import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendError } from "../utils/response";
import NewsletterSubscriber from "../models/newsletter.model";

const router = Router();

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  source: z.string().trim().max(40).optional(),
});

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, "A valid email address is required", 400);
      return;
    }

    const { email, source } = parsed.data;

    // Idempotent: subscribing twice is a no-op, never a duplicate error.
    await NewsletterSubscriber.updateOne(
      { email },
      { $setOnInsert: { email, source: source ?? "footer" } },
      { upsert: true }
    );

    sendSuccess(res, "Subscribed successfully", null, 201);
  })
);

export default router;
