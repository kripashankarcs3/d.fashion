/**
 * Central recommendation configuration: skincare routine baseline + trigger
 * grades. Makeup shades, hair options and style insights are computed from
 * the user's analysis (see recommendation.service.ts) — not configured here.
 */

/** Baseline every routine starts from. */
export const SKINCARE_BASE: string[] = [
  "Gentle Cleanser",
  "Moisturizer",
  "Sunscreen SPF 50",
];

/**
 * Concern grades (0–100 analysis score units) that add a targeted step.
 * Kept in step with the stylist chat's thresholds (0.3 / 0.25 / 0.3). The old
 * 10 / 5 / 10 sat below the floor of the estimated-score range, so every user
 * received all three serums and the routine said nothing about their skin.
 */
export const SKINCARE_TRIGGERS: { key: string; threshold: number; product: string }[] = [
  { key: "acne", threshold: 30, product: "Salicylic Acid Serum" },
  { key: "darkSpots", threshold: 25, product: "Vitamin C Serum" },
  { key: "wrinkles", threshold: 30, product: "Retinol Serum" },
];