import { Router, Request, Response } from "express";
import mongoose from "mongoose";

const router = Router();

// Liveness probe — always 200 as long as the process is running.
// Orchestrators (K8s, ECS) should use this to decide whether to restart the container.
router.get("/live", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// Readiness probe — 503 when MongoDB is not connected.
// Orchestrators should use this to decide whether to send traffic to the container.
const readyHandler = (_req: Request, res: Response): void => {
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    ["disconnected", "connected", "connecting", "disconnecting"][dbState] ??
    "unknown";

  const statusCode = dbState === 1 ? 200 : 503;

  res.status(statusCode).json({
    status: dbState === 1 ? "ok" : "unavailable",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
};

router.get("/ready", readyHandler);

// Backward-compat alias: GET /api/health → same as /ready
router.get("/", readyHandler);

export default router;
