import mongoose, { Schema, Document } from "mongoose";
import { env } from "../config/env";

export type TryOnPlan = "starter" | "essentials" | "atelier";

export interface ITryOnUsage extends Document {
  email: string;
  count: number;
  /** Current plan. Drives what the member sees on the pricing page and what
   *  `limit` was last set to when the plan changed. */
  plan: TryOnPlan;
  /** Try-ons allowed before `reserveTryOnSlot` starts refusing. A per-document
   *  value (not a shared constant) so a plan upgrade or a ₹5 top-up can raise
   *  just this account's allowance without touching anyone else's. Ignored
   *  once `unlimited` is true. */
  limit: number;
  /** True only for an approved Atelier payment; bypasses the limit check
   *  entirely rather than relying on a sentinel value in `limit`. */
  unlimited: boolean;
}

const TryOnUsageSchema = new Schema<ITryOnUsage>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
    plan: {
      type: String,
      enum: ["starter", "essentials", "atelier"],
      default: "starter",
    },
    limit: {
      type: Number,
      default: () => env.TRY_ON_LIMIT_STARTER,
      min: 0,
    },
    unlimited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITryOnUsage>("TryOnUsage", TryOnUsageSchema);
