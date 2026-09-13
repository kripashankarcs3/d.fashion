import { SEASON_PROFILES } from "../utils/colourAnalysis";

export interface ColourItemDTO {
  name: string;
  hex: string;
  recommendation: string;
}

export interface SeasonInfoDTO {
  season: string;
  tagline: string;
  description: string;
  palette: ColourItemDTO[];
  neutrals: ColourItemDTO[];
  avoid: ColourItemDTO[];
  archetypes: { title: string; description: string }[];
}

/**
 * Per-colour recommendation text, keyed by hex. Shared across seasons —
 * the same neutral reads the same way wherever it appears.
 */
const RECOMMENDATION_BY_HEX: Record<string, string> = {
  // Light Spring palette + neutrals
  "#FFD9C0": "Blouses and soft knitwear", "#FFB347": "Dresses and accents",
  "#F7D06E": "Light layering pieces", "#8FD3C7": "Statement accessories",
  "#FF8C7A": "Tops and scarves", "#F7A8B8": "Prints and linens",
  "#C89F7A": "Coats and bags", "#FDF3E0": "The base of your wardrobe",
  "#C0D9A0": "Casual outerwear", "#A9D6C1": "Everyday knitwear",
  "#E8D5B8": "Quiet, everyday layering", "#B09A84": "Tailoring",
  "#D9A86C": "Evening and autumn pieces",
  // Light Spring avoid
  "#1A1A1A": "Too heavy for your lightness", "#1B2A4A": "Dulls your fresh warmth",
  "#3A3F44": "Weighs down your glow", "#722F37": "Too deep for your palette",
  // True Warm Spring palette + neutrals
  "#F6C667": "Statement pieces", "#FF7F50": "Dresses and blouses",
  "#FF6347": "A bold accent colour", "#2EB8A8": "Statement outerwear",
  "#9CC25C": "Casual layers", "#F58FB8": "Prints and scarves",
  "#B5845C": "Coats and bags", "#FBF0DC": "The base of your wardrobe",
  "#78C8E8": "Light layering", "#7FD4C0": "Everyday knitwear",
  "#E0C9A8": "Quiet layering", "#B8AA9E": "Tailoring",
  // True Warm Spring avoid
  "#FFFFFF": "Too stark for your warm tone", "#808080": "Saps your glow",
  // Bright Spring palette + neutrals
  "#FF7A00": "Statement outerwear", "#FFD400": "Accent pieces",
  "#FF4D9D": "Dresses and blouses", "#00A86B": "Evening pieces",
  "#00C8C8": "Statement accessories", "#FF6B57": "Tops and scarves",
  "#7B3FA0": "A bold accent colour", "#66D6E8": "Light layering",
  "#FFF7E6": "The base of your wardrobe", "#B6D94C": "Casual statement pieces",
  "#E5E0D8": "Quiet layering", "#B8A99A": "Coats and bags",
  "#8B5A2B": "Tailoring and belts",
  // Bright Spring avoid
  "#6E1423": "Too heavy and muted for you", "#6B6B4A": "Dims your brightness",
  // Light Summer palette + neutrals
  "#A8C8E8": "Blouses and knitwear", "#E3B7C6": "Dresses and blouses",
  "#C4B7D9": "Light layering", "#A8D8D0": "Everyday knitwear",
  "#A9B8C8": "Tailoring", "#E8A0B4": "Scarves and accessories",
  "#B5D8C0": "Casual pieces", "#F2E8C6": "Light summer layers",
  "#B79AAC": "Evening pieces", "#F7F6F2": "The base of your wardrobe",
  "#D8D6D2": "Quiet layering", "#C4B8A8": "Coats and bags",
  "#7A8B9A": "Tailoring", "#8A8A90": "Everyday neutrals",
  // True Cool Summer palette + neutrals
  "#E58BA6": "Dresses and blouses", "#A99AD1": "Light layering",
  "#8FB4D4": "Blouses and knitwear", "#C2185B": "A bold accent colour",
  "#5FA9A5": "Evening pieces", "#7D5B8C": "Accessories",
  "#9AA3AE": "Metallic accents", "#6C7A94": "Tailoring",
  "#9FD4C8": "Everyday knitwear", "#F0C4CE": "Light layering",
  "#C9CDD4": "Quiet layering", "#4A4E55": "Winter pieces",
  // Soft Summer palette + neutrals
  "#F4F1EA": "Blouses and light knitwear", "#C9A2A4": "Dresses and blouses",
  "#A78B9E": "Accessories and scarves", "#9DB6C9": "Light layers",
  "#8A8D7A": "Casual outerwear", "#7D6678": "Evening pieces",
  "#6B6B6B": "Everyday neutrals", "#3F4A5A": "Trousers and skirts",
  "#33363C": "Winter essentials", "#D6D5CE": "Quiet layering",
  "#A99E93": "Coats and bags", "#4A3B32": "Evening and winter pieces",
  // Soft Summer avoid
  "#FF5E8A": "Too loud for your softness",
  "#A3C02F": "Fights your muted tone",
  // Soft Autumn palette + neutrals
  "#C98A6B": "Blouses and knitwear", "#B89968": "Coats and bags",
  "#C9A29A": "Dresses", "#6E7A50": "Trousers and skirts",
  "#A08C7A": "Everyday neutrals", "#C7A84B": "Statement accessories",
  "#7A5540": "Leather goods", "#6B7D6B": "Evening pieces",
  "#F2E8D5": "The base of your wardrobe", "#D8C3A5": "Quiet layering",
  "#B0A89C": "Tailoring", "#4A3326": "Winter pieces",
  // Warm Autumn palette + neutrals
  "#F3E7CF": "Crisp white tops and shirts", "#C19A6B": "Coats, knitwear, and tailoring",
  "#C7953A": "Statement accessories", "#B8860B": "Autumn layering pieces",
  "#B7410E": "A bold accent colour", "#D2691E": "Leather goods and bags",
  "#8B4513": "Everyday neutral dressing", "#556B2F": "Casual outerwear",
  "#2F4F2F": "Trousers and skirts", "#954535": "Blouses and dresses",
  "#E2D0B4": "Quiet, everyday layering", "#4A2E1F": "Tailoring and denim",
  "#3B2318": "Evening and winter pieces",
  // Warm Autumn avoid
  "#F8FAFC": "Too stark against your undertone", "#C94A9C": "Fights your palette",
  "#4A4A4A": "Flattens your complexion",
  // Deep Autumn palette + neutrals
  "#4A5D23": "Casual outerwear", "#4A2A17": "Tailoring and coats",
  "#C95A2B": "A bold accent colour", "#7A3B2E": "Leather goods",
  "#2F5D5A": "Evening pieces", "#8C6B2F": "Metallic accents",
  "#9E3B1F": "Statement pieces", "#6B3A5A": "Evening accessories",
  "#3A322A": "Winter outerwear", "#2A241F": "Evening pieces",
  // Deep Autumn avoid
  // Deep Winter palette + neutrals
  "#0E1B3A": "Tailoring", "#00594C": "Evening pieces",
  "#4A2E8A": "Statement outerwear", "#00565C": "Blouses and dresses",
  "#2A2D34": "Winter layers", "#8E2A6B": "A bold accent colour",
  "#4A235A": "Evening accessories", "#1B2A55": "Denim and casual pieces",
  "#232936": "Evening pieces",
  // Deep Winter avoid
  // Cool Winter palette + neutrals
  "#F7F8FB": "Crisp shirts and blouses", "#B8D0E8": "Knits and light layers",
  "#E8B4C8": "Accent pieces", "#2B3A8F": "Statement outerwear",
  "#1F4ED8": "Evening wear", "#C21B7E": "A bold accent colour",
  "#A4161A": "Lip colour and accessories", "#16213E": "The deepest base of your wardrobe",
  // Cool Winter avoid
  "#F5F0E8": "Too yellow against your skin",
  // Bright Winter palette + neutrals
  "#000000": "Structured evening pieces", "#1E3FBF": "Statement outerwear",
  "#FF2E9A": "A bold accent colour", "#0A5CD8": "Evening wear",
  "#C8102E": "Lip colour and accessories", "#009B6B": "Statement pieces",
  "#D40078": "Dresses and blouses", "#A8D8F0": "Light layering",
  "#5E2EC0": "Evening accessories", "#6E727A": "Everyday neutrals",
  // Shared seasonal-avoid texts (same hex, different reason per season —
  // handled by the per-season overrides below)
};

