<div align="center">

# D'Fashion

**Colour intelligence, rendered personal.**

Upload one photo. Get your colour season, a palette built for your skin, and the
ability to *see* an outfit in those colours before you buy it.

[![CI](https://github.com/kripashankarcs3/d.fashion/actions/workflows/ci.yml/badge.svg)](https://github.com/kripashankarcs3/d.fashion/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)

*YouCam API Hackathon — Category 3: Skin AI + Apparel VTO*

</div>

---

## What it does

Most people buy clothes in colours that quietly work against them. Professional
colour analysis fixes that, but it costs a few hundred dollars and a studio
appointment. D'Fashion does it from a selfie.

| | Feature | What happens |
|---|---|---|
| 📸 | **Colour analysis** | Your photo is read for undertone, depth, and contrast, then mapped to one of the twelve seasonal palettes |
| 🎨 | **Personal report** | Your season, your palette, your neutrals, your metals — and the colours to walk past |
| 👗 | **Virtual try-on** | Render a real garment onto your own photo, in seconds, before you spend anything |
| 💬 | **D'Style stylist** | A season-aware chat that answers "does this jacket work on me?" with your palette in context |
| 📊 | **Dashboard** | Every analysis, every saved look, and your wardrobe at a glance |

---

## How it works

```
   Photo  ──▶  Express API  ──▶  YouCam AI            ──▶  Skin tone,
                                 (skin + colour tone)      undertone, depth
                                        │
                                        ▼
                              Colour season engine  ──▶  1 of 12 seasons
                              (server/src/utils/           + full palette
                               colourAnalysis.ts)
                                        │
                        ┌───────────────┼───────────────┐
                        ▼               ▼               ▼
                    Report page    Virtual try-on   D'Style stylist
                                   (YouCam VTO)     (rules + LLM)
```

The browser never touches a third-party AI key. Every YouCam and model call is
proxied server-side, so credentials stay in the Express process.

---

## Tech stack

**Frontend** — React 18 · TypeScript · Vite 6 · Tailwind CSS v4 · shadcn/ui ·
Wouter · Framer Motion · TanStack Query · Zustand

**Backend** — Express 5 · TypeScript · MongoDB (Mongoose) · JWT + bcrypt ·
Helmet · express-rate-limit · Vitest

**Infra** — Docker · docker-compose · GitHub Actions · Vercel / Render

---

## Routes

| Route | Access | Page |
|---|---|---|
| `/` | — | Auth-switched entry: guests → login, members → home |
| `/home` | Public | The campaign landing page |
| `/pricing` | Public | Plans, FAQ, monthly/annual toggle |
| `/about` `/contact` `/faq` `/blog` | Public | Company + journal |
| `/privacy` `/terms` | Public | Legal |
| `/login` `/signup` | Guests only | JWT + Google sign-in |
| `/dashboard` | Members | Palette, history, saved looks, activity |
| `/upload` | Members | Photo upload + colour analysis |
| `/report` | Members | Season, palette, neutrals, wardrobe guidance |
| `/try-on` | Members | Garment catalog + virtual try-on |
| `/chat` | Members | D'Style AI stylist |

Route access is enforced structurally by `<Protected>` / `<GuestOnly>` wrappers
in [src/App.tsx](src/App.tsx); the paths themselves live in a single source of
truth at [src/config/navigation.ts](src/config/navigation.ts).

---

## API

All endpoints are mounted under `/api` (see [server/src/app.ts](server/src/app.ts)):

| Prefix | Purpose |
|---|---|
| `/api/auth` | Sign up, sign in, session, Firebase token exchange |
| `/api/analyze` | Photo upload → skin + colour tone analysis |
| `/api/recommend` | Palette-driven product recommendations |
| `/api/tryon` | Virtual try-on job submission and polling |
| `/api/chat` | D'Style stylist |
| `/api/products` `/api/favorites` `/api/history` | Catalog and user data |
| `/api/newsletter` `/api/health` | Signups, liveness |

---

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB — local (`mongodb://localhost:27017/deestyle`) or an Atlas URI
- A YouCam AI API key (required for real analysis and try-on)

### 1. Install

```bash
npm install
npm --prefix server install
```

### 2. Configure

```bash
cp .env.example .env                  # frontend
cp server/.env.example server/.env    # backend
```

Fill in `server/.env`:

| Variable | Required | Notes |
|---|---|---|
| `JWT_SECRET` | ✅ | Generate with `openssl rand -base64 32` |
| `MONGODB_URI` | ✅ | Local or Atlas connection string |
| `YOUCAM_API_KEY` | ✅ | Powers analysis + virtual try-on |
| `FIREBASE_PROJECT_ID` / `CLIENT_EMAIL` / `PRIVATE_KEY` | ✅ | Verifies Firebase ID tokens |
| `ANTHROPIC_API_KEY` | ➖ | Optional — upgrades the stylist; falls back to the rules engine without it |
| `PORT` `NODE_ENV` `CLIENT_ORIGIN` | ➖ | Sensible defaults provided |

The frontend only ever learns `VITE_API_BASE_URL`. No AI credential is exposed
to the browser.

### 3. Run

```bash
npm run dev
```

`concurrently` boots both halves:

- Frontend → http://localhost:5173
- API → http://localhost:3001

---

## Verification

```bash
npm run typecheck        # TypeScript, frontend + server
npm run build            # Production build, both
npm --prefix server test # Backend unit + integration tests (Vitest)
```

### End-to-end

Playwright specs live in [e2e/](e2e/) — a smoke pass over every route, plus a
full signup → analysis → chat flow.

```bash
npm run dev                       # in one terminal
npx playwright install chromium   # one-time
npm run test:e2e
```

Point it elsewhere with `TARGET_URL=http://localhost:4173 npm run test:e2e`.

---

## Deployment

The Express server serves the API *and* the built SPA (with fallback routing),
so a single container runs the whole product.

```bash
# Full stack, including MongoDB
export YOUCAM_API_KEY=your_key_here
docker compose up --build -d
# → http://localhost:3001

# Server only
docker build -t dfashion .
docker run -p 3001:3001 \
  -e JWT_SECRET=... -e MONGODB_URI=... -e YOUCAM_API_KEY=... \
  dfashion
```

Ready-made configs are checked in for [Vercel](vercel.json) and
[Render](render.yaml).

---

## Continuous integration

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every push and PR
to `main`:

- **Frontend** — typecheck + production build
- **Backend** — TypeScript build + Vitest suite
- **E2E** — boots MongoDB, the API, and Vite, then runs the Playwright suite

---

## Project layout

```
├── src/                    React frontend
│   ├── components/         UI, editorial system, shadcn primitives
│   ├── pages/              One file per route
│   ├── hooks/              useAnalysis, useTryOn
│   ├── store/              Zustand — auth, style
│   ├── services/           API client
│   └── config/             Navigation + page meta (single source of truth)
├── server/                 Express API
│   └── src/
│       ├── routes/         HTTP surface
│       ├── controllers/    Request handling
│       ├── services/       YouCam, stylist, recommendations, images
│       ├── models/         Mongoose schemas
│       ├── middleware/     Auth, rate limiting, uploads, errors
│       └── utils/          Colour analysis engine, JWT, responses
├── e2e/                    Playwright smoke + flow
├── scripts/                Image optimisation pipeline
└── public/images/          Campaign assets (AVIF/WebP/JPG, 5 widths + LQIP)
```

---

## Security

- YouCam and model credentials never leave the server
- Helmet with an explicit CSP allowlist; `trust proxy` set for correct rate limiting
- `express-rate-limit` on the whole `/api` surface
- bcrypt password hashing, JWT sessions, admin-gated routes
- Uploads served `private, no-store` and `noindex`

---

## Contributing

1. Branch off `main`
2. Make sure `npm run typecheck` and the test suites pass
3. Open a PR — CI runs automatically

---

## License

Private project. All rights reserved.
