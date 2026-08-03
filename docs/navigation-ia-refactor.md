# Navigation & Information Architecture Refactor — Implementation Handoff

**Project:** D'Fashion (DeeStyle) — Vite + React 18 + TypeScript + wouter 3.10 + Zustand + framer-motion + Tailwind
**Branch:** `main` (all work is uncommitted in the working tree)
**Status:** Core refactor complete and typecheck-clean. Remaining work is listed in §4.
**Audience:** An AI/engineer picking this up cold. This document is self-contained — you should not need any prior conversation.

---

## 0. TL;DR

A large navigation refactor is **already applied to the working tree** (uncommitted). It:

1. Created a single source of truth for routing/IA at `src/config/navigation.ts`.
2. Replaced a blunt app-wide auth wall (`RequireAuth`) with per-route guards (`Protected` / `GuestOnly`) so the marketing site is public and only app pages are gated.
3. Moved scroll-restoration out of every page's `useEffect` into a router-owned `ScrollManager`, which also makes cross-page anchor links work.
4. Rewired Navbar + Footer to render from config, with auth-aware link sets.
5. Swept every hardcoded route string literal onto `ROUTES`.

**`npm run typecheck:client` passes clean.** Nothing has been run in a browser yet.

**Your job:** the 9 tasks in §4, then the verification in §6. Do not redo §3.

---

## 1. Why this refactor exists

The pre-refactor state had four concrete defects:

| # | Defect | Consequence |
|---|--------|-------------|
| 1 | `RequireAuth` wrapped the **entire** router in `App.tsx` | `/` (the campaign landing page) and `/pricing` were gated. A first-time visitor could not see the marketing site at all — they were bounced to `/login` before the product could sell itself. |
| 2 | Route paths and labels were duplicated across `Navbar`, `Footer`, `App.tsx` `PAGE_TITLES`, and ~18 inline `<Link href="/...">` sites | Labels had already drifted: `/pricing` was "Collections" in the header, "Pricing" in the footer; `/dashboard` was "Dashboard" in nav and "My Profile" in the account menu. Same destination, three names. |
| 3 | Every page called `window.scrollTo(0,0)` in its own mount effect | The framer-motion `AnimatePresence` page transition mounts the incoming route more than once, so a late reset always clobbered any attempt to jump to a section. Cross-page anchor links were therefore impossible. |
| 4 | The header nav offered gated destinations to signed-out visitors | Every header link for a guest dead-ended at a login redirect. |

The refactor's guiding principle:

> **A path or a label is written exactly once, in `src/config/navigation.ts`. Every navigation surface and the router itself read from it.**

---

## 2. Target architecture

### 2.1 `src/config/navigation.ts` — the single source of truth

Exports (all already written, do not redesign):

| Export | Type | Purpose |
|---|---|---|
| `NavLink` | interface | `{ href: string; label: string; hash?: string }`. `hash` present ⇒ this link scrolls to a section instead of just routing. |
| `ROUTES` | const object | Canonical path for every screen. `home, pricing, login, signup, dashboard, upload, report, tryOn, chat`. |
| `ROUTE_ALIASES` | `Record<string,string>` | Legacy paths kept alive as redirects. Currently `{'/tryon': '/try-on'}`. |
| `PUBLIC_PATHS` | `Set<string>` | `/` and `/pricing`. Reference set — see §5.3. |
| `GUEST_ONLY_PATHS` | `Set<string>` | `/login`, `/signup`. Reference set — see §5.3. |
| `AUTHENTICATED_HOME` | const | `ROUTES.dashboard`. Where sign-in lands you absent a `?redirect=`. Deliberately **not** `/` — the landing page stays the front door for everyone. |
| `MARKETING_NAV` | `NavLink[]` | Signed-out header. Anchors + `/pricing` only. Nothing gated. |
| `APP_NAV` | `NavLink[]` | Signed-in header, ordered by product journey: analyse → read → wear → ask. |
| `ACCOUNT_MENU` | `NavLink[]` | Avatar dropdown. Account concerns only; nothing already in `APP_NAV`, so no destination is reachable under two labels. |
| `FOOTER_PRODUCT` | `NavLink[]` | Footer product column (anchors + pricing). |
| `FOOTER_ACCOUNT_AUTHED` / `FOOTER_ACCOUNT_GUEST` | `NavLink[]` | Footer account column, swapped on auth state so guests are never pointed at a gated page. |
| `PAGE_TITLES` | `Record<string,string>` | `document.title` per path. |
| `FALLBACK_PAGE_TITLE` | const | `"Page Not Found — D'Fashion"`. |
| `OVERLAY_ROUTES` | `Set<string>` | Routes whose hero sits under a transparent full-bleed header. Currently just `/`. |
| `loginPathFor(destination)` | function | Builds `/login?redirect=<encoded>`; returns bare `/login` for `/` or empty input. |

