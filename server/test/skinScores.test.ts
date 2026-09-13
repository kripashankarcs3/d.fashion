import { describe, expect, it } from "vitest";
import {
  estimatedSkinConcerns,
  healthScoresFromOutput,
  skinConcernsFromScores,
} from "../src/utils/skinScores";

describe("healthScoresFromOutput", () => {
  it("reads ui_score as a 0-1 health score and skips entries without one", () => {
    const scores = healthScoresFromOutput([
      { type: "acne", ui_score: 99, raw_score: 80 },
      { type: "pore", raw_score: 72 },
      { type: "resize_image" },
      { type: "all", score: 90 },
    ]);
    expect(scores).toEqual({ acne: 0.99, pore: 0.72 });
  });

  it("returns nothing for a missing or malformed output", () => {
    expect(healthScoresFromOutput(undefined)).toEqual({});
    expect(healthScoresFromOutput({ acne: 99 })).toEqual({});
  });
});

describe("skinConcernsFromScores", () => {
  it("inverts health scores into severities — clear skin is not a 99% concern", () => {
    const c = skinConcernsFromScores({ acne: 0.99, redness: 0.99, wrinkle: 0.82, pore: 0.72 }, null);
    expect(c.acne).toBeCloseTo(0.01);
    expect(c.redness).toBeCloseTo(0.01);
    expect(c.wrinkles).toBeCloseTo(0.18);
    expect(c.pores).toBeCloseTo(0.28);
  });

  it("maps every provider metric to its concern, including dark_circle_v2", () => {
    const c = skinConcernsFromScores(
      {
        age_spot: 0.6, oiliness: 0.7, moisture: 0.4, eye_bag: 0.9,
        dark_circle_v2: 0.35, radiance: 0.55, texture: 0.8, firmness: 0.65,
      },
      null,
    );
    expect(c.darkSpots).toBeCloseTo(0.4);
    expect(c.oiliness).toBeCloseTo(0.3);
    expect(c.dryness).toBeCloseTo(0.6);
    expect(c.eyeBags).toBeCloseTo(0.1);
    expect(c.darkCircles).toBeCloseTo(0.65);
    expect(c.radiance).toBeCloseTo(0.45);
    expect(c.uneven).toBeCloseTo(0.45);
    expect(c.texture).toBeCloseTo(0.2);
    expect(c.firmness).toBeCloseTo(0.35);
  });

  it("derives sensitivity from redness severity", () => {
    expect(skinConcernsFromScores({ redness: 0.5 }, null).sensitivity).toBeCloseTo(0.4);
  });

  it("falls back to luminance estimates for metrics the provider did not return", () => {
    const estimate = estimatedSkinConcerns(120);
    const c = skinConcernsFromScores({ acne: 0.9 }, 120);
    expect(c.acne).toBeCloseTo(0.1);
    expect(c.oiliness).toBe(estimate.oiliness);
    expect(c.darkCircles).toBe(estimate.darkCircles);
    expect(c.sensitivity).toBe(estimate.sensitivity);
  });

  it("keeps every severity within 0-1", () => {
    const c = skinConcernsFromScores({ acne: 1.2, pore: -0.3 }, 0);
    for (const value of Object.values(c)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });
});
