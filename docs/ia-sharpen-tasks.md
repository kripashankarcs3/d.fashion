# Tasks — IA Sharpen: Home / Dashboard / Report

**Spec:** `.kiro/specs/ia-sharpen-home-dashboard-report/`
**Priority order:** P0 tasks first (D1, D2, D5) — these alone resolve the core confusion.

---

## Task 1 — D1: Delete duplicate full palette grid from Dashboard

- [ ] Open `src/pages/Dashboard.tsx`.
- [ ] Locate the `{/* Full colour palette */}` section (the `<section className="mt-12">` block containing `<SectionHeading label="Your Palette" title="Your Colour Palette" />` and the full `ColorSwatch` grid).
- [ ] Delete the entire section — from `{/* Full colour palette */}` through the closing `</section>`.
- [ ] Confirm `ColorSwatch` import remains (it is still used by `PaletteRow`).
- [ ] Run `npm run typecheck` — must pass.

**Requirement:** R1
**Effort:** 5 min
**Priority:** P0

---

## Task 2 — D2: Add "View full report →" link in Dashboard header

- [ ] Open `src/pages/Dashboard.tsx`.
- [ ] Locate the `<motion.header>` block — specifically the `<p>` showing analysed date and undertone.
- [ ] After that `<p>`, still inside `<motion.header>`, add:

```tsx
<Link
  href={ROUTES.report}
  className="mt-4 inline-flex items-center gap-1.5 text-nav text-gold-primary transition-colors duration-200 ease-out hover:text-gold-light"
>
  View full report
  <ArrowRight className="h-4 w-4" aria-hidden="true" />
</Link>
```

- [ ] `ROUTES` and `ArrowRight` are already imported — no new imports needed.
- [ ] Run `npm run typecheck`.

**Requirement:** R2
**Effort:** 15 min
**Priority:** P0

---

## Task 3 — D5: Replace hardcoded paths in QuickActions with ROUTES constants

- [ ] Open `src/pages/Dashboard.tsx`.
- [ ] Locate the `actions` array inside the `QuickActions` function.
- [ ] Replace each `href` string literal:
  - `'/upload'` → `ROUTES.upload`
  - `'/try-on'` → `ROUTES.tryOn`
  - `'/chat'` → `ROUTES.chat`
  - `'/report'` → `ROUTES.report`
- [ ] Run `npm run typecheck`.

**Requirement:** R5
**Effort:** 10 min
**Priority:** P0

---

## Task 4 — D3: Add "See all N colours →" link on Dashboard palette strip

- [ ] Open `src/pages/Dashboard.tsx`.
- [ ] Locate the palette strip `<div>` (the `flex flex-wrap items-center gap-3 border-b border-gold-hairline pb-6` div).
- [ ] After the `<motion.div>` of swatches, inside the same parent div, add:

```tsx
<Link
  href={ROUTES.report}
  className="ml-auto inline-flex items-center gap-1 text-nav text-cream-primary/55 transition-colors duration-200 ease-out hover:text-cream-primary"
>
  See all {seasonInfo.palette.length} colours
  <ArrowRight className="h-4 w-4" aria-hidden="true" />
</Link>
```

- [ ] Run `npm run typecheck`.

**Requirement:** R3
**Effort:** 15 min
**Priority:** P1

---

## Task 5 — D4: Reorder Dashboard sections — status → actions → archive

- [ ] Open `src/pages/Dashboard.tsx`.
- [ ] In the populated-state `<>` fragment, move the `<QuickActions />` call (currently at the very bottom) to appear **after the palette strip** and **before** the Compare with Previous section.
- [ ] New order:
  1. `<motion.header>` — season header
  2. Palette strip div
  3. `<QuickActions />` ← moved here
  4. Compare with Previous `<section>` (conditional)
  5. Saved Looks `<section>`
  6. Saved Reports `<section>`
  7. Analysis History `<section>`
- [ ] Run `npm run typecheck`.

