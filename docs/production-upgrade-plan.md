# D'Fashion — Production Upgrade Plan

Implementation spec for four workstreams:

1. **Responsive scaling** — fix "resize karne pe sirf text chhota-bada hota hai"
2. **Backend / API** — real bugs found by audit
3. **Content depth** — sections jo khaali lagte hain
4. **Images + animations** — production-grade polish

Nothing here is implemented yet. Every item names exact files, exact values, and an acceptance test.

---

# PART A — RESPONSIVE SCALING (the reported bug)

## A.0 Evidence — measured, not guessed

Landing page (`/home`) measured with Playwright at five viewport widths. Computed values:

| Element | 1920px | 1440px | 1100px | 900px | 768px | Scales? |
|---|---|---|---|---|---|---|
| `html` font-size | 16px | 16px | 16px | 16px | 16px | **NO** |
| `h1` (`text-campaign`) | 184px | 180px | 137.5px | 112.5px | 96px | YES (1.92×) |
| lede paragraph | 21px | 18.7px | 17px | 17px | 17px | barely (1.24×) |
| `.btn-campaign` font | 12px | 12px | 12px | 12px | 12px | **NO** |
| `.btn-campaign` padding | 14/32px | 14/32px | 14/32px | 14/32px | 14/32px | **NO** |
| `.btn-campaign` height | 48px | 48px | 48px | — | — | **NO** |
| navbar height | 70px | 70px | 70px | 70px | 70px | **NO** |
| hero stat number (`text-h4`) | 24px | 24px | 24px | 24px | 24px | **NO** |

So: viewport shrinks 2.5× → the headline halves, and **every other thing on the page stays byte-identical**. That is exactly the reported symptom.

## A.1 Root cause

Two type systems live side by side in `src/index.css`:

- **Fluid** (`@theme`, lines 82–101): `--text-campaign`, `--text-editorial-*`, `--text-lede` — all `clamp()` with a `vw` term. These scale.
- **Fixed** (`@theme`, lines 57–80 + 137–142 + 170): `--text-display: 96px`, `--text-h1: 72px` … `--text-micro: 10px`, `--text-nav: 15px`, `--text-wordmark: 30px`, `--text-label: 13px`. All hard px. These do not scale.

Then all *spacing* is fixed too, because `html { font-size }` is never made fluid — Tailwind v4's spacing scale is rem-based, so `p-8`/`gap-5`/`mt-16`/`h-10` are all frozen at a 16px root.

Usage counts (so you know the blast radius):

```
text-body      82 uses      text-caption   39 uses
text-body-sm   65 uses      text-h5        17 uses
text-nav       12 uses      text-h4         5 uses
text-h2         4 uses      text-h3         3 uses
```

~200 usages of fixed-px tokens. **Converting the tokens to `rem` + making the root fluid fixes all of them in one edit.** Only 76 arbitrary `[Npx]` classes need hand conversion (and ~16 of those *should* stay px).

Also confirmed: `--space-1` … `--space-11` (lines 153–163) are **dead code — 0 usages**. Delete them.

## A.2 Step 1 — make the root font-size fluid

`src/index.css`, inside `@layer base`, in the existing `html { … }` block (line 260):

```css
@layer base {
  html {
    /* ── System scale ──
       One fluid root drives every rem in the app: type, spacing, gaps,
       icon sizes, radii, tap targets. When the window changes width, the
       whole composition changes with it instead of only the display type.

       16px  @ ≤ 772px   (mobile floor — never below browser default)
       18.9px @ 1280px
       19.9px @ 1440px
       21px  @ ≥ 1800px  (4K ceiling)

       The 0.72rem term matters: it keeps the value proportional to the
       user's own browser font-size setting, so zoom and a11y preferences
       still work. A pure-vw root would break both. */
    font-size: clamp(1rem, 0.72rem + 0.58vw, 1.3125rem);

    color-scheme: dark;
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }
}
```

**Note for the implementer:** Tailwind's `@media` breakpoints (`md:` = `48rem`) resolve `rem` against the *initial* 16px, not against the fluid `html` size. So breakpoints stay at 768px/1024px/1280px — they will not drift. This is intended.

## A.3 Step 2 — convert every fixed type token from px to rem

`src/index.css`, `@theme` block. Replace lines 57–80, and lines 137–142, and line 170.

```css
  /* ── Fixed type scale, now in rem so it rides the fluid root ──
     Third column = rendered px at 360 / 1440 / 1920 viewport width. */
  --text-display: 5.25rem;      /* 84  / 104  / 110  */
  --text-display--line-height: 1.05;
  --text-display--letter-spacing: -0.02em;
  --text-h1: 4rem;              /* 64  / 79.5 / 84   */
  --text-h1--line-height: 1.05;
  --text-h1--letter-spacing: -0.02em;
  --text-h2: 2.75rem;           /* 44  / 54.6 / 57.8 */
  --text-h2--line-height: 1.15;
  --text-h3: 2rem;              /* 32  / 39.7 / 42   */
  --text-h3--line-height: 1.2;
  --text-h4: 1.5rem;            /* 24  / 29.8 / 31.5 */
  --text-h4--line-height: 1.3;
  --text-h5: 1.25rem;           /* 20  / 24.8 / 26.3 */
  --text-h5--line-height: 1.4;
  --text-body-lg: 1.125rem;     /* 18  / 22.4 / 23.6 */
  --text-body-lg--line-height: 1.65;
  --text-body: 1rem;            /* 16  / 19.9 / 21   */
  --text-body--line-height: 1.65;
  --text-body-sm: 0.875rem;     /* 14  / 17.4 / 18.4 */
  --text-body-sm--line-height: 1.6;
  --text-caption: 0.75rem;      /* 12  / 14.9 / 15.8 */
  --text-caption--line-height: 1.4;
  --text-micro: 0.625rem;       /* 10  / 12.4 / 13.1 */
  --text-micro--line-height: 1.4;

  --text-nav: 0.9375rem;        /* 15  / 18.6 / 19.7 */
  --text-nav--line-height: 1.4;
  --text-footer-label: 0.6875rem;  /* 11 / 13.7 / 14.4 */
  --text-footer-label--line-height: 1.4;
  --text-wordmark: 1.75rem;     /* 28  / 34.8 / 36.8 */
  --text-wordmark--line-height: 1.1;
  --text-label: 0.8125rem;      /* 13  / 16.1 / 17.1 */
  --text-label--line-height: 1.4;
```

## A.4 Step 3 — retune the fluid display clamps

Right now the headline spans **3.8×** (48→184px) while everything else spans **1.0×**. That mismatch *is* the visual bug. After Step 1 the system spans 1.31×, so the display type must come down to roughly **2.0–2.6×** — still dramatic, but in the same family as the rest of the page.

Replace `src/index.css` lines 85–101:

```css
  /* ── Fluid editorial display scale ──
     These keep a vw term on top of the fluid root, because a campaign
     headline legitimately needs a wider range than body copy. But the
     range is now ~2.0–2.6×, not 3.8× — so the headline no longer
     dwarfs the UI it sits on.
     Comment column = rendered px at 360 / 768 / 1440 / 1920. */
  --text-campaign: clamp(3rem, 1.2rem + 5.2vw, 8rem);
  /* 48 / 59 / 99 / 125 */
  --text-campaign--line-height: 0.9;
  --text-campaign--letter-spacing: -0.03em;

  --text-editorial-xl: clamp(2.5rem, 1.1rem + 3.4vw, 5.5rem);
  /* 40 / 44 / 71 / 88 */
  --text-editorial-xl--line-height: 0.96;
  --text-editorial-xl--letter-spacing: -0.025em;

  --text-editorial-lg: clamp(2rem, 0.95rem + 2.3vw, 4.25rem);
  /* 32 / 33 / 52 / 64 */
  --text-editorial-lg--line-height: 1.02;
  --text-editorial-lg--letter-spacing: -0.02em;

  --text-editorial-md: clamp(1.75rem, 1rem + 1.4vw, 3rem);
  /* 28 / 28 / 40 / 48 */
  --text-editorial-md--line-height: 1.08;
  --text-editorial-md--letter-spacing: -0.015em;

  /* No vw needed — the fluid root already gives this the right range. */
  --text-editorial-sm: 1.5rem;   /* 24 / 24 / 30 / 31.5 */
  --text-editorial-sm--line-height: 1.15;
  --text-editorial-sm--letter-spacing: -0.01em;

  --text-lede: 1.0625rem;        /* 17 / 17 / 21 / 22.3 */
  --text-lede--line-height: 1.6;
```

