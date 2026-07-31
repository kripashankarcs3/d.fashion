import { Router } from "express";
import {
  listTemplates,
  tryOnClothes,
  tryOnMakeup,
  tryOnHair,
} from "../controllers/tryon.controller";

const router = Router();

router.get("/templates/:feature", listTemplates);
router.post("/clothes", tryOnClothes);
router.post("/makeup", tryOnMakeup);
router.post("/hair", tryOnHair);

export default router;
