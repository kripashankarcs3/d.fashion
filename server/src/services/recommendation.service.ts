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
      "Light Spring": ["Warm Blonde", "Light Golden Brown", "Honey Brown"],
      "True Warm Spring": ["Golden Brown", "Caramel Brown", "Warm Chestnut"],
      "Bright Spring": ["Copper Brown", "Warm Chestnut", "Rich Golden Brown"],
      "Light Summer": ["Ash Blonde", "Cool Mushroom Brown", "Soft Taupe"],
      "True Cool Summer": ["Cool Brown", "Ash Brown", "Mauve-Toned Brown"],
      "Soft Summer": ["Ash Brown", "Mushroom Blonde", "Soft Cool Brown"],
      "Soft Autumn": ["Mushroom Brown", "Warm Taupe", "Soft Chestnut"],
      "Warm Autumn": ["Dark Brown", "Chestnut Brown", "Copper Brown"],
      "Deep Autumn": ["Espresso", "Deep Chestnut", "Black-Brown"],
      "Deep Winter": ["Black", "Cool Espresso", "Deep Ash Brown"],
      "Cool Winter": ["Natural Black", "Ash Brown", "Cool Espresso"],
      "Bright Winter": ["Blue-Black", "Jet Black", "Cool Espresso"],
    };

    const toneWord =
      undertone === "warm"
        ? "warm golden undertone"
        : undertone === "cool"
          ? "cool, rosy undertone"
          : "balanced, neutral undertone";

    const styleBySeason: Record<string, string> = {
      "Light Spring":
        "Your light, warm freshness is amplified by airy, clear shades — peach, butter yellow, and soft turquoise bring you to life.",
      "True Warm Spring":
        "Your warm golden undertone pairs beautifully with clear warm colours — coral, golden yellow, and turquoise give you a healthy glow.",
      "Bright Spring":
        "Your bright, high-contrast warmth loves saturated colour — vivid orange, hot pink, and emerald sharpened by crisp warm white.",
      "Light Summer":
        "Your cool, gentle softness is flattered by powdery pastels — baby blue, dusty pink, and lavender in light, airy fabrics.",
      "True Cool Summer":
        "Your clear cool undertone shines in rose, raspberry, and soft blue — muted, refined shades that keep you fresh without going stark.",
      "Soft Summer":
        "Your neutral-cool undertone suits muted, blended tones — dusty rose, powder blue, and grey sage flatter you without overpowering.",
      "Soft Autumn":
        "Your muted warmth blends beautifully with earthy, softened tones — olive, camel, and terracotta in natural fabrics.",
      "Warm Autumn":
        "Your warm golden undertone pairs beautifully with earth tones and gold accents — bronze, olive, and terracotta bring out your glow.",
      "Deep Autumn":
        "Your rich warmth is anchored by deep, saturated earth tones — espresso, forest, and burnt orange give you undeniable presence.",
      "Deep Winter":
        "Your cool depth thrives in black and jewel tones — navy, emerald, and burgundy in sharp, structured silhouettes.",
      "Cool Winter":
        "Your cool undertone is intensified by jewel tones and silver accents — royal blue, magenta, and crisp white make you shine.",
      "Bright Winter":
        "Your high-contrast cool clarity loves pure white and black sharpened with electric colour — royal blue and hot pink are your power shades.",
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
