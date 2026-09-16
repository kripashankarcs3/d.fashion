import { Router } from "express";
import {
  submitPayment,
  getMyPayments,
  getPayment,
  listPayments,
  approvePayment,
  rejectPayment,
} from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/requireAdmin";
import { paymentLimiter } from "../middleware/rateLimiter";

const router = Router();

// Member routes — submit a request, check on it.
router.post("/", authenticate, paymentLimiter, submitPayment);
router.get("/mine", authenticate, getMyPayments);
router.get("/:id", authenticate, getPayment);

// Admin routes — review queue.
router.get("/", authenticate, requireAdmin, listPayments);
router.post("/:id/approve", authenticate, requireAdmin, approvePayment);
router.post("/:id/reject", authenticate, requireAdmin, rejectPayment);

export default router;
