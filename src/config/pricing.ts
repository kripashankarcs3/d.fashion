/**
 * Central pricing catalogue: plans, feature comparison, and pricing FAQ.
 *
 * Monthly prices live here (in minor units of the configured currency, i.e. whole
 * rupees), while annual-billing discounts are derived — adjust `annualFactor` and
 * the comparison grid stays honest.
 */

const env: Record<string, string | undefined> =
  (import.meta.env as Record<string, string | undefined>) ?? {};

export interface Plan {
  name: string;
  title: string;
  tagline: string;
  monthly: number;
  popular?: boolean;
  cta: string;
  features: string[];
  missing: string[];
  included: string[];
}

export interface CompareRow {
  feature: string;
  starter: boolean;
  essentials: boolean;
  atelier: boolean;
}

export interface PricingFaq {
  q: string;
  a: string;
}

/* ------------------------------------------------------------- catalogue */

export const PLANS: Plan[] = [
  {
    name: 'Starter',
    title: 'Starter Collection',
    tagline: 'Core colour analysis, free forever.',
    monthly: 0,
    cta: 'Get Started with Starter',
    features: [
      'Colour season analysis',
      'Personal colour palette',
      'Skin undertone report',
      '9 AI try-on images',
    ],
    missing: [
      'Full wardrobe report',
      'Palette download',
      'AI stylist chat',
    ],
    included: [
      'One analysis on upload',
      'Your colour season and palette',
      'Skin undertone reading',
      '9 virtual try-ons (clothes, makeup or hair)',
    ],
  },
  {
    name: 'Essentials',
    title: 'Essentials Collection',
    tagline: 'Your complete colour identity.',
    monthly: 200,
    popular: true,
    cta: 'Get Started with Essentials',
    features: [
      'Everything in Starter',
      'Full wardrobe report',
      'Colour palette download',
      '40 AI try-on images',
      'Analysis history',
    ],
    missing: ['AI stylist chat'],
    included: [
      'Unlimited re-analysis',
      'Downloadable colour palette',
      '40 virtual try-ons (clothes, makeup or hair)',
      'Best neutrals for your season',
      'Saved analysis history',
    ],
  },
  {
    name: 'Atelier',
    title: 'Atelier Collection',
    tagline: 'The full atelier experience.',
    monthly: 999,
    cta: 'Get Started with Atelier',
    features: [
      'Everything in Essentials',
      'Unlimited AI try-ons',
      'AI stylist chat',
      'Priority updates',
      'Early access to new features',
    ],
    missing: [],
    included: [
      'Unlimited virtual try-ons',
      '24/7 AI stylist conversations',
      'Priority support',
      'Early access to every new feature',
      'Personal style archetypes',
    ],
  },
];

export const COMPARE: CompareRow[] = [
  { feature: 'Colour season analysis', starter: true, essentials: true, atelier: true },
  { feature: 'Personal colour palette', starter: true, essentials: true, atelier: true },
  { feature: 'Skin undertone report', starter: true, essentials: true, atelier: true },
  { feature: 'Colours to avoid', starter: true, essentials: true, atelier: true },
  { feature: 'Full wardrobe report', starter: false, essentials: true, atelier: true },
  { feature: 'Colour palette download', starter: false, essentials: true, atelier: true },
  { feature: 'Best neutrals guide', starter: false, essentials: true, atelier: true },
  { feature: 'Saved analysis history', starter: false, essentials: true, atelier: true },
  { feature: 'Virtual try-on (9 / 40 / unlimited images)', starter: true, essentials: true, atelier: true },
  { feature: 'AI stylist chat', starter: false, essentials: false, atelier: true },
  { feature: 'Priority updates', starter: false, essentials: false, atelier: true },
  { feature: 'Early access to new features', starter: false, essentials: false, atelier: true },
];

export const PRICING_FAQS: PricingFaq[] = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel directly from your account at any time — no hidden fees, no questions asked.',
  },
  {
    q: 'What happens to my analysis if I cancel?',
    a: 'Your colour identity is yours. Download your palette before you leave and we keep nothing after 30 days.',
  },
  {
    q: 'How accurate is the colour analysis?',
    a: 'The analysis reads your undertone, depth, and contrast from a clear photo in natural light. The more accurate the photo, the more accurate the season.',
  },
  {
    q: 'Does the free plan ever expire?',
    a: 'No. Starter is free forever — your colour analysis and palette stay with you, with no credit card required.',
  },
  {
    q: 'Can I use Atelier as a professional stylist?',
    a: 'Yes. Atelier is built for stylists and power users who want try-on, chat, and early access for their clients.',
  },
  {
    q: 'What happens when I run out of try-ons?',
    a: 'Starter gives you 9 free virtual try-ons and Essentials gives you 40 — after that, you can top up ₹5 per extra try-on any time, or upgrade to Atelier for unlimited try-ons.',
  },
  {
    q: 'How do I pay?',
    a: 'Payments are verified manually over UPI — scan the QR, pay, then submit your transaction ID and a screenshot. Your plan or top-up is applied as soon as it is reviewed, usually within a few hours.',
  },
];

/* ------------------------------------------------------------- billing */

export const CURRENCY = {
  /** Intl locale used when formatting prices. */
  locale: env.VITE_CURRENCY_LOCALE ?? 'en-IN',
  /** Currency suffix rendered before the value. */
  symbol: env.VITE_CURRENCY_SYMBOL ?? '₹',
} as const;

/** Months actually paid per 12-month annual commitment (10 = "2 months free"). */
export const ANNUAL_PAID_MONTHS = (() => {
  const raw = Number(env.VITE_ANNUAL_PAID_MONTHS);
  return Number.isFinite(raw) && raw > 0 && raw <= 12 ? raw : 10;
})();

export const formatPrice = (value: number): string =>
  `${CURRENCY.symbol}${value.toLocaleString(CURRENCY.locale)}`;

/** Total payable for one year under annual billing. */
export const annualPayable = (monthly: number): number =>
  monthly === 0 ? 0 : monthly * ANNUAL_PAID_MONTHS;

/** Effective monthly rate under annual billing. */
export const annualMonthlyEquivalent = (monthly: number): number => {
  const payable = annualPayable(monthly);
  return monthly === 0 ? 0 : Math.floor(payable / 12);
};

/** Yearly saving from annual billing, in the configured currency. */
export const annualSavings = (monthly: number): number =>
  monthly === 0 ? 0 : monthly * 12 - annualPayable(monthly);

/** Human "Save N months" label shown next to the billing toggle. */
export const ANNUAL_SAVE_LABEL = `${12 - ANNUAL_PAID_MONTHS} months`;