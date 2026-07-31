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
