/**
 * Central, environment-driven site configuration.
 *
 * Every deploy-specific value (brand assets, contact addresses, social handles,
 * share images, support copy) is read from `import.meta.env` with safe
 * development defaults, so no environment value lives inside a component.
 *
 * Read through optional chaining because these modules are sometimes imported
 * by tooling under plain Node, where `import.meta.env` is a Vite-only global
 * and therefore undefined.
 */

const env: Record<string, string | undefined> =
  (import.meta.env as Record<string, string | undefined>) ?? {};

const fromEnv = (key: string, fallback: string): string => env[key]?.trim() || fallback;

/* ------------------------------------------------------------------ brand */

export const BRAND = {
  name: fromEnv('VITE_BRAND_NAME', "D'Fashion"),
  stylistName: fromEnv('VITE_STYLIST_NAME', "D'Style"),
  tagline: fromEnv('VITE_BRAND_TAGLINE', 'Colour Intelligence, Personalised.'),
  strapline: fromEnv('VITE_BRAND_STRAPLINE', 'Discover the colours that were made for you.'),
  logoPath: fromEnv('VITE_BRAND_LOGO', '/images/campaign/logo3.png'),
} as const;

/* ---------------------------------------------------------------- contact */

export const CONTACT = {
  supportEmail: fromEnv('VITE_SUPPORT_EMAIL', 'hello@deestyle.example.com'),
  contactEmail: fromEnv('VITE_CONTACT_EMAIL', 'hello@dfashion.app'),
  instagramHandle: fromEnv('VITE_INSTAGRAM_HANDLE', '@dfashion.app'),
  responseTime: fromEnv('VITE_RESPONSE_TIME', 'Within 2 working days'),
  responseTimeDetail: fromEnv('VITE_RESPONSE_TIME_DETAIL', 'Usually within two working days.'),
} as const;

/* ----------------------------------------------------------------- social */

export interface SocialLink {
  label: string;
  href: string;
}

export const SOCIALS: SocialLink[] = [
  {
    label: 'Instagram',
    href: fromEnv('VITE_SOCIAL_INSTAGRAM', 'https://www.instagram.com/'),
  },
  {
    label: 'Pinterest',
    href: fromEnv('VITE_SOCIAL_PINTEREST', 'https://www.pinterest.com/'),
  },
  {
    label: 'YouTube',
    href: fromEnv('VITE_SOCIAL_YOUTUBE', 'https://www.youtube.com/'),
  },
  {
    label: 'X (Twitter)',
    href: fromEnv('VITE_SOCIAL_X', 'https://x.com/'),
  },
];

/* ---------------------------------------------------------------- language */

export interface LanguageOption {
  code: string;
  label: string;
}

function parseLanguageOptions(raw: string | undefined, fallback: LanguageOption[]): LanguageOption[] {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every((o) => o?.code && o?.label) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export const LANGUAGE_OPTIONS: LanguageOption[] = parseLanguageOptions(
  env.VITE_LANGUAGE_OPTIONS,
  [
    { code: 'en-US', label: 'English (US)' },
    { code: 'en-GB', label: 'English (UK)' },
    { code: 'en-IN', label: 'English (India)' },
    { code: 'hi-IN', label: 'हिन्दी' },
  ],
);

export const DEFAULT_LANGUAGE = fromEnv('VITE_DEFAULT_LANGUAGE', 'en-US');

/* ------------------------------------------------------------------- seo */

/** Extension-less-relative path of the default social share image. */
export const OG_IMAGE_PATH = fromEnv('VITE_OG_IMAGE', '/images/campaign/opening-og.jpg');

/* ----------------------------------------------------------- style preview */

/** Sample palette rendered on marketing surfaces (Final CTA, showcases). */
export const PALETTE_PREVIEW = fromEnv('VITE_PALETTE_PREVIEW', '#C19A6B,#B8974A,#3E6B5E,#8B4513,#D4AF71').split(',');