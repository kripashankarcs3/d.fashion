# D'Fashion

A web app for personal colour analysis and virtual fashion styling. Upload a
photo, get your colour season and palette, see garments on your own photo,
and ask a stylist for guidance.

Live demo: https://dfashion-rust.vercel.app/home

---

## Features

- **Colour analysis** - uploads a photo and reads undertone, depth and contrast
- **Season report** - one of twelve colour seasons with a palette, neutrals,
  metals and colours to avoid
- **Virtual try-on** - garments, makeup and hairstyles on the user's photo
- **D'Style stylist chat** - an LLM-powered stylist that answers with your
  colour profile in mind. It keeps the stylist persona and never claims to be
  an AI. It falls back to a built-in rules engine when no model is configured
- **Buy links** - the catalogue is sourced from several retailers (Snitch,
  Myntra, Amazon and others); the Buy button opens the source store
- **Saved looks** - favourites, saved reports and analysis history on a
  personal dashboard

## How it works

1. The user uploads a photograph.
2. YouCam AI extracts skin and colour data.
3. The colour engine maps the result to one of twelve seasonal profiles.
4. The report shows the palette, neutrals, avoid colours and wardrobe guidance.
5. Virtual try-on lets the user see outfits in their palette on their own photo.
6. The D'Style chat answers styling questions, grounded in the member's
   season and palette, in clear structured sections.

## Architecture

```text
Browser (React + Vite)
        |
        | REST API
        v
Express server
  |          |          |
  v          v          v
YouCam Ai  Colour    D'Style   -> rules engine or an LLM
(analysis,  engine    stylist       (local model server / Zen API)
 try-on)   (12 seasons)
        |
        v
     MongoDB
```

## Tech stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS v4, Wouter, TanStack
  Query, Zustand, Framer Motion
- Backend: Node.js, Express 5, TypeScript, MongoDB + Mongoose, JWT, bcrypt,
  Helmet, express-rate-limit
- AI: YouCam AI (analysis and virtual try-on), LLM stylist served through a
  local `opencode serve` or the OpenCode Zen API
- Tooling: Vitest, Playwright (e2e), Docker, GitHub Actions

## Routes

| Route        | Access  | Purpose                                |
| ------------ | ------- | -------------------------------------- |
| `/`          | Auth    | Entry point (login or dashboard)       |
| `/home`      | Public  | Landing page                           |
| `/pricing`   | Public  | Plans                                  |
| `/about`     | Public  | About                                  |
| `/contact`   | Public  | Contact                                |
| `/faq`       | Public  | FAQ                                    |
| `/blog`      | Public  | Content                                |
| `/privacy`   | Public  | Privacy policy                         |
| `/terms`     | Public  | Terms                                  |
| `/login`     | Guests  | Sign in                                |
| `/signup`    | Guests  | Create account                         |
| `/dashboard` | Members | Personal dashboard                     |
| `/upload`    | Members | Photo upload and analysis              |
| `/report`    | Members | Colour report                          |
| `/try-on`    | Members | Virtual try-on                         |
| `/chat`      | Members | D'Style stylist chat                   |

## API

All endpoints are mounted under `/api`.

| Endpoint          | Purpose                              |
| ----------------- | ------------------------------------ |
| `/api/auth`       | Register and log in                  |
| `/api/analyze`    | Colour analysis                      |
| `/api/seasons`    | Season catalogue                     |
| `/api/garments`   | Garment catalogue and recommendations |
| `/api/tryon`      | Try-on jobs (clothes, makeup, hair)  |
| `/api/chat`       | D'Style stylist chat                 |
| `/api/products`   | Product catalogue                    |
| `/api/favorites`  | Saved products and looks             |
| `/api/history`    | Analysis history                     |
| `/api/newsletter` | Newsletter subscriptions             |
| `/api/health`     | Health check                         |

## Project structure

```text
src/            React client (pages, components, hooks, store)
server/src/     Express server (routes, services, models, data/)
server/scripts/  helpers (e.g. opencode-serve.mjs)
server/src/data/garments.json   garment catalogue (571 items)
e2e/            Playwright end-to-end tests
```

## Getting started

Requirements: Node.js 18+, npm, MongoDB, and a YouCam AI API key.

```bash
git clone https://github.com/kripashankarcs3/d.fashion.git
cd d.fashion

npm install
npm --prefix server install

cp .env.example .env
cp server/.env.example server/.env
```

Environment variables (see `server/src/config/env.ts` for the full schema):

| Variable                      | Required | Purpose                                 |
| ----------------------------- | -------- | --------------------------------------- |
| `JWT_SECRET`                  | Yes      | Authentication                          |
| `MONGODB_URI`                 | Yes      | MongoDB connection                      |
| `YOUCAM_API_KEY`              | Yes      | Colour analysis and try-on              |
| `FIREBASE_PROJECT_ID`         | Yes      | Firebase auth                           |
| `FIREBASE_CLIENT_EMAIL`       | Yes      | Firebase service account                |
| `FIREBASE_PRIVATE_KEY`        | Yes      | Firebase service account                |
| `OPENCODE_MODE`               | No       | `zen` (model API) or `server` (local serve) |
| `OPENCODE_MODEL`              | No       | Model id for the stylist chat           |
| `OPENCODE_SERVER_URL`         | No       | Local model server address              |
| `OPENCODE_SERVER_USERNAME`    | No       | Local model server username             |
| `OPENCODE_SERVER_PASSWORD`    | No       | Local model server password             |
| `OPENCODE_TIMEOUT_MS`         | No       | Model reply timeout (rules engine on timeout) |
| `CLIENT_ORIGIN`               | No       | Frontend origin                         |
| `PORT`                        | No       | Backend port (default 3001)             |

Never commit `.env` files or keys.

## Run locally

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001

A local stylist model server (`opencode serve`) can be started with
`npm --prefix server run serve:stylist` if you use `OPENCODE_MODE=server`.

## Tests

```bash
npm run typecheck       # type checking
npm run build           # production build
npm --prefix server test
npx playwright install chromium   # once, for e2e
npm run test:e2e
```

## Docker

```bash
docker compose up --build -d
```

## Deployment

Vercel and Render configs are included (`vercel.json`, `render.yaml`). The
Express server can serve both the API and the built client from one container.

## License

Private project - all rights reserved.