**Requirement:** R4
**Effort:** 20 min
**Priority:** P1

---

## Task 6 — D6: Filter QuickActions to upload-only in empty state

- [ ] Open `src/pages/Dashboard.tsx`.
- [ ] Change the `QuickActions` function signature to accept `emptyState?: boolean` prop (default `false`).
- [ ] Inside `QuickActions`, filter the actions array:

```tsx
const actions = emptyState
  ? allActions.filter((a) => a.href === ROUTES.upload)
  : allActions;
```

- [ ] In the empty-state branch of `Dashboard`, change `<QuickActions />` to `<QuickActions emptyState />`.
- [ ] Run `npm run typecheck`.

**Requirement:** R6
**Effort:** 20 min
**Priority:** P1

---

## Task 7 — D8: Add "Back to dashboard" link on Report

- [ ] Open `src/pages/Report.tsx`.
- [ ] Add `ArrowLeft` to the lucide-react import.
- [ ] In the `<header>` block — inside `<EditorialContainer>`, before `<EyebrowLabel tone="gold">Your Colour Report</EyebrowLabel>` — add:

```tsx
<Link
  href={ROUTES.dashboard}
  className="mb-6 inline-flex items-center gap-1.5 text-nav text-cream-primary/55 transition-colors duration-200 ease-out hover:text-cream-primary"
>
  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
  Back to dashboard
</Link>
```

- [ ] `ROUTES` is already imported.
- [ ] Run `npm run typecheck`.

**Requirement:** R7
**Effort:** 15 min
**Priority:** P1

---

## Task 8 — D9: Strengthen ResumeAnalysisBanner — season + swatches + two CTAs

- [ ] Open `src/components/ResumeAnalysisBanner.tsx`.
- [ ] Rewrite the component to:
  - Compute `seasonInfo` from `getSeasonInfo(...)` (already done in current code for `.season`; extend to also use `.palette`).
  - Display the season name.
  - Display `seasonInfo.palette.slice(0, 4)` as four small swatches (`h-6 w-6`, `rounded-sm`, `border border-gold-hairline`).
  - Show palette count label: `"{N} colours in your palette"`.
  - Add a second CTA button "Go to dashboard" → `ROUTES.dashboard` alongside the existing "View report" button.
  - Rename existing button label from "Resume My Analysis" to "View report".
- [ ] Keep the `if (!analysisResult) return null` guard.
- [ ] Keep `useStyleStore` as the only data source (no auth store, no API call).
- [ ] Run `npm run typecheck`.

**Requirement:** R8
**Effort:** 45 min
**Priority:** P1

---

## Task 9 — R9: Replace hardcoded route literals in FeatureShowcase, PricingTeaser, StylistChat

### FeatureShowcase.tsx
- [ ] Open `src/components/FeatureShowcase.tsx`.
- [ ] Add `import { ROUTES } from '@/config/navigation';`.
- [ ] In the `CHAPTERS` array, replace:
  - `href: '/upload'` (appears twice, chapters 1 and 2) → `ROUTES.upload`
  - `href: '/report'` (chapter 3) → `ROUTES.report`
  - `href: '/try-on'` (chapter 4) → `ROUTES.tryOn`

### PricingTeaser.tsx
- [ ] Open `src/components/PricingTeaser.tsx`.
- [ ] Add `import { ROUTES } from '@/config/navigation';`.
- [ ] In the `plans` array, replace:
  - `href: '/upload'` (Starter plan) → `ROUTES.upload`
  - `href: '/pricing'` (Essentials + Atelier plans) → `ROUTES.pricing`

### StylistChat.tsx
- [ ] Open `src/components/StylistChat.tsx`.
- [ ] Add `import { ROUTES } from '@/config/navigation';`.
- [ ] In `initialMessage`, replace:
  - `link: { href: '/upload', label: 'Upload a selfie →' }` → `link: { href: ROUTES.upload, label: 'Upload a selfie →' }`

