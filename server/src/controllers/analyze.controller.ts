import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { sendSuccess, sendError } from "../utils/response";
import { ImageService, extractSkinToneLocally } from "../services/image.service";
import RecommendationService from "../services/recommendation.service";
import YouCamService from "../services/youcam.service";
import {
  deriveSeason,
  deriveSeasonConfidence,
  deriveUndertone,
  getSeasonProfile,
  lipColorName,
} from "../utils/colourAnalysis";
import { healthScoresFromOutput, skinConcernsFromScores } from "../utils/skinScores";

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
    // Provenance — surfaced to the client so estimated values are never
    // presented as real AI analysis.
    const sources = {
      skinAnalysis: "youcam" as "youcam" | "estimated",
      colorTones: "youcam" as "youcam" | "local-extraction",
    };
    if (skinRes.status === "fulfilled") {
      youcamResult = skinRes.value;
    } else {
      sources.skinAnalysis = "estimated";
      const detail = (skinRes.reason as any)?.response?.data
        ? JSON.stringify((skinRes.reason as any).response.data)
        : (skinRes.reason as Error).message;
      console.warn("YouCam skin analysis failed, using local fallback:", detail);
    }

    // Local skin analysis fallback — derive concern estimates from the image
    // when YouCam skin-analysis credits are unavailable.
    let localSkinData: { skinToneHex: string; luma: number } | null = null;
    if (!youcamResult) {
      localSkinData = await extractSkinToneLocally(originalImage);
    }

    const output = youcamResult?.data?.results?.output || [];

    // YouCam scores are health (higher = healthier); the report shows concern
    // severity, so every score is inverted. Metrics YouCam did not return fall
    // back to estimates from the photo's luminance.
    const skinConcerns = skinConcernsFromScores(
      healthScoresFromOutput(output),
      localSkinData?.luma ?? null,
    );

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
    } else {
      sources.colorTones = "local-extraction";
      if (toneRes.status === "rejected") {
        const detail = (toneRes.reason as any)?.response?.data
          ? JSON.stringify((toneRes.reason as any).response.data)
          : (toneRes.reason as Error).message;
        console.warn("YouCam color tones failed, using local extraction:", detail);
      }
      // Local fallback: extract skin tone directly from the uploaded image
      const local = await extractSkinToneLocally(originalImage);
      color = { skin_color: local.skinToneHex };
      console.log(`Local skin tone extracted: ${local.skinToneHex} (luma: ${Math.round(local.luma)})`);
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
      features: {
        skinHex: skinToneHex,
        hairColor: (color as any).hair_color_name ?? undefined,
        eyeColor: (color as any).eye_color_name ?? undefined,
      },
    });

    return sendSuccess(res, "Analysis completed successfully", {
      enhancedImageUrl,
      skinConcerns,
      sources,
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
