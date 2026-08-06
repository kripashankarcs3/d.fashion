/**
 * Single source of truth for the app's information architecture.
 *
 * Every navigation surface (header, mobile drawer, account menu, footer) and the
 * router itself read from this module, so a label or a path is only ever written
 * once. Anything that appears in two places here would drift — it did before.
 */

export interface NavLink {
  /** Route to navigate to. For anchor links this is always the landing page. */
  href: string;
  label: string;
  /** DOM id of a section on the landing page, when this link scrolls instead of routing. */
  hash?: string;
}

/* ------------------------------------------------------------------ routes */

/** The canonical path for every screen. Referenced instead of string literals. */
export const ROUTES = {
  /** Auth-switched entry point: signed-out visitors land on login, signed-in
   *  members on the dashboard. The marketing story lives on `home`. */
  root: '/',
  home: '/home',
  pricing: '/pricing',
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  upload: '/upload',
  report: '/report',
  tryOn: '/try-on',
  chat: '/chat',
  privacy: '/privacy',
  terms: '/terms',
  about: '/about',
  contact: '/contact',
  faq: '/faq',
  blog: '/blog',
} as const;

/** Legacy paths kept alive as redirects so old links and bookmarks never 404. */
export const ROUTE_ALIASES: Record<string, string> = {
  '/tryon': ROUTES.tryOn,
};

/**
 * The absolute origin used for canonical URLs, Open Graph, and sitemap.xml.
 * Set `VITE_SITE_URL` at build time to your production domain; until then the
 * reserved `.example.com` placeholder is used so no real third-party site is
 * ever pointed at.
 *
 * Read through optional chaining because this module is also imported by the
 * e2e suite under plain Node, where `import.meta.env` is a Vite-only global and
 * therefore undefined — reading a property straight off it crashed the tests
 * before they could open a browser.
 */
export const SITE_URL: string =
  (import.meta.env?.VITE_SITE_URL as string | undefined) ??
  'https://deestyle.example.com';

/** Reachable without an account. The root (`/`) is intentionally absent — it is
 *  auth-switched and bounces signed-out visitors to login. Everything else here
 *  requires a session.
 *  Documentation/test fixture — the router expresses this fact structurally via
 *  the `<Protected>` / `<GuestOnly>` wrappers, and `e2e/smoke.js` imports these
 *  sets so the test's public/protected route lists can never disagree. */
export const PUBLIC_PATHS = new Set<string>([
  ROUTES.home,
  ROUTES.pricing,
  ROUTES.privacy,
  ROUTES.terms,
  ROUTES.about,
  ROUTES.contact,
  ROUTES.faq,
  ROUTES.blog,
]);

/** Only for signed-out visitors — an authenticated user is bounced to the app.
 *  Documentation/test fixture — see `PUBLIC_PATHS`. */
export const GUEST_ONLY_PATHS = new Set<string>([ROUTES.login, ROUTES.signup]);

/**
 * Where signing in lands you when no `?redirect=` was carried along. Note this
 * is *not* what `/` renders — the campaign landing page stays the front door for
 * everyone, so a member can always walk back through the story.
 */
export const AUTHENTICATED_HOME = ROUTES.home;

/* --------------------------------------------------------------- header nav */

/**
 * Signed-out header. Marketing destinations only — nothing here can dead-end at
 * a login redirect. The two anchors resolve to sections rendered by
 * `HowItWorks` and `FeatureShowcase` on the landing page.
 */
export const MARKETING_NAV: NavLink[] = [
  { href: ROUTES.home, hash: 'how-it-works', label: 'How It Works' },
  { href: ROUTES.home, hash: 'virtual-try-on', label: 'Virtual Try-On' },
  { href: ROUTES.pricing, label: 'Pricing' },
];

/** Signed-in header, ordered by the product journey: home → analyse → read → wear → ask. */
export const APP_NAV: NavLink[] = [
  { href: ROUTES.home, label: 'Home' },
  { href: ROUTES.dashboard, label: 'Dashboard' },
  { href: ROUTES.upload, label: 'Analysis' },
  { href: ROUTES.report, label: 'My Report' },
  { href: ROUTES.tryOn, label: 'Try-On' },
  { href: ROUTES.chat, label: 'Stylist' },
];

/**
 * Avatar dropdown — account concerns only. Anything already in `APP_NAV` stays
 * out of it, so no destination is reachable under two different labels. Sign Out
 * is a button, so it is not listed here.
 */
export const ACCOUNT_MENU: NavLink[] = [
  { href: ROUTES.pricing, label: 'Plans & Billing' },
];

/* --------------------------------------------------------------- footer nav */

export const FOOTER_PRODUCT: NavLink[] = [
  { href: ROUTES.home, hash: 'how-it-works', label: 'How It Works' },
  { href: ROUTES.home, hash: 'colour-season', label: 'Colour Season' },
  { href: ROUTES.home, hash: 'virtual-try-on', label: 'Virtual Try-On' },
  { href: ROUTES.pricing, label: 'Pricing' },
];

