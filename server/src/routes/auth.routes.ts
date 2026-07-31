import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

router.get(
  "/profile",
  authenticate,
  (req, res) => {
    res.json({
      success: true,
      message: "Protected Route Accessed",
      user: (req as any).user,
    });
  }
);

export default router;