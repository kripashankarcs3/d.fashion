import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

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