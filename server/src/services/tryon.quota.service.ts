import { Request } from "express";
import User from "../models/user.model";
import TryOnUsage, { TryOnPlan } from "../models/tryon.usage.model";
import { PLAN_TRY_ON_LIMITS } from "../config/plans";
import { IPayment } from "../models/payment.model";

/** Email of the authenticated user, normalised the same way the User and
 *  TryOnUsage schemas store it (trim + lowercase). Firebase tokens carry it
 *  directly; local JWTs only carry the user id, so we look the doc up. */
const resolveUserEmail = async (req: Request): Promise<string | null> => {
  const currentUser = (req as unknown as { user?: { id?: string; email?: string } }).user;
  if (!currentUser?.id) return null;
  if (currentUser.email) return String(currentUser.email).trim().toLowerCase();
  try {
    const user = await User.findById(currentUser.id).select("email").lean();
    return user?.email ? String(user.email).trim().toLowerCase() : null;
  } catch {
    return null;
  }
};

/** Atomically reserves one AI try-on slot for the requesting email, against
 *  that account's own `limit` (raised by a plan upgrade or a ₹5 top-up) or
 *  skipped entirely once the account is unlimited. Returns the number of
 *  try-ons left after this reservation, or null when the quota is already
 *  exhausted (or the user's email cannot be resolved). */
export const reserveTryOnSlot = async (req: Request): Promise<number | null> => {
  const email = await resolveUserEmail(req);
  if (!email) return null;

  // Step 1: make sure a usage document exists, seeded with Starter defaults
  // on first touch. Kept as its own upsert (no $expr — MongoDB rejects $expr
  // in the filter of an upsert operation) so step 2 below can always assume
  // a document is there to compare against. $setOnInsert only fires on an
  // actual insert, so an existing pre-migration document (missing
  // limit/plan/unlimited) is left untouched here — the $ifNull guard in step
  // 2 covers it, and it fills in for real the next time a payment is applied.
  await TryOnUsage.updateOne(
    { email },
    { $setOnInsert: { plan: "starter" as TryOnPlan, count: 0, limit: PLAN_TRY_ON_LIMITS.starter, unlimited: false } },
    { upsert: true }
  );

  // Step 2: the atomic guarded increment, comparing `count` against the
  // document's own `limit` via $expr — allowed here because this query never
  // upserts (step 1 already guaranteed the document exists), so a concurrent
  // request either wins this compare-and-increment or correctly finds no
  // match once the limit is reached.
  const doc = await TryOnUsage.findOneAndUpdate(
    {
      email,
      $expr: {
        $or: [
          { $ifNull: ["$unlimited", false] },
          { $lt: ["$count", { $ifNull: ["$limit", PLAN_TRY_ON_LIMITS.starter] }] },
        ],
      },
    },
    { $inc: { count: 1 } },
    { new: true }
  ).lean();

  if (!doc) return null;
  if (doc.unlimited) return Number.POSITIVE_INFINITY;
  return Math.max(0, (doc.limit ?? PLAN_TRY_ON_LIMITS.starter) - doc.count);
};

/** Undoes a reservation from `reserveTryOnSlot` when the call it guarded did
 *  not actually produce a real try-on image (the provider errored, or there
 *  was nothing to extract a result from) — a member should never lose part
 *  of their quota for a click that rendered a fallback, not a real result.
 *  Floors at 0 via a pipeline update so an unexpected extra refund can never
 *  push the count negative. Never throws: best-effort, and a request that
 *  never reserved anything (unresolved email) is a silent no-op. */
export const refundTryOnSlot = async (req: Request): Promise<void> => {
  const email = await resolveUserEmail(req);
  if (!email) return;
  await TryOnUsage.updateOne(
    { email },
    [{ $set: { count: { $max: [{ $subtract: [{ $ifNull: ["$count", 0] }, 1] }, 0] } } }],
    { updatePipeline: true }
  );
};

/** Current usage for the requesting email. Never throws: unknown users
 *  simply report the default Starter allowance, unused. */
export const getTryOnUsage = async (
  req: Request
): Promise<{ used: number; limit: number | null; plan: TryOnPlan; unlimited: boolean }> => {
  const email = await resolveUserEmail(req);
  if (!email) {
    return { used: 0, limit: PLAN_TRY_ON_LIMITS.starter, plan: "starter", unlimited: false };
  }
  const doc = await TryOnUsage.findOne({ email }).lean();
  if (!doc) {
    return { used: 0, limit: PLAN_TRY_ON_LIMITS.starter, plan: "starter", unlimited: false };
  }
  return {
    used: doc.count,
    limit: doc.unlimited ? null : (doc.limit ?? PLAN_TRY_ON_LIMITS.starter),
    plan: doc.plan ?? "starter",
    unlimited: Boolean(doc.unlimited),
  };
};

/** Applies an approved payment to the buyer's try-on allowance. A plan
 *  payment replaces the plan and grants a fresh allowance (usage resets);
 *  a top-up simply raises the current limit by however many extra try-ons
 *  were bought, on top of whatever plan is already active. */
export const applyPaymentToUsage = async (payment: Pick<IPayment, "email" | "kind" | "planId" | "topupQty">) => {
  const email = payment.email.trim().toLowerCase();

  if (payment.kind === "plan") {
    if (payment.planId === "atelier") {
      await TryOnUsage.findOneAndUpdate(
        { email },
        { $set: { plan: "atelier", unlimited: true, count: 0 } },
        { upsert: true }
      );
      return;
    }
    if (payment.planId === "essentials") {
      await TryOnUsage.findOneAndUpdate(
        { email },
        { $set: { plan: "essentials", unlimited: false, limit: PLAN_TRY_ON_LIMITS.essentials, count: 0 } },
        { upsert: true }
      );
      return;
    }
    return;
  }

  // Top-up: stacks on top of whatever plan/limit is already active. A member
  // on Atelier is never offered a top-up (they're already unlimited), so this
  // branch only ever raises a finite limit. A plain `$inc: { limit: qty }`
  // would be wrong for a document written before this migration — it has no
  // `limit` field at all, and Mongo's $inc treats that as starting from 0,
  // handing a Starter account with 9 already banked a limit of just `qty`
  // instead of `9 + qty`. An aggregation-pipeline update reads the field
  // itself (via $ifNull) before adding to it, so a legacy or brand-new
  // document both land on the correct total in one atomic write.
  const qty = payment.topupQty ?? 1;
  await TryOnUsage.findOneAndUpdate(
    { email },
    [
      {
        $set: {
          plan: { $ifNull: ["$plan", "starter"] },
          count: { $ifNull: ["$count", 0] },
          unlimited: { $ifNull: ["$unlimited", false] },
          limit: { $add: [{ $ifNull: ["$limit", PLAN_TRY_ON_LIMITS.starter] }, qty] },
        },
      },
    ],
    // updatePipeline: Mongoose otherwise refuses an array-form (aggregation
    // pipeline) update, which is what makes reading-then-adding to $limit in
    // one atomic write possible.
    { upsert: true, updatePipeline: true }
  );
};
