import { Router } from "express";
import {
  submitPayment,
  getMyPayments,
  getPayment,
  getPaymentScreenshot,
  listPayments,
  approvePayment,
  rejectPayment,
} from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/requireAdmin";
import { paymentLimiter } from "../middleware/rateLimiter";
import paymentUpload from "../middleware/paymentUpload";

const router = Router();

// Member routes — submit a request, check on it, read its own screenshot back.
router.post("/", authenticate, paymentLimiter, paymentUpload.single("screenshot"), submitPayment);
router.get("/mine", authenticate, getMyPayments);
router.get("/:id", authenticate, getPayment);
router.get("/:id/screenshot", authenticate, getPaymentScreenshot);

// Admin routes — review queue.
router.get("/", authenticate, requireAdmin, listPayments);
router.post("/:id/approve", authenticate, requireAdmin, approvePayment);
router.post("/:id/reject", authenticate, requireAdmin, rejectPayment);

export default router;
