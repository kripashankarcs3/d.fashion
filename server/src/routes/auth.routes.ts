import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authLimiter } from "../middleware/rateLimiter";
import { isAdminRequest } from "../middleware/requireAdmin";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

router.get(
  "/profile",
  authenticate,
  (req, res) => {
    const user = (req as any).user as
      | { id?: string; email?: string; emailVerified?: boolean; provider?: string }
      | undefined;
    res.json({
      success: true,
      message: "Protected Route Accessed",
      // Same rule the API enforces, so the UI never offers an admin surface
      // whose every request would then 403.
      user: { ...user, role: isAdminRequest(user) ? "admin" : "user" },
    });
  }
);

export default router;