### Verify
- [ ] Run the grep invariant — must return 0 results:
  ```bash
  grep -rn "href: '/\|href: \"/" src/ --include=*.tsx --include=*.ts | grep -v "config/navigation"
  ```
- [ ] Run `npm run typecheck`.

**Requirement:** R9
**Effort:** 20 min
**Priority:** P1

---

## Task 10 — AppShell: import GUEST_ONLY_PATHS, fix scroll-margin

- [ ] Open `src/components/AppShell.tsx`.
- [ ] Add `GUEST_ONLY_PATHS` to import from `@/config/navigation`:
  ```tsx
  import { GUEST_ONLY_PATHS } from '@/config/navigation';
  ```
- [ ] Remove the local constant:
  ```tsx
  const AUTH_ROUTES = new Set(['/login', '/signup']);
  ```
- [ ] Replace `AUTH_ROUTES.has(location)` with `GUEST_ONLY_PATHS.has(location)`.
- [ ] On `<main>`, change `scroll-mt-16` → `scroll-mt-[70px]`.
- [ ] Run `npm run typecheck`.

**Requirements:** R10, R11
**Effort:** 10 min
**Priority:** P1

---

## Task 11 — Add role comments to Home, Dashboard, Report

- [ ] `src/pages/Home.tsx` — add before first import:
  ```tsx
  // SELL. Public campaign story. Renders the same for everyone except a
  // personalised resume strip for returning members. Never shows analysis detail.
  ```
- [ ] `src/pages/Dashboard.tsx` — add before first import:
  ```tsx
  // ORIENT. The member's hub: status at a glance, what changed, the archive,
  // and the launcher. Summarises; never explains. Every summary links out.
  ```
- [ ] `src/pages/Report.tsx` — add before first import:
  ```tsx
  // EXPLAIN. The full artefact of ONE analysis. Shareable and printable,
  // so it must never contain account-level or activity data.
  ```

**Requirement:** R12
**Effort:** 5 min
**Priority:** P2

---

## Task 12 — Add altitude rule to CLAUDE.md

- [ ] Check if `CLAUDE.md` exists at project root. If not, create it.
- [ ] Append the following section:

```markdown
## Altitude rule — Home / Dashboard / Report

Dashboard **summarises and links**. Report **explains**.

If you are about to add a section to Dashboard that a user could read and act on
*without leaving the page*, it belongs in Report, and Dashboard should get a
one-line summary linking to it instead.

Rule of thumb:
- Home → SELL (would you show this to a stranger? → Home)
- Dashboard → ORIENT (is it a summary that links somewhere? → Dashboard)
- Report → EXPLAIN (does it explain colour theory in depth? → Report)
```

**Requirement:** R13
**Effort:** 5 min
**Priority:** P2

---

## Final verification (after all tasks complete)

```bash
npm run typecheck
npm run build
```

Then manual QA from `docs/home-vs-dashboard-ia-decision.md §8`:

**Signed in, with an analysis:**
- [ ] `/dashboard` shows season, palette strip, and **no** full palette grid.
- [ ] "View full report →" from Dashboard header lands on `/report`.
- [ ] "Back to dashboard" from Report lands on `/dashboard`. Round trip works.
- [ ] Quick Actions appear **above** Compare/Saved/History sections.
- [ ] All four Quick Action cards navigate correctly.
- [ ] `/` shows the resume banner with season name, 4 swatches, and both "View report" + "Go to dashboard" buttons.
- [ ] Hard-refresh `/` — banner appears **immediately, no flash**.

**Signed in, no analysis:**
- [ ] `/dashboard` shows empty state with only the New Analysis card (no dead doors).
- [ ] `/` shows no resume banner.

**Signed out:**
- [ ] `/` renders the full marketing story — no personal data, no redirect.
- [ ] `/dashboard` redirects to `/login?redirect=%2Fdashboard`.

**Grep check:**
- [ ] `grep -rn "href: '/\|href: \"/" src/ --include=*.tsx --include=*.ts | grep -v "config/navigation"` returns 0 rows.
