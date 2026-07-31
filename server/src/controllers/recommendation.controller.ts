import { Request, Response } from "express";
import RecommendationService from "../services/recommendation.service";
import { asyncHandler } from "../utils/asyncHandler";

export const recommendProducts = asyncHandler(async (req: Request, res: Response) => {
  const { skinType, skinTone } = req.body;

  const products = await RecommendationService.recommendProducts(skinType, skinTone);

  res.status(200).json({ success: true, count: products.length, products });
});
