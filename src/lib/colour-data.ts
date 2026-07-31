export interface ColourItem {
  name: string;
  hex: string;
  recommendation: string;
}

export interface SeasonInfo {
  season: string;
  tagline: string;
  description: string;
  palette: ColourItem[];
  neutrals: ColourItem[];
  avoid: ColourItem[];
  archetypes: { title: string; description: string }[];
}

const WARM_AUTUMN: SeasonInfo = {
  season: 'Warm Autumn',
  tagline: 'Earthy, golden, and rich.',
  description:
    'Warm Autumn sits at the golden end of the spectrum. Your skin glows against bronze, olive, and terracotta — while stark white and icy pastels can leave you looking washed out.',
  palette: [
    { name: 'Warm Ivory', hex: '#F3E7CF', recommendation: 'Crisp white tops and shirts' },
    { name: 'Camel', hex: '#C19A6B', recommendation: 'Coats, knitwear, and tailoring' },
    { name: 'Golden Ochre', hex: '#C7953A', recommendation: 'Statement accessories' },
    { name: 'Goldenrod', hex: '#B8860B', recommendation: 'Autumn layering pieces' },
    { name: 'Rust', hex: '#B7410E', recommendation: 'A bold accent colour' },
    { name: 'Chocolate', hex: '#D2691E', recommendation: 'Leather goods and bags' },
    { name: 'Saddle Brown', hex: '#8B4513', recommendation: 'Everyday neutral dressing' },
    { name: 'Olive', hex: '#556B2F', recommendation: 'Casual outerwear' },
    { name: 'Deep Forest', hex: '#2F4F2F', recommendation: 'Trousers and skirts' },
    { name: 'Chestnut', hex: '#954535', recommendation: 'Blouses and dresses' },
  ],
  neutrals: [
    { name: 'Warm Ivory', hex: '#F3E7CF', recommendation: 'The base of your wardrobe' },
    { name: 'Soft Fawn', hex: '#E2D0B4', recommendation: 'Quiet, everyday layering' },
    { name: 'Camel', hex: '#C19A6B', recommendation: 'Coats and bags' },
    { name: 'Espresso', hex: '#4A2E1F', recommendation: 'Tailoring and denim' },
    { name: 'Deep Cocoa', hex: '#3B2318', recommendation: 'Evening and winter pieces' },
  ],
  avoid: [
    { name: 'Ice White', hex: '#F8FAFC', recommendation: 'Too stark against your undertone' },
    { name: 'Navy', hex: '#1B2A4A', recommendation: 'Dulls your warmth' },
    { name: 'Fuchsia', hex: '#C94A9C', recommendation: 'Fights your palette' },
    { name: 'Charcoal', hex: '#4A4A4A', recommendation: 'Flattens your complexion' },
  ],
  archetypes: [
    {
      title: 'The Classic',
      description:
        'A tailored, timeless presence. You look strongest in structured silhouettes and heritage colours.',
    },
    {
      title: 'The Earthy Minimalist',
      description:
        'Natural fabrics, muted tones, and quiet luxury. Your palette does the talking.',
    },
    {
      title: 'The Vintage Romantic',
      description:
        'Rust, ochre, and antique gold flatter you. You carry vintage-inspired pieces with ease.',
    },
  ],
};

const COOL_WINTER: SeasonInfo = {
  season: 'Cool Winter',
  tagline: 'Sharp, icy, and dramatic.',
  description:
    'Cool Winter lives at the crisp, high-contrast end of the palette. Clear jewel tones and icy shades intensify your skin, while earthy or muted tones can make you look tired.',
  palette: [
    { name: 'Cool White', hex: '#F7F8FB', recommendation: 'Crisp shirts and blouses' },
    { name: 'Powder Blue', hex: '#B8D0E8', recommendation: 'Knits and light layers' },
    { name: 'Icy Pink', hex: '#E8B4C8', recommendation: 'Accent pieces' },
    { name: 'Royal Blue', hex: '#2B3A8F', recommendation: 'Statement outerwear' },
    { name: 'Electric Blue', hex: '#1F4ED8', recommendation: 'Evening wear' },
    { name: 'Magenta', hex: '#C21B7E', recommendation: 'A bold accent colour' },
    { name: 'Crimson', hex: '#A4161A', recommendation: 'Lip colour and accessories' },
    { name: 'Charcoal', hex: '#3A3F44', recommendation: 'Tailoring and denim' },
    { name: 'Navy', hex: '#16213E', recommendation: 'The deepest base of your wardrobe' },
    { name: 'Black Ink', hex: '#1A1A1A', recommendation: 'Evening and structured pieces' },
  ],
  neutrals: [
    { name: 'Cool White', hex: '#F7F8FB', recommendation: 'The base of your wardrobe' },
    { name: 'Dove Grey', hex: '#C9CDD4', recommendation: 'Quiet layering' },
    { name: 'Silver', hex: '#9AA3AE', recommendation: 'Metallic accents' },
    { name: 'Charcoal', hex: '#3A3F44', recommendation: 'Tailoring' },
    { name: 'Black Ink', hex: '#1A1A1A', recommendation: 'Evening and structured pieces' },
  ],
  avoid: [
    { name: 'Olive', hex: '#556B2F', recommendation: 'Dulls your clarity' },
    { name: 'Rust', hex: '#B7410E', recommendation: 'Warms your palette too far' },
    { name: 'Goldenrod', hex: '#B8860B', recommendation: 'Fights your cool tone' },
    { name: 'Cream', hex: '#F5F0E8', recommendation: 'Too yellow against your skin' },
  ],
  archetypes: [
    {
      title: 'The Sharp Minimalist',
      description:
        'Clean lines, strong silhouettes, and decisive colours. You command a room before you speak.',
    },
    {
      title: 'The Dramatic Icon',
      description:
        'High contrast suits you. Jewel tones and crisp tailoring are your native language.',
    },
    {
      title: 'The Modern Classic',
      description:
        'Timeless pieces in sharp shades. You edit ruthlessly and wear little, perfectly.',
    },
  ],
};