/** Per-season avoid texts where the shared map's reason doesn't apply. */
const AVOID_TEXT_OVERRIDES: Record<string, Record<string, string>> = {
  "True Cool Summer": { "#B8860B": "Dulls your freshness", "#B7410E": "Warms you too far" },
  "Soft Summer": { "#B8860B": "Too warm and heavy", "#1F4ED8": "Overpowers your palette" },
  "Cool Winter": { "#B8860B": "Fights your cool tone" },
  "Deep Autumn": {
    "#A8C8E8": "Too light and cool for you", "#8FD3C7": "Washes out your depth",
    "#FF4D9D": "Fights your warmth", "#C9CDD4": "Dims your richness",
  },
  "Deep Winter": {
    "#F2E8D5": "Too warm and pale for you", "#C89F7A": "Dulls your cool depth",
    "#D8C3A5": "Fades your richness", "#C7A84B": "Fights your cool tone",
  },
  "Bright Winter": {
    "#C89F7A": "Too muted for your clarity", "#6B6B4A": "Dims your brightness",
    "#7A5540": "Fights your cool tone", "#D8C3A5": "Washes out your contrast",
  },
  "Bright Spring": { "#3A3F44": "Flattens your colour", "#C9A2A4": "Fights your clarity" },
  "Warm Autumn": { "#1B2A4A": "Dulls your warmth" },
  "Light Spring": { "#1B2A4A": "Dulls your fresh warmth", "#3A3F44": "Weighs down your glow" },
};

