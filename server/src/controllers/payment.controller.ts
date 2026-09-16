import { Request, Response } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Payment from "../models/payment.model";
import { asyncHandler } from "../utils/asyncHandler";
import { PLAN_PRICES, TOPUP_PRICE_PER_UNIT } from "../config/plans";
import { applyPaymentToUsage } from "../services/tryon.quota.service";
import { sendPaymentAlert } from "../services/email.service";
import { PAYMENT_PROOF_DIR } from "../constants";
import { isAdminEmail } from "../middleware/requireAdmin";

const currentUser = (req: Request) => (req as any).user as { id?: string; email?: string } | undefined;

const resolveEmail = (req: Request): string | null => {
  const email = currentUser(req)?.email;
  return email ? String(email).trim().toLowerCase() : null;
};

/** Neutralises regex metacharacters in a user-supplied search term and caps
 *  its length — an unescaped term on a public-ish route is a ReDoS vector. */
const escapeRegex = (value: string): string =>
  value.slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const submitSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("plan"),
    planId: z.enum(["essentials", "atelier"]),
    utr: z.string().trim().min(4).max(64),
  }),
  z.object({
    kind: z.literal("topup"),
    topupQty: z.coerce.number().int().min(1).max(20).default(1),
    utr: z.string().trim().min(4).max(64),
  }),
]);

const computeAmount = (data: z.infer<typeof submitSchema>): number =>
  data.kind === "plan" ? PLAN_PRICES[data.planId] : TOPUP_PRICE_PER_UNIT * data.topupQty;

interface PaymentLike {
  _id: unknown;
  email: string;
  kind: string;
  planId?: string;
  topupQty?: number;
  amount: number;
  utr: string;
  status: string;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
}

/** Never leaks `screenshotFile` (an on-disk path fragment) to the client — the
 *  authenticated screenshot route is the only way to read the image. */
const toClientPayment = (p: PaymentLike) => ({
  id: String(p._id),
  email: p.email,
  kind: p.kind,
  planId: p.planId,
  topupQty: p.topupQty,
  amount: p.amount,
  utr: p.utr,
  status: p.status,
  rejectionReason: p.rejectionReason,
  verifiedBy: p.verifiedBy,
  verifiedAt: p.verifiedAt,
  createdAt: p.createdAt,
  screenshotUrl: `/api/payments/${String(p._id)}/screenshot`,
});

export const submitPayment = asyncHandler(async (req: Request, res: Response) => {
  const email = resolveEmail(req);
  if (!email) {
    res.status(401).json({ success: false, message: "Sign in required" });
    return;
  }

  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "Invalid payment request" });
    return;
  }

  const file = req.file;
  if (!file) {
    res.status(400).json({ success: false, message: "A payment screenshot is required" });
    return;
  }

  const data = parsed.data;

  // One open request per email+kind(+plan) at a time — a duplicate "I've
  // Paid" click should not create a second pending row.
  const dupeFilter: Record<string, unknown> = { email, status: "pending", kind: data.kind };
  if (data.kind === "plan") dupeFilter.planId = data.planId;
  const existingPending = await Payment.findOne(dupeFilter).lean();
  if (existingPending) {
    res.status(409).json({
      success: false,
      message: "You already have a pending payment request awaiting review.",
      id: existingPending._id,
    });
    return;
  }

  try {
    const payment = await Payment.create({
      email,
      kind: data.kind,
      planId: data.kind === "plan" ? data.planId : undefined,
      topupQty: data.kind === "topup" ? data.topupQty : undefined,
      amount: computeAmount(data),
      utr: data.utr,
      screenshotFile: file.filename,
      status: "pending",
    });
    // Fire-and-forget: sendPaymentAlert never throws (best-effort), and a
    // member's submission must never wait on an SMTP round-trip.
    void sendPaymentAlert({
      email: payment.email,
      kind: payment.kind,
      planId: payment.planId,
      topupQty: payment.topupQty,
      amount: payment.amount,
      utr: payment.utr,
    });
    res.status(201).json({ success: true, message: "Payment submitted for review", payment: toClientPayment(payment) });
  } catch (err) {
    if ((err as { code?: number }).code === 11000) {
      res.status(409).json({ success: false, message: "This transaction ID has already been submitted." });
      return;
    }
    throw err;
  }
});

