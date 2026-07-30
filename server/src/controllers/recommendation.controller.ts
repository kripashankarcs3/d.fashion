import { Request, Response } from "express";
import RecommendationService from "../services/recommendation.service";

export const recommendProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { skinType, skinTone } = req.body;

    const products =
      await RecommendationService.recommendProducts(
        skinType,
        skinTone
      );

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get recommendations",
    });
  }
};