const TAGLINE_BY_SEASON: Record<string, string> = {
  "Light Spring": "Fresh, warm, and luminous.",
  "True Warm Spring": "Warm, clear, and radiant.",
  "Bright Spring": "Vivid, clear, and electric.",
  "Light Summer": "Cool, gentle, and powdery.",
  "True Cool Summer": "Cool, clear, and refined.",
  "Soft Summer": "Muted, gentle, and refined.",
  "Soft Autumn": "Earthy, muted, and gentle.",
  "Warm Autumn": "Earthy, golden, and rich.",
  "Deep Autumn": "Rich, warm, and dramatic.",
  "Deep Winter": "Dark, cool, and commanding.",
  "Cool Winter": "Sharp, icy, and dramatic.",
  "Bright Winter": "Clear, icy, and electric.",
};

const DESCRIPTION_BY_SEASON: Record<string, string> = {
  "Light Spring": "Light Spring sits at the airy, golden end of the palette. Warm pastels and clear soft tones glow against your skin, while heavy dark colours can weigh you down.",
  "True Warm Spring": "True Warm Spring sits at the clear, golden core of the warm palette. Coral, turquoise, and golden yellow make your skin glow — while black and stark grey can flatten you.",
  "Bright Spring": "Bright Spring is the most saturated of the warm seasons. High-contrast colour sharpens your features — while muted, dusty tones can dim your natural radiance.",
  "Light Summer": "Light Summer lives in the soft, cool pastels. Baby blue, dusty pink, and lavender flatter you — while heavy black or fire orange can overwhelm your delicacy.",
  "True Cool Summer": "True Cool Summer blends cool clarity with gentle depth. Rose, lavender, and powder blue keep you fresh — while warm earthy tones can make you look tired.",
  "Soft Summer": "Soft Summer blends cool and neutral with a gentle, muted finish. Soft powdery tones flatter you — while loud, saturated colours can overwhelm your quiet elegance.",
  "Soft Autumn": "Soft Autumn blends warm with neutral and muted. Olive, camel, and terracotta sit softly against your skin — while stark black or electric blue can fight your gentleness.",
  "Warm Autumn": "Warm Autumn sits at the golden end of the spectrum. Your skin glows against bronze, olive, and terracotta — while stark white and icy pastels can leave you looking washed out.",
  "Deep Autumn": "Deep Autumn is the darkest of the warm seasons. Chocolate, forest, and bronze anchor you — while light pastels can wash out your depth.",
  "Deep Winter": "Deep Winter is the cool, high-depth season. Black, navy, and jewel tones intensify you — while pale warm shades can fade you into the background.",
  "Cool Winter": "Cool Winter lives at the crisp, high-contrast end of the palette. Clear jewel tones and icy shades intensify your skin, while earthy or muted tones can make you look tired.",
  "Bright Winter": "Bright Winter pairs cool clarity with the highest contrast of all. Pure white and black sharpened with electric colour make you shine — while muted earthy tones can wash you out.",
};

