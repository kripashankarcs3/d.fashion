import { describe, it, expect } from "vitest";
import {
  hexToOklab,
  oklabDistance,
  distanceToPalette,
} from "../src/utils/colour";
import RecommendationService from "../src/services/recommendation.service";
import { getSeasonInfoDTO, getAllSeasonsDTO } from "../src/data/seasons";
import { getGarments } from "../src/services/garment.service";
import { getSeasonProfile } from "../src/utils/colourAnalysis";

describe("OKLab colour math", () => {
  it("maps identical hexes to zero distance", () => {
    const a = hexToOklab("#C19A6B")!;
    const b = hexToOklab("#C19A6B")!;
    expect(oklabDistance(a, b)).toBe(0);
  });

  it("returns null for invalid hexes", () => {
    expect(hexToOklab("nope")).toBeNull();
    expect(hexToOklab("#12")).toBeNull();
  });

  it("black is farther from white than two near-neutrals are", () => {
    const black = hexToOklab("#000000")!;
    const white = hexToOklab("#FFFFFF")!;
    const grey1 = hexToOklab("#808080")!;
    const grey2 = hexToOklab("#828282")!;
    expect(oklabDistance(black, white)).toBeGreaterThan(
      oklabDistance(grey1, grey2),
    );
  });

  it("distanceToPalette is zero for a palette member", () => {
    const palette = ["#C19A6B", "#B7410E"];
    expect(distanceToPalette("#C19A6B", palette)).toBe(0);
    expect(distanceToPalette("#B7410E", palette)).toBe(0);
  });

  it("distanceToPalette grows away from the palette", () => {
    const palette = ["#C19A6B"];
    const near = distanceToPalette("#C69B6B", palette);
    const far = distanceToPalette("#0011FF", palette);
    expect(far).toBeGreaterThan(near);
  });
});

