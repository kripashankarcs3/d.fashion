export type Undertone = "warm" | "cool" | "neutral";

export interface SeasonProfile {
  season: string;
  palette: string[];
  neutrals: string[];
  avoid: string[];
  archetypes: { title: string; description: string }[];
}

const SEASON_PROFILES: Record<string, SeasonProfile> = {
  "Warm Autumn": {
    season: "Warm Autumn",
    palette: [
      "#F3E7CF", "#C19A6B", "#C7953A", "#B8860B", "#B7410E",
      "#D2691E", "#8B4513", "#556B2F", "#2F4F2F", "#954535",
    ],
    neutrals: ["#F3E7CF", "#E2D0B4", "#C19A6B", "#4A2E1F", "#3B2318"],
    avoid: ["#F8FAFC", "#1B2A4A", "#C94A9C", "#4A4A4A"],
    archetypes: [
      {
        title: "The Classic",
        description:
          "A tailored, timeless presence. You look strongest in structured silhouettes and heritage colours.",
      },
      {
        title: "The Earthy Minimalist",
        description:
          "Natural fabrics, muted tones, and quiet luxury. Your palette does the talking.",
      },
      {
        title: "The Vintage Romantic",
        description:
          "Rust, ochre, and antique gold flatter you. You carry vintage-inspired pieces with ease.",
      },
    ],
  },
  "Cool Winter": {
    season: "Cool Winter",
    palette: [
      "#F7F8FB", "#B8D0E8", "#E8B4C8", "#2B3A8F", "#1F4ED8",
      "#C21B7E", "#A4161A", "#3A3F44", "#16213E", "#1A1A1A",
    ],
    neutrals: ["#F7F8FB", "#C9CDD4", "#9AA3AE", "#3A3F44", "#1A1A1A"],
    avoid: ["#556B2F", "#B7410E", "#B8860B", "#F5F0E8"],
    archetypes: [
      {
        title: "The Sharp Minimalist",
        description:
          "Clean lines, strong silhouettes, and decisive colours. You command a room before you speak.",
      },
      {
        title: "The Dramatic Icon",
        description:
          "High contrast suits you. Jewel tones and crisp tailoring are your native language.",
      },
      {
        title: "The Modern Classic",
        description:
          "Timeless pieces in sharp shades. You edit ruthlessly and wear little, perfectly.",
      },
    ],
  },
  "Soft Summer": {
    season: "Soft Summer",
    palette: [
      "#F4F1EA", "#C9A2A4", "#A78B9E", "#9DB6C9", "#6C7A94",
      "#8A8D7A", "#7D6678", "#6B6B6B", "#3F4A5A", "#33363C",
    ],
    neutrals: ["#F4F1EA", "#D6D5CE", "#A99E93", "#6C7A94", "#4A3B32"],
    avoid: ["#FF5E8A", "#1F4ED8", "#A3C02F", "#B8860B"],
    archetypes: [
      {
        title: "The Quiet Elegant",
        description:
          "Soft fabrics, muted tones, and understated tailoring. Your beauty is in the details.",
      },
      {
        title: "The Refined Romantic",
        description:
          "Dusty roses and powder blues flatter you. You favour delicate, feminine pieces.",
      },
      {
        title: "The Modern Minimalist",
        description:
          "A muted palette, clean shapes, and quality over quantity. Your restraint is your style.",
      },
    ],
  },
};

export function deriveSeason(undertone: Undertone): string {
  if (undertone === "warm") return "Warm Autumn";
  if (undertone === "cool") return "Cool Winter";
  return "Soft Summer";
}

export function getSeasonProfile(season?: string, undertone?: Undertone): SeasonProfile {
  const key = season ?? deriveSeason(undertone ?? "neutral");
  return SEASON_PROFILES[key] ?? SEASON_PROFILES["Warm Autumn"];
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const value = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return null;
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

/**
 * Derive a warm/cool/neutral undertone from a skin-tone hex.
 * Warm skin skews toward yellow/orange (R >> B), cool toward pink/blue (B >= R).
 * The delta is scaled by lightness so dark and fair complexions are treated fairly.
 */
export function deriveUndertone(skinHex: string): Undertone {
  const rgb = hexToRgb(skinHex);
  if (!rgb) return "neutral";

  const delta = rgb.r - rgb.b;
  const scale = Math.max(rgb.r, rgb.b, 1);
  const ratio = delta / scale;

  if (ratio > 0.07) return "warm";
  if (ratio < -0.07) return "cool";
  return "neutral";
}

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / d) % 6;
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    default:
      h = (r - g) / d + 4;
  }
  h = ((h * 60) % 360 + 360) % 360;
  return { h, s, l };
}

export function lipColorName(hex: string): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return "rose";
  const { h, s, l } = hsl;

  if (l > 0.82) return "nude";
  if (s < 0.22) return "mauve";
  if (l < 0.35) return "berry";
  if (h >= 340 || h <= 20) return "rose";
  if (h <= 45) return "nude";
  return "coral";
}

const COLOUR_NAMES: Record<string, string> = {
  "#F3E7CF": "warm ivory", "#C19A6B": "camel", "#C7953A": "golden ochre",
  "#B8860B": "goldenrod", "#B7410E": "rust", "#D2691E": "chocolate",
  "#8B4513": "saddle brown", "#556B2F": "olive", "#2F4F2F": "deep forest",
  "#954535": "chestnut", "#E2D0B4": "soft fawn", "#4A2E1F": "espresso",
  "#3B2318": "deep cocoa",
  "#F7F8FB": "cool white", "#B8D0E8": "powder blue", "#E8B4C8": "icy pink",
  "#2B3A8F": "royal blue", "#1F4ED8": "electric blue", "#C21B7E": "magenta",
  "#A4161A": "crimson", "#3A3F44": "charcoal", "#16213E": "navy",
  "#1A1A1A": "black ink", "#C9CDD4": "dove grey", "#9AA3AE": "silver",
  "#F4F1EA": "soft white", "#C9A2A4": "dusty rose", "#A78B9E": "mauve",
  "#9DB6C9": "powder blue", "#6C7A94": "slate blue", "#8A8D7A": "grey sage",
  "#7D6678": "dusty plum", "#6B6B6B": "stone grey", "#3F4A5A": "deep slate",
  "#33363C": "charcoal", "#D6D5CE": "dove grey", "#A99E93": "stone",
  "#4A3B32": "deep cocoa",
  "#F8FAFC": "ice white", "#1B2A4A": "navy", "#C94A9C": "fuchsia", "#4A4A4A": "charcoal",
  "#F5F0E8": "cream", "#FF5E8A": "neon pink", "#A3C02F": "bright lime",
  "#C99B6A": "warm sand", "#E8A0B4": "peachy pink", "#C97B84": "rosewood",
  "#D4A89C": "rosy sand", "#E58BA6": "cool rose", "#B23A5B": "berry",
  "#CDA27E": "neutral sand", "#DE9AA6": "mauve pink", "#B9686B": "dusty brick",
};

export function colourName(hex: string): string {
  const key = hex.toLowerCase();
  return COLOUR_NAMES_NORMALIZED[key] ?? hex;
}

const COLOUR_NAMES_NORMALIZED: Record<string, string> = Object.fromEntries(
  Object.entries(COLOUR_NAMES).map(([hex, name]) => [hex.toLowerCase(), name]),
);
