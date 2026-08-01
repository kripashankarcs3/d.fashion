import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/database";
import { ImageService } from "./services/image.service";

const UPLOAD_TTL_MS = 24 * 60 * 60 * 1000;

const startServer = async () => {
  try {
    if (!env.YOUCAM_API_KEY) {
      if (env.NODE_ENV === "production") {
        console.error(
          "[startup] Missing required YouCam credential: YOUCAM_API_KEY. " +
            "Set it in server/.env before running in production.",
        );
        process.exitCode = 1;
        process.exit(1);
      }
      console.warn(
        "[startup] WARNING — YOUCAM_API_KEY not configured in server/.env. " +
          "AI analysis/try-on endpoints will fail until it is added. " +
          "Copy server/.env.example to server/.env and fill in your YouCam API key.",
      );
    }

    await connectDB();

    const removed = await ImageService.cleanupStaleUploads(UPLOAD_TTL_MS);
    if (removed > 0) {
      console.log(`Cleaned up ${removed} stale uploaded image(s)`);
    }

    const server = app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });

    const cleanup = async () => {
      await ImageService.cleanupStaleUploads(UPLOAD_TTL_MS);
    };
    const cleanupTimer = setInterval(cleanup, UPLOAD_TTL_MS);
    cleanupTimer.unref();

    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      clearInterval(cleanupTimer);
      server.close(() => {
        console.log("HTTP server closed");
      });
      await mongoose.disconnect();
      console.log("MongoDB disconnected");
      process.exit(0);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
