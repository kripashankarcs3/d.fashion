import { describe, expect, it } from "vitest";
import recommendationService from "../src/services/recommendation.service";

const warmAnalysis = {
  enhancedImage: "data:image/jpeg;base64,xxx",
  skinAnalysis: { skinTone: "#C99B6A", skinType: "normal", acne: 15, wrinkles: 3, darkSpots: 8 },
  colorAnalysis: { season: "Warm Autumn", undertone: "warm", recommendedColors: ["#B8860B", "#8B4513"] },
};

const coolAnalysis = {
  enhancedImage: "data:image/jpeg;base64,xxx",
  skinAnalysis: { skinTone: "#D4A89C", skinType: "dry", acne: 2, wrinkles: 12, darkSpots: 2 },
  colorAnalysis: { season: "Cool Winter", undertone: "cool", recommendedColors: ["#1F4ED8"] },
};

describe("RecommendationService.generateRecommendations", () => {
  it("keeps the base routine and adds serums for flagged concerns", () => {
    const result = recommendationService.generateRecommendations(warmAnalysis);
    const products = result.skincareRoutine.map((s) => s.product);
    expect(products).toContain("Gentle Cleanser");
    expect(products).toContain("Salicylic Acid Serum");
    expect(products).toContain("Vitamin C Serum");
    expect(products).not.toContain("Retinol Serum");
  });

  it("adds retinol only when wrinkles are high", () => {
    const result = recommendationService.generateRecommendations(coolAnalysis);
    const products = result.skincareRoutine.map((s) => s.product);
    expect(products).toContain("Retinol Serum");
  });

  it("returns season-aware makeup and hair options", () => {
    const warm = recommendationService.generateRecommendations(warmAnalysis);
    expect(warm.makeupShades.foundation).toBe("#C99B6A");
    expect(warm.hairColorOptions).toContain("Copper Brown");

    const cool = recommendationService.generateRecommendations(coolAnalysis);
    expect(cool.makeupShades.foundation).toBe("#D4A89C");
    expect(cool.hairColorOptions).toContain("Ash Brown");
  });

  it("includes avoid colours from the season profile", () => {
    const result = recommendationService.generateRecommendations(warmAnalysis);
    expect(result.avoidColors.length).toBeGreaterThan(0);
  });

  it("passes through the recommended outfit palette", () => {
    const result = recommendationService.generateRecommendations(warmAnalysis);
    expect(result.outfitPalette).toEqual(["#B8860B", "#8B4513"]);
  });
});
