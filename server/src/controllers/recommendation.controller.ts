import { Request, Response } from "express";
import { z } from "zod";
import RecommendationService from "../services/recommendation.service";
import { asyncHandler } from "../utils/asyncHandler";

const bodySchema = z.object({
  skinType: z.string().trim().min(1).max(60),
  skinTone: z.string().trim().min(1).max(60),
});

export const recommendProducts = asyncHandler(async (req: Request, res: Response) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "Invalid recommendation request" });
    return;
  }

  const { skinType, skinTone } = parsed.data;

  const products = await RecommendationService.recommendProducts(skinType, skinTone);

  res.status(200).json({ success: true, count: products.length, products });
});