**Tuning lever, if desktop feels flat after this:** raise only the `vw` coefficient of `--text-campaign` (5.2vw → 6.0vw gives ~139px at 1920). Do **not** raise the `rem` term — that inflates mobile. Do not go past ~6.5vw or the mismatch returns.

## A.5 Step 4 — rhythm, gutter, and section padding

Replace lines 148–163 and 189–195, and the `.py-section-*` utilities (lines 708–709):

```css
  /* Component sizes — rem so they scale with the system */
  --size-wordmark: 7.5rem;      /* was 120px */
  --size-underline: 1.5px;      /* KEEP px — a hairline must not thicken */
  --size-cta-min-width: 11.25rem;  /* was 180px */
  --size-field-height: 3.25rem;    /* was 52px */

  /* DELETE --space-1 … --space-11 entirely — 0 usages in the codebase. */

  /* ── Section rhythm ──
     Now pure rem: the fluid root already supplies the scaling, and a
     second vw term here was double-counting (that is why 1920px had
     those huge dead gaps between sections). */
  --rhythm-dense: 3.5rem;    /* 56 / 70 / 73.5 */
  --rhythm-normal: 5.5rem;   /* 88 / 109 / 115 */
  --rhythm-open: 7.5rem;     /* 120 / 149 / 157 */

  /* Gutter keeps a vw term — page margins are genuinely a function of
     viewport width, not of type size. */
  --gutter: clamp(1.25rem, 0.4rem + 2.5vw, 4.5rem);  /* 20 / 26 / 44 / 56 */
```

```css
@layer utilities {
  /* ── Section spacings ── */
  .py-section-xl { padding-block: 6.5rem; }   /* 104 / 129 / 136 */
  .py-section-lg { padding-block: 4.5rem; }   /* 72 / 90 / 94.5 */
}
```

**Why the section padding gets *smaller* at 1920 than today (136px vs 160px):** the 1920px screenshot shows large empty black bands between sections. Tightening this is a fix, not a regression — verify visually after.

## A.6 Step 5 — the 76 arbitrary `[Npx]` classes

Rule: **anything that is a size → rem. Anything that is a line/hairline/dot → stays px.**

**Must stay px** (do not touch): every `[1px]`, `[2px]`, `[3px]`, `[4px]` — these are hairlines, dividers, tracking dots, and the `--radius-sm/md` values. Also `--size-underline`. Also every `border` width.

**Must convert** (`px ÷ 16 = rem`):

| File | Current | Change to | Note |
|---|---|---|---|
| `src/components/Navbar.tsx:153` | `h-[70px]` | `h-[4.375rem]` | header height — must grow with the wordmark |
| `src/components/Navbar.tsx:158` | `text-[26px]` | `text-[1.625rem]` | wordmark |
| `src/components/Navbar.tsx:181` | `bottom-[18px]` | `bottom-[1.125rem]` | nav underline offset |
| `src/components/Navbar.tsx:228` | `text-[15px]` | `text-[0.9375rem]` | avatar initials |
| `src/components/Navbar.tsx:241` | `top-[calc(100%+14px)]` | `top-[calc(100%+0.875rem)]` | |
| `src/components/Navbar.tsx:313` | `h-[70px]` | `h-[4.375rem]` | drawer header |
| `src/components/Navbar.tsx:314` | `text-[26px]` | `text-[1.625rem]` | |
| `src/components/Navbar.tsx:342` | `text-[32px]` | `text-[2rem]` | drawer nav item |
| `src/components/Navbar.tsx:408` | `min-h-[52px]` | `min-h-[3.25rem]` | |
| `src/components/Navbar.tsx:24` | `h-[11px] w-[22px]` | `h-[0.6875rem] w-[1.375rem]` | hamburger box |
| `src/components/Hero.tsx:93` | `max-w-[52rem]` | already rem ✓ | |
| `src/components/Hero.tsx:184,191,198` | `text-[9px]` | `text-[0.5625rem]` | score-card micro labels |
| `src/components/Hero.tsx:59–64` | `size: 2/3/4` (particles) | leave px | dots — must not balloon |
| `src/components/FeatureShowcase.tsx:114` | `px-[28px] py-[14px] text-[11px]` | `px-[1.75rem] py-[0.875rem] text-[0.6875rem]` | |
| `src/components/FeatureShowcase.tsx:25,46,66,86` | `clamp(2.75rem, 5.4vw, 6.5rem)` etc. | see A.6b below | per-chapter headline sizes |
| `src/components/editorial/CampaignSpread.tsx:150` | `text-[11px]` | `text-[0.6875rem]` | eyebrow |
| `src/components/editorial/CampaignSpread.tsx:196` | `text-[15px]` | `text-[0.9375rem]` | body copy |
| `src/components/editorial/CampaignSpread.tsx:196` | `md:max-w-[560px]` | `md:max-w-[35rem]` | |
| `src/components/editorial/CampaignSpread.tsx:117` | `max-w-[46rem] md:max-w-[38rem]` | already rem ✓ | |
| `src/components/TryOnPreview.tsx:91` | `max-w-[360px]` | `max-w-[22.5rem]` | |
| `src/components/TryOnPreview.tsx:21` | `h-64 w-52` (blazer SVG) | already rem ✓ | |
| `src/components/TryOnPreview.tsx:105,122` | `text-[10px]` | `text-[0.625rem]` | |
| `src/components/TryOnPreview.tsx:50,51` | `blur-[130px]`, `blur-[100px]` | leave px | decorative blur |
| `src/components/PricingTeaser.tsx:79,86` | `text-[10px]`, `text-[11px]` | `text-[0.625rem]`, `text-[0.6875rem]` | |
| `src/components/PricingTeaser.tsx:93` | `text-[2.5rem]` | already rem ✓ | |
| `src/components/SocialProof.tsx:109` | `text-[3rem]` | already rem ✓ | |
| `src/components/HowItWorks.tsx:126` | `text-[7rem]` | already rem ✓ | |
| `src/pages/Report.tsx` (6 sites) | `text-[10px]` | `text-[0.625rem]` | section sub-labels |
| `src/pages/Dashboard.tsx` (3 sites) | `text-[10px]` | `text-[0.625rem]` | |
| `src/pages/not-found.tsx` (3 sites) | `[96px]`, `[300px]` etc. | `[6rem]`, `[18.75rem]` | |
| `src/components/UploadFlow.tsx` (3 sites) | check each | rem unless hairline | |
| `src/components/StylistChat.tsx` (2 sites) | check each | rem unless hairline | |
| `src/components/AnalysisProcessing.tsx` (2) | check each | rem unless hairline | |
| `src/pages/TryOn.tsx` (1) | check | rem unless hairline | |
| `src/components/ui/*.tsx` | ~15 sites | **leave alone** | shadcn internals; already rem-based except hairlines |

### A.6b The four per-chapter headline overrides

`src/components/FeatureShowcase.tsx` lines 25, 46, 66, 86 hardcode their own `clamp(…vw…)` — these bypass the token system entirely and are a second source of the mismatch. Replace with the retuned scale:

```ts
// line 25  (colour-season)
headingSize: 'clamp(2.5rem, 1.0rem + 3.6vw, 5.75rem)',   // 40 / 45 / 74 / 92
// line 46  (skin-undertone)
headingSize: 'clamp(2.25rem, 0.9rem + 3.2vw, 5.25rem)',  // 36 / 39 / 65 / 82
// line 66  (style-archetype)
headingSize: 'clamp(2.4rem, 0.95rem + 3.4vw, 5.5rem)',   // 38 / 42 / 69 / 87
// line 86  (virtual-try-on)
headingSize: 'clamp(2.25rem, 0.9rem + 3.1vw, 5rem)',     // 36 / 38 / 64 / 80
```

Better still: add a `headingScale?: 'campaign' | 'xl' | 'lg'` prop to `CampaignSpread` and delete the raw `fontSize` style, so nothing can drift again.

