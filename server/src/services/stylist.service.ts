import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env";
import {
  deriveSeason,
  deriveUndertone,
  getSeasonProfile,
  colourName,
} from "../utils/colourAnalysis";

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

const OCCASIONS: { id: string; regex: string; label: string }[] = [
  { id: "work", regex: "work|office|meeting|corporate", label: "the office" },
  { id: "interview", regex: "interview", label: "an interview" },
  { id: "party", regex: "party|club|night|evening out", label: "an evening out" },
  { id: "wedding", regex: "wedding|marriage|sangeet|reception|function|bride", label: "a wedding" },
  { id: "date", regex: "date|dinner", label: "a date" },
  { id: "casual", regex: "casual|weekend|brunch|coffee", label: "a casual weekend" },
  { id: "vacation", regex: "vacation|beach|holiday|trip|travel", label: "a getaway" },
  { id: "festival", regex: "festival|diwali|holi|navratri|eid", label: "a festival" },
];

const OCCASION_GUIDANCE: Record<string, string> = {
  work: "Lean on your neutrals and a single statement piece. A tailored blazer in a muted neutral anchors the look, while one bold accent keeps it personal without shouting.",
  interview: "Interviews call for quiet confidence. Keep the silhouette clean and the colours calm — a neutral base with one small accent reads as composed and capable.",
  party: "An evening out is your moment to use the deeper, richer end of your palette. Let one vivid colour lead, keep the rest neutral, and add a metallic that sits in your season.",
  wedding: "Weddings let you go bold, but stay within your season so the colour flatters rather than competes. Pick one saturated shade for the main piece and carry it with a neutral or two.",
  date: "For a date, choose colours that warm your complexion and feel approachable. A soft, flattering tone near the face does more than a loud print ever could.",
  casual: "For a casual weekend, keep it effortless: a neutral base, one relaxed layer from your palette, and comfortable fits. Style comes from the colour, not the complication.",
  vacation: "On holiday, translate your palette into relaxed fabrics — lighter versions of your colours read effortless in bright light and photograph beautifully.",
  festival: "Festivals are made for colour. Pull a rich shade from your palette for the main outfit and balance it with a neutral; skip anything on your avoid list so you glow, not clash.",
};

const OCCASION_PICK: Record<string, string[]> = {
  work: ["#C19A6B", "#556B2F", "#F3E7CF"],
  interview: ["#8B4513", "#3A3F44", "#F7F8FB"],
  party: ["#B7410E", "#16213E", "#1F4ED8"],
  wedding: ["#B8860B", "#C21B7E", "#954535"],
  date: ["#D2691E", "#C9A2A4", "#E8B4C8"],
  casual: ["#556B2F", "#9DB6C9", "#8A8D7A"],
  vacation: ["#C7953A", "#9DB6C9", "#E2D0B4"],
  festival: ["#C21B7E", "#2B3A8F", "#B8860B"],
};

function has(haystack: string, pattern: RegExp): boolean {
  return pattern.test(haystack);
}

const COMMON_COLOURS: Record<string, "warm" | "cool" | "neutral"> = {
  red: "warm", orange: "warm", rust: "warm", terracotta: "warm", coral: "warm",
  yellow: "warm", gold: "warm", goldenrod: "warm", ochre: "warm", camel: "warm",
  olive: "warm", brown: "warm", beige: "warm", tan: "warm", cream: "warm",
  ivory: "neutral", mustard: "warm", maroon: "warm", brick: "warm",
  burgundy: "warm", chestnut: "warm", chocolate: "warm", copper: "warm",
  blue: "cool", navy: "cool", royal: "cool", teal: "cool", turquoise: "cool",
  purple: "cool", violet: "cool", magenta: "cool", fuchsia: "cool",
  pink: "cool", rose: "cool", berry: "cool", plum: "cool", lavender: "cool",
  white: "neutral", black: "neutral", grey: "neutral", gray: "neutral",
  silver: "cool", charcoal: "cool", slate: "cool", sage: "neutral",
};

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
    const foundation = shades.foundation ?? fallbackShades.foundation;
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
    return `Hello! I am **D'Style**, your personal stylist. I have your colour season — **${season}** — and I can help with colours, occasions, makeup, hair, or styling pieces from your wardrobe. What shall we plan today?`;
  }

  // ── Fallback ──
  return `I want to give you something genuinely useful, so let me work with what I know: your season is **${season}** (${undertone} undertone), which means colours like **${paletteLine}** tend to flatter you, while ${avoidLine} are best kept small. Ask me about an occasion, a specific colour, makeup, hair, or how to style your wardrobe — and I will tailor the answer to you.`;
}

export async function generateStylistReplyAI(
  message: string,
  ctx?: StylistContext
): Promise<string> {
  if (!env.ANTHROPIC_API_KEY) return generateStylistReply(message, ctx);

  try {
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    const res = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 700,
      system:
        "You are D'Style, a warm, expert personal colour-and-style consultant for D'Fashion. " +
        "Ground every answer in the user's colour analysis JSON below. Never invent an analysis " +
        "they don't have. Be specific and concise; use **bold** for colour names.\n" +
        `USER ANALYSIS: ${JSON.stringify(ctx?.analysisResult ?? null)}\n` +
        `USER WARDROBE: ${JSON.stringify(ctx?.wardrobeItems ?? [])}`,
      messages: [{ role: "user", content: message }],
    });
    return res.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");
  } catch (err) {
    console.warn("Claude stylist failed, using rules engine:", (err as Error).message);
    return generateStylistReply(message, ctx);
  }
}
