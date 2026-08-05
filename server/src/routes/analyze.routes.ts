import { Router } from "express";
import upload from "../middleware/upload";
import { uploadImage } from "../controllers/analyze.controller";
import { authenticate } from "../middleware/auth.middleware";
import { aiHeavyLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/upload", authenticate, aiHeavyLimiter, upload.single("image"), uploadImage);

export default router;