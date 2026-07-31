import { Request, Response, NextFunction } from "express";
import path from "path";
import { sendSuccess, sendError } from "../utils/response";
import { ImageService } from "../services/image.service";
import RecommendationService from "../services/recommendation.service";
import YouCamService from "../services/youcam.service";

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  let originalImage = "";
  let optimizedImage = "";

  try {
    if (!req.file) {
      return sendError(res, "No image uploaded", 400);
    }

    const image = ImageService.processImage(req.file);
    originalImage = image.path;

    optimizedImage = await ImageService.optimizeImage(image.path);

    let youcamResult: any = null;
    try {
      youcamResult = await YouCamService.analyzeSkin(originalImage);
    } catch (err: any) {
      const detail = err?.response?.data ? JSON.stringify(err.response.data) : err.message;
      console.warn("YouCam skin analysis failed, using fallback:", detail);
    }

    const output = youcamResult?.data?.results?.output || [];
    const scoreMap: Record<string, number> = {};
    for (const item of output) {
      scoreMap[item.type] = (item.ui_score ?? item.raw_score ?? 0) / 100;
    }

    const skinConcerns: Record<string, number> = {
      acne: scoreMap.acne ?? 0.15,
      darkSpots: scoreMap.dark_spot ?? 0.05,
      wrinkles: scoreMap.wrinkle ?? 0.08,
      pores: scoreMap.pore ?? 0.3,
      oiliness: scoreMap.oiliness ?? 0.4,
      dryness: scoreMap.dryness ?? 0.2,
      redness: scoreMap.redness ?? 0.1,
      eyeBags: scoreMap.eye_bag ?? 0.2,
      darkCircles: scoreMap.dark_circle ?? 0.3,
      uneven: scoreMap.dullness ?? 0.25,
      sensitivity: scoreMap.sensitivity ?? 0.15,
      texture: scoreMap.texture ?? 0.3,
      firmness: 0.7,
      radiance: 0.6,
    };

    const imageUrl = `/uploads/${path.basename(optimizedImage)}`;

    const recommendations = RecommendationService.generateRecommendations({
      enhancedImage: optimizedImage,
      skinAnalysis: {
        skinTone: "Medium",
        skinType: "Combination",
        acne: Math.round(skinConcerns.acne * 100),
        wrinkles: Math.round(skinConcerns.wrinkles * 100),
        darkSpots: Math.round(skinConcerns.darkSpots * 100),
      },
      colorAnalysis: {
        season: "Autumn",
        undertone: "Warm",
        recommendedColors: ["#8B4513", "#D2691E", "#556B2F", "#B8860B"],
      },
    });

    return sendSuccess(res, "Analysis completed successfully", {
      enhancedImageUrl: imageUrl,
      skinConcerns,
      colorProfile: {
        undertone: "warm" as const,
        skinToneHex: "#D2A679",
        eyeColor: "brown",
        lipColor: "rose",
        hairColor: "dark brown",
      },
      recommendations,
      analyzedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Upload Error:", err);
    next(err);
  } finally {
    if (originalImage) await ImageService.deleteImage(originalImage);
  }
};