const SOFT_SUMMER: SeasonInfo = {
  season: 'Soft Summer',
  tagline: 'Muted, gentle, and refined.',
  description:
    'Soft Summer blends cool and neutral with a gentle, muted finish. Soft powdery tones flatter you — while loud, saturated colours can overwhelm your quiet elegance.',
  palette: [
    { name: 'Soft White', hex: '#F4F1EA', recommendation: 'Blouses and light knitwear' },
    { name: 'Dusty Rose', hex: '#C9A2A4', recommendation: 'Dresses and blouses' },
    { name: 'Mauve', hex: '#A78B9E', recommendation: 'Accessories and scarves' },
    { name: 'Powder Blue', hex: '#9DB6C9', recommendation: 'Light layers' },
    { name: 'Slate Blue', hex: '#6C7A94', recommendation: 'Tailoring' },
    { name: 'Grey Sage', hex: '#8A8D7A', recommendation: 'Casual outerwear' },
    { name: 'Dusty Plum', hex: '#7D6678', recommendation: 'Evening pieces' },
    { name: 'Stone Grey', hex: '#6B6B6B', recommendation: 'Everyday neutrals' },
    { name: 'Deep Slate', hex: '#3F4A5A', recommendation: 'Trousers and skirts' },
    { name: 'Charcoal', hex: '#33363C', recommendation: 'Winter essentials' },
  ],
  neutrals: [
    { name: 'Soft White', hex: '#F4F1EA', recommendation: 'The base of your wardrobe' },
    { name: 'Dove Grey', hex: '#D6D5CE', recommendation: 'Quiet layering' },
    { name: 'Stone', hex: '#A99E93', recommendation: 'Coats and bags' },
    { name: 'Slate', hex: '#6C7A94', recommendation: 'Tailoring' },
    { name: 'Deep Cocoa', hex: '#4A3B32', recommendation: 'Evening and winter pieces' },
  ],
  avoid: [
    { name: 'Neon Pink', hex: '#FF5E8A', recommendation: 'Too loud for your softness' },
    { name: 'Electric Blue', hex: '#1F4ED8', recommendation: 'Overpowers your palette' },
    { name: 'Bright Lime', hex: '#A3C02F', recommendation: 'Fights your muted tone' },
    { name: 'Goldenrod', hex: '#B8860B', recommendation: 'Too warm and heavy' },
  ],
  archetypes: [
    {
      title: 'The Quiet Elegant',
      description:
        'Soft fabrics, muted tones, and understated tailoring. Your beauty is in the details.',
    },
    {
      title: 'The Refined Romantic',
      description:
        'Dusty roses and powder blues flatter you. You favour delicate, feminine pieces.',
    },
    {
      title: 'The Modern Minimalist',
      description:
        'A muted palette, clean shapes, and quality over quantity. Your restraint is your style.',
    },
  ],
};

export const SEASONS: Record<string, SeasonInfo> = {
  'Warm Autumn': WARM_AUTUMN,
  'Cool Winter': COOL_WINTER,
  'Soft Summer': SOFT_SUMMER,
};

export function deriveSeason(undertone: string): string {
  if (undertone === 'warm') return 'Warm Autumn';
  if (undertone === 'cool') return 'Cool Winter';
  return 'Soft Summer';
}

export function getSeasonInfo(
  season?: string,
  undertone?: string,
): SeasonInfo {
  const key = season ?? deriveSeason(undertone ?? 'neutral');
  return SEASONS[key] ?? SEASONS['Warm Autumn'];
}

function hexToLuma(hex: string): number {
  const value = hex.replace('#', '');
  if (value.length !== 6) return 0;
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function sortByGradient<T extends { hex: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => hexToLuma(a.hex) - hexToLuma(b.hex));
}

export function mergeAnalysisPalette(
  palette: ColourItem[],
  backendHexes: string[],
): ColourItem[] {
  const known = new Set(palette.map((c) => c.hex.toLowerCase()));
  const extras = backendHexes
    .filter((hex) => !known.has(hex.toLowerCase()))
    .map((hex) => ({
      name: hex,
      hex,
      recommendation: 'From your analysis',
    }));
  return sortByGradient([...palette, ...extras]);
}
