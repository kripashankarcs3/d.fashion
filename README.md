<div align="center">

# ✦ D'Fashion

### **Colour Intelligence, Rendered Personal.**

**AI-powered personal colour intelligence and virtual fashion experience.**

Upload a photo. Discover your colour season. Get a personalised palette.
Then **see how real outfits look on you before you buy them.**

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-D'Fashion-ff1493?style=for-the-badge)](https://dfashion-rust.vercel.app/home)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge\&logo=github)](https://github.com/kripashankarcs3/d.fashion)
[![YouCam AI](https://img.shields.io/badge/YouCam_AI-Hackathon-ff4f9b?style=for-the-badge)](https://www.perfectcorp.com/business/showcase/youcam-ai-api)

<br/>

![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square\&logo=react\&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square\&logo=typescript\&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=flat-square\&logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square\&logo=mongodb\&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square\&logo=tailwindcss\&logoColor=white)

<br/>

**YouCam API Hackathon — Category 3: Skin AI + Apparel VTO**

</div>

---

## Why D'Fashion?

Choosing the right clothes is not only about trends. **Colour matters.**

A colour that looks great on one person can make another look washed out.
Professional colour analysis solves this, but visits can be expensive and
time-consuming. D'Fashion brings it to the web.

With just a photograph, D'Fashion analyses:

- Skin undertone
- Skin depth
- Contrast
- Personal colour season (one of twelve)
- Recommended palette, neutrals and metals
- Colours to avoid

And it goes one step further.

**Don't just know what suits you. See it on you.**

Our virtual try-on lets users visualise real garments on their own photo
before making a purchase.

---

## Core Experience

| Feature                    | Description                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| AI Colour Analysis         | Reads undertone, depth and contrast from a photograph.                                   |
| Personal Colour Report     | Personalised seasonal palette with recommended colours, neutrals and metals.             |
| Virtual Try-On             | Garments, curated Indian hairstyles and makeup on the user's own photograph.             |
| D'Style AI Stylist         | LLM-powered chat grounded in the user's colour season and wardrobe, with structured answers. |
| Buy from Real Stores       | The catalogue is sourced from several retailers (Snitch, Myntra, Amazon and more); Buy opens the store. |
| Smart Recommendations      | Garments matched to the user's colour profile.                                           |
| Saved Looks                | Favourites, saved reports and fashion inspiration.                                       |
| Personal Dashboard         | Analysis history, saved images and favourites in one place.                              |

---

## The User Journey

```text
                    ┌──────────────────┐
                    │   Upload Photo   │
                    └────────┬─────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │     YouCam AI       │
                  │ Skin + Colour AI    │
                  └──────────┬──────────┘
                             │
                             ▼
                ┌────────────────────────┐
                │  Colour Analysis Engine│
                │  Undertone / Depth /   │
                │  Contrast              │
                └───────────┬────────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │  Seasonal Analysis   │
                 │   1 of 12 Seasons    │
                 └──────────┬───────────┘
            ┌───────────────┼────────────────┐
            ▼               ▼                ▼
      ┌──────────┐    ┌────────────┐   ┌──────────────┐
      │  Report  │    │ Virtual    │   │ D'Style AI   │
      │  Palette │    │ Try-On     │   │ Stylist      │
      └──────────┘    └────────────┘   └──────────────┘
```

---

## How It Works

1. **Upload** - the user uploads a photograph.
2. **AI analysis** - the image is processed through the YouCam AI pipeline to
   extract skin and colour information.
3. **Colour intelligence** - the engine reads undertone, depth and contrast
   and maps the result to one of twelve seasonal profiles.
4. **Personalised report** - season, palette, neutrals, metals, avoid colours
   and wardrobe guidance.
5. **Virtual try-on** - see garments, makeup and hairstyles on your own photo.
6. **AI styling** - D'Style answers styling questions in clear structured
   sections, grounded in the member's season and palette. It stays in persona
   and never describes itself as an AI model; off-topic questions are steered
   back to style and colour.

---

## System Architecture

```text
                          ┌────────────────────┐
                          │    Browser view     │
                          │ React + TypeScript  │
                          └──────────┬──────────┘
                                     │ REST API
                                     ▼
                          ┌─────────────────────┐
                          │   Express Server    │
                          └──────┬──────┬───────┘
                                 │      │
                  ┌──────────────┘      └──────────────┐
                  ▼                                    ▼
      ┌──────────────────────┐            ┌──────────────────────────┐
      │ YouCam AI            │            │ D'Style AI Stylist       │
      │ Skin AI + VTO        │            │ Rules engine (fallback)  │
      │                      │            │ or LLM: local serve / Zen│
      └──────────────────────┘            └──────────────────────────┘
                  │                                    │
                  └─────────────── ────────────────────┘
                                  ▼
                       ┌───────────────────┐
                       │     MongoDB       │
                       │ Users / History   │
                       │ Products / Saves  │
                       └───────────────────┘
```

---

## Security

- Credentials for third-party AI services never reach the browser; the Express
  server calls them server-side.
- JWT-based authentication with bcrypt password hashing
- Helmet security headers and a content security policy
- API rate limiting on auth, AI-heavy, chat and history routes
- Protected and guest-only routes, admin-gated product routes
- Private upload handling with `no-store` responses and `noindex`
- SSRF protection for remote image inputs

---

## Tech Stack

**Frontend**

- React 18, TypeScript 5.5, Vite, Tailwind CSS v4, Wouter, Framer Motion,
  TanStack Query, Zustand

**Backend**

- Node.js, Express 5, TypeScript, MongoDB + Mongoose, JWT, bcrypt, Helmet,
  express-rate-limit, Vitest

**AI & Computer Vision**

- YouCam AI (colour analysis and virtual try-on)
- Rules-based styling engine
- LLM-powered stylist via a local model server (`opencode serve`) or the
  OpenCode Zen API, with structured GPT-style reply rendering

**Infrastructure**

- Vercel and Render, with GitHub Actions running the verification pipeline

---

## Application Routes

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

---

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

---

## Project Structure

```text
src/            React client (pages, components, hooks, store)
server/src/     Express server (routes, services, models, config)
server/src/data/garments.json   garment catalogue (571 items, multi-retailer)
server/scripts/  opencode-serve.mjs - local stylist model server
e2e/            Playwright end-to-end tests
public/         Static assets and images
```

---

## Getting Started

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
| `OPENCODE_API_KEY`            | No       | Zen-mode API key                        |
| `OPENCODE_SERVER_URL`         | No       | Local model server address              |
| `OPENCODE_SERVER_USERNAME`    | No       | Local model server username             |
| `OPENCODE_SERVER_PASSWORD`    | No       | Local model server password             |
| `OPENCODE_TIMEOUT_MS`         | No       | Model reply timeout (rules engine on timeout) |
| `CLIENT_ORIGIN`               | No       | Frontend origin                         |
| `PORT`                        | No       | Backend port (default 3001)             |

Never commit `.env` files or keys.

---

## Testing

```bash
npm run typecheck       # type checking
npm run build           # production build
npm --prefix server test
```

End-to-end tests use Playwright. The suite covers signup, authentication,
photo upload, colour analysis, the report, and the AI stylist.

```bash
npx playwright install chromium   # once
npm run test:e2e
```

---

## Deployment

Production configs are included for Vercel (`vercel.json`) and Render
(`render.yaml`). The Express server can serve both the backend API and the
built React app from a single container.

---

## Continuous Integration

GitHub Actions runs type checking, the production build, backend tests and
the e2e suite on pushes and pull requests to `main`.

---

## What Makes D'Fashion Different?

Most fashion platforms answer **"What's trending?"**.

D'Fashion asks **"What actually works for you?"** — connecting a personal
colour profile to fashion discovery and virtual visualisation, so the user
makes a confident choice.

---

## Roadmap

- Native mobile application
- Larger apparel catalogue
- More advanced virtual try-on
- Better personal styling intelligence
- Direct fashion marketplace integration
- Digital wardrobe management
- Personal style evolution tracking
- Brand and retailer integrations

---

## Team

Built for the **YouCam AI Hackathon**.

- Deepali Kumari
- Kripashankar Yadav

---

## License

**Private Project — All Rights Reserved**