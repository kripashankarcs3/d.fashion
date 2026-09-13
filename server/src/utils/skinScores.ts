/**
 * Converts YouCam skin-analysis scores into the report's concern severities.
 *
 * YouCam scores every metric 1–100 where a HIGHER score means HEALTHIER skin.
 * The report shows how pronounced each concern is (higher = more of it), so
 * every provider score is inverted. Metrics the provider did not return fall
 * back to an estimate from the photo's luminance.
 */

export interface SkinConcernScores {
  acne: number;
  darkSpots: number;
  wrinkles: number;
  pores: number;
  oiliness: number;
  dryness: number;
  redness: number;
  eyeBags: number;
  darkCircles: number;
  uneven: number;
  sensitivity: number;
  texture: number;
  firmness: number;
  radiance: number;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Luminance-based estimates for when no provider score exists. Lighter skin
 * tends to read more redness and sensitivity; deeper skin more dark spots and
 * uneven tone. `luma` is 0–255, or null when no local sample was taken.
 */
export function estimatedSkinConcerns(luma: number | null): SkinConcernScores {
  const deep = luma === null ? 0.5 : (255 - luma) / 255;
  const light = luma === null ? 0.5 : luma / 255;
  return {
    acne: 0.1 + light * 0.15,
    darkSpots: 0.05 + deep * 0.2,
    wrinkles: 0.05 + deep * 0.12,
    pores: 0.2 + deep * 0.15,
    oiliness: 0.25 + light * 0.2,
    dryness: 0.15 + deep * 0.15,
    redness: 0.08 + light * 0.12,
    eyeBags: 0.12 + deep * 0.12,
    darkCircles: 0.15 + deep * 0.2,
    uneven: 0.15 + deep * 0.15,
    sensitivity: 0.1 + light * 0.1,
    texture: 0.2 + deep * 0.15,
    firmness: 0.2 + deep * 0.15,
    radiance: 0.25 + deep * 0.2,
  };
}

/**
 * YouCam's `output` array as metric type → 0–1 health score. Entries without a
 * numeric score (such as `resize_image`) are skipped rather than read as 0.
 */
export function healthScoresFromOutput(output: unknown): Record<string, number> {
  const scores: Record<string, number> = {};
  if (!Array.isArray(output)) return scores;
  for (const item of output) {
    const score = item?.ui_score ?? item?.raw_score;
    if (typeof item?.type === "string" && typeof score === "number") {
      scores[item.type] = clamp01(score / 100);
    }
  }
  return scores;
}

export function skinConcernsFromScores(
  health: Record<string, number>,
  luma: number | null,
): SkinConcernScores {
  const estimate = estimatedSkinConcerns(luma);
  const severity = (keys: string[], fallback: number) => {
    for (const key of keys) {
      if (typeof health[key] === "number") return clamp01(1 - health[key]);
    }
    return fallback;
  };

  const redness = severity(["redness"], estimate.redness);

  return {
    acne: severity(["acne"], estimate.acne),
    darkSpots: severity(["age_spot"], estimate.darkSpots),
    wrinkles: severity(["wrinkle"], estimate.wrinkles),
    pores: severity(["pore"], estimate.pores),
    oiliness: severity(["oiliness"], estimate.oiliness),
    dryness: severity(["moisture"], estimate.dryness),
    redness,
    eyeBags: severity(["eye_bag"], estimate.eyeBags),
    darkCircles: severity(["dark_circle_v2", "dark_circle"], estimate.darkCircles),
    uneven: severity(["radiance"], estimate.uneven),
    sensitivity: typeof health.redness === "number" ? clamp01(redness * 0.8) : estimate.sensitivity,
    texture: severity(["texture"], estimate.texture),
    firmness: severity(["firmness"], estimate.firmness),
    radiance: severity(["radiance"], estimate.radiance),
  };
}