### 2.2 `src/components/RouteGuards.tsx` — per-route auth

Replaces the deleted `src/components/RequireAuth.tsx`.

- **`<Protected fallback>`** — renders `fallback` while `authStore.authReady` is false; redirects to `loginPathFor(location)` when not authenticated; else renders children.
- **`<GuestOnly fallback>`** — same readiness gate; if authenticated, redirects to `?redirect=` target or `AUTHENTICATED_HOME`; else renders children.

Both read `authReady` and `isAuthenticated` from `useAuthStore` (`src/store/useAuthStore.ts`).

### 2.3 `src/lib/scroll.ts` + `src/components/ScrollManager.tsx` — scroll ownership

`src/lib/scroll.ts` holds a **module-level singleton** `pending: {path, hash} | null` plus:

- `setPendingScrollTarget(path, hash)` — called by `HashLink` before a cross-page navigation.
- `pendingScrollTargetFor(path)` — returns the hash if the pending intent matches `path`; drops the intent and returns `null` on mismatch.
- `clearPendingScrollTarget()` — **currently exported but never called.** See task **T2**.
- `scrollToSection(id, smooth = false)` — returns `false` if the element has not mounted. Honours `prefers-reduced-motion`.
- `scrollToTop()`.

`ScrollManager` is rendered **inside** the animated page container in `App.tsx` so it runs when the incoming page does. On `path` change: if there is no pending target it scrolls to top; otherwise it polls up to `MAX_FRAMES = 60` (~1s at 60fps) via `requestAnimationFrame` waiting for the section to mount.

### 2.4 `src/components/nav/HashLink.tsx` — anchor links that survive the SPA

A plain `<a href="/#id">` triggers a full document load under wouter, throwing away SPA state. `HashLink`:

- Bails out (letting the browser handle it) on modified clicks — `metaKey`/`ctrlKey`/`shiftKey`/`altKey`, non-left button, or already-`defaultPrevented`. This preserves open-in-new-tab.
- Same page ⇒ `scrollToSection(hash, true)` (smooth).
- Different page ⇒ `setPendingScrollTarget(href, hash)` then `navigate(href)`; `ScrollManager` finishes the job.
- Accepts `onNavigate` for side effects like closing the mobile drawer.
- Renders a real `<a href={`${href}#${hash}`}>` so the link is copyable and crawlable.

### 2.5 `src/App.tsx` — router shape

```
<AppShell>
  <AnimatePresence mode="wait">
    <motion.div key={location}>
      <ScrollManager path={location} />
      <Suspense fallback={<PageFallback />}>
        <Switch>
          Public:      /  (Home, no ErrorBoundary — see T9), /pricing
          Guest only:  /login, /signup      → wrapped in <GuestOnly>
          Protected:   /dashboard /upload /report /try-on /chat → wrapped in <AppRoute>
          Aliases:     Object.entries(ROUTE_ALIASES).map(...) → <Redirect replace />
          Fallback:    <Route component={NotFound} />
        </Switch>
      </Suspense>
    </motion.div>
  </AnimatePresence>
</AppShell>
```

`AppRoute` is a local helper = `<Protected fallback={<PageFallback/>}><ErrorBoundary pageName={name}>{children}</ErrorBoundary></Protected>` — auth gate outside, error boundary inside.

**Verified:** mapping an array of `<Route>` into `<Switch>` is safe. wouter 3.10's `Switch` uses `flattenChildren(children)` (`node_modules/wouter/src/index.js:335`), which flattens nested arrays. The `/tryon` alias will match.

### 2.6 Anchor targets on the landing page

Three section ids are referenced by `MARKETING_NAV` / `FOOTER_PRODUCT` / `Hero`:

| id | Rendered by | Has `scroll-mt`? |
|---|---|---|
| `how-it-works` | `src/components/HowItWorks.tsx:46` (`<section id="how-it-works" className="scroll-mt-16 …">`) | ✅ `scroll-mt-16` |
| `colour-season` | `src/components/FeatureShowcase.tsx` → `CampaignSpread` (`chapter.id`) | ❌ **none** — task **T1** |
| `virtual-try-on` | same | ❌ **none** — task **T1** |

