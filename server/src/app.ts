import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import healthRoutes from "./routes/health.routes";
import { apiLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import analyzeRoutes from "./routes/analyze.routes";
import chatRoutes from "./routes/chat.routes";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import favoriteRoutes from "./routes/favorite.routes";
import historyRoutes from "./routes/history.routes";
import recommendationRoutes from "./routes/recommendation.routes";
import tryOnRoutes from "./routes/tryon.routes";
import newsletterRoutes from "./routes/newsletter.routes";
import { env } from "./config/env";

const app = express();

// Behind any proxy/CDN, without this express-rate-limit sees one IP for
// every visitor and the whole userbase gets limited together. It also lets
// req.protocol report https for building absolute asset URLs to YouCam.
app.set("trust proxy", 1);

// Security
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://images.unsplash.com",
          "https://*.youcamcdn.com",
          "https://*.perfectcorp.com",
          "https://lh3.googleusercontent.com",
        ],
        connectSrc: [
          "'self'",
          "https://*.googleapis.com",
          "https://*.firebaseio.com",
          "https://securetoken.googleapis.com",
          "https://identitytoolkit.googleapis.com",
        ],
        frameSrc: ["'self'", "https://*.firebaseapp.com", "https://accounts.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'", "https://apis.google.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Enable CORS
const allowedOrigins = env.CLIENT_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// Serve uploaded images. Helmet's default `crossOriginResourcePolicy:
// same-origin` would block cross-origin <img> loads of these files, so the
// header is explicitly allowed for this mount only.
app.use(
  "/uploads",
  (_req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Robots-Tag", "noindex");
    next();
  },
  express.static(path.join(__dirname, "../tmp"), { maxAge: "1h", index: false })
);

// Compress responses
app.use(compression());

// Logger
app.use(morgan("dev"));

// Parse JSON
app.use(express.json());

app.use("/api", apiLimiter);

// Parse URL Encoded Data
app.use(express.urlencoded({ extended: true }));
app.use("/api/health", healthRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/recommend", recommendationRoutes);
app.use("/api/tryon", tryOnRoutes);
app.use("/api/newsletter", newsletterRoutes);

// Serve the built frontend if it exists (production deployments)
const distDir = path.join(__dirname, "../../dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// SPA fallback: unknown GET routes serve index.html, API routes return 404
app.use((req, res) => {
  if (req.method !== "GET" || req.path.startsWith("/api/")) {
    res.status(404).json({ success: false, message: "Endpoint not found" });
    return;
  }
  const indexHtml = path.join(distDir, "index.html");
  if (fs.existsSync(indexHtml)) {
    res.sendFile(indexHtml);
    return;
  }
  res.status(404).send("Not found");
});

app.use(errorHandler);

export default app;