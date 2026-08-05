import { Router } from "express";
import { recommendProducts } from "../controllers/recommendation.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, recommendProducts);

export default router;