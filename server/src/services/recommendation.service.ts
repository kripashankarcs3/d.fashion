import { AnalysisResult } from "../types/analysis.types";
import {
  contrastLevel,
  getSeasonProfile,
  hairLightness,
  hexToHsl,
  hslToHex,
  valueDepth,
} from "../utils/colourAnalysis";
import { SKINCARE_BASE, SKINCARE_TRIGGERS } from "../config/recommendations";

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

/** Extra feature inputs the controller already extracts, passed through so
 *  hair/insight computation uses the user's real colouring, not defaults. */
export interface AnalysisFeatures {
  skinHex?: string;
  hairColor?: string;
  eyeColor?: string;
}

/** Descriptor for a computed shade — hex the client renders directly, plus a
 *  human-readable name derived from the same HSL numbers (not a lookup table). */
interface ShadeSuggestion {
  hex: string;
  name: string;
}

/** Foundation: the user's actual skin tone, slightly neutralised so it
 *  blends rather than oxidises — exact-depth by construction. */
function computeFoundation(skinHex: string): ShadeSuggestion {
  const hsl = hexToHsl(skinHex);
  if (!hsl) return { hex: skinHex, name: "your skin tone" };

  const sat = hsl.s * 0.85;
  const light = clamp(hsl.l * 0.97);
  const hex = hslToHex(hsl.h, sat, light);
  return { hex, name: foundationName(light, hsl.s) };
}

/** Blush: a palette hue tuned to the user's skin depth — deeper skin takes a
 *  richer, more saturated blush; fairer skin a softer one. */
function computeBlush(palette: string[], skinLight: number | null): ShadeSuggestion {
  const base = pickPaletteHue(palette, [350, 15]);
  const hsl = hexToHsl(base) ?? { h: 5, s: 0.5, l: 0.6 };
  const depthScale = skinLight === null ? 0.5 : clamp(skinLight);
  const sat = clamp(hsl.s * (0.72 + 0.55 * (1 - depthScale)));
  const light = clamp(0.35 + 0.32 * depthScale);
  return { hex: hslToHex(hsl.h, sat, light), name: blushName(hsl.h) };
}

/** Lip: a deeper, more saturated variant of a palette hue, depth-scaled. */
function computeLip(palette: string[], skinLight: number | null): ShadeSuggestion {
  const base = pickPaletteHue(palette, [350, 10]);
  const hsl = hexToHsl(base) ?? { h: 355, s: 0.6, l: 0.45 };
  const depthScale = skinLight === null ? 0.5 : clamp(skinLight);
  const sat = clamp(hsl.s * (0.8 + 0.4 * (1 - depthScale)));
  const light = clamp(0.24 + 0.3 * depthScale);
  return { hex: hslToHex(hsl.h, sat, light), name: lipName(hsl.h, light) };
}

/** Find the palette colour closest to the given hue anchors. Falls back to
 *  the first palette colour when nothing is near. */
function pickPaletteHue(palette: string[], hueAnchors: number[]): string {
  const candidates = palette
    .map((hex) => {
      const hsl = hexToHsl(hex);
      return hsl ? { hex, hsl } : null;
    })
    .filter((c): c is { hex: string; hsl: { h: number; s: number; l: number } } => c !== null);

  if (candidates.length === 0) return palette[0];

  let best = candidates[0];
  let bestScore = Infinity;
  for (const c of candidates) {
    const dist = Math.min(...hueAnchors.map((a) => hueDistance(c.hsl.h, a)));
    // Pale neutrals in a palette don't make a meaningful blush/lip —
    // push them behind any reasonably saturated colour.
    const penalty = c.hsl.s < 0.25 ? 40 : 0;
    if (dist + penalty < bestScore) {
      bestScore = dist + penalty;
      best = c;
    }
  }
  return best.hex;
}

function hueDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function foundationName(light: number, sat: number): string {
  const t = sat > 0.5 ? "golden " : "";
  if (light < 0.25) return `${t}deep`;
  if (light < 0.4) return `${t}rich`;
  if (light < 0.55) return `${t}medium`;
  if (light < 0.7) return `${t}light`;
  return `${t}fair`;
}

function blushName(hue: number): string {
  if (hue >= 330 || hue <= 15) return "rose";
  if (hue <= 45) return "peachy coral";
  if (hue <= 70) return "warm apricot";
  return "soft pink";
}

function lipName(hue: number, light: number): string {
  if (light < 0.3) return "berry";
  if (hue >= 340 || hue <= 20) return "rosewood";
  if (hue <= 45) return "terracotta rose";
  return "mauve rose";
}

/**
 * Hair colour options derived from the user's natural hair level + the
 * season's temperature direction — three depths of the same tone family.
 */
