import { Router } from "express";
import {
  submitPayment,
  getMyPayments,
  getPayment,
  getEmailStatus,
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

// Admin routes — review queue. /email-status must come before the /:id
// catch-all below, or Express would try to treat "email-status" as an id.
router.get("/email-status", authenticate, requireAdmin, getEmailStatus);
router.get("/", authenticate, requireAdmin, listPayments);
router.post("/:id/approve", authenticate, requireAdmin, approvePayment);
router.post("/:id/reject", authenticate, requireAdmin, rejectPayment);

router.get("/:id", authenticate, getPayment);

export default router;