export const getMyPayments = asyncHandler(async (req: Request, res: Response) => {
  const email = resolveEmail(req);
  if (!email) {
    res.status(401).json({ success: false, message: "Sign in required" });
    return;
  }
  const payments = await Payment.find({ email }).sort({ createdAt: -1 }).limit(50).lean();
  res.status(200).json({ success: true, payments: payments.map(toClientPayment) });
});

const loadOwnedOrAdminPayment = async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({ success: false, message: "Not found" });
    return null;
  }
  const payment = await Payment.findById(req.params.id).lean();
  if (!payment) {
    res.status(404).json({ success: false, message: "Not found" });
    return null;
  }
  const email = resolveEmail(req);
  const isOwner = Boolean(email) && payment.email === email;
  if (!isOwner && !isAdminEmail(currentUser(req)?.email)) {
    res.status(403).json({ success: false, message: "Not allowed" });
    return null;
  }
  return payment;
};

export const getPayment = asyncHandler(async (req: Request, res: Response) => {
  const payment = await loadOwnedOrAdminPayment(req, res);
  if (!payment) return;
  res.status(200).json({ success: true, payment: toClientPayment(payment) });
});

export const getPaymentScreenshot = asyncHandler(async (req: Request, res: Response) => {
  const payment = await loadOwnedOrAdminPayment(req, res);
  if (!payment) return;
  const filePath = path.join(PAYMENT_PROOF_DIR, path.basename(payment.screenshotFile));
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ success: false, message: "Screenshot not found" });
    return;
  }
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  res.sendFile(filePath);
});

/** Admin: paginated, filterable list with status counts for the dashboard header. */
export const listPayments = asyncHandler(async (req: Request, res: Response) => {
  const statusParam = req.query.status;
  const status =
    typeof statusParam === "string" && ["pending", "verified", "rejected"].includes(statusParam)
      ? statusParam
      : undefined;
  const q = typeof req.query.q === "string" ? escapeRegex(req.query.q.trim()) : "";
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 20));

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (q) filter.$or = [{ utr: new RegExp(q, "i") }, { email: new RegExp(q, "i") }];

  const [items, total, counts] = await Promise.all([
    Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Payment.countDocuments(filter),
    Payment.aggregate<{ _id: string; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
  ]);

  const countMap: Record<string, number> = { pending: 0, verified: 0, rejected: 0 };
  for (const c of counts) countMap[c._id] = c.n;

  res.status(200).json({
    success: true,
    payments: items.map(toClientPayment),
    total,
    page,
    pageSize,
    counts: countMap,
  });
});

export const approvePayment = asyncHandler(async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({ success: false, message: "Not found" });
    return;
  }
  const adminEmail = currentUser(req)?.email?.trim().toLowerCase();

  // Guarded by status: 'pending' in the filter so a double click (or two
  // admins racing) can approve a request exactly once — the second call finds
  // no matching document and reports 409 instead of granting quota twice.
  const payment = await Payment.findOneAndUpdate(
    { _id: req.params.id, status: "pending" },
    { $set: { status: "verified", verifiedBy: adminEmail, verifiedAt: new Date() } },
    { new: true }
  );
  if (!payment) {
    res.status(409).json({ success: false, message: "This payment was already reviewed." });
    return;
  }

  await applyPaymentToUsage(payment);
  res.status(200).json({ success: true, message: "Payment approved", payment: toClientPayment(payment) });
});

const rejectSchema = z.object({ reason: z.string().trim().max(300).optional() });

export const rejectPayment = asyncHandler(async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({ success: false, message: "Not found" });
    return;
  }
  const parsed = rejectSchema.safeParse(req.body ?? {});
  const reason = parsed.success ? parsed.data.reason : undefined;

  const payment = await Payment.findOneAndUpdate(
    { _id: req.params.id, status: "pending" },
    // liveUtr: false frees the UTR for resubmission — see payment.model.ts.
    { $set: { status: "rejected", rejectionReason: reason, liveUtr: false } },
    { new: true }
  );
  if (!payment) {
    res.status(409).json({ success: false, message: "This payment was already reviewed." });
    return;
  }

  res.status(200).json({ success: true, message: "Payment rejected", payment: toClientPayment(payment) });
});
