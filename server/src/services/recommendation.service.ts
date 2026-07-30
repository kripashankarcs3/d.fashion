import Product from "../models/product.model";
import { AnalysisResult } from "../types/analysis.types";

class RecommendationService {

  // ================= AI Recommendation Logic =================

  generateRecommendations(
    analysis: Omit<AnalysisResult, "recommendations">
  ) {
    const { skinAnalysis, colorAnalysis } = analysis;

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

    let makeupShades =
      colorAnalysis.undertone === "Warm"
        ? ["Peach", "Coral", "Warm Nude"]
        : ["Rose Pink", "Berry", "Cool Nude"];

    let hairOptions =
      colorAnalysis.season === "Autumn"
        ? ["Dark Brown", "Chestnut Brown", "Copper Brown"]
        : ["Natural Black", "Ash Brown"];

    return {
      outfitPalette: colorAnalysis.recommendedColors,
      makeupShades,
      hairOptions,
      skincareRoutine,
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
    });
  }
}

export default new RecommendationService();