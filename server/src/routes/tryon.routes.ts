import { Router } from "express";
import {
  listTemplates,
  tryOnClothes,
  tryOnMakeup,
  tryOnHair,
} from "../controllers/tryon.controller";
import { authenticate } from "../middleware/auth.middleware";
import { aiLightLimiter } from "../middleware/rateLimiter";

const router = Router();

router.get("/templates/:feature", authenticate, aiLightLimiter, listTemplates);
router.post("/clothes", authenticate, aiLightLimiter, tryOnClothes);
router.post("/makeup", authenticate, aiLightLimiter, tryOnMakeup);
router.post("/hair", authenticate, aiLightLimiter, tryOnHair);

export default router;
