import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authLimiter } from "../middleware/rateLimiter";
import { isAdminEmail } from "../middleware/requireAdmin";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

router.get(
  "/profile",
  authenticate,
  (req, res) => {
    const user = (req as any).user as { id?: string; email?: string } | undefined;
    res.json({
      success: true,
      message: "Protected Route Accessed",
      user: { ...user, role: isAdminEmail(user?.email) ? "admin" : "user" },
    });
  }
);

export default router;