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
} as const;

/** Legacy paths kept alive as redirects so old links and bookmarks never 404. */
export const ROUTE_ALIASES: Record<string, string> = {
  '/tryon': ROUTES.tryOn,
};

/** Reachable without an account. The root (`/`) is intentionally absent — it is
 *  auth-switched and bounces signed-out visitors to login. Everything else here
 *  requires a session.
 *  Documentation/test fixture — the router expresses this fact structurally via
 *  the `<Protected>` / `<GuestOnly>` wrappers, and `e2e/smoke.js` imports these
 *  sets so the test's public/protected route lists can never disagree. */
export const PUBLIC_PATHS = new Set<string>([ROUTES.home, ROUTES.pricing]);

/** Only for signed-out visitors — an authenticated user is bounced to the app.
 *  Documentation/test fixture — see `PUBLIC_PATHS`. */
export const GUEST_ONLY_PATHS = new Set<string>([ROUTES.login, ROUTES.signup]);

/**
 * Where signing in lands you when no `?redirect=` was carried along.
 * Members land on the marketing Home page first — the ResumeAnalysisBanner
 * greets them with their season, swatches, and links to their report/dashboard.
 * This way the beautiful campaign story is the first thing they see, and they
 * can navigate to the dashboard from the banner whenever they want.
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

/** Signed-in header, ordered by the product journey: analyse → read → wear → ask. */
export const APP_NAV: NavLink[] = [
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

/* ------------------------------------------------------------- page titles */

export const PAGE_TITLES: Record<string, string> = {
  [ROUTES.root]: "D'Fashion — Welcome",
  [ROUTES.home]: "D'Fashion — Discover Your Colour Season",
  [ROUTES.upload]: "Upload — D'Fashion",
  [ROUTES.report]: "Your Colour Report — D'Fashion",
  [ROUTES.tryOn]: "Virtual Try-On — D'Fashion",
  [ROUTES.chat]: "D'Style Stylist Chat — D'Fashion",
  [ROUTES.dashboard]: "Dashboard — D'Fashion",
  [ROUTES.pricing]: "Pricing — D'Fashion",
  [ROUTES.login]: "Sign In — D'Fashion",
  [ROUTES.signup]: "Sign Up — D'Fashion",
};

export const FALLBACK_PAGE_TITLE = "Page Not Found — D'Fashion";

/** Routes whose hero sits under a transparent, full-bleed header. */
export const OVERLAY_ROUTES = new Set<string>([ROUTES.home]);

/** Builds a login URL that returns the visitor to where they were headed. */
export function loginPathFor(destination: string): string {
  if (!destination || destination === ROUTES.home) return ROUTES.login;
  return `${ROUTES.login}?redirect=${encodeURIComponent(destination)}`;
}
