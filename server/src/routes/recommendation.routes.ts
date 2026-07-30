import { Router } from "express";
import { recommendProducts } from "../controllers/recommendation.controller";

const router = Router();

router.post("/", recommendProducts);

export default router;