function computeHairOptions(hairColor: string | undefined, season: string): string[] {
  const warmSeason = /Spring|Autumn/.test(season);
  const direction = warmSeason ? "Golden" : "Ash";
  const baseLevel = hairLightness(hairColor);

  const levels: number[] =
    baseLevel === null
      ? [0.3, 0.4, 0.5]
      : [clamp(baseLevel - 0.1, 0.1, 0.8), clamp(baseLevel, 0.1, 0.8), clamp(baseLevel + 0.1, 0.1, 0.8)];

  const used = new Set<string>();
  return levels.map((lvl) => {
    // Depth band + the season's temperature direction at every level —
    // a deep-haired cool season still gets ash-toned suggestions.
    const depth =
      lvl < 0.2 ? "Black-Brown" :
      lvl < 0.35 ? "Chestnut" :
      lvl < 0.5 ? "Brown" :
      lvl < 0.65 ? "Light Brown" :
      "Blonde";
    const base = `${direction} ${depth}`;
    let name = base;
    // Ensure the three options stay distinct even after level rounding.
    let i = 2;
    while (used.has(name)) {
      name = `${base} ${"I".repeat(i)}`;
      i += 1;
    }
    used.add(name);
    return name;
  });
}

/** Reason text that references the user's actual score for the trigger.
 *  Scores arrive from the controller as 0–100 integers. */
function skincareReason(key: string, score: number): string {
  const pct = Math.round(score);
  const label = key === "acne" ? "acne" : key === "darkSpots" ? "dark-spot" : "wrinkle";
  return `Your ${label} reading is ${pct}% — this step targets it directly.`;
}

/** styleInsight composed from the same computed features deriveSeason uses. */
function composeStyleInsight(
  season: string,
  features: AnalysisFeatures,
  toneWord: string,
): string {
  const value = valueDepth(features);
  const chroma = contrastLevel(features);
  const skinHsl = features.skinHex ? hexToHsl(features.skinHex) : null;

  const depthPhrase =
    value === "deep" ? "deep, rich colouring" :
    value === "light" ? "light, delicate colouring" : "balanced medium colouring";
  const chromaPhrase =
    chroma === "bright" ? "high-contrast" :
    chroma === "soft" ? "softly muted, blended" : "clear, true";

  const hueBias =
    skinHsl === null ? "" :
    skinHsl.h >= 45 ? "Your warmth leans golden. " :
    skinHsl.h < 15 ? "Your warmth leans red. " : "";

  const warm = /Spring|Autumn/.test(season);
  const deep = /Deep|Winter/.test(season) || season === "Warm Autumn" || season === "Deep Autumn";
  const bright = /Bright/.test(season);
  const paletteLead = warm
    ? deep
      ? "Deep, saturated warm tones anchor your best looks."
      : bright
        ? "Vivid, clear warm colour brings you to life."
        : "Light-to-medium warm tones keep you glowing."
    : deep
      ? "Deep, saturated cool tones anchor your best looks."
      : bright
        ? "Crisp, high-contrast cool colour sharpens your features."
        : "Soft, cool tones keep you fresh and refined.";

  return `As a ${season}, you have ${depthPhrase} with a ${chromaPhrase} quality and a ${toneWord}. ${hueBias}${paletteLead}`;
}

class RecommendationService {
  // ================= Computed Recommendation Logic =================

  generateRecommendations(
    analysis: Omit<AnalysisResult, "recommendations"> & { features?: AnalysisFeatures },
  ) {
    const { skinAnalysis, colorAnalysis, features } = analysis;
    const undertone = colorAnalysis.undertone;
    const seasonProfile = getSeasonProfile(
      colorAnalysis.season,
      undertone as "warm" | "cool" | "neutral",
    );

    const skinHex = skinAnalysis.skinTone;
    const skinHsl = hexToHsl(skinHex);
    const skinLight = skinHsl ? skinHsl.l : null;

    const foundation = computeFoundation(skinHex);
    const blush = computeBlush(seasonProfile.palette, skinLight);
    const lip = computeLip(seasonProfile.palette, skinLight);

    const routine: { product: string; reason: string }[] = SKINCARE_BASE.map(
      (product) => ({
        product,
        reason: "The foundation of every routine — suitable for all skin.",
      }),
    );
    const scores = skinAnalysis as unknown as Record<string, number | undefined>;
    for (const trigger of SKINCARE_TRIGGERS) {
      const value = scores[trigger.key] ?? 0;
      // Scores are 0–100 integers (see analyze.controller) — thresholds too.
      if (value > trigger.threshold) {
        routine.push({
          product: trigger.product,
          reason: skincareReason(trigger.key, value),
        });
      }
    }

    const toneWord =
      undertone === "warm"
        ? "warm golden undertone"
        : undertone === "cool"
          ? "cool, rosy undertone"
          : "balanced, neutral undertone";

    return {
      outfitPalette: colorAnalysis.recommendedColors,
      avoidColors: seasonProfile.avoid,
      makeupShades: {
        foundation: foundation.hex,
        blush: blush.hex,
        lip: lip.hex,
      },
      makeupShadeNames: {
        foundation: foundation.name,
        blush: blush.name,
        lip: lip.name,
      },
      hairColorOptions: computeHairOptions(features?.hairColor, colorAnalysis.season),
      skincareRoutine: routine.map((item, i) => ({ step: i + 1, ...item })),
      styleInsight: composeStyleInsight(
        colorAnalysis.season,
        features ?? {},
        toneWord,
      ),
    };
  }
}

export default new RecommendationService();
