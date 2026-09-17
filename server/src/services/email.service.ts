import nodemailer, { Transporter } from "nodemailer";
import { env } from "../config/env";
import { PRODUCT_NAME } from "../config/stylist";

let transporter: Transporter | null | undefined; // undefined = not yet built, null = not configured

/** Lazily builds the Gmail SMTP transporter. Returns null when SMTP_USER or
 *  SMTP_APP_PASSWORD is unset — email alerts are optional, never required to
 *  boot, and a payment always lands in /admin/payments regardless. */
const getTransporter = (): Transporter | null => {
  if (transporter !== undefined) return transporter;
  if (!env.SMTP_USER || !env.SMTP_APP_PASSWORD) {
    transporter = null;
    return transporter;
  }
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: env.SMTP_USER, pass: env.SMTP_APP_PASSWORD },
  });
  return transporter;
};

/** Who the "new payment" alert goes to: NOTIFY_EMAIL if set, otherwise the
 *  first address in ADMIN_EMAILS. */
const notifyRecipient = (): string | null => {
  if (env.NOTIFY_EMAIL.trim()) return env.NOTIFY_EMAIL.trim();
  const first = env.ADMIN_EMAILS.split(",").map((e) => e.trim()).find(Boolean);
  return first ?? null;
};

export interface PaymentAlertInput {
  email: string;
  kind: "plan" | "topup";
  planId?: string;
  topupQty?: number;
  amount: number;
  utr: string;
}

/** Last outcome of sendPaymentAlert, so an operator can tell a misconfigured
 *  SMTP_APP_PASSWORD from "no payment has been submitted since the last
 *  restart" without digging through raw logs — see emailDiagnostics(). */
let lastAlertOutcome: { at: string; ok: boolean; detail: string } | null = null;

/** Emails whoever reviews payments as soon as one is submitted, so it never
 *  sits unnoticed in /admin/payments. Best-effort and silent: a member's
 *  submission must never fail (or even slow down) because an email couldn't
 *  be sent — every path here only warns, never throws. */
export const sendPaymentAlert = async (payment: PaymentAlertInput): Promise<void> => {
  const mail = getTransporter();
  const to = notifyRecipient();
  if (!mail) {
    lastAlertOutcome = { at: new Date().toISOString(), ok: false, detail: "SMTP_USER/SMTP_APP_PASSWORD not set" };
    return;
  }
  if (!to) {
    lastAlertOutcome = { at: new Date().toISOString(), ok: false, detail: "No recipient — set NOTIFY_EMAIL or ADMIN_EMAILS" };
    return;
  }

  const what =
    payment.kind === "plan"
      ? `${payment.planId} plan`
      : `${payment.topupQty ?? 1} extra try-on${(payment.topupQty ?? 1) > 1 ? "s" : ""}`;

  try {
    await mail.sendMail({
      from: `"${PRODUCT_NAME}" <${env.SMTP_USER}>`,
      to,
      subject: `New payment to review — ₹${payment.amount} (${what})`,
      text: [
        `A member submitted a payment for review.`,
        ``,
        `Member: ${payment.email}`,
        `For: ${what}`,
        `Amount: ₹${payment.amount}`,
        `UTR: ${payment.utr}`,
        ``,
        `Review it at /admin/payments.`,
      ].join("\n"),
    });
    lastAlertOutcome = { at: new Date().toISOString(), ok: true, detail: `sent to ${to}` };
  } catch (err) {
    const detail = (err as Error).message;
    lastAlertOutcome = { at: new Date().toISOString(), ok: false, detail };
    console.warn("Payment alert email failed to send:", detail);
  }
};

/** Public, secret-free view of the email alert wiring for operators —
 *  mirrors stylistDiagnostics() in stylist.service.ts. Never exposes
 *  SMTP_APP_PASSWORD itself, only whether it's set. */
export const emailDiagnostics = () => ({
  configured: getTransporter() !== null,
  recipient: notifyRecipient(),
  smtpUser: env.SMTP_USER || null,
  lastAlertOutcome,
});
