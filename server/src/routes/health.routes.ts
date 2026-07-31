import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = ["disconnected", "connected", "connecting", "disconnecting"][dbState] || "unknown";

  const statusCode = dbState === 1 ? 200 : 503;

  res.status(statusCode).json({
    success: dbState === 1,
    message: dbState === 1 ? "Server is healthy" : "Database not connected",
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

export default router;