## A.7 Step 6 — viewport-height sections

19 sites use `vh`/`svh`/`min-h-screen`. Two problems: (a) `vh` on mobile jumps when the URL bar hides; (b) on a short, wide window (e.g. 1920×760) an `85vh` section is only 646px tall while its fixed-px content needs more → cramped, and on a 1440×1200 window it is 1020px tall with dead space.

- Replace every `vh` with `svh` (already done in `CampaignSection`, missing in `CampaignSpread` and `FeatureShowcase`):
  - `src/components/editorial/CampaignSpread.tsx:44` → `md:min-h-[85svh] lg:min-h-[92svh]`
  - `src/components/FeatureShowcase.tsx:24,45,65,85` → same swap
  - `src/pages/Report.tsx:167`, `src/pages/not-found.tsx` → `min-h-[80svh]`
- Add a **content floor and a ceiling** so short windows don't crush and tall ones don't gape. In `CampaignSection.tsx:23–28` and the four `FeatureShowcase` heights:
  ```
  screen: 'min-h-[max(38rem,min(100svh,56rem))]'
  tall:   'min-h-[max(34rem,min(82svh,50rem))] lg:min-h-[max(36rem,min(88svh,54rem))]'
  mid:    'min-h-[max(28rem,min(62svh,42rem))] lg:min-h-[max(30rem,min(70svh,46rem))]'
  band:   'min-h-[max(22rem,min(46svh,32rem))] lg:min-h-[max(24rem,min(54svh,36rem))]'
  ```
- `src/components/Hero.tsx:30,92` `min-h-screen` → `min-h-[max(40rem,min(100svh,58rem))]`.

## A.8 Step 7 — viewport meta (accessibility, one line)

`index.html:5` currently blocks pinch-zoom, which is a WCAG 1.4.4 failure and will be flagged by any audit:

