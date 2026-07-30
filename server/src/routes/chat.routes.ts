import { Router } from "express";

const router = Router();

router.post("/", (_req, res) => {
  res.json({
    success: true,
    reply:
      "Hello! I'm your AI Beauty Assistant. Ask me anything about skincare, makeup or fashion.",
  });
});

export default router;