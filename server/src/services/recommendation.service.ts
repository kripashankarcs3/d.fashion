import Product from "../models/product.model";
import { AnalysisResult } from "../types/analysis.types";
import { getSeasonProfile } from "../utils/colourAnalysis";

class RecommendationService {

  // ================= AI Recommendation Logic =================

  generateRecommendations(
    analysis: Omit<AnalysisResult, "recommendations">
  ) {
    const { skinAnalysis, colorAnalysis } = analysis;
    const undertone = colorAnalysis.undertone;
    const seasonProfile = getSeasonProfile(colorAnalysis.season, undertone as "warm" | "cool" | "neutral");

    let skincareRoutine = [
      "Gentle Cleanser",
      "Moisturizer",
      "Sunscreen SPF 50",
    ];

    if (skinAnalysis.acne > 10) {
      skincareRoutine.push("Salicylic Acid Serum");
    }

    if (skinAnalysis.darkSpots > 5) {
      skincareRoutine.push("Vitamin C Serum");
    }

    if (skinAnalysis.wrinkles > 10) {
      skincareRoutine.push("Retinol Serum");
    }

    const makeupByUndertone: Record<string, { foundation: string; blush: string; lip: string }> = {
      warm: { foundation: "#C99B6A", blush: "#E8A0B4", lip: "#C97B84" },
      cool: { foundation: "#D4A89C", blush: "#E58BA6", lip: "#B23A5B" },
      neutral: { foundation: "#CDA27E", blush: "#DE9AA6", lip: "#B9686B" },
    };

    const hairBySeason: Record<string, string[]> = {
      "Warm Autumn": ["Dark Brown", "Chestnut Brown", "Copper Brown"],
      "Cool Winter": ["Natural Black", "Ash Brown", "Cool Espresso"],
      "Soft Summer": ["Ash Brown", "Mushroom Blonde", "Soft Cool Brown"],
    };

    const toneWord =
      undertone === "warm"
        ? "warm golden undertone"
        : undertone === "cool"
          ? "cool, rosy undertone"
          : "balanced, neutral undertone";

    const styleBySeason: Record<string, string> = {
      "Warm Autumn":
        "Your warm golden undertone pairs beautifully with earth tones and gold accents — bronze, olive, and terracotta bring out your glow.",
      "Cool Winter":
        "Your cool undertone is intensified by jewel tones and silver accents — royal blue, magenta, and crisp white make you shine.",
      "Soft Summer":
        "Your neutral-cool undertone suits muted, blended tones — dusty rose, powder blue, and grey sage flatter you without overpowering.",
    };

    return {
      outfitPalette: colorAnalysis.recommendedColors,
      avoidColors: seasonProfile.avoid,
      makeupShades: {
        foundation: makeupByUndertone[undertone]?.foundation ?? makeupByUndertone.warm.foundation,
        blush: makeupByUndertone[undertone]?.blush ?? makeupByUndertone.warm.blush,
        lip: makeupByUndertone[undertone]?.lip ?? makeupByUndertone.warm.lip,
      },
      hairColorOptions: hairBySeason[colorAnalysis.season] ?? hairBySeason["Warm Autumn"],
      skincareRoutine: skincareRoutine.map((product, i) => ({
        step: i + 1,
        product,
        reason: "Recommended based on your skin analysis",
      })),
      styleInsight: styleBySeason[colorAnalysis.season] ??
        `Your ${toneWord} sits harmoniously with your personal palette.`,
    };
  }

  // ================= MongoDB Product Recommendation =================

  async recommendProducts(
    skinType: string,
    skinTone: string
  ) {
    return Product.find({
      skinType: { $in: [skinType] },
      skinTone: { $in: [skinTone] },
    }).limit(50);
  }
}

export default new RecommendationService();