describe("computed recommendation engine", () => {
  const baseAnalysis = {
    enhancedImage: "",
    skinAnalysis: { skinTone: "#8D5524", skinType: "Combination", acne: 40, wrinkles: 10, darkSpots: 32 },
    colorAnalysis: { season: "Warm Autumn", undertone: "warm", recommendedColors: getSeasonProfile("Warm Autumn").palette },
    features: { skinHex: "#8D5524", hairColor: "dark brown", eyeColor: "dark brown" },
  };

  it("keeps the base routine and adds serums only for flagged concerns", () => {
    const r = RecommendationService.generateRecommendations(baseAnalysis);
    const products = r.skincareRoutine.map((s) => s.product);
    // Base routine always present…
    expect(products).toContain("Gentle Cleanser");
    expect(products).toContain("Moisturizer");
    expect(products).toContain("Sunscreen SPF 50");
    // …acne 40 > 30 and darkSpots 32 > 25 trigger serums, wrinkles 10 < 30 doesn't.
    expect(products).toContain("Salicylic Acid Serum");
    expect(products).toContain("Vitamin C Serum");
    expect(products).not.toContain("Retinol Serum");
  });

  it("skips trigger steps below threshold", () => {
    const r = RecommendationService.generateRecommendations({
      ...baseAnalysis,
      skinAnalysis: { ...baseAnalysis.skinAnalysis, acne: 5, darkSpots: 2, wrinkles: 3 },
    });
    expect(r.skincareRoutine.find((s) => s.product === "Salicylic Acid Serum")).toBeUndefined();
    expect(r.skincareRoutine.find((s) => s.product === "Vitamin C Serum")).toBeUndefined();
    // Base routine remains.
    expect(r.skincareRoutine.length).toBe(3);
  });

  it("skincare reasons reference the actual score", () => {
    const r = RecommendationService.generateRecommendations(baseAnalysis);
    // acne 40 > threshold 30 → salicylic step present, reason cites "40%".
    const acneStep = r.skincareRoutine.find((s) => s.product === "Salicylic Acid Serum");
    expect(acneStep).toBeDefined();
    expect(acneStep!.reason).toContain("40%");
  });

  it("derives foundation from the user's actual skin depth", () => {
    const deep = RecommendationService.generateRecommendations(baseAnalysis);
    const fair = RecommendationService.generateRecommendations({
      ...baseAnalysis,
      skinAnalysis: { ...baseAnalysis.skinAnalysis, skinTone: "#F1C27D" },
      features: { skinHex: "#F1C27D", hairColor: "light blonde", eyeColor: "blue" },
    });
    // Different skin depths must produce different foundation hexes —
    // the old static table returned one of 3 fixed sets.
    expect(deep.makeupShades.foundation).not.toEqual(fair.makeupShades.foundation);
  });

  it("returns hex strings for all three makeup shades", () => {
    const r = RecommendationService.generateRecommendations(baseAnalysis);
    for (const hex of [r.makeupShades.foundation, r.makeupShades.blush, r.makeupShades.lip]) {
      expect(hex).toMatch(/^#[0-9A-F]{6}$/);
    }
  });

  it("makeup shade names are populated", () => {
    const r = RecommendationService.generateRecommendations(baseAnalysis);
    expect(r.makeupShadeNames!.foundation).toBeTruthy();
    expect(r.makeupShadeNames!.blush).toBeTruthy();
    expect(r.makeupShadeNames!.lip).toBeTruthy();
  });

  it("hair options derive from the user's natural hair + season direction", () => {
    const warm = RecommendationService.generateRecommendations(baseAnalysis);
    const cool = RecommendationService.generateRecommendations({
      ...baseAnalysis,
      colorAnalysis: { ...baseAnalysis.colorAnalysis, season: "Cool Winter", undertone: "cool" },
    });
    expect(warm.hairColorOptions).toHaveLength(3);
    expect(cool.hairColorOptions).toHaveLength(3);
    // Warm season → golden direction; cool season → ash.
    expect(warm.hairColorOptions.join(" ")).toMatch(/Golden|Chestnut|Brown/);
    expect(cool.hairColorOptions.join(" ")).toMatch(/Ash/);
    // Three distinct options.
    expect(new Set(warm.hairColorOptions).size).toBe(3);
  });

  it("includes avoid colours from the season profile", () => {
    const r = RecommendationService.generateRecommendations(baseAnalysis);
    expect(r.avoidColors.length).toBeGreaterThan(0);
  });

  it("passes through the recommended outfit palette", () => {
    const r = RecommendationService.generateRecommendations(baseAnalysis);
    expect(r.outfitPalette).toEqual(getSeasonProfile("Warm Autumn").palette);
  });

  it("styleInsight mentions the season (composed, not canned per-season table)", () => {
    const r = RecommendationService.generateRecommendations(baseAnalysis);
    expect(r.styleInsight).toContain("Warm Autumn");
  });
});

describe("season data (server single source)", () => {
  it("serves all 12 seasons", () => {
    const seasons = getAllSeasonsDTO();
    expect(seasons).toHaveLength(12);
    for (const s of seasons) {
      expect(s.palette.length).toBeGreaterThan(0);
      expect(s.neutrals.length).toBeGreaterThan(0);
      expect(s.avoid.length).toBeGreaterThan(0);
      expect(s.archetypes.length).toBeGreaterThan(0);
      expect(s.tagline).toBeTruthy();
      expect(s.description).toBeTruthy();
    }
  });

  it("palette items carry names and recommendations", () => {
    const info = getSeasonInfoDTO("Warm Autumn")!;
    for (const c of [...info.palette, ...info.neutrals, ...info.avoid]) {
      expect(c.hex).toMatch(/^#[0-9A-F]{6}$/i);
      expect(c.name).toBeTruthy();
      expect(c.recommendation).toBeTruthy();
    }
  });

  it("avoid texts are avoid-flavoured, not wardrobe advice", () => {
    const info = getSeasonInfoDTO("Bright Winter")!;
    for (const c of info.avoid) {
      expect(c.recommendation).not.toMatch(/blouses|dresses|outerwear|knitwear|trousers/i);
    }
  });

  it("returns null for unknown season", () => {
    expect(getSeasonInfoDTO("Not A Season")).toBeNull();
  });
});

describe("garment catalogue", () => {
  it("carries the full 571-item catalogue", () => {
    const garments = getGarments();
    expect(garments.length).toBe(571);
    // Every entry has the fields the UI and colour-matching need.
    for (const g of garments) {
      expect(g.id).toBeGreaterThan(0);
      expect(g.name).toBeTruthy();
      expect(g.category).toBeTruthy();
      expect(["Women", "Men"]).toContain(g.gender);
      expect(g.img).toMatch(/^https?:\/\//);
      expect(g.colourHex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(g.colourName).toBeTruthy();
    }
  });

  it("has no duplicate ids", () => {
    const garments = getGarments();
    expect(new Set(garments.map((g) => g.id)).size).toBe(garments.length);
  });

  it("most entries carry a working buyUrl", () => {
    const garments = getGarments();
    const withBuy = garments.filter((g) => g.buyUrl && /^https?:\/\//.test(g.buyUrl!));
    expect(withBuy.length).toBeGreaterThan(garments.length / 2);
  });
});
