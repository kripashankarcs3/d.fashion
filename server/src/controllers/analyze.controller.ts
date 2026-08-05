import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { sendSuccess, sendError } from "../utils/response";
import { ImageService } from "../services/image.service";
import RecommendationService from "../services/recommendation.service";
import YouCamService from "../services/youcam.service";
import {
  deriveSeason,
  deriveSeasonConfidence,
  deriveUndertone,
  getSeasonProfile,
  lipColorName,
} from "../utils/colourAnalysis";

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  let originalImage = "";
  let optimizedImage = "";
  let enhancedImage = "";
  // Tracks the enhanced-image path so the catch block can unlink it even
  // before it has been assigned to `enhancedImage`.
  let enhancedImagePath: string | null = null;

  try {
    if (!req.file) {
      return sendError(res, "No image uploaded", 400);
    }

    const image = ImageService.processImage(req.file);
    originalImage = image.path;

    // ── 1–3. Run the three independent YouCam pipelines in parallel.
    //         They only need originalImage, so a sequential await here triples
    //         worst-case latency for no benefit. Each stage degrades to a
    //         local fallback on its own. ──
    const [enhanceRes, skinRes, toneRes] = await Promise.allSettled([
      YouCamService.enhancePhoto(originalImage, 1),
      YouCamService.analyzeSkin(originalImage),
      YouCamService.analyzeColorTones(originalImage),
    ]);

    let enhancedImageUrl = "";
    const enhanceOk = enhanceRes.status === "fulfilled" && enhanceRes.value;
    if (enhanceOk) {
      try {
        enhancedImage = await ImageService.saveRemoteImage(enhanceRes.value, "enhanced");
        enhancedImagePath = enhancedImage;
        enhancedImageUrl = `/uploads/${path.basename(enhancedImage)}`;
      } catch (err: any) {
        console.warn("YouCam photo enhance failed, using local optimization:", err?.message);
      }
    }

    if (!enhancedImageUrl) {
      optimizedImage = await ImageService.optimizeImage(originalImage);
      enhancedImageUrl = `/uploads/${path.basename(optimizedImage)}`;
    }

    let youcamResult: any = null;
    if (skinRes.status === "fulfilled") {
      youcamResult = skinRes.value;
    } else {
      const detail = (skinRes.reason as any)?.response?.data
        ? JSON.stringify((skinRes.reason as any).response.data)
        : (skinRes.reason as Error).message;
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

    let color = {};
    if (toneRes.status === "fulfilled" && toneRes.value?.color) {
      color = toneRes.value.color;
    } else if (toneRes.status === "rejected") {
      const detail = (toneRes.reason as any)?.response?.data
        ? JSON.stringify((toneRes.reason as any).response.data)
        : (toneRes.reason as Error).message;
      console.warn("YouCam color tones analysis failed, using fallback:", detail);
    }

    const skinToneHex = (color as any).skin_color ?? "#D2A679";
    const undertone = deriveUndertone(skinToneHex);
    const season = deriveSeason(undertone, {
      skinHex: skinToneHex,
      hairColor: (color as any).hair_color_name ?? undefined,
      eyeColor: (color as any).eye_color_name ?? undefined,
    });
    const seasonConfidence = deriveSeasonConfidence(skinToneHex, undertone);
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
      seasonConfidence,
      bestNeutrals: seasonProfile.neutrals,
      styleArchetypes: seasonProfile.archetypes,
      recommendations,
      analyzedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Upload Error:", err);
    // Unlink the enhanced file immediately on the error path rather than
    // waiting for the 24h sweeper. Use fire-and-forget fs.unlink so that
    // a missing file (ENOENT) or any other I/O error never masks the
    // original failure.
    if (enhancedImagePath) {
      fs.unlink(enhancedImagePath, () => {});
    }
    // If the analysis partially succeeded, the enhanced/optimized copy must
    // not survive until the 24h sweeper — unlink it on the error path.
    const cleanup = [enhancedImage, optimizedImage]
      .filter(Boolean)
      .map((p) => ImageService.deleteImage(p as string).catch(() => undefined));
    await Promise.all(cleanup);
    next(err);
  } finally {
    if (originalImage) await ImageService.deleteImage(originalImage);
  }
};