const fallbackRecommendation = "From your season palette";

function toColourItems(
  hexes: string[],
  season: string,
  overrides: Record<string, string>,
): ColourItemDTO[] {
  return hexes.map((hex) => ({
    hex,
    name: COLOUR_NAME_BY_HEX[hex] ?? hex,
    recommendation:
      overrides[hex] ?? RECOMMENDATION_BY_HEX[hex] ?? fallbackRecommendation,
  }));
}

const COLOUR_NAME_BY_HEX: Record<string, string> = {
  "#FFD9C0": "Peach", "#FFB347": "Apricot", "#F7D06E": "Butter Yellow",
  "#8FD3C7": "Soft Turquoise", "#FF8C7A": "Light Coral", "#F7A8B8": "Warm Pink",
  "#C89F7A": "Light Caramel", "#FDF3E0": "Ivory", "#C0D9A0": "Light Olive",
  "#A9D6C1": "Mint", "#E8D5B8": "Warm Sand", "#B09A84": "Warm Taupe",
  "#D9A86C": "Honey", "#1A1A1A": "Black Ink", "#1B2A4A": "Navy",
  "#3A3F44": "Charcoal", "#722F37": "Burgundy",
  "#F6C667": "Golden Yellow", "#FF7F50": "Coral", "#FF6347": "Tomato",
  "#2EB8A8": "Turquoise", "#9CC25C": "Light Green", "#F58FB8": "Coral Pink",
  "#B5845C": "Golden Brown", "#FBF0DC": "Warm Cream", "#78C8E8": "Sky Blue",
  "#7FD4C0": "Light Aqua", "#E0C9A8": "Light Tan", "#B8AA9E": "Warm Grey",
  "#FFFFFF": "Pure White", "#808080": "Pure Grey", "#4A2E1F": "Espresso",
  "#FF7A00": "Vivid Orange", "#FFD400": "Bright Yellow", "#FF4D9D": "Hot Pink",
  "#00A86B": "Emerald", "#00C8C8": "Bright Turquoise", "#FF6B57": "Coral Orange",
  "#7B3FA0": "Royal Purple", "#66D6E8": "Light Aqua Blue", "#FFF7E6": "Warm White",
  "#B6D94C": "Lime", "#E5E0D8": "Light Grey", "#B8A99A": "Taupe Stone",
  "#8B5A2B": "Medium Brown", "#6E1423": "Wine", "#6B6B4A": "Muted Olive",
  "#C9A2A4": "Dusty Rose", "#A8C8E8": "Baby Blue", "#E3B7C6": "Dusty Pink",
  "#C4B7D9": "Powder Lavender", "#A8D8D0": "Soft Aqua", "#A9B8C8": "Light Grey Blue",
  "#B5D8C0": "Cool Mint", "#F2E8C6": "Pale Yellow", "#B79AAC": "Light Plum",
  "#F7F6F2": "Cool White", "#D8D6D2": "Light Grey", "#C4B8A8": "Cool Beige",
  "#7A8B9A": "Slate", "#8A8A90": "Mid Grey", "#E58BA6": "Cool Rose",
  "#A99AD1": "Lavender", "#8FB4D4": "Soft Blue", "#C2185B": "Raspberry",
  "#5FA9A5": "Soft Teal", "#7D5B8C": "Plum", "#9AA3AE": "Silver",
  "#6C7A94": "Slate Blue", "#9FD4C8": "Pale Aqua", "#F0C4CE": "Icy Rose",
  "#C9CDD4": "Dove Grey", "#4A4E55": "Deep Grey", "#F4F1EA": "Soft White",
  "#A78B9E": "Mauve", "#9DB6C9": "Powder Blue", "#8A8D7A": "Grey Sage",
  "#7D6678": "Dusty Plum", "#6B6B6B": "Stone Grey", "#3F4A5A": "Deep Slate",
  "#33363C": "Charcoal", "#D6D5CE": "Dove Grey", "#A99E93": "Stone",
  "#4A3B32": "Deep Cocoa", "#FF5E8A": "Neon Pink", "#1F4ED8": "Electric Blue",
  "#A3C02F": "Bright Lime", "#B8860B": "Goldenrod", "#C98A6B": "Muted Terracotta",
  "#B89968": "Camel Tan", "#C9A29A": "Dusty Rose Tan", "#6E7A50": "Moss Green",
  "#A08C7A": "Taupe", "#C7A84B": "Muted Gold", "#7A5540": "Warm Brown",
  "#6B7D6B": "Slate Teal", "#F2E8D5": "Warm Cream", "#D8C3A5": "Beige",
  "#B0A89C": "Soft Grey", "#4A3326": "Deep Brown", "#F3E7CF": "Warm Ivory",
  "#C19A6B": "Camel", "#C7953A": "Golden Ochre", "#B7410E": "Rust",
  "#D2691E": "Chocolate", "#8B4513": "Saddle Brown", "#556B2F": "Olive",
  "#2F4F2F": "Deep Forest", "#954535": "Chestnut", "#E2D0B4": "Soft Fawn",
  "#F8FAFC": "Ice White", "#C94A9C": "Fuchsia", "#4A4A4A": "Charcoal",
  "#4A5D23": "Deep Olive", "#4A2A17": "Dark Chocolate", "#C95A2B": "Burnt Orange",
  "#7A3B2E": "Mahogany", "#2F5D5A": "Deep Teal", "#8C6B2F": "Bronze",
  "#9E3B1F": "Deep Rust", "#6B3A5A": "Warm Plum", "#3A322A": "Charcoal Brown",
  "#2A241F": "Black-Brown", "#0E1B3A": "Deep Navy", "#00594C": "Emerald",
  "#4A2E8A": "Royal Purple", "#00565C": "Deep Teal", "#2A2D34": "Dark Charcoal",
  "#8E2A6B": "Dark Magenta", "#4A235A": "Deep Plum", "#1B2A55": "Black-Blue",
  "#232936": "Deep Slate", "#F7F8FB": "Cool White", "#B8D0E8": "Powder Blue",
  "#E8B4C8": "Icy Pink", "#2B3A8F": "Royal Blue", "#C21B7E": "Magenta",
  "#A4161A": "Crimson", "#16213E": "Navy", "#F5F0E8": "Cream",
  "#000000": "Black Ink", "#1E3FBF": "Royal Blue", "#FF2E9A": "Hot Pink",
  "#0A5CD8": "Electric Blue", "#C8102E": "Crimson", "#009B6B": "Emerald",
  "#D40078": "Magenta", "#A8D8F0": "Icy Blue", "#5E2EC0": "Purple",
  "#6E727A": "Mid Grey",
};

