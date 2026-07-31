# D'Fashion - Complete Style Intelligence Platform

> YouCam API Hackathon Submission - Category 3: Skin AI + Apparel VTO

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

### 2. Backend (`server/`)
```bash
cd server
npm install
copy .env.example .env   # fill JWT_SECRET, MONGODB_URI, YOUCAM_API_KEY
npm run dev              # http://localhost:3001
```

### 3. Frontend (`./`)
```bash
npm install
npm run dev              # http://localhost:5173
```

Open http://localhost:5173

## YouCam APIs Used
1. AI Photo Enhance
2. AI Skin Analysis
3. AI Facial Color Tones Analyzer
4. AI Clothes Virtual Try-On
5. AI Makeup Virtual Try-On
6. AI Hair Color Virtual Try-On

## Environment Variables
Frontend (`.env`):
```
VITE_API_BASE_URL=http://localhost:3001/api
VITE_YOUCAM_API_KEY=your_key_here
VITE_YOUCAM_API_SECRET=your_secret_here
```

Backend (`server/.env`):
```
PORT=3001
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your-jwt-secret-here
MONGODB_URI=mongodb://localhost:27017/deestyle
YOUCAM_API_KEY=your-youcam-api-key-here
YOUCAM_API_SECRET=
```

## Verification
```bash
npm run typecheck     # TypeScript check (frontend)
npm run build         # Production build (frontend)
cd server && npm run build   # Compile backend
```

## End-to-End Tests
Playwright smoke + flow tests live in `e2e/`. Requires the dev servers running (`npm run dev` + backend).

```bash
npx playwright install chromium   # one-time browser download
npm run test:e2e                  # smoke (all routes) + flow (signup -> chat)
```

## Deployment (Docker)
The Express server serves both the API and the built frontend (SPA fallback included).

```bash
# Full stack with MongoDB:
export YOUCAM_API_KEY=your_key_here
export YOUCAM_API_SECRET=your_secret_here
docker compose up --build -d
# App at http://localhost:3001

# Server only:
docker build -t dfashion .
docker run -p 3001:3001 -e JWT_SECRET=... -e MONGODB_URI=... -e YOUCAM_API_KEY=... dfashion
```
