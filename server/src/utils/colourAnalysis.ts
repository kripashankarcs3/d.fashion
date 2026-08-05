export type Undertone = "warm" | "cool" | "neutral";

export interface SeasonProfile {
  season: string;
  palette: string[];
  neutrals: string[];
  avoid: string[];
  archetypes: { title: string; description: string }[];
}

export interface SeasonFeatures {
  skinHex?: string;
  hairColor?: string;
  eyeColor?: string;
}

const SEASON_PROFILES: Record<string, SeasonProfile> = {
  "Light Spring": {
    season: "Light Spring",
    palette: [
      "#FFD9C0", "#FFB347", "#F7D06E", "#8FD3C7", "#FF8C7A",
      "#F7A8B8", "#C89F7A", "#FDF3E0", "#C0D9A0", "#A9D6C1",
    ],
    neutrals: ["#FDF3E0", "#E8D5B8", "#C89F7A", "#B09A84", "#D9A86C"],
    avoid: ["#1A1A1A", "#1B2A4A", "#3A3F44", "#722F37"],
    archetypes: [
      {
        title: "The Fresh Romantic",
        description:
          "Airy fabrics, delicate prints, and warm pastels bring out your brightness. You read as soft yet luminous.",
      },
      {
        title: "The Sunlit Minimalist",
        description:
          "Light, warm neutrals and clean lines let your golden freshness carry the look.",
      },
      {
        title: "The Cottage Classic",
        description:
          "Peach, butter, and soft aqua suit you — relaxed tailoring in light warm tones.",
      },
    ],
  },
  "True Warm Spring": {
    season: "True Warm Spring",
    palette: [
      "#F6C667", "#FF7F50", "#FF6347", "#2EB8A8", "#9CC25C",
      "#F58FB8", "#B5845C", "#FBF0DC", "#78C8E8", "#7FD4C0",
    ],
    neutrals: ["#FBF0DC", "#E0C9A8", "#B5845C", "#B8AA9E", "#4A2E1F"],
    avoid: ["#1A1A1A", "#1B2A4A", "#FFFFFF", "#808080"],
    archetypes: [
      {
        title: "The Radiant Classic",
        description:
          "Warm, clear colours give you a healthy glow. Structured pieces in coral and golden tones look effortlessly polished.",
      },
      {
        title: "The Warm Tailor",
        description:
          "Sharp silhouettes in warm earth tones. Your energy suits confident, clean dressing.",
      },
      {
        title: "The Sunny Icon",
        description:
          "You carry clear warm colour like no one else — turquoise, coral, and butter yellow are your power shades.",
      },
    ],
  },
  "Bright Spring": {
    season: "Bright Spring",
    palette: [
      "#FF7A00", "#FFD400", "#FF4D9D", "#00A86B", "#00C8C8",
      "#FF6B57", "#7B3FA0", "#66D6E8", "#FFF7E6", "#B6D94C",
    ],
    neutrals: ["#FFF7E6", "#E5E0D8", "#B8A99A", "#8B5A2B", "#4A2E1F"],
    avoid: ["#6E1423", "#6B6B4A", "#C9A2A4", "#3A3F44"],
    archetypes: [
      {
        title: "The Vibrant Minimalist",
        description:
          "High-contrast warm colour with clean lines. You bring drama without ever feeling heavy.",
      },
      {
        title: "The Bold Classic",
        description:
          "Electric shades and crisp whites sharpen your features. One vivid piece is all you need.",
      },
      {
        title: "The Playful Tailor",
        description:
          "You pair saturated colour with clean structure — the rare combination of playful and precise.",
      },
    ],
  },
  "Light Summer": {
    season: "Light Summer",
    palette: [
      "#A8C8E8", "#E3B7C6", "#C4B7D9", "#A8D8D0", "#A9B8C8",
      "#E8A0B4", "#B5D8C0", "#F2E8C6", "#B79AAC", "#F7F6F2",
    ],
    neutrals: ["#F7F6F2", "#D8D6D2", "#C4B8A8", "#7A8B9A", "#8A8A90"],
    avoid: ["#1A1A1A", "#FF7A00", "#FFD400", "#6E1423"],
    archetypes: [
      {
        title: "The Airy Romantic",
        description:
          "Cool, gentle pastels mirror your natural softness. You look best in light fabrics and delicate colours.",
      },
      {
        title: "The Quiet Minimalist",
        description:
          "Soft cool neutrals with clean lines. Your palette is whisper-quiet and deeply flattering.",
      },
      {
        title: "The Cool Elegant",
        description:
          "Powder blue, rose, and lavender suit you. Understated tailoring reads effortlessly refined.",
      },
    ],
  },
  "True Cool Summer": {
    season: "True Cool Summer",
    palette: [
      "#E58BA6", "#A99AD1", "#8FB4D4", "#C2185B", "#5FA9A5",
      "#7D5B8C", "#9AA3AE", "#6C7A94", "#9FD4C8", "#F0C4CE",
    ],
    neutrals: ["#F7F6F2", "#C9CDD4", "#6C7A94", "#8A8A90", "#4A4E55"],
    avoid: ["#FF7A00", "#B8860B", "#6B6B4A", "#B7410E"],
    archetypes: [
      {
        title: "The Cool Classic",
        description:
          "Rose, lavender, and powder blue keep you looking fresh. Timeless pieces in cool tones are your strength.",
      },
      {
        title: "The Refined Minimalist",
        description:
          "Muted cool shades with clean structure. You favour quiet, precise dressing.",
      },
      {
        title: "The Soft Modernist",
        description:
          "You balance cool clarity with gentleness — raspberry and dusty blue make you glow.",
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
  "Soft Autumn": {
    season: "Soft Autumn",
    palette: [
      "#C98A6B", "#6B6B4A", "#B89968", "#C9A29A", "#6E7A50",
      "#A08C7A", "#C7A84B", "#7A5540", "#6B7D6B", "#F2E8D5",
    ],
    neutrals: ["#F2E8D5", "#D8C3A5", "#A08C7A", "#B0A89C", "#4A3326"],
    avoid: ["#1A1A1A", "#FFFFFF", "#1F4ED8", "#FF4D9D"],
    archetypes: [
      {
        title: "The Earthy Romantic",
        description:
          "Muted warm tones blend softly with your skin. Natural fabrics in olive, camel, and terracotta are made for you.",
      },
      {
        title: "The Quiet Craftsman",
        description:
          "You favour texture over noise — moss, taupe, and muted gold in relaxed, quality pieces.",
      },
      {
        title: "The Warm Minimalist",
        description:
          "Muted warm neutrals with simple lines. Your palette does the talking, quietly.",
      },
    ],
  },
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
  "Deep Autumn": {
    season: "Deep Autumn",
    palette: [
      "#4A5D23", "#4A2A17", "#C95A2B", "#7A3B2E", "#2F5D5A",
      "#8C6B2F", "#3B2318", "#9E3B1F", "#2F4F2F", "#6B3A5A",
    ],
    neutrals: ["#3B2318", "#4A2A17", "#4A5D23", "#3A322A", "#2A241F"],
    avoid: ["#A8C8E8", "#8FD3C7", "#FF4D9D", "#C9CDD4"],
    archetypes: [
      {
        title: "The Rich Classic",
        description:
          "Deep, warm colour anchors you. Chocolate, forest, and bronze in structured pieces are unmistakably yours.",
      },
      {
        title: "The Dramatic Earth",
        description:
          "You carry darkness with warmth — espresso and deep rust give you presence without harshness.",
      },
      {
        title: "The Timeless Romantic",
        description:
          "Rich jewel-warm tones in luxurious fabrics. Your palette feels both vintage and modern.",
      },
    ],
  },
  "Deep Winter": {
    season: "Deep Winter",
    palette: [
      "#1A1A1A", "#0E1B3A", "#00594C", "#6E1423", "#4A2E8A",
      "#00565C", "#2A2D34", "#8E2A6B", "#4A235A", "#1B2A55",
    ],
    neutrals: ["#1A1A1A", "#0E1B3A", "#2A2D34", "#3A3F44", "#232936"],
    avoid: ["#F2E8D5", "#C89F7A", "#D8C3A5", "#C7A84B"],
    archetypes: [
      {
        title: "The Dark Icon",
        description:
          "Deep, saturated colour with sharp tailoring. You are at your most magnetic in black and jewel tones.",
      },
      {
        title: "The Modern Classic",
        description:
          "Navy, emerald, and burgundy suit your depth. Clean, deliberate silhouettes are your language.",
      },
      {
        title: "The Bold Minimalist",
        description:
          "You need no colour noise — deep tones and precise structure carry your look completely.",
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
  "Bright Winter": {
    season: "Bright Winter",
    palette: [
      "#FFFFFF", "#000000", "#1E3FBF", "#FF2E9A", "#0A5CD8",
      "#C8102E", "#009B6B", "#D40078", "#A8D8F0", "#5E2EC0",
    ],
    neutrals: ["#FFFFFF", "#000000", "#3A3F44", "#9AA3AE", "#6E727A"],
    avoid: ["#C89F7A", "#6B6B4A", "#7A5540", "#D8C3A5"],
    archetypes: [
      {
        title: "The Electric Classic",
        description:
          "Pure white, black, and electric colour create your signature contrast. You make a statement by walking in.",
      },
      {
        title: "The High-Contrast Minimalist",
        description:
          "Sharp, graphic dressing suits you. Hot pink against black, royal blue against white — flawless.",
      },
      {
        title: "The Bold Modernist",
        description:
          "You carry saturated colour with clarity and confidence. Your energy is unmistakable.",
      },
    ],
  },
};

export function deriveSeason(undertone: Undertone, features?: SeasonFeatures): string {
  const hasFeatures = Boolean(
    features?.skinHex || features?.hairColor || features?.eyeColor
  );
  if (!hasFeatures) {
    if (undertone === "warm") return "Warm Autumn";
    if (undertone === "cool") return "Cool Winter";
    return "Soft Summer";
  }

  const family: "warm" | "cool" =
    undertone === "neutral" ? neutralFamily(features) : undertone;

  const value = valueDepth(features);
  const chroma = contrastLevel(features);
  const skinL = skinLightness(features);

  if (family === "warm") {
    if (value === "deep") return "Deep Autumn";
    if (value === "light") return chroma === "bright" ? "Bright Spring" : "Light Spring";
    if (chroma === "soft") return "Soft Autumn";
    if (chroma === "bright") return "Bright Spring";
    if (typeof skinL === "number" && skinL > 0.5) return "True Warm Spring";
    return "Warm Autumn";
  }

  if (value === "deep") return chroma === "bright" ? "Bright Winter" : "Deep Winter";
  if (value === "light") return "Light Summer";
  if (chroma === "soft") return "Soft Summer";
  if (chroma === "bright") return "Bright Winter";
  if (typeof skinL === "number" && skinL > 0.5) return "True Cool Summer";
  return "Cool Winter";
}

function neutralFamily(features?: SeasonFeatures): "warm" | "cool" {
  const l = skinLightness(features);
  if (typeof l === "number") {
    if (l < 0.45) return "warm";
    if (l > 0.6) return "cool";
  }

  const hair = (features?.hairColor ?? "").toLowerCase();
  if (/(black|blue|ash|grey|gray|platinum|burgundy)/.test(hair)) return "cool";
  if (/(red|copper|golden|auburn|strawberry|blonde)/.test(hair)) return "warm";

  return "cool";
}

const HAIR_LIGHTNESS: Record<string, number> = {
  "dark brown": 0.22, "dark blonde": 0.55, "light brown": 0.45, "light blonde": 0.7,
  "golden blonde": 0.6, "strawberry blonde": 0.55, "dark chestnut": 0.24,
  black: 0.1, brown: 0.34, chestnut: 0.3, blonde: 0.62, platinum: 0.78,
  red: 0.35, auburn: 0.32, burgundy: 0.28, grey: 0.75, gray: 0.75, white: 0.85,
};

const EYE_LIGHTNESS: Record<string, number> = {
  black: 0.1, "dark brown": 0.18, "light brown": 0.3,
  brown: 0.22, hazel: 0.3, amber: 0.28, green: 0.35,
  blue: 0.42, "light blue": 0.5, grey: 0.5, gray: 0.5, dark: 0.15,
};

function hairLightness(hair?: string): number | null {
  if (!hair) return null;
  const key = hair.trim().toLowerCase();
  const names = Object.keys(HAIR_LIGHTNESS).sort((a, b) => b.length - a.length);
  for (const name of names) {
    if (key.includes(name)) return HAIR_LIGHTNESS[name];
  }
  return null;
}

function eyeLightness(eye?: string): number | null {
  if (!eye) return null;
  const key = eye.trim().toLowerCase();
  const names = Object.keys(EYE_LIGHTNESS).sort((a, b) => b.length - a.length);
  for (const name of names) {
    if (key.includes(name)) return EYE_LIGHTNESS[name];
  }
  return null;
}

function skinLightness(features?: SeasonFeatures): number | null {
  if (!features?.skinHex) return null;
  const hsl = hexToHsl(features.skinHex);
  return hsl ? hsl.l : null;
}

type ValueLevel = "light" | "medium" | "deep";

function valueDepth(features?: SeasonFeatures): ValueLevel {
  const sample = [hairLightness(features?.hairColor), skinLightness(features)].filter(
    (v): v is number => typeof v === "number"
  );
  if (sample.length === 0) return "medium";
  const avg = sample.reduce((a, b) => a + b, 0) / sample.length;
  if (avg < 0.28) return "deep";
  if (avg > 0.58) return "light";
  return "medium";
}

function contrastLevel(features?: SeasonFeatures): "soft" | "true" | "bright" {
  const skin = skinLightness(features);
  const hair = hairLightness(features?.hairColor);
  const eye = eyeLightness(features?.eyeColor);

  let values: number[];
  if (typeof skin === "number" && typeof hair === "number") {
    values = [skin, hair];
  } else if (typeof skin === "number" && typeof eye === "number") {
    values = [skin, eye];
  } else {
    return "true";
  }

  const spread = Math.max(...values) - Math.min(...values);
  if (spread > 0.5) return "bright";
  if (spread < 0.3) return "soft";
  return "true";
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

/**
 * How far the undertone ratio sits from the ±0.07 classification threshold.
 * Barely past the threshold reads ~50%, a decisive warm/cool signal ~99%;
 * a "neutral" reading is honest about having no strong signal (50–72%).
 */
export function deriveSeasonConfidence(skinHex: string, undertone: Undertone): number {
  const rgb = hexToRgb(skinHex);
  if (!rgb) return 55;

  const delta = rgb.r - rgb.b;
  const scale = Math.max(rgb.r, rgb.b, 1);
  const ratio = delta / scale;
  const abs = Math.abs(ratio);

  if (undertone === "neutral") {
    return Math.round(Math.min(72, Math.max(50, 50 + (0.07 - abs) * 300)));
  }
  return Math.round(Math.min(99, Math.max(50, 50 + (abs - 0.07) * 100)));
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
  // Light Spring
  "#FFD9C0": "peach", "#FFB347": "apricot", "#F7D06E": "butter yellow",
  "#8FD3C7": "soft turquoise", "#FF8C7A": "light coral", "#F7A8B8": "warm pink",
  "#C89F7A": "light caramel", "#FDF3E0": "ivory", "#C0D9A0": "light olive",
  "#A9D6C1": "mint", "#E8D5B8": "warm sand", "#B09A84": "warm taupe",
  "#D9A86C": "honey", "#722F37": "burgundy",
  // True Warm Spring
  "#F6C667": "golden yellow", "#FF7F50": "coral", "#FF6347": "tomato",
  "#2EB8A8": "turquoise", "#9CC25C": "light green", "#F58FB8": "coral pink",
  "#B5845C": "golden brown", "#FBF0DC": "warm cream", "#78C8E8": "sky blue",
  "#7FD4C0": "light aqua", "#E0C9A8": "light tan", "#B8AA9E": "warm grey",
  "#FFFFFF": "pure white", "#808080": "pure grey",
  // Bright Spring
  "#FF7A00": "vivid orange", "#FFD400": "bright yellow", "#FF4D9D": "hot pink",
  "#00A86B": "emerald", "#00C8C8": "bright turquoise", "#FF6B57": "coral orange",
  "#7B3FA0": "royal purple", "#66D6E8": "light aqua blue", "#FFF7E6": "warm white",
  "#B6D94C": "lime", "#E5E0D8": "light grey", "#B8A99A": "taupe stone",
  "#8B5A2B": "medium brown", "#6E1423": "wine",
  // Light Summer
  "#A8C8E8": "baby blue", "#E3B7C6": "dusty pink", "#C4B7D9": "powder lavender",
  "#A8D8D0": "soft aqua", "#A9B8C8": "light grey blue", "#B5D8C0": "cool mint",
  "#F2E8C6": "pale yellow", "#B79AAC": "light plum", "#F7F6F2": "cool white",
  "#D8D6D2": "light grey", "#C4B8A8": "cool beige", "#7A8B9A": "slate",
  "#8A8A90": "mid grey",
  // True Cool Summer
  "#A99AD1": "lavender", "#8FB4D4": "soft blue", "#C2185B": "raspberry",
  "#5FA9A5": "soft teal", "#7D5B8C": "plum", "#9FD4C8": "pale aqua",
  "#F0C4CE": "icy rose", "#4A4E55": "deep grey",
  // Soft Autumn
  "#C98A6B": "muted terracotta", "#6B6B4A": "muted olive", "#B89968": "camel tan",
  "#C9A29A": "dusty rose tan", "#6E7A50": "moss green", "#A08C7A": "taupe",
  "#C7A84B": "muted gold", "#7A5540": "warm brown", "#6B7D6B": "slate teal",
  "#F2E8D5": "warm cream", "#D8C3A5": "beige", "#B0A89C": "soft grey",
  "#4A3326": "deep brown",
  // Deep Autumn
  "#4A5D23": "deep olive", "#4A2A17": "dark chocolate", "#C95A2B": "burnt orange",
  "#7A3B2E": "mahogany", "#2F5D5A": "deep teal", "#8C6B2F": "bronze",
  "#9E3B1F": "deep rust", "#6B3A5A": "warm plum", "#3A322A": "charcoal brown",
  "#2A241F": "black-brown",
  // Deep Winter
  "#0E1B3A": "deep navy", "#00594C": "emerald", "#4A2E8A": "royal purple",
  "#00565C": "deep teal", "#2A2D34": "dark charcoal", "#8E2A6B": "dark magenta",
  "#4A235A": "deep plum", "#1B2A55": "black-blue", "#232936": "deep slate",
  // Bright Winter
  "#1E3FBF": "royal blue", "#FF2E9A": "hot pink", "#0A5CD8": "electric blue",
  "#C8102E": "crimson", "#009B6B": "emerald", "#D40078": "magenta",
  "#A8D8F0": "icy blue", "#5E2EC0": "purple", "#6E727A": "mid grey",
};

export function colourName(hex: string): string {
  const key = hex.toLowerCase();
  return COLOUR_NAMES_NORMALIZED[key] ?? hex;
}

const COLOUR_NAMES_NORMALIZED: Record<string, string> = Object.fromEntries(
  Object.entries(COLOUR_NAMES).map(([hex, name]) => [hex.toLowerCase(), name]),
);