/** Shown to signed-in users — these all require a session. */
export const FOOTER_ACCOUNT_AUTHED: NavLink[] = [
  { href: ROUTES.dashboard, label: 'Dashboard' },
  { href: ROUTES.upload, label: 'Colour Analysis' },
  { href: ROUTES.report, label: 'My Report' },
  { href: ROUTES.chat, label: 'Stylist' },
];

/** Shown to signed-out visitors in the same column. */
export const FOOTER_ACCOUNT_GUEST: NavLink[] = [
  { href: ROUTES.login, label: 'Sign In' },
  { href: ROUTES.signup, label: 'Create Account' },
];

export const FOOTER_COMPANY: NavLink[] = [
  { href: ROUTES.about, label: 'About' },
  { href: ROUTES.contact, label: 'Contact' },
  { href: ROUTES.blog, label: 'Journal' },
  { href: ROUTES.faq, label: 'FAQ' },
];

export const FOOTER_LEGAL: NavLink[] = [
  { href: ROUTES.privacy, label: 'Privacy Policy' },
  { href: ROUTES.terms, label: 'Terms of Service' },
  { href: ROUTES.privacy, hash: 'cookies', label: 'Cookie Policy' },
  { href: ROUTES.terms, hash: 'refunds', label: 'Refund Policy' },
];

/* ------------------------------------------------------------- page meta */

export interface PageMeta {
  title: string;
  description: string;
}

export const PAGE_META: Record<string, PageMeta> = {
  [ROUTES.root]: {
    title: "D'Fashion — Welcome",
    description:
      'Personalised colour analysis for your skin tone, undertone, and style personality.',
  },
  [ROUTES.home]: {
    title: "D'Fashion — Discover Your Colour Season",
    description:
      'Discover the colours that were made for you. AI-powered colour analysis personalised to your skin tone, undertone, and style personality.',
  },
  [ROUTES.pricing]: {
    title: "Pricing — D'Fashion",
    description:
      'Simple, transparent pricing for personalised colour analysis. Analyse your colours, read your report, and shop your palette.',
  },
  [ROUTES.upload]: {
    title: "Upload — D'Fashion",
    description:
      'Upload a clear photo in natural light and let D\u2019Fashion read your skin undertone, depth, and contrast.',
  },
  [ROUTES.report]: {
    title: "Your Colour Report — D'Fashion",
    description:
      'Your personalised colour season, palette, neutrals, makeup shades, and wardrobe guidance.',
  },
  [ROUTES.tryOn]: {
    title: "Virtual Try-On — D'Fashion",
    description:
      'See outfits, makeup, and hairstyles rendered in your exact palette before you buy.',
  },
  [ROUTES.chat]: {
    title: "D'Style Stylist Chat — D'Fashion",
    description:
      'Ask your personal AI stylist anything about your palette, wardrobe, and colour choices.',
  },
  [ROUTES.dashboard]: {
    title: "Dashboard — D'Fashion",
    description:
      'Your colour intelligence at a glance — palette, reports, wardrobe, and weekly guidance.',
  },
  [ROUTES.login]: {
    title: "Sign In — D'Fashion",
    description: 'Sign in to access your colour report and dashboard.',
  },
  [ROUTES.signup]: {
    title: "Sign Up — D'Fashion",
    description:
      'Create your D\u2019Fashion account and discover the colours made for you.',
  },
  [ROUTES.privacy]: {
    title: "Privacy Policy — D'Fashion",
    description:
      'How D\u2019Fashion collects, uses, and protects your data — including exactly what happens to the photos you upload.',
  },
  [ROUTES.terms]: {
    title: "Terms of Service — D'Fashion",
    description:
      'The terms that govern your use of the D\u2019Fashion colour analysis service.',
  },
  [ROUTES.about]: {
    title: "About — D'Fashion",
    description:
      'The story behind D\u2019Fashion — colour intelligence, rendered personal.',
  },
  [ROUTES.contact]: {
    title: "Contact — D'Fashion",
    description:
      'Get in touch with the D\u2019Fashion team for support, press, and partnerships.',
  },
  [ROUTES.faq]: {
    title: "FAQ — D'Fashion",
    description:
      'Answers to common questions about colour analysis, your report, privacy, and payments.',
  },
  [ROUTES.blog]: {
    title: "Journal — D'Fashion",
    description:
      'Essays and guides on colour analysis, undertones, and building a wardrobe in your palette.',
  },
};

export const FALLBACK_PAGE_META: PageMeta = {
  title: "Page Not Found — D'Fashion",
  description: "The page you're looking for could not be found.",
};

/** Routes whose hero sits under a transparent, full-bleed header. */
export const OVERLAY_ROUTES = new Set<string>([ROUTES.home]);

/** Builds a login URL that returns the visitor to where they were headed. */
export function loginPathFor(destination: string): string {
  if (!destination || destination === ROUTES.home) return ROUTES.login;
  return `${ROUTES.login}?redirect=${encodeURIComponent(destination)}`;
}
