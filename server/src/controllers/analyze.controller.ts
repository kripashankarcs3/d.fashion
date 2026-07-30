import { Request, Response, NextFunction } from "express";
import { sendSuccess, sendError } from "../utils/response";
import { ImageService } from "../services/image.service";
import RecommendationService from "../services/recommendation.service";

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let originalImage = "";
  let optimizedImage = "";

  try {
    console.log("========== Upload Request ==========");
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("File:", req.file);
    console.log("Body:", req.body);

    if (!req.file) {
      return sendError(res, "No image uploaded", 400);
    }

    const image = ImageService.processImage(req.file);
    originalImage = image.path;

    optimizedImage = await ImageService.optimizeImage(image.path);

    // Temporary analysis (replace with YouCam later)
    const skinAnalysis = {
      skinTone: "Medium",
      skinType: "Combination",
      acne: 15,
      wrinkles: 8,
      darkSpots: 5,
    };

    const colorAnalysis = {
      season: "Autumn",
      undertone: "Warm",
      recommendedColors: [
        "#8B4513",
        "#D2691E",
        "#556B2F",
        "#B8860B",
      ],
    };

    const recommendations =
      RecommendationService.generateRecommendations({
        enhancedImage: optimizedImage,
        skinAnalysis,
        colorAnalysis,
      });

    return sendSuccess(res, "Analysis completed successfully", {
      enhancedImage: optimizedImage,
      skinAnalysis,
      colorAnalysis,
      recommendations,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    next(err);
  } finally {
    if (originalImage) ImageService.deleteImage(originalImage);
    if (optimizedImage) ImageService.deleteImage(optimizedImage);
  }
};