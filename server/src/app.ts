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
import tryOnRoutes from "./routes/tryon.routes";
import garmentRoutes from "./routes/garment.routes";
import seasonRoutes from "./routes/season.routes";
import newsletterRoutes from "./routes/newsletter.routes";
import paymentRoutes from "./routes/payment.routes";
import { env } from "./config/env";
import { API_PREFIX, GALLERY_DIR, TMP_DIR } from "./constants";

/** Hosts allowed to load images via CSP — env-driven, comma-separated. */
const cspImageHosts = env.CSP_IMG_HOSTS.split(",").map((h) => h.trim()).filter(Boolean);

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
          ...cspImageHosts,
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
// Stored filenames are built from the accepted mimetype, so nothing but an
// image can land in these folders. This header is the second lock: a document
// served from here can load nothing and run nothing, which costs an <img>
// consumer nothing — a response's own CSP does not govern the page embedding it.
const staticAssetHeaders = (cacheControl: string) =>
  (_req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cache-Control", cacheControl);
    res.setHeader("X-Robots-Tag", "noindex");
    res.setHeader("Content-Security-Policy", "default-src 'none'; sandbox");
    next();
  };

app.use(
  "/uploads",
  staticAssetHeaders("private, no-store"),
  express.static(TMP_DIR, { maxAge: "1h", index: false })
);

// Saved dashboard images. Same cross-origin allowance as /uploads, but this
// folder is durable: entries a member saved must survive the /uploads sweep.
app.use(
  "/gallery",
  staticAssetHeaders("private, max-age=86400"),
  express.static(GALLERY_DIR, { maxAge: "1d", index: false })
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
app.use(`${API_PREFIX}/health`, healthRoutes);
app.use(`${API_PREFIX}/analyze`, analyzeRoutes);
app.use(`${API_PREFIX}/chat`, chatRoutes);
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/favorites`, favoriteRoutes);
app.use(`${API_PREFIX}/history`, historyRoutes);
app.use(`${API_PREFIX}/tryon`, tryOnRoutes);
app.use(`${API_PREFIX}/garments`, garmentRoutes);
app.use(`${API_PREFIX}/seasons`, seasonRoutes);
app.use(`${API_PREFIX}/newsletter`, newsletterRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes);

// Serve the built frontend if it exists (production deployments)
const distDir = path.join(__dirname, "../../dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// SPA fallback: unknown GET routes serve index.html, API routes return 404
app.use((req, res) => {
  if (req.method !== "GET" || req.path.startsWith(`${API_PREFIX}/`)) {
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