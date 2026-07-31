import { Request, Response, NextFunction } from "express";
import path from "path";
import { sendSuccess, sendError } from "../utils/response";
import { ImageService } from "../services/image.service";
import RecommendationService from "../services/recommendation.service";
import YouCamService from "../services/youcam.service";
import {
  deriveSeason,
  deriveUndertone,
  getSeasonProfile,
  lipColorName,
} from "../utils/colourAnalysis";

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  let originalImage = "";
  let optimizedImage = "";
  let enhancedImage = "";

  try {
    if (!req.file) {
      return sendError(res, "No image uploaded", 400);
    }

    const image = ImageService.processImage(req.file);
    originalImage = image.path;

    // ── 1. AI Photo Enhance (real YouCam, with local fallback) ──
    let enhancedImageUrl = "";
    try {
      const remoteUrl = await YouCamService.enhancePhoto(originalImage, 1);
      if (remoteUrl) {
        enhancedImage = await ImageService.saveRemoteImage(remoteUrl, "enhanced");
        enhancedImageUrl = `/uploads/${path.basename(enhancedImage)}`;
      }
    } catch (err: any) {
      console.warn("YouCam photo enhance failed, using local optimization:", err?.message);
    }

    if (!enhancedImageUrl) {
      optimizedImage = await ImageService.optimizeImage(originalImage);
      enhancedImageUrl = `/uploads/${path.basename(optimizedImage)}`;
    }

    // ── 2. AI Skin Analysis (real YouCam) ──
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

    // ui_score is 0-1 "healthier is higher"; a concern is the inverse for
    // positive metrics (moisture/firmness/radiance) and direct for negative ones.
    const concernOf = (key: string, fallback: number) => {
      const s = scoreMap[key];
      return typeof s === "number" ? clamp(s) : fallback;
    };
    const inverseOf = (key: string, fallback: number) => {
      const s = scoreMap[key];
      return typeof s === "number" ? clamp(1 - s) : fallback;
    };

    const rednessScore = scoreMap.redness;
    const radianceScore = scoreMap.radiance;

    const skinConcerns: Record<string, number> = {
      acne: concernOf("acne", 0.15),
      darkSpots: concernOf("age_spot", concernOf("dark_spot", 0.05)),
      wrinkles: concernOf("wrinkle", 0.08),
      pores: concernOf("pore", 0.3),
      oiliness: concernOf("oiliness", 0.4),
      dryness: inverseOf("moisture", 0.2),
      redness: concernOf("redness", 0.1),
      eyeBags: concernOf("eye_bag", 0.2),
      darkCircles: concernOf("dark_circle", 0.3),
      uneven: typeof radianceScore === "number" ? clamp(1 - radianceScore) : concernOf("dullness", 0.25),
      sensitivity:
        typeof rednessScore === "number"
          ? clamp(rednessScore * 0.8)
          : concernOf("sensitivity", 0.15),
      texture: concernOf("texture", 0.3),
      firmness: inverseOf("firmness", 0.3),
      radiance: typeof radianceScore === "number" ? clamp(1 - radianceScore) : 0.4,
    };

    const skinTypeItem = output.find((i: any) => i.type === "skin_type");
    const skinType =
      (typeof youcamResult?.data?.results?.skin_type === "string" &&
        youcamResult.data.results.skin_type) ||
      (typeof skinTypeItem?.skin_type === "string" && skinTypeItem.skin_type) ||
      (typeof skinTypeItem?.value === "string" && skinTypeItem.value) ||
      "Combination";

    // ── 3. AI Facial Color Tones Analyzer (real YouCam) ──
    let color = {};
    try {
      const toneResult = await YouCamService.analyzeColorTones(originalImage);
      if (toneResult?.color) {
        color = toneResult.color;
      }
    } catch (err: any) {
      const detail = err?.response?.data ? JSON.stringify(err.response.data) : err.message;
      console.warn("YouCam color tones analysis failed, using fallback:", detail);
    }

    const skinToneHex = (color as any).skin_color ?? "#D2A679";
    const undertone = deriveUndertone(skinToneHex);
    const season = deriveSeason(undertone);
    const seasonProfile = getSeasonProfile(season, undertone);

    const colorProfile = {
      undertone: undertone as "warm" | "cool" | "neutral",
      skinToneHex,
      eyeColor: (color as any).eye_color_name ?? "brown",
      lipColor: (color as any).lip_color ? lipColorName((color as any).lip_color) : "rose",
      hairColor: (color as any).hair_color_name ?? "brown",
    };

    // ── 4. Recommendations built from the real analysis ──
    const recommendations = RecommendationService.generateRecommendations({
      enhancedImage: enhancedImage || optimizedImage || originalImage,
      skinAnalysis: {
        skinTone: skinToneHex,
        skinType,
        acne: Math.round(skinConcerns.acne * 100),
        wrinkles: Math.round(skinConcerns.wrinkles * 100),
        darkSpots: Math.round(skinConcerns.darkSpots * 100),
      },
      colorAnalysis: {
        season,
        undertone,
        recommendedColors: seasonProfile.palette,
      },
    });

    return sendSuccess(res, "Analysis completed successfully", {
      enhancedImageUrl,
      skinConcerns,
      colorProfile,
      colourSeason: season,
      bestNeutrals: seasonProfile.neutrals,
      styleArchetypes: seasonProfile.archetypes,
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
