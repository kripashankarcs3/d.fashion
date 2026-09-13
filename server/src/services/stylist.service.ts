import {
  deriveSeason,
  getSeasonProfile,
  colourName,
} from "../utils/colourAnalysis";
import {
  COMMON_COLOURS,
  OCCASIONS,
  OCCASION_GUIDANCE,
  OCCASION_PICK,
  STYLIST_NAME,
} from "../config/stylist";

export interface StylistContext {
  analysisResult?: {
    colorProfile?: {
      undertone?: "warm" | "cool" | "neutral";
      skinToneHex?: string;
      eyeColor?: string;
      lipColor?: string;
      hairColor?: string;
    };
    colourSeason?: string;
    skinConcerns?: Record<string, number>;
    recommendations?: {
      avoidColors?: string[];
      hairColorOptions?: string[];
      makeupShades?: { foundation?: string; blush?: string; lip?: string };
      outfitPalette?: string[];
    };
  };
  wardrobeItems?: Array<{
    name?: string;
    category?: string;
    palette?: string[];
  }>;
}

function has(haystack: string, pattern: RegExp): boolean {
  return pattern.test(haystack);
}

export function generateStylistReply(message: string, context?: StylistContext): string {
  const text = ` ${(message ?? "").trim().toLowerCase()} `;

  const analysis = context?.analysisResult;
  const undertone = analysis?.colorProfile?.undertone ?? "neutral";
  const season = analysis?.colourSeason ?? deriveSeason(undertone);
  const profile = getSeasonProfile(season, undertone);

  const pickFor = (occasionKey: string): string => {
    const avoidSet = new Set(profile.avoid.map((h) => h.toLowerCase()));
    const chosen: string[] = [];
    const preferred = (OCCASION_PICK[occasionKey] ?? profile.palette.slice(0, 3)).map((h) =>
      h.toLowerCase(),
    );
    for (const h of preferred) {
      if (!avoidSet.has(h) && chosen.length < 3) chosen.push(h);
    }
    const fillers = profile.palette.filter(
      (h) => !chosen.includes(h.toLowerCase()) && !avoidSet.has(h.toLowerCase()),
    );
    for (const h of fillers) {
      if (chosen.length >= 3) break;
      chosen.push(h.toLowerCase());
    }
    return chosen.map((h) => colourName(h)).join(", ");
  };

  const paletteLine = profile.palette.slice(0, 4).map((h) => colourName(h)).join(", ");
  const avoidLine = profile.avoid.slice(0, 3).map((h) => colourName(h)).join(", ");

  // ── Skincare ──
  if (has(text, /skincare|skin care|acne|pimple|dry skin|oily skin|dark spot|pigment|wrinkle|routine/)) {
    const concerns = analysis?.skinConcerns ?? {};
    const steps: string[] = [];
    if ((concerns.acne ?? 0) > 0.3) steps.push("a salicylic-acid cleanser to keep breakouts in check");
    if ((concerns.darkSpots ?? 0) > 0.25) steps.push("a vitamin-C serum for evening tone");
    if ((concerns.dryness ?? 0) > 0.4) steps.push("a hyaluronic-acid moisturiser for hydration");
    if ((concerns.wrinkles ?? 0) > 0.3) steps.push("a gentle retinol at night for fine lines");
    if (steps.length === 0) steps.push("a consistent cleanse, hydrate, and SPF rhythm");
    return `Looking after your skin is the quiet foundation of every look. Given what your analysis showed, I would start with ${steps.join(", ")}. **Keep it gentle, keep it consistent, and always finish with SPF** — your skin will thank you long before the outfit matters.`;
  }

  // ── Makeup ──
  if (has(text, /makeup|lipstick|foundation|blush|concealer|mascara|kajal|eyeliner/)) {
    const fallbackShades =
      undertone === "cool"
        ? { foundation: "#D4A89C", blush: "#E58BA6", lip: "#B23A5B" }
        : undertone === "neutral"
          ? { foundation: "#CDA27E", blush: "#DE9AA6", lip: "#B9686B" }
          : { foundation: "#C99B6A", blush: "#E8A0B4", lip: "#C97B84" };
    const shades = analysis?.recommendations?.makeupShades ?? fallbackShades;
    const blush = shades.blush ?? fallbackShades.blush;
    const lip = shades.lip ?? fallbackShades.lip;
    const hex = analysis?.colorProfile?.skinToneHex;
    const base = hex ? `For your **${season}** colouring, aim for a foundation that melts into your skin (around ${hex}) — match on the jawline, never the hand.` : `For your **${season}** colouring, match your base on the jawline in natural light.`;
    return `${base} A ${colourName(blush)} blush keeps cheeks believable, and for the lips I would reach for a **${colourName(lip)}** — it stays within your palette while adding polish. Keep the eyes classic and let the season do the talking.`;
  }

  // ── Hair ──
  if (has(text, /hair colour|hair color|dye|coloring my hair|colouring my hair|new hair/)) {
    const options = analysis?.recommendations?.hairColorOptions;
    const list = options?.length
      ? options.join(", ")
      : "a shade from your palette that echoes your natural depth";
    return `Hair sits right next to your face, so it should share your undertone rather than fight it. For **${season}**, strong options are **${list}**. If you want a frame that flatters, keep the depth close to your natural level and let warmth or coolness follow your undertone.`;
  }

  // ── Occasion ──
  for (const occ of OCCASIONS) {
    if (has(text, new RegExp(occ.regex))) {
      const guidance = OCCASION_GUIDANCE[occ.id] ?? OCCASION_GUIDANCE.work;
      return `For ${occ.label}, keep your **${season}** palette in front of you. ${guidance} Colours I would reach for first: **${pickFor(occ.id)}**. And stay clear of ${avoidLine}, which can sit against your undertone.`;
    }
  }

  // ── Wardrobe / outfit from saved items ──
  if (has(text, /wardrobe|saved pieces|from my closet|style my (clothes|pieces|collection)|outfit idea|what should i wear today/)) {
    const items = (context?.wardrobeItems ?? []).filter((i) => i?.name);
    if (items.length > 0) {
      const a = items[0];
      const b = items[1];
      const part = b
        ? `Start with your **${a.name}** as the anchor and layer your **${b.name}** on top`
        : `Start with your **${a.name}** as the anchor`;
      const accent = profile.palette.slice(0, 2).map((h) => colourName(h)).join(" or ");
      return `${part}. Keep the rest of the look neutral, then add one accent in **${accent}** — it ties the whole thing to your **${season}** palette. If you want more pairing ideas, save a few more pieces to your wardrobe and ask me again.`;
    }
    return `I would love to help you build an outfit, but your wardrobe is still empty. **Save a few pieces to your wardrobe** and ask me to style them — I will pull combinations that sit comfortably in your **${season}** palette. For now, a safe place to start is ${pickFor("work")} with a neutral base.`;
  }

  // ── "Which colours suit me / my palette" ──
  if (has(text, /what colours? suit|my colours?|colour palette|color palette|best colours?|which colours? (should i )?wear|colours? for me|my best colours?/)) {
    return `Your season is **${season}**, built on your ${undertone} undertone. The colours that flatter you most sit at: **${paletteLine}**. For everyday wear, anchor with your neutrals — they do the quiet work while your palette colours bring the life. If you are ever unsure, hold a fabric next to your face in daylight: the colours that brighten you are your palette.`;
  }

  // ── "Colours to avoid" ──
  if (has(text, /avoid|shouldn.t wear|colours? to stay away|not suit me|doesn.t suit/)) {
    return `Every palette has its graveyard, and yours is no different. For **${season}**, colours that tend to dull your complexion are **${avoidLine}**. It is not that you can never wear them — it is that they work as tiny accents at most, never as the main event.`;
  }

  // ── A specific colour name ──
  const paletteNames = profile.palette.map((h) => colourName(h).toLowerCase());
  const avoidNames = profile.avoid.map((h) => colourName(h).toLowerCase());
  for (const name of paletteNames) {
    if (text.includes(name)) {
      return `**${name.charAt(0).toUpperCase() + name.slice(1)}** sits inside your **${season}** palette, so you can wear it with confidence — I would let it be the hero of the look and keep everything else neutral.`;
    }
  }
  for (const name of avoidNames) {
    if (text.includes(name)) {
      return `That shade drifts toward your avoid list for **${season}** — near your face it can pull the life out of your skin. If you love it, use it sparingly (shoes, a bag, a tiny accent) rather than as a full outfit.`;
    }
  }
  const colourWords = text.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  const commonColour = colourWords.find((w) => COMMON_COLOURS[w] !== undefined);
  if (commonColour) {
    const tone = COMMON_COLOURS[commonColour];
    if (tone === undertone) {
      return `**${commonColour.charAt(0).toUpperCase() + commonColour.slice(1)}** leans ${tone} — the same family as your undertone — so it will sit harmoniously against your skin for **${season}**. Wear it near your face with confidence.`;
    }
    if (tone === "neutral") {
      return `**${commonColour.charAt(0).toUpperCase() + commonColour.slice(1)}** is fairly neutral, so it works for your **${season}** palette — pair it with your neutrals and let your season colours provide the accents.`;
    }
    return `**${commonColour.charAt(0).toUpperCase() + commonColour.slice(1)}** leans ${tone}, which can fight your ${undertone} undertone in **${season}**. Wear it away from the face (trousers, shoes, a bag) and let your palette colours carry the look.`;
  }

  // ── Greeting ──
  if (has(text, /(^|\s)(hi|hello|hey|namaste|yo)([\s,.!?]|$)/)) {
    return `Hello! I am **${STYLIST_NAME}**, your personal stylist. I have your colour season — **${season}** — and I can help with colours, occasions, makeup, hair, or styling pieces from your wardrobe. What shall we plan today?`;
  }

  // ── Fallback ──
  return `I want to give you something genuinely useful, so let me work with what I know: your season is **${season}** (${undertone} undertone), which means colours like **${paletteLine}** tend to flatter you, while ${avoidLine} are best kept small. Ask me about an occasion, a specific colour, makeup, hair, or how to style your wardrobe — and I will tailor the answer to you.`;
}
