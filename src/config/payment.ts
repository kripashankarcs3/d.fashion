/**
 * UPI payment config — the QR image and UPI ID rendered on the Pay page.
 * Same env-with-fallback pattern as src/config/site.ts. Set VITE_UPI_ID and
 * VITE_UPI_QR_IMAGE (a static image dropped into public/images/payment/) to
 * your real values before taking real payments — the fallbacks are visibly
 * placeholders, not a real QR.
 */

const env: Record<string, string | undefined> =
  (import.meta.env as Record<string, string | undefined>) ?? {};

const fromEnv = (key: string, fallback: string): string => env[key]?.trim() || fallback;

export const UPI = {
  id: fromEnv('VITE_UPI_ID', 'your-upi-id@bank'),
  qrImage: fromEnv('VITE_UPI_QR_IMAGE', '/images/payment/upi-qr.png'),
} as const;

/** Mirrors server/src/config/plans.ts — display only; the server always
 *  recomputes and never trusts a client-sent amount. */
export const PLAN_PRICES = { essentials: 200, atelier: 999 } as const;
export const TOPUP_PRICE_PER_UNIT = 5;

export const PLAN_LABELS: Record<'essentials' | 'atelier', string> = {
  essentials: 'Essentials — 40 AI try-on images / month',
  atelier: 'Atelier — Unlimited AI try-ons',
};
