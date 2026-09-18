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
| Saved Conversations        | Stylist chats persist to the account and reopen from a history rail.                      |
| Plans & Try-On Credits     | Starter (9 try-ons), Essentials (40/month) and Atelier (unlimited), metered per account.  |
| Manual UPI Payments        | Pay by UPI, submit the reference, and an owner approves it before access is granted.      |

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
   back to style and colour. Conversations are saved to the account, so an
   earlier thread can be reopened from the history rail beside the chat.

---

## Plans and Payments

Every account gets nine AI try-ons. Beyond that there are two plans —
Essentials at INR 200 a month for forty, and Atelier at INR 999 a month for
unlimited — or a single extra try-on for INR 5 when that is all someone needs.

Payment is handled manually rather than through a gateway. The member pays the
UPI ID shown on `/payment`, submits the transaction reference with their name
and account email, and the request sits as pending until the owner reviews it
in `/admin/payments`. Approving it is what raises the quota; rejecting it
releases the reference so it can be submitted again. Every submission also
emails the owner, and `/admin/usage` shows try-on consumption per account.

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
      │                      │            │ or LLM: OpenRouter / Zen │
      └──────────┬───────────┘            └────────────┬─────────────┘
                 │                                     │
                 └──────────────── ────────────────────┘
                                  ▼
             ┌───────────────────┐   ┌────────────────────────┐
             │     MongoDB       │   │      Cloudinary        │
             │ Users / History   │   │ Analysed photos and    │
             │ Payments / Usage  │   │ saved try-on results   │
             │ Conversations     │   │                        │
             └───────────────────┘   └────────────────────────┘
```

---

## Security

- Credentials for third-party AI services never reach the browser; the Express
  server calls them server-side.
- JWT-based authentication with bcrypt password hashing
- Helmet security headers and a content security policy
- API rate limiting on auth, AI-heavy, chat and history routes
- Protected and guest-only routes, admin-gated product, payment and usage routes
- Admin access needs both an allowlisted email and a verified one, so a
  self-registered account cannot claim an owner address
- Security headers on the static frontend too, including `frame-ancestors`
  so the admin screens cannot be framed
- Private upload handling with `no-store` responses and `noindex`
- SSRF protection for remote image inputs: every hop is checked against the
  addresses it actually resolves to, not the hostname it was written as

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
- LLM-powered stylist via OpenRouter (default), the OpenCode Zen API, or a
  local model server (`opencode serve`), with structured GPT-style reply
  rendering and a rules-engine fallback whenever none is configured

**Infrastructure**

- Vercel and Render, with GitHub Actions running the verification pipeline
- Cloudinary for durable image storage, so analysed photos and saved try-ons
  survive a redeploy on hosts with no persistent disk

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
| `/payment`   | Members | UPI payment for a plan or a top-up     |
| `/admin/payments` | Owner | Review and approve payment requests  |
| `/admin/usage`    | Owner | Try-on usage across every account    |

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
| `/api/chat`       | D'Style stylist chat and saved conversations |
| `/api/products`   | Product catalogue                    |
| `/api/favorites`  | Saved products and looks             |
| `/api/history`    | Analysis history                     |
| `/api/payments`   | Payment submission and owner review  |
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
| `OPENCODE_MODE`               | No       | Stylist provider: `openrouter` (default), `zen` or `server` |
| `OPENROUTER_API_KEY`          | No       | OpenRouter key for the stylist chat     |
| `OPENROUTER_MODEL`            | No       | Model id (a free one is the default)    |
| `OPENCODE_API_KEY`            | No       | Zen-mode API key                        |
| `OPENCODE_MODEL`              | No       | Zen-mode model id                       |
| `ADMIN_EMAILS`                | No       | Emails allowed to review payments and usage |
| `TRY_ON_LIMIT_STARTER`        | No       | Free try-ons per account (default 9)    |
| `TRY_ON_LIMIT_ESSENTIALS`     | No       | Try-ons granted by an Essentials plan (default 40) |
| `CLOUDINARY_CLOUD_NAME`       | No       | Durable image storage (falls back to local disk) |
| `CLOUDINARY_API_KEY`          | No       | Cloudinary credentials                  |
| `CLOUDINARY_API_SECRET`       | No       | Cloudinary credentials                  |
| `SMTP_USER`                   | No       | Gmail address that sends payment alerts |
| `SMTP_APP_PASSWORD`           | No       | Gmail app password (never the login one) |
| `NOTIFY_EMAIL`                | No       | Who receives payment alerts             |
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