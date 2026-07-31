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
import { env } from "./config/env";

const app = express();

// Security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://images.unsplash.com",
          "https://*.youcamcdn.com",
        ],
      },
    },
  })
);

// Enable CORS
const allowedOrigins = env.CLIENT_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../tmp")));

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