```html
<!-- before -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
<!-- after -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

## A.9 Things that must **NOT** scale — do not convert these

- All `border-width` (`1px` hairlines). The whole visual language is hairlines; a 1.3px border at 1920 renders as a fuzzy grey smear.
- `--radius-sm: 2px`, `--radius-md: 4px`. Keep px.
- `--size-underline: 1.5px`.
- Hero particle dots (`Hero.tsx:59–64`, sizes 2/3/4).
- Decorative `blur-[Npx]` values.
- Tailwind breakpoint values.
- `--container-content: 1200px`, `--container-narrow: 640px`, `--container-editorial: 1440px` — these are hard maximum measures. Leave in px. (`--container-reading: 68ch` already scales with type, which is correct.)

## A.10 Acceptance test

Save as `_qa-scale.mjs` in the repo root (gitignored by the existing `/check*.mjs` rule if you name it `check-scale.mjs`), run against `npm run dev:client`:

```js
import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [1920, 1440, 1280, 1100, 900, 768, 600, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://localhost:5173/home', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  const m = await p.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const fs = (e) => e ? parseFloat(getComputedStyle(e).fontSize) : null;
    const h1 = q('h1'), btn = q('.btn-campaign'), nav = q('header nav');
    return {
      root: fs(document.documentElement),
      h1: fs(h1),
      btn: fs(btn),
      navH: nav && Math.round(nav.getBoundingClientRect().height),
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log(w, JSON.stringify({ ...m, ratio: +(m.h1 / m.root).toFixed(2) }));
  await p.screenshot({ path: `qa-${w}.png`, fullPage: false });
  await p.close();
}
await b.close();
```

**Pass criteria:**
1. `root` changes monotonically: 16 at 768 → ~19.9 at 1440 → 21 at 1920.
2. `btn` and `navH` change across widths (they are frozen today).
3. `ratio` (h1 ÷ root) stays within **4.5 – 6.2** across the whole range. Today it is 3.0 at 390px and 11.5 at 1920px — that spread *is* the bug.
4. `overflow` is `false` at every width.
5. Repeat for `/pricing`, `/report`, `/dashboard`, `/try-on`, `/chat`, `/upload`, `/login`.
6. Manual: Ctrl+scroll browser zoom 50%→200% on `/home` — layout must stay intact (this is what the fluid-root `rem` term protects).

---

# PART B — BACKEND / API

## B.1 CRITICAL — will break in real use

### B.1.1 Client aborts every real analysis at 30s while the server keeps spending YouCam credits

`src/services/api.ts:6` sets `timeout: 30000` on the shared axios instance. `analyzeImage` does not override it.

But `server/src/controllers/analyze.controller.ts` runs **three sequential YouCam task pipelines**, each polling `pollTaskResult(feature, taskId, 60, 3000)` — up to **180 seconds each**, so up to **~9 minutes** worst case (`youcam.service.ts:135, 168, 183`).

Every real analysis therefore fails client-side with `ECONNABORTED` after 30s, while the server continues to burn paid YouCam units and then writes a response nobody reads.

**Fix — do all three:**

1. Per-call timeout in `src/services/api.ts`:
   ```ts
   export const analyzeImage = (file, onUploadProgress) => {
     const form = new FormData();
     form.append('image', file);
     return api.post<{ data: AnalysisResult }>('/analyze/upload', form, {
       timeout: 300_000,          // the pipeline is a multi-minute AI job
       headers: { 'Content-Type': 'multipart/form-data' },
       onUploadProgress: (e) => { /* unchanged */ },
     });
   };
   ```
   Also add `timeout: 180_000` to `tryOnClothes` / `tryOnMakeup` / `tryOnHair` — those poll `maxRetries = 30, 2000ms` = 60s each, plus a file upload.

2. Cut the server's poll budget so a stuck task fails fast instead of hanging for 3 minutes. `youcam.service.ts:135, 168, 183` — `pollTaskResult(feature, taskId, 60, 3000)` → `(feature, taskId, 20, 2500)` (50s ceiling per stage, ~2.5 min total worst case).

3. **Run the three YouCam calls in parallel, not in series.** `analyze.controller.ts` currently awaits enhance → skin → tone sequentially, but they are independent (all three only need `originalImage`). `Promise.allSettled` cuts worst-case latency ~3×:
   ```ts
   const [enhanceRes, skinRes, toneRes] = await Promise.allSettled([
     YouCamService.enhancePhoto(originalImage, 1),
     YouCamService.analyzeSkin(originalImage),
     YouCamService.analyzeColorTones(originalImage),
   ]);
   ```
   Keep the existing per-call fallback logic, just read it off `.status === 'fulfilled' ? .value : null`.

4. **Better long-term shape (do this if you have time):** turn it into a job.
   `POST /api/analyze/upload` → `202 { jobId }` immediately after the file is stored.
   `GET /api/analyze/status/:jobId` → `{ state: 'queued'|'running'|'done'|'failed', stage, progress, result? }`.
   Client polls every 2s. This also unlocks a real progress UI (see C.6) and removes all timeout risk. `AnalysisProcessing.tsx` already exists and is currently faking progress — this is what should feed it.

### B.1.2 `enhancedImageUrl` 404s in development

`analyze.controller.ts:39, 45` return `enhancedImageUrl: '/uploads/<file>.jpg'` — a **root-relative** path.

But `.env` sets `VITE_API_BASE_URL=http://localhost:3001/api`, so the client bypasses the Vite proxy entirely. `src/pages/Report.tsx:272` renders `<img src="/uploads/…">`, which the browser resolves against **`http://localhost:5173`** → 404. The `onError` handler at line 278 hides the image, so it silently disappears and looks like "no photo was returned".

Same breakage in `src/pages/TryOn.tsx:595` via `referenceImageUrl`.

**Fix — all three:**

1. `vite.config.js` — proxy `/uploads` too:
   ```js
   proxy: {
     '/api':     { target: 'http://localhost:3001', changeOrigin: true },
     '/uploads': { target: 'http://localhost:3001', changeOrigin: true },
   },
   ```
   (Also note the existing typo: the option is **`changeOrigin`** in Vite's docs but the real vite-proxy key is `changeOrigin` — verify it is not silently ignored; `http-proxy` expects `changeOrigin`. If requests fail with a host-header error, this is why.)

2. `server/src/app.ts` — helmet's default `crossOriginResourcePolicy: same-origin` blocks cross-origin `<img>` loads of `/uploads`. Allow it for that mount only:
   ```ts
   app.use(
     "/uploads",
     (_req, res, next) => { res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); next(); },
     express.static(path.join(__dirname, "../tmp"), { maxAge: "1h", index: false })
   );
   ```

3. Add a shared client helper so no component ever guesses again — `src/services/api.ts`:
   ```ts
   /** Turns a server-relative /uploads path into a browser-loadable URL. */
   export const assetUrl = (p?: string | null): string =>
     !p ? '' : /^https?:\/\//.test(p) ? p : new URL(p, BASE.replace(/\/api\/?$/, '/')).toString();
   ```
   Use `assetUrl(analysisResult.enhancedImageUrl)` in `Report.tsx:272` and `assetUrl(referenceImageUrl)` in `TryOn.tsx:595`.

### B.1.3 Paid AI endpoints are wide open to anonymous callers

No `authenticate` on any of these:

| Route | File | Cost of abuse |
|---|---|---|
| `POST /api/analyze/upload` | `routes/analyze.routes.ts:7` | 3 YouCam tasks + 10MB upload per call |
| `POST /api/tryon/clothes` | `routes/tryon.routes.ts:12` | 1 YouCam task |
| `POST /api/tryon/makeup` | `routes/tryon.routes.ts:13` | 1 YouCam task |
| `POST /api/tryon/hair` | `routes/tryon.routes.ts:14` | 1 YouCam task |
| `GET /api/tryon/templates/:f` | `routes/tryon.routes.ts:11` | YouCam read |
| `POST /api/recommend` | `routes/recommendation.routes.ts:5` | DB scan |
| `POST /api/chat` | `routes/chat.routes.ts:6` | CPU, unbounded input |

The global limiter is `100 req/min` per IP (`middleware/rateLimiter.ts:3`) — that is **6,000 YouCam analyses per hour from a single IP**. Your quota is gone in minutes.

**Fix:**

1. Add `authenticate` to all of the above. The client already sends `Authorization: Bearer` on every request (`src/services/api.ts:8–19`), and `/upload`, `/try-on`, `/chat` are already behind `<Protected>` in the router (`src/App.tsx:125–144`) — so this is a server-side gap only, no UI change needed.

2. Add a **cost-aware limiter** keyed on the user, not the IP — new export in `middleware/rateLimiter.ts`:
   ```ts
   const perUser = (req: any) => req.user?.id ?? req.ip;

   export const aiHeavyLimiter = rateLimit({
     windowMs: 60 * 60 * 1000, max: 8, keyGenerator: perUser,
     message: { success: false, message: "Analysis limit reached. Try again in an hour." },
   });

   export const aiLightLimiter = rateLimit({
     windowMs: 60 * 60 * 1000, max: 40, keyGenerator: perUser,
     message: { success: false, message: "Try-on limit reached. Try again in an hour." },
   });
   ```
   Mount `authenticate` **before** the limiter so `req.user.id` exists:
   `router.post("/upload", authenticate, aiHeavyLimiter, upload.single("image"), uploadImage)`.

3. `app.set("trust proxy", 1)` in `app.ts` — without it, behind any proxy/CDN `express-rate-limit` sees one IP for every visitor and rate-limits your whole userbase together. (It also fixes `req.protocol` for `tryon.controller.ts:24`, which builds the absolute selfie URL sent to YouCam — currently that will hand YouCam an `http://` URL behind an HTTPS terminator and the fetch will fail.)

### B.1.4 `errorHandler` turns every error into a 500

`server/src/middleware/errorHandler.ts` ignores `err.status` entirely and always `res.status(500)`.

Consequences today:
- `upload.single("image")` rejecting a 12MB file → user sees "Internal Server Error", not "file too large".
- Invalid mime type from `middleware/upload.ts:38` → 500.
- `Favorite.findById("not-an-id")` → Mongoose `CastError` → 500 (should be 400).
- It is also registered **after** the SPA catch-all (`app.ts:79`), which is legal for error middleware but fragile — move it to the very last `app.use`.

**Fix:**
```ts
import { MulterError } from "multer";

export const errorHandler = (err: any, _req, res, _next) => {
  const isProd = env.NODE_ENV === "production";

  if (err instanceof MulterError) {
    const status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    const message = err.code === "LIMIT_FILE_SIZE"
      ? "Image is larger than 10 MB. Please upload a smaller photo."
      : "That file could not be accepted. Use a JPEG, PNG, WebP or HEIC image.";
    res.status(status).json({ success: false, message });
    return;
  }

  if (err?.name === "CastError")       { res.status(400).json({ success: false, message: "Invalid id" }); return; }
  if (err?.name === "ValidationError") { res.status(400).json({ success: false, message: err.message }); return; }
  if (err?.code === 11000)             { res.status(409).json({ success: false, message: "Already exists" }); return; }

  const status = Number(err?.status ?? err?.statusCode) || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    success: false,
    message: status >= 500 && isProd ? "Internal Server Error" : err?.message ?? "Request failed",
  });
};
```
Also add the `fileFilter` rejection as a proper error: `middleware/upload.ts:41` → `cb(new MulterError("LIMIT_UNEXPECTED_FILE"))` instead of a bare `Error`.

### B.1.5 Try-on silently returns the *input* image as a "result"

`server/src/controllers/tryon.controller.ts`:
- `tryOnClothes` — on YouCam failure: `resultUrl = garmentImageUrl`, `source = "fallback"`, HTTP **200 `success: true`**.
- `tryOnMakeup` / `tryOnHair` — on failure: `resultUrl = personImageUrl` (the user's untouched selfie), still 200 `success: true`.

`src/services/api.ts:37–44` types the response as `{ resultUrl: string }` and **drops `source`**. So when YouCam is down or out of credit, the user is shown their own unchanged photo (or the garment photo) labelled as a successful try-on. That is a trust-destroying bug — worse than an error message.

**Fix:**
1. Client types: `api.post<{ resultUrl: string; source: 'youcam' | 'fallback' }>(...)`.
2. In `src/hooks/useTryOn.ts`, when `source === 'fallback'`, do **not** set the result image — surface `toast.error('Try-on is temporarily unavailable. Please try again shortly.')` and keep the previous state.
3. Optionally cleaner: have the controller return `502 { success: false, message, source: 'fallback' }` and delete the fallback URL entirely. Pick one and make all three endpoints consistent.

## B.2 SECURITY / PRODUCTION

### B.2.1 CSP will break Firebase auth the moment Express serves the SPA

`server/src/app.ts:24–37` overrides only `imgSrc`. Helmet keeps its defaults for everything else, which means `default-src 'self'` and **no `connect-src`** — so in the Docker/production path where Express serves `dist/` (`app.ts:71–74`), the Firebase Web SDK's calls to `identitytoolkit.googleapis.com` and `securetoken.googleapis.com` are blocked, and the Google sign-in popup (`src/components/GoogleSignInButton.tsx`) has no `frame-src`. Sign-in dies with only a console CSP error.

**Fix:**
```ts
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      imgSrc: ["'self'", "data:", "blob:", "https://images.unsplash.com", "https://*.youcamcdn.com", "https://*.perfectcorp.com", "https://lh3.googleusercontent.com"],
      connectSrc: ["'self'", "https://*.googleapis.com", "https://*.firebaseio.com", "https://securetoken.googleapis.com", "https://identitytoolkit.googleapis.com"],
      frameSrc:  ["'self'", "https://*.firebaseapp.com", "https://accounts.google.com"],
      styleSrc:  ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:   ["'self'", "data:", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "https://apis.google.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
```
Verify with a production build (`npm run start`) and a real Google sign-in — not just `npm run dev`, which never hits this code path.

### B.2.2 `server/.env` is malformed — `YOUCAM_API_SECRET` silently truncated

Inspected structure of `server/.env`:
```
line 7:  YOUCAM_API_SECRET=MIGfMA0GCSqG…     ← start of an unquoted RSA key
line 8:  VoWV8etBqsjW/PK6…                   ← orphan continuation
line 9:  gRLsamEMfmcCGr07…                   ← orphan continuation
line 10: PuvrhZC9f8RvHKOx…                   ← orphan continuation
```
`dotenv` reads only line 7; lines 8–10 are dropped. Multi-line values **must** be double-quoted.

The code never actually reads `YOUCAM_API_SECRET` (`youcam.service.ts` authenticates with the Bearer key alone, and `.env.example` says so). **Simplest fix: delete lines 7–10 from `server/.env` and drop `YOUCAM_API_SECRET` from `config/env.ts` and `docker-compose.yml`.** If it ever is needed, store it as `"-----BEGIN…\n…\n-----END…"` on one quoted line, like `FIREBASE_PRIVATE_KEY` already is.

### B.2.3 `JWT_SECRET` is a guessable dev string

`server/.env` line 4 starts `deestyle-jwt…`. Anyone who guesses it can mint tokens for any `userId`. Add a startup guard in `server/src/config/env.ts`:
```ts
export const env = envSchema.parse(process.env);

if (env.NODE_ENV === "production") {
  if (env.JWT_SECRET.length < 32 || /deestyle|change-me|secret|replace/i.test(env.JWT_SECRET)) {
    console.error("[startup] JWT_SECRET is weak or still the default. Generate one: openssl rand -base64 48");
    process.exit(1);
  }
}
```
Same guard belongs on the `docker-compose.yml:20` default `change-me-in-prod`.

### B.2.4 `/uploads` exposes every user's selfie to anyone with the filename

`app.ts:44` serves `server/tmp` statically with no auth. Filenames are `crypto.randomUUID()` so they're unguessable, but the URL is handed to the client, put in localStorage (`useStyleStore` persists `referenceImageUrl`), sent to YouCam, and lives for 24h. Anyone who obtains the URL — logs, a shared screenshot, a referrer header — can fetch a stranger's face photo.

Given the product promises *"Your photo is deleted after analysis"* (`src/pages/Upload.tsx:19`), which is currently **false** for the enhanced copy (it survives 24h per `server.ts:11`), this is also a copy/behaviour mismatch worth resolving.

**Options, cheapest first:**
1. Add `Cache-Control: private, no-store` + `X-Robots-Tag: noindex` to the `/uploads` mount, shorten `UPLOAD_TTL_MS` to 1–2 hours, and change the Upload page copy to *"Your original photo is deleted immediately after analysis; the enhanced copy is removed within an hour."*
2. Replace static serving with an auth-gated stream route `GET /api/analyze/image/:id` that checks `req.user.id` owns that file (store `userId` alongside the filename).
3. Full fix: short-lived HMAC-signed URLs.

### B.2.5 `/api/chat` accepts unbounded input and a fully client-supplied context

`routes/chat.routes.ts:6` — no auth, no length limit on `message`, no cap on `context.wardrobeItems[]`. `express.json()` default limit is 100kb, so a caller can post ~100kb of text and a 1000-item wardrobe array on every request, 100×/min.

**Fix:**
```ts
import { z } from "zod";
const bodySchema = z.object({
  message: z.string().trim().min(1).max(1000),
  context: z.object({
    analysisResult: z.any().optional(),
    wardrobeItems: z.array(z.object({
      name: z.string().max(120).optional(),
      category: z.string().max(60).optional(),
      palette: z.array(z.string().max(9)).max(12).optional(),
    })).max(50).optional(),
  }).optional(),
});

router.post("/", authenticate, chatLimiter, (req, res) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "Invalid chat request" });
    return;
  }
  res.json({ success: true, reply: generateStylistReply(parsed.data.message, parsed.data.context) });
});
```

### B.2.6 Two auth systems that lock each other out

`middleware/auth.middleware.ts:52–74`: if `FIREBASE_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY` are all set, it verifies the token as a **Firebase ID token and returns 401 on failure — never reaching the local-JWT branch on line 76**.

`server/.env` has all three Firebase vars set. So right now, any account created through `POST /api/auth/register` (which issues a local JWT via `utils/jwt.ts`) **cannot authenticate against any protected route**. `/api/auth/register` and `/api/auth/login` are effectively dead code that hands out unusable tokens.

**Fix — pick one:**
- **(a) Firebase-only (recommended, matches the client):** delete `auth.controller.ts`, `auth.service.ts`, `models/user.model.ts`, `utils/jwt.ts`, and `routes/auth.routes.ts`'s register/login. Keep `GET /api/auth/profile`. Drop `JWT_SECRET` from `env.ts`. The client already uses the Firebase Web SDK (`src/services/auth.ts`, `src/lib/firebase.ts`).
- **(b) Both:** try Firebase, and on `verifyIdToken` failure **fall through** to `jwt.verify` instead of returning 401:
  ```ts
  if (firebase) {
    try {
      const d = await getAuth(firebase).verifyIdToken(token);
      (req as any).user = { id: d.uid, email: d.email };
      return next();
    } catch { /* not a Firebase token — fall through to local JWT */ }
  }
  const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  (req as any).user = decoded;
  next();
  ```

Verify with `server/test/auth.test.ts` — it likely passes today only because it does not exercise the middleware with Firebase configured.

## B.3 CORRECTNESS

### B.3.1 Malformed ObjectIds return 500
`controllers/favorite.controller.ts:31` and `controllers/history.controller.ts:47` call `findById(req.params.id)` directly. A malformed id throws `CastError`. Fixed globally by B.1.4, but add an explicit guard for a clearer 404:
```ts
if (!mongoose.isValidObjectId(req.params.id)) {
  res.status(404).json({ success: false, message: "Not found" }); return;
}
```

### B.3.2 `createProduct` / `updateProduct` mass-assign the request body
`controllers/product.controller.ts:24, 34` pass `req.body` straight into Mongoose. Any authenticated user can create products, and can set fields not in the schema if `strict` is ever relaxed. Add a zod schema and — since this is admin functionality — an `isAdmin` check (there is no role field on `IUser` today; add one).

### B.3.3 `/api/recommend` has no validation
`controllers/recommendation.controller.ts:6` destructures `{ skinType, skinTone }` with no type check and passes them to a DB query. Add zod.

### B.3.4 "12 colour seasons" is marketing that the engine cannot deliver
`server/src/utils/colourAnalysis.ts:92–96`:
```ts
export function deriveSeason(undertone: Undertone): string {
  if (undertone === "warm") return "Warm Autumn";
  if (undertone === "cool") return "Cool Winter";
  return "Soft Summer";
}
```
**Only 3 seasons exist**, and `src/lib/colour-data.ts` mirrors exactly those three. But the UI advertises:
- `src/components/Hero.tsx:13–15` — "4 Seasons", "12 Types"
- `src/components/SocialProof.tsx:11` — "12 Colour seasons covered"
- `src/components/ProblemStrip.tsx` — "Colour Season Analysis"

Two honest paths:
- **(a) Make the engine real.** You already fetch the inputs and throw them away. `analyze.controller.ts` computes 14 `skinConcerns` and receives `hair_color_name` / `eye_color_name` from YouCam. Standard 12-season analysis needs three axes — **undertone** (have it), **depth/value** (derive from the skin-tone hex's lightness + hair colour), and **chroma/contrast** (derive from skin-vs-hair-vs-eye lightness spread). That gives Light/True/Deep/Soft/Bright variants of the four seasons. Then add the remaining 9 entries to `SEASON_PROFILES` (server) and `colour-data.ts` (client).
- **(b) Fix the copy.** Change "12 Types" → "3 Seasons" etc. Fastest, but weakens the product.

Recommendation: (a). It is the single biggest credibility upgrade available, and 90% of the data plumbing already exists.

### B.3.5 The "AI Stylist" is a regex rules engine
`server/src/services/stylist.service.ts` (349 lines) is a hand-written pattern matcher. The UI calls it "AI Stylist" / "AI Stylist Chat" (`src/pages/Chat.tsx:42`, `src/pages/Dashboard.tsx:432`).

**Fix:** wire it to the Claude API and keep the rules engine as the offline fallback.
```ts
// server/src/services/stylist.service.ts
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

export async function generateStylistReplyAI(message: string, ctx?: StylistContext) {
  if (!env.ANTHROPIC_API_KEY) return generateStylistReply(message, ctx);   // existing rules engine
  try {
    const res = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 700,
      system:
        "You are D'Style, a warm, expert personal colour-and-style consultant for D'Fashion. " +
        "Ground every answer in the user's colour analysis JSON below. Never invent an analysis " +
        "they don't have. Be specific and concise; use **bold** for colour names.\n" +
        `USER ANALYSIS: ${JSON.stringify(ctx?.analysisResult ?? null)}\n` +
        `USER WARDROBE: ${JSON.stringify(ctx?.wardrobeItems ?? [])}`,
      messages: [{ role: "user", content: message }],
    });
    return res.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  } catch (err) {
    console.warn("Claude stylist failed, using rules engine:", (err as Error).message);
    return generateStylistReply(message, ctx);
  }
}
```
Add `ANTHROPIC_API_KEY: z.string().default("")` to `config/env.ts`, `npm i @anthropic-ai/sdk` in `server/`, make `routes/chat.routes.ts` `async`, and add it to `.env.example` + `docker-compose.yml`. Also enable streaming later so `StylistChat.tsx` can render token-by-token (see D.3.5).

### B.3.6 Enhanced-image file leak on partial failure
`analyze.controller.ts:151` `finally` deletes only `originalImage`. If `saveRemoteImage` succeeds (line 36) but a later step throws, the enhanced file survives until the 24h sweeper. Track it and unlink on the error path.

### B.3.7 No `/live` vs `/ready` split
`routes/health.routes.ts` returns 503 whenever Mongo's `readyState !== 1`. An orchestrator using this as a **liveness** probe will restart the container during any transient DB blip. Split: `GET /api/health/live` → always 200 if the process is up; `GET /api/health/ready` → the current DB-aware check.

## B.4 Backend acceptance tests

Add to `server/test/`:
1. `POST /api/analyze/upload` without a token → 401 (currently 200).
2. `POST /api/tryon/clothes` without a token → 401 (currently 200).
3. Upload a 12MB file → 413 with a readable message (currently 500).
4. Upload a `.txt` → 400 (currently 500).
5. `DELETE /api/favorites/not-an-id` → 404 (currently 500).
6. `POST /api/chat` with a 5,000-char message → 400.
7. 9th analysis in one hour by the same user → 429.
8. Production-mode boot with `JWT_SECRET=deestyle-jwt-secret` → `process.exit(1)`.
9. `GET /api/health/live` → 200 with Mongo stopped.
10. E2E: run `npm run start` (production path, Express serves `dist/`), complete a Google sign-in, confirm zero CSP violations in the console.

---

# PART C — CONTENT: what to add, section by section

Guiding principle from the screenshots: at 1920px there are large dead black bands and only three shallow content blocks per screen. The fix is **more substance per section**, not more decoration.

## C.1 Landing page — new sections to insert

Current order (`src/pages/Home.tsx`): Hero → ResumeBanner → ProblemStrip → HowItWorks → FeatureShowcase(×4) → SocialProof → TryOnPreview → PricingTeaser → FinalCTA.

**Proposed order** (new items in **bold**):

1. Hero
2. ResumeAnalysisBanner
3. **`LogoBar`** — "As seen in / Trusted by" row, 5–6 monochrome logos at 40% opacity, hairline top and bottom. Cheapest possible credibility lift. Place directly under the hero.
4. ProblemStrip (marquee) — *keep, but see C.2*
5. **`ProblemSection`** (the real one) — the marquee is `aria-hidden` decoration; there is no actual problem statement anywhere on the page. Add a 2-column editorial spread: left = "You have bought clothes that looked wrong on you and could not say why." Right = three stat cards: *"₹—— average wasted per year on clothes worn under 3 times"*, *"—% of wardrobe never worn"*, *"—minutes lost each morning"*. Cite sources in a caption.
6. HowItWorks — *see C.3*
7. **`ScienceSection`** — "How the analysis actually works". Three columns: **Undertone** (the R−B ratio logic from `colourAnalysis.ts:118`, explained in plain language, with a live gradient showing warm↔cool), **Depth**, **Contrast**. Add a small diagram per column. This is what converts a sceptical visitor, and you already have the algorithm — just narrate it.
8. FeatureShowcase (×4 campaign spreads)
9. **`SampleReportSection`** — the single highest-value addition. Nobody buys an invisible product. Show a real report preview: a season card, a 12-swatch palette grid, a makeup-shade row, an archetype card — all statically rendered from `src/lib/colour-data.ts` (`'Warm Autumn'`), with a `View the full sample report →` link. Consider making `/report?sample=1` render `colour-data.ts` fixtures so guests can browse a real report without an account.
10. **`ColourSeasonExplorer`** — interactive tabs (Autumn / Winter / Summer / Spring), each showing that season's palette, neutrals, avoid-list and archetypes pulled straight from `colour-data.ts`. Use the already-installed but **entirely unused** `src/components/ui/tabs.tsx`. Zero new data needed.
11. SocialProof — *see C.4*
12. TryOnPreview — *see C.5*
13. **`ComparisonSection`** — "D'Fashion vs. a colour-analysis appointment vs. guessing": a 3-column table on price / time / repeatability / what you take home. Uses the unused `src/components/ui/table.tsx`.
14. PricingTeaser
15. **`FaqSection`** — 8–10 questions using the already-installed `ui/accordion.tsx` (Pricing already uses it, Home does not). Add `FAQPage` JSON-LD for search rich results. Questions: photo requirements, is my photo stored, accuracy, can my season change, does it work for all skin tones, refunds, is it for men too, what if I disagree with my result.
16. **`NewsletterSection`** — a proper block, not just the footer input, with a real value proposition ("A weekly colour note").
17. FinalCTA

That takes the landing page from 8 blocks to 17 and removes the empty feeling structurally.

## C.2 `ProblemStrip` (marquee)

- It is `aria-hidden="true"` (`ProblemStrip.tsx:18`) so it contributes nothing to SEO or screen readers. That is fine for pure decoration — but then it must not be the *only* thing between the hero and HowItWorks. Adding C.1.5 solves that.
- Add a duplicate-set guard: the animation `x: 0% → -50%` (line 26) only tiles seamlessly because the array is duplicated exactly once (line 30). Leave as is, but add a comment so nobody breaks it.
- Add `hover:[animation-play-state:paused]`.

## C.3 `HowItWorks` — three thin cards → a real process

`src/components/HowItWorks.tsx`. Each of the three cards is currently a number, a tag, a title and one sentence. Add per card:
- A small **illustration or photo** (you already have `CAMPAIGN.process` in `src/lib/editorial-images.ts` and it is **never used**).
- A **"what you need"** micro-list (e.g. step 1: natural light · no filter · face the window · no makeup).
- A **duration chip** with a real number, not "Instant".
- A hover state that reveals a one-line detail.

Then add a **step 04 — "Wear it"** so the story ends in the wardrobe, not the report. And add a horizontal connector line animating between steps on scroll (see D.3.2).

## C.4 `SocialProof` — 3 testimonials → a proof section

`src/components/SocialProof.tsx`:
- **Avatars are initials on a grey circle** (line 155). Replace with real photos, or clearly-labelled illustrated avatars. Initials read as placeholder.
- Add a **before/after colour comparison** per testimonial: two small swatch rows, "what she used to wear" vs "her palette".
- Add each person's **season badge with the actual palette** (3 swatches) — you have all of it in `colour-data.ts`.
- Grow to **6 testimonials** in a carousel using the installed-but-unused `src/components/ui/carousel.tsx` (embla).
- Add a **video testimonial slot** (one 30s clip does more than six quotes).
- The stats (line 8–12: 50,000+ / 4.9 / 12) are unsourced and the "12" contradicts B.3.4. Either make them true or replace with verifiable ones ("4.9 from 312 reviews" with a link).
- Add a **rating-distribution bar chart** (5★ 78%, 4★ 16%…) using the installed-but-unused `recharts`.

## C.5 `TryOnPreview` — the hand-drawn SVG blazer must go

`src/components/TryOnPreview.tsx:20–36` is a hand-coded `<path>` blazer. At 1920px it is the single most amateur element on the page (visible in the screenshot). Replace with either:
- **(a)** 6 real garment photographs, one per palette colour, cross-fading on swatch click — best result; needs 6 assets.
- **(b)** One garment photo with a CSS `hue-rotate`/`mix-blend-mode: multiply` tint layer driven by the active hex — one asset, still convincing.
- **(c)** A real before/after slider on a model photo using the installed-but-unused `ui/resizable.tsx`.

Also add: a **"Try on your own photo" CTA**, the **garment name/brand**, and a **`source: 'fallback'` notice** wired to B.1.5.

## C.6 `UploadFlow` / `AnalysisProcessing`

- `AnalysisProcessing.tsx` currently animates fake progress. Once B.1.1's job API exists, feed it **real stage names**: "Uploading" → "Enhancing photo" → "Reading skin tone" → "Analysing undertone" → "Building your palette". Concrete stages massively reduce perceived wait.
- Add a **photo-quality precheck before upload**: resolution, brightness, single face detected. Cheap client-side canvas checks; prevents the most common bad result.
- Add a **good/bad example gallery** (4 thumbnails) — this alone cuts support load.
- Add a **privacy panel** stating exactly what happens to the photo, aligned with whatever B.2.4 resolves to.

## C.7 `Report` — surface the 14 skin-concern scores you already compute

**The biggest content gap in the app.** `server/src/controllers/analyze.controller.ts:73–90` computes fourteen scored concerns — `acne, darkSpots, wrinkles, pores, oiliness, dryness, redness, eyeBags, darkCircles, uneven, sensitivity, texture, firmness, radiance` — and returns them. `src/store/useStyleStore.ts:55` types them.

**They are rendered nowhere.** Grep confirms exactly one hit in the whole client, and it is the type declaration.

Add to `src/pages/Report.tsx`:
1. A **"Skin Analysis"** section: a radar chart (recharts, already installed) of the 14 concerns, plus a ranked list of the top 3 with plain-language explanations and what to do.
2. A **season-confidence indicator** — "Warm Autumn, 87% confidence" with the runner-up season. Requires the server to return a score; derive it from how far the undertone ratio sits from the ±0.07 thresholds in `colourAnalysis.ts:130`.
3. **Palette-in-context photos** — for each of the top 3 colours, one photo of that colour worn. Swatches alone are abstract.
4. **A downloadable PDF/PNG palette card** — currently only `window.print()`. Add a canvas-rendered shareable card (this is the organic-growth lever).
5. **"Colours to avoid" needs a *why* per colour**, not one blanket paragraph.
6. **A shopping section** — the `Product` model and `/api/recommend` endpoint both exist and the Report never calls them.
7. **A "your season through the year"** block — how the palette shifts across seasons/occasions.

## C.8 `Dashboard`

- **Zero photography** on the whole page. Add the user's analysed photo to the header and a campaign image to the empty states.
- **Add charts** (recharts is installed and unused): palette-usage donut, skin-concern trend across analyses, wardrobe-coverage bar.
- The **"Compare with Previous"** section only ever shows the immediately-previous analysis. Show a full timeline.
- **Wardrobe items have no actions** — add rename / delete / re-try-on / "build an outfit from this".
- Add a **"Your week in colour"** strip — 7 outfit suggestions from the palette.
- Add a **profile-completion meter** (photo ✓, palette ✓, wardrobe 2/5 items, try-on 0/1) — proven engagement driver.

## C.9 `Pricing`

Already the deepest page (489 lines, has compare table + accordion + FAQ). Add:
- **Monthly/annual toggle** with a "2 months free" badge (`ui/switch.tsx` is installed and unused).
- **A currency note** — prices are `₹` with no locale handling.
- **Testimonial per tier.**
- **A money-back guarantee badge.**
- **Payment-method logos** — right now nothing tells the visitor how they would even pay.

## C.10 `Chat`

- The **sidebar is two thin lists.** Add: recent conversations, a "your palette" reference card pinned in view, and an occasion picker.
- **Empty state**: show 3 example exchanges rather than only prompt buttons.
- Add **message actions** — copy, regenerate, "save this outfit to wardrobe".
- Wire up **streaming** (B.3.5) so replies type out.

## C.11 `Footer` — currently missing everything a production footer needs

`src/components/Footer.tsx` has: wordmark, 2 taglines, Product nav (4), Account nav (2–4), newsletter, copyright, "SSL secured", "Powered by YouCam".

**Missing:** Privacy Policy, Terms of Service, Cookie Policy, Refund Policy, Contact / support email, About, Careers, Blog, social icons (Instagram/Pinterest are essential for a fashion brand), a Company column, a sitemap link, and a language/region selector. `react-icons` is already a dependency for the social icons.

Also: **the newsletter form is fake** — `handleSubscribe` (line 28) just fires a toast and clears the input. Nothing is stored. Either wire it to a real endpoint (`POST /api/newsletter`) or an ESP, or remove it. Shipping a form that silently discards emails is worse than having none.

## C.12 Cross-cutting content gaps

- **New pages needed:** `/privacy`, `/terms`, `/about`, `/contact`, `/faq`, `/blog` (even a stub). A production site without a privacy policy that collects face photos is a legal problem, not a polish problem.
- **SEO:** `index.html` has no canonical URL, no `og:image`, no Twitter card, no structured data. Per-route meta is set as `document.title` only (`src/App.tsx:66–69`) — add descriptions too. Add `Organization` + `FAQPage` + `Product` JSON-LD.
- **`public/robots.txt` exists but there is no `sitemap.xml`.**
- **Only 2 local images exist** in `public/images/` (`emerald_wall_shadows.png`, `feature_colour_season_model.png`) and one of them (`feature_colour_season_model.png`) is **never referenced anywhere in `src/`**. Everything else is hot-linked from Unsplash — see D.1.

---

# PART D — IMAGES & ANIMATIONS

## D.1 Images — the structural problem first

Every campaign photo comes from `src/lib/editorial-images.ts:17`:
```ts
const unsplash = (id) => `https://images.unsplash.com/photo-${id}?q=80&w=1600&auto=format&fit=crop`;
```

Eight hot-linked Unsplash URLs. Problems:
1. **A third-party CDN is on your critical rendering path** — the LCP element of the entire site (`Hero.tsx:39`) is an external request you do not control.
2. **No licence audit.** Unsplash's licence permits commercial use, but hot-linking by photo ID is fragile: a photographer can remove an image and your hero goes blank in production.
3. `srcsetFromUrl` (`src/lib/utils.ts:26`) does `url.replace(/w=\d+/, 'w=' + w)` — this works only because `w=1600` happens to appear before any other `w`. Any URL param change silently breaks the srcset.
4. **No AVIF/WebP negotiation you control**, no blur-up placeholder, no `<picture>` element.
5. `EditorialImage.tsx:82–83` hardcodes `width={1600} height={2000}` on every image regardless of the actual `ratio` prop — so for `ratio="fill"`, `"wide"`, `"square"` the intrinsic aspect ratio is wrong and CLS is not actually prevented.

**Action:**
1. **Download all 8 images, licence-check them, self-host** under `public/images/campaign/`. Generate AVIF + WebP + JPEG at 480/768/1080/1440/1920 and a 24px blurred LQIP. A short `scripts/optimize-images.mjs` using `sharp` (already a server dependency) does this.
2. Rewrite `EditorialImage.tsx` to emit a real `<picture>` with AVIF → WebP → JPEG sources, a base64 LQIP as the CSS background, and a **`ratio`-derived** `width`/`height` pair.
3. Add `<link rel="preload" as="image" imagesrcset="…" fetchpriority="high">` for the hero image in `index.html`.
4. Delete or use the orphaned `public/images/feature_colour_season_model.png`.

## D.2 New images needed (with placement)

| Where | What | Count |
|---|---|---|
| C.1.3 LogoBar | Press / partner logos, monochrome SVG | 6 |
| C.1.7 ScienceSection | Undertone / depth / contrast diagrams | 3 |
| C.1.9 SampleReport | A rendered report screenshot or mock | 1 |
| C.3 HowItWorks | One image per step | 4 |
| C.4 SocialProof | Real testimonial portraits | 6 |
| C.4 SocialProof | Video testimonial (poster + mp4) | 1 |
| C.5 TryOnPreview | Garment photos, one per palette colour | 6 |
| C.6 UploadFlow | Good/bad photo examples | 4 |
| C.7 Report | Palette-in-context lifestyle photos | 8–12 |
| C.8 Dashboard | Empty-state illustrations | 3 |
| SEO | `og:image` 1200×630 | 1 |
| Brand | Favicon set + apple-touch-icon + PWA icons | 5 |

Everything must be shot/selected in the same warm-neutral, low-saturation register or the `cinematic-image` grade in `index.css:437` will fight it.

## D.3 Animations

### What already exists (don't rebuild it)
`framer-motion` is used well: `Reveal.tsx` (mask/rise/fade, respects `prefers-reduced-motion`), hero parallax via `useScroll`/`useTransform`, stagger variants, `CountUp`, the marquee, floating particles, `AnimatePresence` page transitions, and a `MotionConfig reducedMotion="user"` at the root. The `@keyframes` library in `index.css:815–856` (`gold-shimmer`, `float-up`, `pulse-gold`, `reveal-up`, `scale-in`) is defined — but `animate-gold-shimmer`, `animate-float`, `animate-pulse-gold`, `animate-reveal-up`, `animate-scale-in` are **all unused**. Either use them or delete them.

### D.3.1 Scroll-driven progress
A thin gold `scaleX` progress bar at the very top of the viewport, driven by `useScroll().scrollYProgress`. Add to `AppShell.tsx` above `<Navbar />`. Cheap, and immediately reads as "considered".

### D.3.2 `HowItWorks` connector line
An SVG path between the three (soon four) step cards that draws itself via `pathLength` as the section enters view. On mobile it becomes a vertical line.

### D.3.3 Palette reveal choreography
`Report.tsx:352–370` staggers swatches with `delay: i * 0.08` — at 25+ swatches the last one waits 2s. Cap it: `delay: Math.min(i * 0.04, 0.6)`. Same fix in `Dashboard.tsx` and the neutrals/avoid grids.

### D.3.4 Number counters everywhere
`CountUp` already exists in `SocialProof.tsx:24`. Extract it to `src/components/ui/count-up.tsx` and reuse for the C.1.5 problem stats, the Report confidence score, and the Dashboard metrics.

### D.3.5 Chat streaming
Once B.3.5 lands, render replies token-by-token with a blinking gold caret. This is the single animation users notice most in a chat product.

### D.3.6 Try-on transition
When a new try-on result arrives, cross-fade with a subtle scale (0.98 → 1) and a brief gold shimmer sweep — reuse the existing unused `animate-gold-shimmer`.

### D.3.7 Magnetic / cursor-follow CTA
On `.btn-campaign`, translate the label 2–3px toward the cursor on hover. Desktop only, `motion-safe:` gated.

### D.3.8 Image reveal on scroll
`EditorialImage` should reveal with a `clip-path: inset()` wipe plus a slow `scale(1.06 → 1)` when it enters view, instead of appearing instantly. `Reveal variant="mask"` already implements the wipe — compose them.

### D.3.9 Navbar transition polish
`Navbar.tsx:145` transitions `background-color, border-color, color` over 500ms — good. Add: the wordmark shrinking slightly on scroll, and the CTA border filling on hover.

### D.3.10 Skeletons, not spinners
`App.tsx:39–43` `PageFallback` is a generic spinner for every lazy route. Replace with per-route skeletons matching each page's layout (`ui/skeleton.tsx` is installed and unused). Perceived-performance win.

### D.3.11 Page-transition direction
`App.tsx:73–81` uses the same `y: 12 → 0` for every navigation. Vary by depth: forward navigation slides left, back slides right.

### D.3.12 Performance guardrails — mandatory
- Never animate `width`/`height`/`top`/`left`. Only `transform` and `opacity`.
- `will-change` only while animating; the codebase mostly does this correctly already.
- Every scroll listener `{ passive: true }` (`Navbar.tsx:65` already does).
- Every `whileInView` gets `viewport={{ once: true }}` — a few sites are missing it.
- `prefers-reduced-motion` is handled globally (`index.css:858`) and per-component (`Reveal.tsx`) — keep both. **Every new animation must honour it.**
- Budget: keep the landing page under 60 simultaneously-animating elements. The 6 hero particles + marquee + 4 spreads already run continuously.

---

# PART E — EXECUTION ORDER

Do it in this order. Each phase is independently shippable and testable.

### Phase 1 — Responsive scaling (½ day) ← the reported bug
1. A.8 viewport meta (1 line)
2. A.2 fluid root
3. A.3 type tokens px → rem
4. A.4 retune display clamps
5. A.5 rhythm / gutter / section padding, delete dead `--space-*`
6. A.6 + A.6b the 76 arbitrary px classes
7. A.7 `vh` → `svh` with floor + ceiling
8. **A.10 acceptance test — must pass before moving on**

### Phase 2 — Critical API bugs (1 day)
1. B.1.1 timeouts + parallelise the three YouCam calls
2. B.1.2 `/uploads` in dev (proxy + CORP + `assetUrl` helper)
3. B.1.4 `errorHandler` status codes
4. B.1.5 try-on `source: 'fallback'` surfaced to the user
5. B.1.3 auth + per-user rate limits on the paid endpoints
6. B.4 tests 1–7

### Phase 3 — Security & config (½ day)
1. B.2.2 fix `server/.env`
2. B.2.3 `JWT_SECRET` guard
3. B.2.6 pick one auth system
4. B.2.1 CSP for Firebase — **test against a production build**
5. B.2.5 chat validation
6. B.2.4 `/uploads` privacy + honest copy
7. B.3.1 – B.3.3, B.3.6, B.3.7
8. B.4 tests 8–10

### Phase 4 — Images (1 day, blocks Phase 5)
1. D.1 self-host + optimise the 8 campaign images
2. D.1 rewrite `EditorialImage` as `<picture>` with a correct `ratio`-derived intrinsic size
3. Hero preload
4. Start sourcing the D.2 assets — this is the long-lead item, kick it off first

### Phase 5 — Content depth (2–3 days)
1. C.7 Report skin-analysis section (**highest value — the data already exists**)
2. C.1.9 SampleReportSection (**highest conversion value**)
3. C.1.10 ColourSeasonExplorer (free — data already exists)
4. C.1.15 FaqSection + JSON-LD
5. C.11 Footer legal / social / contact + real or removed newsletter
6. C.12 `/privacy` + `/terms` pages
7. C.5 replace the SVG blazer
8. C.1.5 ProblemSection, C.1.7 ScienceSection, C.1.3 LogoBar, C.1.13 ComparisonSection
9. C.3, C.4, C.8, C.9, C.10 enrichments
10. B.3.4 the 12-season engine (biggest credibility win, largest effort)

### Phase 6 — Animation & polish (1 day)
D.3.1 → D.3.11, then delete whatever remains unused in `index.css`.

### Phase 7 — Final verification
1. `npm run typecheck` (client + server) — currently **clean, keep it that way**
2. `npm run test:e2e`
3. `cd server && npm test`
4. A.10 across all 8 routes × 8 widths
5. Lighthouse on `/home` and `/report` — target ≥ 90 on all four categories
6. Real-device check: iPhone SE (375), iPad (820), 1440 laptop, 4K
7. Keyboard-only pass through the full upload → report → try-on → chat flow
8. Screen-reader pass on the landing page

---

# APPENDIX — quick reference of what is installed but unused

Free wins; each one is a dependency you are already shipping:

| Package / file | Status | Use it for |
|---|---|---|
| `recharts` + `ui/chart.tsx` | unused | C.7 skin radar, C.4 ratings, C.8 trends |
| `embla-carousel-react` + `ui/carousel.tsx` | unused | C.4 six testimonials |
| `ui/tabs.tsx` | unused | C.1.10 season explorer |
| `ui/table.tsx` | unused | C.1.13 comparison table |
| `ui/switch.tsx` | unused | C.9 monthly/annual toggle |
| `ui/skeleton.tsx` | unused | D.3.10 route skeletons |
| `ui/resizable.tsx` | unused | C.5 before/after slider |
| `react-icons` | unused | C.11 social icons |
| `CAMPAIGN.process`, `CAMPAIGN.atelier` | defined, unreferenced | C.3, C.9 |
| `public/images/feature_colour_season_model.png` | orphaned | delete or use |
| `animate-gold-shimmer` / `-float` / `-pulse-gold` / `-reveal-up` / `-scale-in` | defined, unused | D.3.6 or delete |
| `--space-1` … `--space-11` | **0 usages** | delete |
| `skinConcerns` (14 scored fields) | computed, returned, never rendered | **C.7** |