(`FeatureShowcase` also defines `skin-undertone` and `style-archetype` chapters that no nav surface currently links to. Leave them; they're valid future anchor targets.)

---

## 3. What is ALREADY applied to the working tree — do not redo

`git status --short` at handoff time:

```
 M e2e/smoke.js                        M src/pages/Chat.tsx
 M src/App.tsx                         M src/pages/Dashboard.tsx
 M src/components/EmptyAnalysisState.tsx   M src/pages/Home.tsx
 M src/components/ErrorBoundary.tsx    M src/pages/Login.tsx
 M src/components/FinalCTA.tsx         M src/pages/Pricing.tsx
 M src/components/Footer.tsx           M src/pages/Report.tsx
 M src/components/Hero.tsx             M src/pages/Signup.tsx
 M src/components/HowItWorks.tsx       M src/pages/TryOn.tsx
 M src/components/Navbar.tsx           M src/pages/Upload.tsx
 D src/components/RequireAuth.tsx      M src/pages/not-found.tsx
 M src/components/ResumeAnalysisBanner.tsx
 M src/components/TryOnPreview.tsx
 M src/hooks/useAnalysis.ts
?? src/config/navigation.ts       ?? src/components/RouteGuards.tsx
?? src/components/ScrollManager.tsx  ?? src/components/nav/HashLink.tsx
?? src/lib/scroll.ts
?? landing.deep.png landing.mid.png landing.top.png   ← local visual-QA scratch, ignore
```

### 3.1 Structural changes (applied)

- **`src/config/navigation.ts`** — new, complete (§2.1).
- **`src/components/RouteGuards.tsx`** — new (§2.2). **`src/components/RequireAuth.tsx` deleted**; zero references remain (verified by grep).
- **`src/lib/scroll.ts`, `src/components/ScrollManager.tsx`, `src/components/nav/HashLink.tsx`** — new (§2.3, §2.4).
- **`src/App.tsx`** — rewritten router (§2.5); `PAGE_TITLES` moved to config; `'/tryon'` removed from titles and turned into a redirect.
- **`src/components/Navbar.tsx`** — renders `MARKETING_NAV` vs `APP_NAV` on auth state; CTA label is `'New Analysis'` (authed) / `'Begin Analysis'` (guest); account menu reduced to `ACCOUNT_MENU`; mobile drawer account block changed from a 3-col grid to a list; `handleSignOut` now also closes the mobile drawer; a dead `cn()` ternary with identical branches was collapsed.
- **`src/components/Footer.tsx`** — "Company" column renamed **"Account"** and swapped on auth state; product column uses `HashLink` for `hash` entries; shared `linkClassName` extracted.
- **Every page** — per-page `window.scrollTo(0,0)` effects removed (Home, Upload, Chat, Pricing, Dashboard, Report, TryOn, Login, Signup). Now owned by `ScrollManager`.
- **`src/pages/Login.tsx` / `Signup.tsx`** — post-auth default destination changed from `/` to `AUTHENTICATED_HOME`.
- **`e2e/smoke.js`** — `/` and `/pricing` moved from `PROTECTED_ROUTES` to `PUBLIC_ROUTES`; `/tryon` added to protected; each result now records `redirectedToLogin`.

### 3.2 Route-literal sweep + Hero scroll handler (applied in the last session, typecheck-clean)

Every remaining hardcoded path was replaced with a `ROUTES` reference. `grep -rn "href=\"/\|navigate('/\|to=\"/\|href='/" src/` now returns **zero** hits outside `config/navigation.ts` and a doc comment in `HashLink.tsx`.

| File | Change |
|---|---|
| `src/components/Hero.tsx` | Deleted the local `scrollToHowItWorks` handler (it hardcoded `getElementById('how-it-works')` and ignored `prefers-reduced-motion`). Replaced the "See how it works" `<a>` with `<HashLink href={ROUTES.home} hash="how-it-works">`. CTA → `ROUTES.upload`. |
| `src/components/EmptyAnalysisState.tsx` | → `ROUTES.upload` |
| `src/components/FinalCTA.tsx` | → `ROUTES.upload` |
| `src/components/ResumeAnalysisBanner.tsx` | → `ROUTES.report` |
| `src/components/ErrorBoundary.tsx` | "Go Home" → `ROUTES.home` |
| `src/components/TryOnPreview.tsx` | → `ROUTES.tryOn`, `ROUTES.upload` |
| `src/components/HowItWorks.tsx` | → `ROUTES.upload` |
| `src/pages/not-found.tsx` | → `ROUTES.home`, `ROUTES.report` |
| `src/pages/Dashboard.tsx` | 2× → `ROUTES.tryOn` |
| `src/pages/Report.tsx` | 2× → `ROUTES.tryOn` |
| `src/pages/TryOn.tsx` | → `ROUTES.upload` |
| `src/pages/Pricing.tsx` | → `` `${ROUTES.signup}?plan=Starter` `` |
| `src/pages/Login.tsx` | footer link → `ROUTES.signup` |
| `src/pages/Signup.tsx` | footer link → `ROUTES.login` |
| `src/hooks/useAnalysis.ts` | `navigate('/report')` → `navigate(ROUTES.report)` |

---

## 4. Remaining work

Ordered by priority. Each task states the defect, the fix, and its acceptance criterion.

### T1 — Anchor targets tuck under the fixed header (**bug, user-visible**)

**Files:** `src/components/editorial/CampaignSpread.tsx:50-57`

**Problem:** The header is `position: fixed` with `h-[70px]` (`src/components/Navbar.tsx:141-144`). `CampaignSpread`'s root `<section id={id}>` has no `scroll-margin-top`, so navigating to `#colour-season` or `#virtual-try-on` lands with the section's top 70px hidden behind the header. `HowItWorks` already dodges this with `scroll-mt-16`.

**Fix:** add a scroll margin to `CampaignSpread`'s section `className`, in the `cn(...)` call alongside `'relative isolate flex flex-col overflow-hidden md:block'`.

**Note:** `scroll-mt-16` = 64px, but the header is 70px. Prefer an exact token, e.g. `scroll-mt-[70px]`, and consider aligning `HowItWorks` to the same value so both anchors land identically. If a `--header-height` CSS variable is introduced, use it in all three places.

**Acceptance:** from `/pricing`, clicking footer → "Colour Season" lands with the section's eyebrow label fully visible below the header, not clipped.

---

### T2 — `ScrollManager` never clears a consumed intent and has no timeout fallback (**bug**)

**File:** `src/components/ScrollManager.tsx:18-36`, `src/lib/scroll.ts`

Two distinct defects:

**(a) Consumed intent is never cleared.** `pendingScrollTargetFor(path)` returns the hash on a match but leaves `pending` set. `clearPendingScrollTarget()` is exported and never called anywhere. The intent only gets dropped later, incidentally, when some *other* path is visited. Any re-mount of `ScrollManager` for the same path (React StrictMode double-invoke in dev, or a future remount) re-triggers the jump, yanking a user who has already scrolled away.

**Fix:** call `clearPendingScrollTarget()` as soon as the target is successfully scrolled to (inside `land()`, on the branch where `scrollToSection` returns `true`). Do **not** clear it merely on read — the rAF loop needs the value across frames, and clearing on read would also break a legitimate retry.

**(b) No fallback when the section never mounts.** If `MAX_FRAMES` (60) is exhausted, `land()` simply returns. The page is left at whatever scroll offset the previous route had — neither at the section nor at the top. This happens if an anchor id is renamed or the section is conditionally rendered.

**Fix:** on frame exhaustion, call `scrollToTop()` and `clearPendingScrollTarget()`.

**Acceptance:** add a temporary nav entry pointing at a nonexistent hash; navigating to it lands at the top of the page within ~1s instead of stranding mid-page. Remove the temp entry after testing.

---

### T3 — `Protected` drops the query string when redirecting to login (**bug**)

**File:** `src/components/RouteGuards.tsx:20-27`

**Problem:** `const [location] = useLocation()` under wouter returns the **pathname only** — the search string is not included. `loginPathFor(location)` therefore builds `?redirect=/report`, losing any query. A signed-out user opening a shared deep link like `/report?share=abc123` signs in and lands on a bare `/report`, having silently lost the parameter.

**Fix:** compose the destination from `useLocation()` + wouter's `useSearch()`:

```ts
const [location] = useLocation();
const search = useSearch();
const destination = search ? `${location}?${search}` : location;
return <Redirect to={loginPathFor(destination)} />;
```

`loginPathFor` already `encodeURIComponent`s the destination, so the nested query survives round-tripping. `Login.tsx` / `Signup.tsx` read `?redirect=` and `navigate()` to it — decoding is automatic via `URLSearchParams.get`.

**Acceptance:** signed out, open `/report?share=abc`; sign in; land on `/report?share=abc`.

---

### T4 — `GuestOnly` reads `window.location.search` directly (**consistency**)

**File:** `src/components/RouteGuards.tsx:38-42`

**Problem:** `new URLSearchParams(window.location.search)` bypasses the router. It works with wouter's default browser location hook, but it is not reactive and would silently break under a memory/hash location hook (e.g. in tests or SSR). Every other consumer (`Login.tsx`, `Signup.tsx`) uses `useSearch()`.

**Fix:** use `useSearch()` from wouter. Keep the `|| AUTHENTICATED_HOME` fallback.

**Acceptance:** typecheck passes; signed in, visiting `/login?redirect=/upload` still bounces to `/upload`.

---

### T5 — Header CTA contradicts its own comment (**product decision required — do not guess**)

**File:** `src/components/Navbar.tsx:52-54, 275-281, 400-408`

**Problem:** The comment above `navLinks` reads:

> *"Signed-out visitors get the marketing story; signed-in members get the product. Nothing in the header ever dead-ends at a login redirect."*

But the primary CTA points at `ROUTES.upload` for **both** auth states. `/upload` is `Protected`, so a guest clicking "Begin Analysis" is bounced to `/login?redirect=/upload`. The nav *links* honour the invariant; the *CTA* does not.

This may well be intentional — routing a guest through sign-up is a normal conversion funnel — but code and comment currently disagree, and the next person will "fix" the wrong one.

**Three options, pick one:**

| Option | Change | Effect |
|---|---|---|
| **A** (recommended) | Keep `/upload`, narrow the comment to *"No nav **link** dead-ends at a login redirect; the CTA deliberately routes guests through sign-in."* | Zero behaviour change, honest comment. Preserves `?redirect=/upload` so sign-in resumes intent. |
| **B** | Guest CTA → `ROUTES.signup`, authed CTA → `ROUTES.upload` | Explicit funnel, but loses the `?redirect=` resume; add `?redirect=/upload` manually if chosen. |
| **C** | Make `/upload` public up to the point of submission, gate only the API call | Best conversion UX, largest change. Out of scope here. |

Apply the same decision to **both** desktop (`:275`) and mobile drawer (`:400`) CTAs — they are separate JSX blocks.

---

### T6 — Mobile drawer stays open when tapping the current route (**minor UX bug**)

**File:** `src/components/Navbar.tsx:66-71, 328-366`

**Problem:** Non-hash `<Link>`s in the drawer have no `onClick`. The drawer closes via `useEffect(() => setMenuOpen(false), [location])`. If the user taps the link for the route they are **already on**, `location` does not change, the effect does not fire, and the drawer stays open over the page.

(`HashLink` entries are unaffected — they pass `onNavigate={() => setMenuOpen(false)}` explicitly.)

**Fix:** add `onClick={() => setMenuOpen(false)}` to the drawer's non-hash `<Link>` branch. Keep the `[location]` effect as the belt-and-braces path for back/forward navigation.

**Acceptance:** on mobile viewport at `/dashboard`, open drawer, tap "Dashboard" → drawer closes.

---

### T7 — `e2e/smoke.js` always exits 0 (**CI is blind**)

**File:** `e2e/smoke.js:112-140`

**Problem:** The script computes an `issues` array per route — `EXPECTED-LOGIN-REDIRECT`, `UNEXPECTED-LOGIN-REDIRECT`, page errors, console errors — and **`console.log`s them**. It never calls `process.exit(1)`. A total auth-guard regression prints a scary log and still reports success to CI.

**Fix:** accumulate a failure count across the per-route loop and the mobile loop, and `process.exit(failures > 0 ? 1 : 0)` at the end. Make sure `await browser.close()` still runs first.

**Care:** decide deliberately whether **console errors** should fail the build or only warn — third-party scripts and dev-server HMR noise produce false positives. Recommend: page errors and redirect-expectation mismatches are hard failures; console errors print as warnings unless the count exceeds a threshold. Whatever you choose, `log()` the distinction so a silent policy is not mistaken for a clean run.

**Acceptance:** temporarily remove a `<Protected>` wrapper → `npm run test:e2e` exits non-zero. Restore.

---

### T8 — No e2e coverage for the two behaviours this refactor actually introduced

**File:** `e2e/smoke.js` (and/or `e2e/flow.js`)

The updated smoke test covers signed-out routing only. Uncovered:

1. **`GuestOnly` bounce** — an authenticated visitor hitting `/login` must land on `AUTHENTICATED_HOME` (or `?redirect=` target). Requires an authenticated browser context; check whether `e2e/flow.js` already establishes one and extend it there rather than duplicating login logic.
2. **Anchor navigation** — the headline feature. Suggested assertions:
   - From `/pricing`, click footer "How It Works" → URL becomes `/`, and `#how-it-works` is within ~100px of the viewport top (this also regression-tests **T1**).
   - From `/`, click header "Virtual Try-On" → scrolls without a full page load. Assert no navigation occurred, e.g. by stamping `window.__spa = true` before the click and checking it survives.
3. **`/tryon` alias** — already in `PROTECTED_ROUTES`, but signed-out it redirects to `/login`, which does not prove the alias works. Add an authenticated assertion that `/tryon` ends at `/try-on`.

---

### T9 — Smaller items (batch together)

**(a) `document.title` flashes "Page Not Found" during the `/tryon` redirect.**
`src/App.tsx` — the title effect runs on `location`. For one render `location === '/tryon'`, which is absent from `PAGE_TITLES` (deliberately removed), so the title is briefly `FALLBACK_PAGE_TITLE` before the `<Redirect>` commits. Fix by resolving aliases before the lookup: `PAGE_TITLES[ROUTE_ALIASES[location] ?? location] ?? FALLBACK_PAGE_TITLE`.

**(b) `/` has no `ErrorBoundary`.**
`src/App.tsx` — `<Route path={ROUTES.home} component={Home} />` is the only route rendered bare. Every other route is wrapped. A throw in any landing-page section white-screens the app's most-trafficked page. Wrap it: `<ErrorBoundary pageName="Home"><Home /></ErrorBoundary>`.

**(c) `aria-current` is never set for anchor links.**
`src/components/Navbar.tsx:171, 331` — `active` is computed as `!link.hash && location === link.href`, so hash links are never "active" even when their section fills the viewport. Acceptable for now (scroll-spy is a real feature, not a one-liner). If you want it, use `IntersectionObserver` over the anchor ids and set `aria-current="location"` (not `"page"`) on the matching link. **Low priority — skip unless asked.**

**(d) `PUBLIC_PATHS` and `GUEST_ONLY_PATHS` are exported but unused.**
`src/config/navigation.ts` — the router expresses these facts structurally via `<Protected>` / `<GuestOnly>` wrappers instead. Two sources of truth for the same fact will drift. Either (i) delete them, or (ii) keep them and add a comment that they are documentation/test fixtures, and import them in `e2e/smoke.js` to drive `PUBLIC_ROUTES` / `PROTECTED_ROUTES` so the test can never disagree with the app. **Option (ii) is better** — it turns dead code into the thing that keeps the e2e lists honest. Note `e2e/*.js` is plain ESM Node, so it cannot use the `@/` alias; import via a relative path (`../src/config/navigation.ts`) only if the runner can load TS, otherwise leave a comment cross-referencing the module.

---

## 5. Invariants — do not break these

1. **One path, one place.** Never reintroduce a route string literal in a component. `grep -rn "href=\"/" src/` must stay empty outside `config/navigation.ts`.
2. **One destination, one label.** A given route appears under exactly one label across header, drawer, account menu, and footer. This is why `ACCOUNT_MENU` is only "Plans & Billing" — everything else already lives in `APP_NAV`.
3. **No page owns its scroll position.** Do not add `window.scrollTo` to a page component. `ScrollManager` owns it. The page transition mounts routes more than once; a page-level reset will silently defeat anchor navigation. (`BackToTop.tsx` is a deliberate exception — it is an explicit user action, not a mount effect.)
4. **`/` stays public and stays the landing page.** `AUTHENTICATED_HOME` is `/dashboard`, but a signed-in member navigating to `/` must still see the campaign story, not a redirect.
5. **`ScrollManager` must stay inside the `motion.div`.** Hoisting it out of the animated container makes it run before the outgoing route finishes exiting, and the anchor jump lands on a stale layout.
6. **Guards outside, error boundaries inside.** `<Protected>` wraps `<ErrorBoundary>`, never the reverse — otherwise an unauthenticated render can throw inside a boundary and show an error page instead of a login redirect.

---

## 6. Verification plan

Run in order. Nothing below has been executed in a browser yet — **the entire refactor is currently verified by typecheck alone.**

```bash
# 1. Static
npm run typecheck          # client + server. Client is currently CLEAN.
npm run build              # vite build + server build

# 2. Dev server (needs the server too — see root .env.example for required vars)
npm run dev                # concurrently: vite (5173) + server

# 3. E2E, against the running dev server
npm run test:e2e           # node e2e/smoke.js && node e2e/flow.js
                           # NOTE: smoke.js currently always exits 0 — read the log, see T7
```

### Manual QA checklist

**Signed out:**
- [ ] `/` renders the landing page — **no login redirect** (this was the headline bug).
- [ ] `/pricing` renders — no redirect.
- [ ] Header shows: How It Works · Virtual Try-On · Pricing · Sign In · CTA. No gated destinations.
- [ ] Header "How It Works" from `/pricing` → routes to `/` **and** scrolls to the section, header not overlapping (**T1**).
- [ ] Header "Virtual Try-On" while on `/` → smooth scroll, no page reload.
- [ ] Footer "Account" column shows Sign In / Create Account.
- [ ] `/upload` → `/login?redirect=%2Fupload`; signing in lands on `/upload`.
- [ ] `/report?share=abc` → sign in → query preserved (**T3**).
- [ ] `/tryon` → `/try-on` → `/login?redirect=%2Ftry-on`.
- [ ] Nonexistent path → 404 page, title "Page Not Found — D'Fashion".
- [ ] Ctrl/Cmd+click a header anchor link opens a new tab (HashLink modified-click bailout).

**Signed in:**
- [ ] Header shows: Dashboard · Analysis · My Report · Try-On · Stylist + avatar. CTA reads "New Analysis".
- [ ] Avatar menu shows only "Plans & Billing" + Sign Out — no duplicate destinations.
- [ ] `/login` and `/signup` bounce to `/dashboard`.
- [ ] `/` still renders the landing page (invariant 4).
- [ ] Footer "Account" column shows Dashboard / Colour Analysis / My Report / Stylist.
- [ ] Sign Out from the mobile drawer closes the drawer and signs out.

**Cross-cutting:**
- [ ] Every route change starts at the top of the page.
- [ ] Anchor navigation does **not** start at the top — it lands on the section.
- [ ] Mobile (375px): drawer opens, closes on link tap **including the current route** (**T6**), no horizontal overflow.
- [ ] With `prefers-reduced-motion: reduce`, anchor scrolling jumps instantly rather than animating.
- [ ] Browser back/forward across an anchor navigation does not re-trigger a stale scroll jump (**T2a**).

---

## 7. Open questions for the product owner

1. **T5** — should the guest CTA route to `/upload` (via login) or straight to `/signup`? Affects conversion funnel. Code and comment currently disagree; needs a decision, not a guess.
2. `FeatureShowcase` defines `skin-undertone` and `style-archetype` chapters that no nav surface links to. Should they be reachable from the footer product column, or stay scroll-only?
3. `AUTHENTICATED_HOME = /dashboard`. Confirm the dashboard is the right post-login landing for a **brand-new** user with no analysis yet — `EmptyAnalysisState` handles this, but `/upload` might convert better for first-timers.
4. Should the three untracked `landing.*.png` files at the repo root be deleted? Commit `c4c57a5` ("Ignore local visual-QA scratch scripts and screenshots") suggests they are scratch output, but they are currently untracked rather than ignored.

---

## 8. Commit guidance

The working tree currently mixes the structural refactor and the literal sweep. Suggested split if the reviewer wants readable history:

1. `refactor(nav): add navigation config as single source of truth for routes and labels`
2. `feat(routing): replace app-wide auth wall with per-route Protected/GuestOnly guards`
3. `fix(scroll): move scroll restoration into router-owned ScrollManager, add cross-page anchor links`
4. `refactor(nav): render Navbar and Footer from navigation config`
5. `refactor: replace hardcoded route literals with ROUTES references`
6. `test(e2e): reclassify public vs protected routes after auth-wall change`

Otherwise a single `refactor(nav): rebuild information architecture around a single routing config` is acceptable — the change is internally coherent.

**Do not commit** `landing.top.png`, `landing.mid.png`, `landing.deep.png` (see §7.4).