/**
 * Full season content, built from the single SEASON_PROFILES source in
 * colourAnalysis.ts. Palettes/neutrals/avoid/archetypes come from there;
 * presentation text (tagline/description/recommendation strings) lives
 * here. One source of truth for the API and the analysis engine.
 */
export function getSeasonInfoDTO(season: string): SeasonInfoDTO | null {
  const profile = SEASON_PROFILES[season];
  if (!profile) return null;

  const overrides = AVOID_TEXT_OVERRIDES[season] ?? {};
  return {
    season: profile.season,
    tagline: TAGLINE_BY_SEASON[season] ?? "",
    description: DESCRIPTION_BY_SEASON[season] ?? "",
    palette: toColourItems(profile.palette, season, {}),
    neutrals: toColourItems(profile.neutrals, season, {}),
    avoid: toColourItems(profile.avoid, season, overrides),
    archetypes: profile.archetypes,
  };
}

export function getAllSeasonsDTO(): SeasonInfoDTO[] {
  return Object.keys(SEASON_PROFILES).map(getSeasonInfoDTO).filter(
    (s): s is SeasonInfoDTO => s !== null,
  );
}

export const RUNNER_UP_SEASONS: Record<string, string> = {
  "Light Spring": "Light Summer",
  "True Warm Spring": "Warm Autumn",
  "Bright Spring": "Bright Winter",
  "Light Summer": "Light Spring",
  "True Cool Summer": "Cool Winter",
  "Soft Summer": "Soft Autumn",
  "Soft Autumn": "Warm Autumn",
  "Warm Autumn": "Deep Autumn",
  "Deep Autumn": "Deep Winter",
  "Deep Winter": "Cool Winter",
  "Cool Winter": "Deep Winter",
  "Bright Winter": "Bright Spring",
};
