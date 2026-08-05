import { Router } from "express";
import { z } from "zod";
import { generateStylistReplyAI, StylistContext } from "../services/stylist.service";
import { authenticate } from "../middleware/auth.middleware";
import { chatLimiter } from "../middleware/rateLimiter";

const router = Router();

const bodySchema = z.object({
  message: z.string().trim().min(1).max(1000),
  context: z
    .object({
      analysisResult: z.any().optional(),
      wardrobeItems: z
        .array(
          z.object({
            name: z.string().max(120).optional(),
            category: z.string().max(60).optional(),
            palette: z.array(z.string().max(9)).max(12).optional(),
          })
        )
        .max(50)
        .optional(),
    })
    .optional(),
});

router.post("/", authenticate, chatLimiter, async (req, res) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "Invalid chat request" });
    return;
  }

  const reply = await generateStylistReplyAI(
    parsed.data.message,
    parsed.data.context as StylistContext | undefined
  );
  res.json({ success: true, reply });
});

export default router;
