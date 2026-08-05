# D'Fashion - Complete Style Intelligence Platform

> YouCam API Hackathon Submission - Category 3: Skin AI + Apparel VTO

[![CI](https://github.com/kripashankarcs3/DeeStyle/actions/workflows/ci.yml/badge.svg)](https://github.com/kripashankarcs3/DeeStyle/actions/workflows/ci.yml)

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Routing**: Wouter
- **Animations**: Framer Motion
- **State**: TanStack Query + Zustand (auth, style store)
- **Backend**: Express 5 + TypeScript + MongoDB (Mongoose)
- **Auth**: JWT (httpOnly-cookie-friendly bearer flow) + bcrypt

## Pages
| Route | Page | Description |
|---|---|---|
| `/` | Home | Landing - Hero, Features, Testimonials, CTA |
| `/upload` | Upload | Photo upload + AI colour analysis |
| `/dashboard` | Dashboard | Wardrobe overview, stats, activity, analysis history |
| `/tryon` | Virtual Try-On | Catalog browse + interactive try-on |
| `/report` | Colour Report | Personal season, palette, avoid colours, wardrobe report |
| `/chat` | D'Style AI Stylist | Season-aware styling chat |
| `/pricing` | Pricing | Collections, FAQ, annual/monthly toggle |
| `/login` `/signup` | Auth | JWT sign in / sign up |

## Setup

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017/deestyle`) or a Mongo Atlas URI
- A YouCam AI API key & secret (for the real analysis/try-on endpoints)

### 2. Install everything (root + server workspaces)
```bash
npm install      # frontend deps + concurrently
cd server && npm install && cd ..
```

### 3. Configure environment
```bash
cp .env.example .env                 # set VITE_API_BASE_URL if your server uses another port
cp server/.env.example server/.env   # fill JWT_SECRET, MONGODB_URI, YOUCAM_API_KEY
```

### 4. Run development (starts BOTH client and server concurrently)
```bash
npm run dev
# Vite frontend  -> http://localhost:5173
# Express server  -> http://localhost:3001
```
`npm run dev` uses `concurrently` to run the Vite dev server and the Express
backend (`server/`) together. The server logs a startup warning if the YouCam
credentials are missing — those keys are required for the AI endpoints to work.

Open http://localhost:5173

## YouCam APIs Used
1. AI Photo Enhance
2. AI Skin Analysis
3. AI Facial Color Tones Analyzer
4. AI Clothes Virtual Try-On
5. AI Makeup Virtual Try-On
6. AI Hair Color Virtual Try-On

## Environment Variables
Frontend (`.env` at project root):
```
VITE_API_BASE_URL=http://localhost:3001/api
```
The client only knows the API base URL. YouCam credentials are never exposed to
the browser — the Express server proxies all YouCam calls server-side.

Backend (`server/.env`):
```
PORT=3001
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your-jwt-secret-here
MONGODB_URI=mongodb://localhost:27017/deestyle
YOUCAM_API_KEY=your-youcam-api-key-here
```

## Verification
```bash
npm run typecheck          # TypeScript check (frontend + server)
npm run build              # Production build (client + server)
cd server && npm test      # Backend unit tests (vitest)
```

## End-to-End Tests
Playwright smoke + flow tests live in `e2e/`. Start the unified dev server first, then run the suite:

```bash
npm run dev                                # boots client + server
npx playwright install chromium            # one-time browser download
npm run test:e2e                          # smoke (all routes) + flow (signup -> chat)
```

The smoke test checks `http://localhost:5173` by default; point it at a different port with `TARGET_URL=http://localhost:<port> npm run test:e2e`.

## Deployment (Docker)
The Express server serves both the API and the built frontend (SPA fallback included).

```bash
# Full stack with MongoDB:
export YOUCAM_API_KEY=your_key_here
docker compose up --build -d
# App at http://localhost:3001

# Server only:
docker build -t dfashion .
docker run -p 3001:3001 -e JWT_SECRET=... -e MONGODB_URI=... -e YOUCAM_API_KEY=... dfashion
```

## Continuous Integration
`.github/workflows/ci.yml` runs on every push/PR to `main`:
- Frontend: `typecheck` + production build
- Backend: TypeScript build + vitest unit tests (`server/test/`)
- E2E: boots MongoDB + the API + Vite, then runs `npm run test:e2e`

> **Note for existing clones:** git history was rewritten to remove a private design
> document. If you have an old clone, re-sync with:
> `git fetch origin && git reset --hard origin/main`
