import { Request } from "express";
import User from "../models/user.model";
import TryOnUsage from "../models/tryon.usage.model";
import { env } from "../config/env";

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

/** Atomically reserves one lifetime AI try-on slot for the requesting email.
 *  Returns the number of try-ons left after this reservation, or null when the
 *  quota is already exhausted (or the user's email cannot be resolved). */
export const reserveTryOnSlot = async (req: Request): Promise<number | null> => {
  const limit = env.TRY_ON_LIMIT;
  if (limit <= 0) return null;

  const email = await resolveUserEmail(req);
  if (!email) return null;

  const doc = await TryOnUsage.findOneAndUpdate(
    { email, count: { $lt: limit } },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  ).lean();

  if (!doc) return null;
  return Math.max(0, limit - doc.count);
};

/** Current usage (`used` / `limit`) for the requesting email. Never throws:
 *  unknown users simply report zero usage. */
export const getTryOnUsage = async (
  req: Request
): Promise<{ used: number; limit: number }> => {
  const limit = env.TRY_ON_LIMIT;
  const email = await resolveUserEmail(req);
  if (!email) return { used: 0, limit };
  const doc = await TryOnUsage.findOne({ email }).lean();
  return { used: doc?.count ?? 0, limit };
};