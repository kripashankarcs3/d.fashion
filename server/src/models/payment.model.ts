import mongoose, { Schema, Document } from "mongoose";
import { PlanId } from "../config/plans";

export type PaymentKind = "plan" | "topup";
export type PaymentStatus = "pending" | "verified" | "rejected";

export interface IPayment extends Document {
  email: string;
  name?: string;
  kind: PaymentKind;
  planId?: PlanId;
  topupQty?: number;
  /** Rupees. Always computed server-side from config/plans.ts — never taken
   *  from the client — so a tampered request can't buy a discount. */
  amount: number;
  /** UPI transaction reference the member typed in. */
  utr: string;
  status: PaymentStatus;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  /** True while `status` is pending or verified, false once rejected. Exists
   *  only so the UTR index below can be a partial index: MongoDB partial
   *  indexes only support equality/$exists/comparison operators in their
   *  filter expression, not $ne/$or/$in, so "not rejected" has to be its own
   *  plain-equality field rather than `status: { $ne: "rejected" }`. */
  liveUtr: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    name: { type: String, trim: true, maxlength: 120 },
    kind: { type: String, enum: ["plan", "topup"], required: true },
    planId: { type: String, enum: ["essentials", "atelier"] },
    topupQty: { type: Number, min: 1, max: 100 },
    amount: { type: Number, required: true, min: 0 },
    utr: { type: String, required: true, trim: true, maxlength: 64 },
    status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending", index: true },
    rejectionReason: { type: String, trim: true, maxlength: 300 },
    verifiedBy: { type: String, trim: true, lowercase: true },
    verifiedAt: { type: Date },
    liveUtr: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// A UTR can only be attached to one live (pending/verified) request at a
// time — replaying someone else's transaction reference, or double-submitting
// the same payment, is rejected at the database level. A rejected request's
// UTR is excluded (via liveUtr, set to false on rejection) so a member can
// resubmit clearer proof of the same payment.
PaymentSchema.index({ utr: 1 }, { unique: true, partialFilterExpression: { liveUtr: true } });

export default mongoose.model<IPayment>("Payment", PaymentSchema);
