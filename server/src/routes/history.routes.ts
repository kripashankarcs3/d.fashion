import { Router } from "express";

import {
  saveHistory,
  getHistory,
  deleteHistory,
} from "../controllers/history.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Save Analysis History
router.post("/", authenticate, saveHistory);

// Get Logged-in User History
router.get("/", authenticate, getHistory);

// Delete History
router.delete("/:id", authenticate, deleteHistory);

export default router;