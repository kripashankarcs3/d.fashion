<div align="center">

# ✦ D'Fashion

### **Colour Intelligence, Rendered Personal.**

**AI-powered personal colour intelligence and virtual fashion experience.**

Upload a photo. Discover your colour season. Get a personalised palette.
Then **see how real outfits look on you before you buy them.**

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-D'Fashion-ff1493?style=for-the-badge)](https://dfashion-rust.vercel.app/home)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge\&logo=github)](https://github.com/kripashankarcs3/d.fashion)
[![Hackathon](https://img.shields.io/badge/YouCam_AI-Hackathon-ff4f9b?style=for-the-badge)](https://www.perfectcorp.com/business/showcase/youcam-ai-api)

<br/>

![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square\&logo=react\&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square\&logo=typescript\&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=flat-square\&logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square\&logo=mongodb\&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square\&logo=tailwindcss\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square\&logo=docker\&logoColor=white)

<br/>

**YouCam API Hackathon — Category 3: Skin AI + Apparel VTO**

</div>

---

# 🚀 Live Demo

### Experience D'Fashion live

👉 **https://dfashion-rust.vercel.app/home**

D'Fashion is deployed as a production web application with a complete user journey from authentication and colour analysis to personalised reports, virtual try-on, saved looks and AI styling.

---

# 💡 Why D'Fashion?

Choosing the right clothes is not only about trends.

**Colour matters.**

A colour that looks amazing on one person can make another person look washed out, dull, or disconnected from their natural features.

Professional colour analysis can solve this problem, but traditional services can be expensive and require studio appointments.

### D'Fashion brings that experience to the web.

With just a photograph, D'Fashion can analyse:

* Skin undertone
* Skin depth
* Overall contrast
* Personal colour season
* Recommended colour palette
* Neutrals
* Metals
* Colours to avoid

And it goes one step further.

### **Don't just know what colour suits you. See it on you.**

Our virtual try-on experience lets users visualise real garments on their own photo before making a purchase.

---

# ✨ Core Experience

|     | Feature                    | Description                                                                                    |
| --- | -------------------------- | ---------------------------------------------------------------------------------------------- |
| 📸  | **AI Colour Analysis**     | Analyse a user's photograph to determine undertone, depth and contrast.                        |
| 🎨  | **Personal Colour Report** | Generate a personalised seasonal colour palette with recommended colours, neutrals and metals. |
| 👗  | **Virtual Try-On**         | Visualise real garments on the user's own photograph before purchasing.                        |
| 💬  | **D'Style AI Stylist**     | Get personalised fashion guidance based on the user's colour season and palette.               |
| 🛍️ | **Smart Recommendations**  | Discover products that align with the user's personal colour profile.                          |
| ❤️  | **Saved Looks**            | Save favourite looks and fashion inspiration for later.                                        |
| 📊  | **Personal Dashboard**     | Access analysis history, saved looks and personalised fashion information from one place.      |

---

# 🎯 The User Journey

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
                │                        │
                │ Undertone               │
                │ Depth                   │
                │ Contrast                │
                └───────────┬────────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │  Seasonal Analysis   │
                 │                      │
                 │   1 of 12 Seasons    │
                 └──────────┬───────────┘
                            │
            ┌───────────────┼────────────────┐
            ▼               ▼                ▼
      ┌──────────┐    ┌────────────┐   ┌──────────────┐
      │  Report  │    │ Virtual    │   │ D'Style AI   │
      │  & Color │    │ Try-On     │   │ Stylist      │
      │  Palette │    │            │   │              │
      └──────────┘    └────────────┘   └──────────────┘
```

---

# 🧠 How It Works

D'Fashion combines computer vision, colour intelligence, virtual try-on and conversational AI into one fashion experience.

### Step 1 — Upload

The user uploads a photograph.

### Step 2 — AI Analysis

The image is processed through the YouCam AI pipeline to extract skin and colour information.

### Step 3 — Colour Intelligence

Our colour analysis engine interprets:

* Undertone
* Depth
* Contrast

The result is mapped to **one of twelve seasonal colour profiles**.

### Step 4 — Personalised Report

The user receives:

* Personal colour season
* Recommended palette
* Neutrals
* Metal recommendations
* Colours to avoid
* Wardrobe guidance

### Step 5 — Virtual Try-On

Users can select garments and visualise how they look on their own photograph using YouCam Virtual Try-On.

### Step 6 — AI Styling

D'Style provides season-aware fashion recommendations and answers questions such as:

> "Does this jacket work for me?"

The response considers the user's personal colour profile rather than giving generic fashion advice.

---

# 🏗️ System Architecture

```text
                           ┌────────────────────┐
                           │      User           │
                           │  Web / Mobile       │
                           └─────────┬──────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │ React + TypeScript    │
                         │ Vite + Tailwind       │
                         │ Shadcn/UI             │
                         └───────────┬───────────┘
                                     │
                              REST API Calls
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │    Express Server     │
                         │      TypeScript       │
                         └───────────┬───────────┘
                                     │
              ┌──────────────────────┼─────────────────────┐
              │                      │                     │
              ▼                      ▼                     ▼
      ┌──────────────┐      ┌────────────────┐    ┌────────────────┐
      │   YouCam AI  │      │ Colour Engine  │    │ D'Style AI     │
      │              │      │                │    │ Stylist        │
      │ Skin AI      │      │ 12 Seasons     │    │ Rules + LLM    │
      │ VTO          │      │ Palette Engine │    │                │
      └──────────────┘      └────────────────┘    └────────────────┘
              │                      │                     │
              └──────────────────────┼─────────────────────┘
                                     │
                                     ▼
                           ┌───────────────────┐
                           │     MongoDB       │
                           │                   │
                           │ Users             │
                           │ Analysis History  │
                           │ Products          │
                           │ Favorites         │
                           │ Saved Looks       │
                           └───────────────────┘
```

---

# 🔐 Security Architecture

Security was considered as part of the application architecture rather than as an afterthought.

### API Key Protection

The browser never receives third-party AI credentials.

```text
Browser
   │
   │ Request
   ▼
Express API
   │
   │ Secure server-side request
   ▼
YouCam / AI Services
```

This keeps sensitive credentials inside the server environment.

### Security measures

* JWT-based authentication
* bcrypt password hashing
* Helmet security headers
* Content Security Policy
* API rate limiting
* Protected routes
* Guest-only routes
* Server-side AI API calls
* Private upload handling
* `no-store` upload responses
* `noindex` protection for private uploads
* SSRF protection for remote image inputs
* Admin-gated routes

---

# 🛠️ Tech Stack

## Frontend

* React 18
* TypeScript 5.5
* Vite 6
* Tailwind CSS v4
* shadcn/ui
* Wouter
* Framer Motion
* TanStack Query
* Zustand

## Backend

* Node.js
* Express 5
* TypeScript
* MongoDB
* Mongoose
* JWT
* bcrypt
* Helmet
* express-rate-limit
* Vitest

## AI & Computer Vision

* YouCam AI
* YouCam Virtual Try-On
* Colour analysis engine
* Rules-based styling
* LLM-powered stylist

## Infrastructure

* Docker
* Docker Compose
* GitHub Actions
* Vercel
* Render

---

# 🗺️ Application Routes

| Route        | Access     | Purpose                                 |
| ------------ | ---------- | --------------------------------------- |
| `/`          | Auth-based | Login or application entry              |
| `/home`      | Public     | D'Fashion campaign landing page         |
| `/pricing`   | Public     | Pricing and plans                       |
| `/about`     | Public     | About D'Fashion                         |
| `/contact`   | Public     | Contact                                 |
| `/faq`       | Public     | Frequently asked questions              |
| `/blog`      | Public     | Fashion and colour intelligence content |
| `/privacy`   | Public     | Privacy policy                          |
| `/terms`     | Public     | Terms                                   |
| `/login`     | Guests     | User authentication                     |
| `/signup`    | Guests     | Account creation                        |
| `/dashboard` | Members    | Personal fashion dashboard              |
| `/upload`    | Members    | Photo upload and colour analysis        |
| `/report`    | Members    | Personal colour report                  |
| `/try-on`    | Members    | Virtual apparel try-on                  |
| `/chat`      | Members    | D'Style AI stylist                      |

---

# 🔌 API Architecture

All backend endpoints are mounted under:

```text
/api
```

| Endpoint          | Purpose                       |
| ----------------- | ----------------------------- |
| `/api/auth`       | Authentication and sessions   |
| `/api/analyze`    | Photo and colour analysis     |
| `/api/recommend`  | Palette-based recommendations |
| `/api/tryon`      | Virtual try-on jobs           |
| `/api/chat`       | D'Style AI stylist            |
| `/api/products`   | Product catalogue             |
| `/api/favorites`  | Saved products and looks      |
| `/api/history`    | User analysis history         |
| `/api/newsletter` | Newsletter subscriptions      |
| `/api/health`     | Application health check      |

---

# 📁 Project Structure

```text
d.fashion/
│
├── src/
│   ├── components/
│   │   ├── UI components
│   │   ├── Editorial system
│   │   └── shadcn primitives
│   │
│   ├── pages/
│   │   ├── Home
│   │   ├── Dashboard
│   │   ├── Upload
│   │   ├── Report
│   │   ├── Try-On
│   │   └── Chat
│   │
│   ├── hooks/
│   │   ├── useAnalysis
│   │   └── useTryOn
│   │
│   ├── store/
│   │   ├── auth
│   │   └── style
│   │
│   ├── services/
│   │   └── API client
│   │
│   └── config/
│       └── Navigation + page metadata
│
├── server/
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       │   ├── YouCam
│       │   ├── stylist
│       │   ├── recommendations
│       │   └── images
│       │
│       ├── models/
│       ├── middleware/
│       └── utils/
│           ├── colourAnalysis
│           ├── JWT
│           └── responses
│
├── e2e/
│   └── Playwright tests
│
├── scripts/
│   └── Image optimisation
│
├── public/
│   └── images/
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── vite.config.js
├── render.yaml
├── vercel.json
└── README.md
```

---

# ⚡ Getting Started

## Prerequisites

Make sure the following are installed:

* Node.js 18+
* npm
* MongoDB
* YouCam AI API key

---

## 1. Clone the repository

```bash
git clone https://github.com/kripashankarcs3/d.fashion.git

cd d.fashion
```

---

## 2. Install dependencies

```bash
npm install

npm --prefix server install
```

---

## 3. Configure environment variables

Create the frontend environment file:

```bash
cp .env.example .env
```

Create the server environment file:

```bash
cp server/.env.example server/.env
```

Configure:

| Variable              | Required | Purpose                      |
| --------------------- | -------: | ---------------------------- |
| `JWT_SECRET`          |        ✅ | Authentication security      |
| `MONGODB_URI`         |        ✅ | MongoDB connection           |
| `YOUCAM_API_KEY`      |        ✅ | AI analysis + virtual try-on |
| `FIREBASE_PROJECT_ID` |        ✅ | Firebase authentication      |
| `CLIENT_EMAIL`        |        ✅ | Firebase service account     |
| `PRIVATE_KEY`         |        ✅ | Firebase service account     |
| `ANTHROPIC_API_KEY`   | Optional | Enhanced AI stylist          |
| `PORT`                | Optional | Backend port                 |
| `NODE_ENV`            | Optional | Runtime environment          |
| `CLIENT_ORIGIN`       | Optional | Frontend origin              |

> **Important:** Never commit `.env` files or API keys to GitHub.

---

# ▶️ Run Locally

Start the application:

```bash
npm run dev
```

The development environment starts both frontend and backend.

### Frontend

```text
http://localhost:5173
```

### API

```text
http://localhost:3001
```

---

# 🧪 Testing & Verification

## Type checking

```bash
npm run typecheck
```

## Production build

```bash
npm run build
```

## Backend tests

```bash
npm --prefix server test
```

---

# 🎭 End-to-End Testing

D'Fashion uses Playwright for end-to-end testing.

Install Chromium:

```bash
npx playwright install chromium
```

Start the development server:

```bash
npm run dev
```

Then run:

```bash
npm run test:e2e
```

The E2E suite covers the application's major routes and user flows including:

```text
Signup
   ↓
Authentication
   ↓
Photo Upload
   ↓
Colour Analysis
   ↓
Report
   ↓
AI Stylist
```

---

# 🐳 Docker Deployment

D'Fashion can also be deployed using Docker.

### Full stack

```bash
export YOUCAM_API_KEY=your_key_here

docker compose up --build -d
```

Application:

```text
http://localhost:3001
```

### Server-only image

```bash
docker build -t dfashion .
```

Run:

```bash
docker run -p 3001:3001 \
  -e JWT_SECRET=... \
  -e MONGODB_URI=... \
  -e YOUCAM_API_KEY=... \
  dfashion
```

---

# ☁️ Deployment

Production deployment configurations are included for:

* Vercel
* Render
* Docker

The Express server can serve both the backend API and the built React application, allowing the complete product to run through a single production container.

---

# 🔄 Continuous Integration

GitHub Actions runs the project's verification pipeline on pushes and pull requests to `main`.

```text
Git Push / Pull Request
          │
          ▼
    ┌──────────────┐
    │ Type Checking│
    └──────┬───────┘
           ▼
    ┌──────────────┐
    │ Production   │
    │ Build        │
    └──────┬───────┘
           ▼
    ┌──────────────┐
    │ Backend Tests │
    └──────┬───────┘
           ▼
    ┌──────────────┐
    │ E2E Tests    │
    └──────┬───────┘
           ▼
       ✅ PASS
```

---

# 🏆 Hackathon

### YouCam API Hackathon

**Category 3 — Skin AI + Apparel Virtual Try-On**

D'Fashion combines:

**Skin AI + Colour Intelligence + Personalisation + Virtual Try-On + AI Styling**

into one end-to-end fashion experience.

---

# 🌟 What Makes D'Fashion Different?

Most fashion platforms answer:

> **"What's trending?"**

D'Fashion asks:

> **"What actually works for YOU?"**

The platform connects a user's personal colour profile with fashion discovery and virtual visualisation.

```text
PERSON
  │
  ▼
SKIN + COLOUR INTELLIGENCE
  │
  ▼
PERSONAL COLOUR PROFILE
  │
  ├───────────────┐
  ▼               ▼
FASHION          AI STYLE
DISCOVERY        ASSISTANT
  │               │
  └───────┬───────┘
          ▼
     VIRTUAL TRY-ON
          │
          ▼
   CONFIDENT DECISION
```

---

# 🔮 Future Roadmap

Potential future improvements include:

* 📱 Native mobile application
* 🧥 Larger apparel catalogue
* 🪞 More advanced virtual try-on
* 🧠 Improved personal styling intelligence
* 🛒 Direct fashion marketplace integration
* 👚 Digital wardrobe management
* 📈 Personal style evolution tracking
* 🌍 Multi-region fashion recommendations
* 🤝 Brand and retailer integrations
* 🎯 More granular body and style personalisation

---

# 👥 Team

Built with passion for the **YouCam AI Hackathon**.

### Contributors

* **Deepali Kumari**
* **Kripashankar Yadav**

---

# 🤝 Contributing

Contributions are welcome for future development.

### Development workflow

```bash
git checkout main

git pull origin main

git checkout -b feature/your-feature

# Make your changes

npm run typecheck
npm run build
npm run test:e2e

git add .

git commit -m "feat: add your feature"

git push origin feature/your-feature
```

Then open a Pull Request.

---

# 🔒 Security

If you discover a security vulnerability, please do not publicly disclose sensitive information through GitHub Issues.

Instead, contact the project maintainers privately.

---

# 📜 License

**Private Project — All Rights Reserved**

This project and its source code are proprietary unless otherwise stated by the project maintainers.

---

<div align="center">

# ✦ D'Fashion

### **Discover. Style. Inspire.**

**AI that understands your colours.
Fashion that understands you.**

<br/>

### 🚀 Try D'Fashion

**[Live Demo →](https://dfashion-rust.vercel.app/home)**

<br/>

**Built with React · TypeScript · Express · MongoDB · YouCam AI**

<br/>

⭐ **If you like the project, consider starring the repository!** ⭐

</div>
