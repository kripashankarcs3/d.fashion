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

describe("deriveSeason (12-season engine)", () => {
  it("keeps legacy 3-season mapping when no features are provided", () => {
    expect(deriveSeason("warm")).toBe("Warm Autumn");
    expect(deriveSeason("cool")).toBe("Cool Winter");
    expect(deriveSeason("neutral")).toBe("Soft Summer");
  });

  it("derives Deep Autumn for warm undertone with deep skin", () => {
    expect(
      deriveSeason("warm", { skinHex: "#3B2318", hairColor: "Black", eyeColor: "Dark Brown" })
    ).toBe("Deep Autumn");
  });

  it("derives Light Spring for warm undertone with light skin and blonde hair", () => {
    expect(
      deriveSeason("warm", { skinHex: "#F1D5C0", hairColor: "Light Blonde", eyeColor: "Blue" })
    ).toBe("Light Spring");
  });

  it("derives Soft Autumn for warm undertone with muted contrast", () => {
    expect(
      deriveSeason("warm", { skinHex: "#A08C7A", hairColor: "Brown", eyeColor: "Hazel" })
    ).toBe("Soft Autumn");
  });

  it("derives Bright Winter for cool undertone with high contrast", () => {
    expect(
      deriveSeason("cool", { skinHex: "#F7F8FB", hairColor: "Black", eyeColor: "Blue" })
    ).toBe("Bright Winter");
  });

  it("derives Deep Winter for cool undertone with deep skin", () => {
    expect(
      deriveSeason("cool", { skinHex: "#2A241F", hairColor: "Black", eyeColor: "Black" })
    ).toBe("Deep Winter");
  });

  it("derives Light Summer for cool undertone with light skin and blonde hair", () => {
    expect(
      deriveSeason("cool", { skinHex: "#E8C9C0", hairColor: "Blonde", eyeColor: "Light Blue" })
    ).toBe("Light Summer");
  });

  it("resolves neutral undertone to warm family for deep skin", () => {
    expect(
      deriveSeason("neutral", { skinHex: "#4A2A17", hairColor: "Black", eyeColor: "Dark Brown" })
    ).toBe("Deep Autumn");
  });

  it("resolves neutral undertone to cool family for fair skin", () => {
    expect(
      deriveSeason("neutral", { skinHex: "#E8C9C0", hairColor: "Brown", eyeColor: "Blue" })
    ).toBe("Light Summer");
  });
});

describe("getSeasonProfile", () => {
  it("exposes all 12 season profiles", () => {
    const expected = [
      "Light Spring", "True Warm Spring", "Bright Spring",
      "Light Summer", "True Cool Summer", "Soft Summer",
      "Soft Autumn", "Warm Autumn", "Deep Autumn",
      "Deep Winter", "Cool Winter", "Bright Winter",
    ];
    for (const season of expected) {
      const profile = getSeasonProfile(season);
      expect(profile.season).toBe(season);
      expect(profile.palette.length).toBeGreaterThan(0);
    }
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
