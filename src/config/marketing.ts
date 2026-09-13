/**
 * Central marketing catalogue: the brand-vs-alternatives comparison table.
 * Pure data — the section component only renders it.
 */

import { BRAND } from '@/config/site';

/** Column labels. The first column is always the row label; the second is the brand. */
export const COMPARISON_COLUMNS: readonly string[] = [
  '',
  BRAND.name,
  'Professional Appointment',
  'Guessing',
];

export type ComparisonRow = readonly [label: string, brand: string, professional: string, guessing: string];

export const COMPARISON_ROWS: readonly ComparisonRow[] = [
  ['Price', 'From ₹299', '₹3,000–₹8,000', 'Free... for now'],
  ['Time needed', '~3 minutes', '2–4 hours', 'Every morning'],
  ['Works remotely', 'Yes', 'In-person only', '—'],
  ['Repeatable', 'Anytime', 'Book again', 'Never consistent'],
  ['What you get', 'Full report + palette', 'Notes, maybe a sheet', 'A vague impression'],
  ['Accuracy', 'AI-measured, objective', 'Varies by consultant', 'Subjective'],
];