import { describe, expect, it } from "vitest";
import {
  colourName,
  deriveSeason,
  deriveUndertone,
  getSeasonProfile,
  lipColorName,
} from "../src/utils/colourAnalysis";

describe("deriveSeason", () => {
  it("maps warm -> Warm Autumn, cool -> Cool Winter, neutral -> Soft Summer", () => {
    expect(deriveSeason("warm")).toBe("Warm Autumn");
    expect(deriveSeason("cool")).toBe("Cool Winter");
    expect(deriveSeason("neutral")).toBe("Soft Summer");
  });
});

describe("deriveUndertone", () => {
  it("detects warm skin (R >> B)", () => {
    expect(deriveUndertone("#C99B6A")).toBe("warm");
  });

  it("detects cool skin (B >= R)", () => {
    expect(deriveUndertone("#8FB4D4")).toBe("cool");
  });

  it("detects neutral skin (balanced R/B)", () => {
    expect(deriveUndertone("#C0BAB4")).toBe("neutral");
  });

  it("handles fair and dark complexions fairly via scaling", () => {
    expect(deriveUndertone("#8A5A3B")).toBe("warm");
    expect(deriveUndertone("#F1D5C0")).toBe("warm");
  });

  it("falls back to neutral on invalid input", () => {
    expect(deriveUndertone("not-a-colour")).toBe("neutral");
    expect(deriveUndertone("")).toBe("neutral");
  });
});

describe("getSeasonProfile", () => {
  it("returns the requested season profile", () => {
    const profile = getSeasonProfile("Cool Winter");
    expect(profile.season).toBe("Cool Winter");
    expect(profile.palette.length).toBeGreaterThan(0);
    expect(profile.avoid.length).toBeGreaterThan(0);
    expect(profile.neutrals.length).toBeGreaterThan(0);
    expect(profile.archetypes.length).toBe(3);
  });

  it("derives a profile from undertone when season is missing", () => {
    expect(getSeasonProfile(undefined, "cool").season).toBe("Cool Winter");
  });

  it("falls back to Warm Autumn for unknown seasons", () => {
    expect(getSeasonProfile("Mystery Season").season).toBe("Warm Autumn");
  });
});

describe("colourName", () => {
  it("maps known palette hexes to friendly names", () => {
    expect(colourName("#B8860B")).toBe("goldenrod");
    expect(colourName("#1F4ED8")).toBe("electric blue");
    expect(colourName("#C9A2A4")).toBe("dusty rose");
  });

  it("is case-insensitive", () => {
    expect(colourName("#B8860B")).toBe(colourName("#b8860b"));
  });

  it("returns the raw hex for unknown colours", () => {
    expect(colourName("#123456")).toBe("#123456");
  });
});

describe("lipColorName", () => {
  it("classifies very light shades as nude", () => {
    expect(lipColorName("#F7F8FB")).toBe("nude");
  });

  it("classifies deep shades as berry", () => {
    expect(lipColorName("#5A1030")).toBe("berry");
  });
});
