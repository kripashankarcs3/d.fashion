import { Router } from "express";
import upload from "../middleware/upload";
import { uploadImage } from "../controllers/analyze.controller";

const router = Router();

router.post("/upload", upload.single("image"), uploadImage);

export default router;