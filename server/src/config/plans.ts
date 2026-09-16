import { env } from "./env";

/**
 * Single source of truth for what each plan/top-up costs and grants. The
 * payment controller computes `amount` from this — it never trusts a
 * client-supplied price — and the quota service reads the limits from here
 * when a payment is approved.
 */

export type PlanId = "essentials" | "atelier";

/** Try-on limits for the plans that have one. Atelier is unconditionally
 *  unlimited and deliberately has no entry here. */
export const PLAN_TRY_ON_LIMITS: Record<"starter" | "essentials", number> = {
  starter: env.TRY_ON_LIMIT_STARTER,
  essentials: env.TRY_ON_LIMIT_ESSENTIALS,
};

/** Monthly price in rupees. */
export const PLAN_PRICES: Record<PlanId, number> = {
  essentials: 200,
  atelier: 999,
};

/** Price per single extra try-on bought outside a plan. */
export const TOPUP_PRICE_PER_UNIT = 5;

export const isPlanId = (value: unknown): value is PlanId =>
  value === "essentials" || value === "atelier";
