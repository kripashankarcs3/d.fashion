import { env } from "./env";

/**
 * Central stylist knowledge base for the rules-engine fallback.
 * Content moved out of `stylist.service.ts` so business guidance is editable
 * without touching the engine. Dress-related: values are unchanged, only home.
 */

export interface Occasion {
  id: string;
  regex: string;
  label: string;
}

export const OCCASIONS: Occasion[] = [
  { id: "work", regex: "work|office|meeting|corporate", label: "the office" },
  { id: "interview", regex: "interview", label: "an interview" },
  { id: "party", regex: "party|club|night|evening out", label: "an evening out" },
  { id: "wedding", regex: "wedding|marriage|sangeet|reception|function|bride", label: "a wedding" },
  { id: "date", regex: "date|dinner", label: "a date" },
  { id: "casual", regex: "casual|weekend|brunch|coffee", label: "a casual weekend" },
  { id: "vacation", regex: "vacation|beach|holiday|trip|travel", label: "a getaway" },
  { id: "festival", regex: "festival|diwali|holi|navratri|eid", label: "a festival" },
];

export const OCCASION_GUIDANCE: Record<string, string> = {
  work: "Lean on your neutrals and a single statement piece. A tailored blazer in a muted neutral anchors the look, while one bold accent keeps it personal without shouting.",
  interview: "Interviews call for quiet confidence. Keep the silhouette clean and the colours calm — a neutral base with one small accent reads as composed and capable.",
  party: "An evening out is your moment to use the deeper, richer end of your palette. Let one vivid colour lead, keep the rest neutral, and add a metallic that sits in your season.",
  wedding: "Weddings let you go bold, but stay within your season so the colour flatters rather than competes. Pick one saturated shade for the main piece and carry it with a neutral or two.",
  date: "For a date, choose colours that warm your complexion and feel approachable. A soft, flattering tone near the face does more than a loud print ever could.",
  casual: "For a casual weekend, keep it effortless: a neutral base, one relaxed layer from your palette, and comfortable fits. Style comes from the colour, not the complication.",
  vacation: "On holiday, translate your palette into relaxed fabrics — lighter versions of your colours read effortless in bright light and photograph beautifully.",
  festival: "Festivals are made for colour. Pull a rich shade from your palette for the main outfit and balance it with a neutral; skip anything on your avoid list so you glow, not clash.",
};

export const OCCASION_PICK: Record<string, string[]> = {
  work: ["#C19A6B", "#556B2F", "#F3E7CF"],
  interview: ["#8B4513", "#3A3F44", "#F7F8FB"],
  party: ["#B7410E", "#16213E", "#1F4ED8"],
  wedding: ["#B8860B", "#C21B7E", "#954535"],
  date: ["#D2691E", "#C9A2A4", "#E8B4C8"],
  casual: ["#556B2F", "#9DB6C9", "#8A8D7A"],
  vacation: ["#C7953A", "#9DB6C9", "#E2D0B4"],
  festival: ["#C21B7E", "#2B3A8F", "#B8860B"],
};

export const COMMON_COLOURS: Record<string, "warm" | "cool" | "neutral"> = {
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

/* ------------------------------------------------------------- persona */

export const STYLIST_NAME = env.STYLIST_NAME;
export const PRODUCT_NAME = env.PRODUCT_NAME;