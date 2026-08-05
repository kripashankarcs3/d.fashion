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

const LIGHT_SPRING: SeasonInfo = {
  season: 'Light Spring',
  tagline: 'Fresh, warm, and luminous.',
  description:
    'Light Spring sits at the airy, golden end of the palette. Warm pastels and clear soft tones glow against your skin, while heavy dark colours can weigh you down.',
  palette: [
    { name: 'Peach', hex: '#FFD9C0', recommendation: 'Blouses and soft knitwear' },
    { name: 'Apricot', hex: '#FFB347', recommendation: 'Dresses and accents' },
    { name: 'Butter Yellow', hex: '#F7D06E', recommendation: 'Light layering pieces' },
    { name: 'Soft Turquoise', hex: '#8FD3C7', recommendation: 'Statement accessories' },
    { name: 'Light Coral', hex: '#FF8C7A', recommendation: 'Tops and scarves' },
    { name: 'Warm Pink', hex: '#F7A8B8', recommendation: 'Prints and linens' },
    { name: 'Light Caramel', hex: '#C89F7A', recommendation: 'Coats and bags' },
    { name: 'Ivory', hex: '#FDF3E0', recommendation: 'The base of your wardrobe' },
    { name: 'Light Olive', hex: '#C0D9A0', recommendation: 'Casual outerwear' },
    { name: 'Mint', hex: '#A9D6C1', recommendation: 'Everyday knitwear' },
  ],
  neutrals: [
    { name: 'Ivory', hex: '#FDF3E0', recommendation: 'The base of your wardrobe' },
    { name: 'Warm Sand', hex: '#E8D5B8', recommendation: 'Quiet, everyday layering' },
    { name: 'Light Caramel', hex: '#C89F7A', recommendation: 'Coats and bags' },
    { name: 'Warm Taupe', hex: '#B09A84', recommendation: 'Tailoring' },
    { name: 'Honey', hex: '#D9A86C', recommendation: 'Evening and autumn pieces' },
  ],
  avoid: [
    { name: 'Black Ink', hex: '#1A1A1A', recommendation: 'Too heavy for your lightness' },
    { name: 'Navy', hex: '#1B2A4A', recommendation: 'Dulls your fresh warmth' },
    { name: 'Charcoal', hex: '#3A3F44', recommendation: 'Weighs down your glow' },
    { name: 'Burgundy', hex: '#722F37', recommendation: 'Too deep for your palette' },
  ],
  archetypes: [
    {
      title: 'The Fresh Romantic',
      description:
        'Airy fabrics, delicate prints, and warm pastels bring out your brightness. You read as soft yet luminous.',
    },
    {
      title: 'The Sunlit Minimalist',
      description:
        'Light, warm neutrals and clean lines let your golden freshness carry the look.',
    },
    {
      title: 'The Cottage Classic',
      description:
        'Peach, butter, and soft aqua suit you — relaxed tailoring in light warm tones.',
    },
  ],
};

const TRUE_WARM_SPRING: SeasonInfo = {
  season: 'True Warm Spring',
  tagline: 'Warm, clear, and radiant.',
  description:
    'True Warm Spring sits at the clear, golden core of the warm palette. Coral, turquoise, and golden yellow make your skin glow — while black and stark grey can flatten you.',
  palette: [
    { name: 'Golden Yellow', hex: '#F6C667', recommendation: 'Statement pieces' },
    { name: 'Coral', hex: '#FF7F50', recommendation: 'Dresses and blouses' },
    { name: 'Tomato', hex: '#FF6347', recommendation: 'A bold accent colour' },
    { name: 'Turquoise', hex: '#2EB8A8', recommendation: 'Statement outerwear' },
    { name: 'Light Green', hex: '#9CC25C', recommendation: 'Casual layers' },
    { name: 'Coral Pink', hex: '#F58FB8', recommendation: 'Prints and scarves' },
    { name: 'Golden Brown', hex: '#B5845C', recommendation: 'Coats and bags' },
    { name: 'Warm Cream', hex: '#FBF0DC', recommendation: 'The base of your wardrobe' },
    { name: 'Sky Blue', hex: '#78C8E8', recommendation: 'Light layering' },
    { name: 'Light Aqua', hex: '#7FD4C0', recommendation: 'Everyday knitwear' },
  ],
  neutrals: [
    { name: 'Warm Cream', hex: '#FBF0DC', recommendation: 'The base of your wardrobe' },
    { name: 'Light Tan', hex: '#E0C9A8', recommendation: 'Quiet layering' },
    { name: 'Golden Brown', hex: '#B5845C', recommendation: 'Coats and bags' },
    { name: 'Warm Grey', hex: '#B8AA9E', recommendation: 'Tailoring' },
    { name: 'Espresso', hex: '#4A2E1F', recommendation: 'Winter and evening pieces' },
  ],
  avoid: [
    { name: 'Black Ink', hex: '#1A1A1A', recommendation: 'Flattens your warmth' },
    { name: 'Navy', hex: '#1B2A4A', recommendation: 'Dulls your clarity' },
    { name: 'Pure White', hex: '#FFFFFF', recommendation: 'Too stark for your warm tone' },
    { name: 'Pure Grey', hex: '#808080', recommendation: 'Saps your glow' },
  ],
  archetypes: [
    {
      title: 'The Radiant Classic',
      description:
        'Warm, clear colours give you a healthy glow. Structured pieces in coral and golden tones look effortlessly polished.',
    },
    {
      title: 'The Warm Tailor',
      description:
        'Sharp silhouettes in warm earth tones. Your energy suits confident, clean dressing.',
    },
    {
      title: 'The Sunny Icon',
      description:
        'You carry clear warm colour like no one else — turquoise, coral, and butter yellow are your power shades.',
    },
  ],
};

const BRIGHT_SPRING: SeasonInfo = {
  season: 'Bright Spring',
  tagline: 'Vivid, clear, and electric.',
  description:
    'Bright Spring is the most saturated of the warm seasons. High-contrast colour sharpens your features — while muted, dusty tones can dim your natural radiance.',
  palette: [
    { name: 'Vivid Orange', hex: '#FF7A00', recommendation: 'Statement outerwear' },
    { name: 'Bright Yellow', hex: '#FFD400', recommendation: 'Accent pieces' },
    { name: 'Hot Pink', hex: '#FF4D9D', recommendation: 'Dresses and blouses' },
    { name: 'Emerald', hex: '#00A86B', recommendation: 'Evening pieces' },
    { name: 'Bright Turquoise', hex: '#00C8C8', recommendation: 'Statement accessories' },
    { name: 'Coral Orange', hex: '#FF6B57', recommendation: 'Tops and scarves' },
    { name: 'Royal Purple', hex: '#7B3FA0', recommendation: 'A bold accent colour' },
    { name: 'Light Aqua Blue', hex: '#66D6E8', recommendation: 'Light layering' },
    { name: 'Warm White', hex: '#FFF7E6', recommendation: 'The base of your wardrobe' },
    { name: 'Lime', hex: '#B6D94C', recommendation: 'Casual statement pieces' },
  ],
  neutrals: [
    { name: 'Warm White', hex: '#FFF7E6', recommendation: 'The base of your wardrobe' },
    { name: 'Light Grey', hex: '#E5E0D8', recommendation: 'Quiet layering' },
    { name: 'Taupe Stone', hex: '#B8A99A', recommendation: 'Coats and bags' },
    { name: 'Medium Brown', hex: '#8B5A2B', recommendation: 'Tailoring and belts' },
    { name: 'Espresso', hex: '#4A2E1F', recommendation: 'Evening pieces' },
  ],
  avoid: [
    { name: 'Wine', hex: '#6E1423', recommendation: 'Too heavy and muted for you' },
    { name: 'Muted Olive', hex: '#6B6B4A', recommendation: 'Dims your brightness' },
    { name: 'Dusty Rose', hex: '#C9A2A4', recommendation: 'Fights your clarity' },
    { name: 'Charcoal', hex: '#3A3F44', recommendation: 'Flattens your colour' },
  ],
  archetypes: [
    {
      title: 'The Vibrant Minimalist',
      description:
        'High-contrast warm colour with clean lines. You bring drama without ever feeling heavy.',
    },
    {
      title: 'The Bold Classic',
      description:
        'Electric shades and crisp whites sharpen your features. One vivid piece is all you need.',
    },
    {
      title: 'The Playful Tailor',
      description:
        'You pair saturated colour with clean structure — the rare combination of playful and precise.',
    },
  ],
};

const LIGHT_SUMMER: SeasonInfo = {
  season: 'Light Summer',
  tagline: 'Cool, gentle, and powdery.',
  description:
    'Light Summer lives in the soft, cool pastels. Baby blue, dusty pink, and lavender flatter you — while heavy black or fire orange can overwhelm your delicacy.',
  palette: [
    { name: 'Baby Blue', hex: '#A8C8E8', recommendation: 'Blouses and knitwear' },
    { name: 'Dusty Pink', hex: '#E3B7C6', recommendation: 'Dresses and blouses' },
    { name: 'Powder Lavender', hex: '#C4B7D9', recommendation: 'Light layering' },
    { name: 'Soft Aqua', hex: '#A8D8D0', recommendation: 'Everyday knitwear' },
    { name: 'Light Grey Blue', hex: '#A9B8C8', recommendation: 'Tailoring' },
    { name: 'Rose', hex: '#E8A0B4', recommendation: 'Scarves and accessories' },
    { name: 'Cool Mint', hex: '#B5D8C0', recommendation: 'Casual pieces' },
    { name: 'Pale Yellow', hex: '#F2E8C6', recommendation: 'Light summer layers' },
    { name: 'Light Plum', hex: '#B79AAC', recommendation: 'Evening pieces' },
    { name: 'Cool White', hex: '#F7F6F2', recommendation: 'The base of your wardrobe' },
  ],
  neutrals: [
    { name: 'Cool White', hex: '#F7F6F2', recommendation: 'The base of your wardrobe' },
    { name: 'Light Grey', hex: '#D8D6D2', recommendation: 'Quiet layering' },
    { name: 'Cool Beige', hex: '#C4B8A8', recommendation: 'Coats and bags' },
    { name: 'Slate', hex: '#7A8B9A', recommendation: 'Tailoring' },
    { name: 'Mid Grey', hex: '#8A8A90', recommendation: 'Everyday neutrals' },
  ],
  avoid: [
    { name: 'Black Ink', hex: '#1A1A1A', recommendation: 'Too heavy for your softness' },
    { name: 'Vivid Orange', hex: '#FF7A00', recommendation: 'Fights your cool tone' },
    { name: 'Bright Yellow', hex: '#FFD400', recommendation: 'Overpowers your palette' },
    { name: 'Wine', hex: '#6E1423', recommendation: 'Too deep for your lightness' },
  ],
  archetypes: [
    {
      title: 'The Airy Romantic',
      description:
        'Cool, gentle pastels mirror your natural softness. You look best in light fabrics and delicate colours.',
    },
    {
      title: 'The Quiet Minimalist',
      description:
        'Soft cool neutrals with clean lines. Your palette is whisper-quiet and deeply flattering.',
    },
    {
      title: 'The Cool Elegant',
      description:
        'Powder blue, rose, and lavender suit you. Understated tailoring reads effortlessly refined.',
    },
  ],
};

const TRUE_COOL_SUMMER: SeasonInfo = {
  season: 'True Cool Summer',
  tagline: 'Cool, clear, and refined.',
  description:
    'True Cool Summer blends cool clarity with gentle depth. Rose, lavender, and powder blue keep you fresh — while warm earthy tones can make you look tired.',
  palette: [
    { name: 'Cool Rose', hex: '#E58BA6', recommendation: 'Dresses and blouses' },
    { name: 'Lavender', hex: '#A99AD1', recommendation: 'Light layering' },
    { name: 'Soft Blue', hex: '#8FB4D4', recommendation: 'Blouses and knitwear' },
    { name: 'Raspberry', hex: '#C2185B', recommendation: 'A bold accent colour' },
    { name: 'Soft Teal', hex: '#5FA9A5', recommendation: 'Evening pieces' },
    { name: 'Plum', hex: '#7D5B8C', recommendation: 'Accessories' },
    { name: 'Silver', hex: '#9AA3AE', recommendation: 'Metallic accents' },
    { name: 'Slate Blue', hex: '#6C7A94', recommendation: 'Tailoring' },
    { name: 'Pale Aqua', hex: '#9FD4C8', recommendation: 'Everyday knitwear' },
    { name: 'Icy Rose', hex: '#F0C4CE', recommendation: 'Light layering' },
  ],
  neutrals: [
    { name: 'Cool White', hex: '#F7F6F2', recommendation: 'The base of your wardrobe' },
    { name: 'Dove Grey', hex: '#C9CDD4', recommendation: 'Quiet layering' },
    { name: 'Slate Blue', hex: '#6C7A94', recommendation: 'Tailoring' },
    { name: 'Mid Grey', hex: '#8A8A90', recommendation: 'Everyday neutrals' },
    { name: 'Deep Grey', hex: '#4A4E55', recommendation: 'Winter pieces' },
  ],
  avoid: [
    { name: 'Vivid Orange', hex: '#FF7A00', recommendation: 'Fights your cool tone' },
    { name: 'Goldenrod', hex: '#B8860B', recommendation: 'Dulls your freshness' },
    { name: 'Muted Olive', hex: '#6B6B4A', recommendation: 'Makes you look sallow' },
    { name: 'Rust', hex: '#B7410E', recommendation: 'Warms you too far' },
  ],
  archetypes: [
    {
      title: 'The Cool Classic',
      description:
        'Rose, lavender, and powder blue keep you looking fresh. Timeless pieces in cool tones are your strength.',
    },
    {
      title: 'The Refined Minimalist',
      description:
        'Muted cool shades with clean structure. You favour quiet, precise dressing.',
    },
    {
      title: 'The Soft Modernist',
      description:
        'You balance cool clarity with gentleness — raspberry and dusty blue make you glow.',
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

const SOFT_AUTUMN: SeasonInfo = {
  season: 'Soft Autumn',
  tagline: 'Earthy, muted, and gentle.',
  description:
    'Soft Autumn blends warm with neutral and muted. Olive, camel, and terracotta sit softly against your skin — while stark black or electric blue can fight your gentleness.',
  palette: [
    { name: 'Muted Terracotta', hex: '#C98A6B', recommendation: 'Blouses and knitwear' },
    { name: 'Muted Olive', hex: '#6B6B4A', recommendation: 'Casual outerwear' },
    { name: 'Camel Tan', hex: '#B89968', recommendation: 'Coats and bags' },
    { name: 'Dusty Rose Tan', hex: '#C9A29A', recommendation: 'Dresses' },
    { name: 'Moss Green', hex: '#6E7A50', recommendation: 'Trousers and skirts' },
    { name: 'Taupe', hex: '#A08C7A', recommendation: 'Everyday neutrals' },
    { name: 'Muted Gold', hex: '#C7A84B', recommendation: 'Statement accessories' },
    { name: 'Warm Brown', hex: '#7A5540', recommendation: 'Leather goods' },
    { name: 'Slate Teal', hex: '#6B7D6B', recommendation: 'Evening pieces' },
    { name: 'Warm Cream', hex: '#F2E8D5', recommendation: 'The base of your wardrobe' },
  ],
  neutrals: [
    { name: 'Warm Cream', hex: '#F2E8D5', recommendation: 'The base of your wardrobe' },
    { name: 'Beige', hex: '#D8C3A5', recommendation: 'Quiet layering' },
    { name: 'Taupe', hex: '#A08C7A', recommendation: 'Coats and bags' },
    { name: 'Soft Grey', hex: '#B0A89C', recommendation: 'Tailoring' },
    { name: 'Deep Brown', hex: '#4A3326', recommendation: 'Winter pieces' },
  ],
  avoid: [
    { name: 'Black Ink', hex: '#1A1A1A', recommendation: 'Too harsh for your softness' },
    { name: 'Pure White', hex: '#FFFFFF', recommendation: 'Dulls your warmth' },
    { name: 'Electric Blue', hex: '#1F4ED8', recommendation: 'Fights your muted tone' },
    { name: 'Hot Pink', hex: '#FF4D9D', recommendation: 'Overwhelms your palette' },
  ],
  archetypes: [
    {
      title: 'The Earthy Romantic',
      description:
        'Muted warm tones blend softly with your skin. Natural fabrics in olive, camel, and terracotta are made for you.',
    },
    {
      title: 'The Quiet Craftsman',
      description:
        'You favour texture over noise — moss, taupe, and muted gold in relaxed, quality pieces.',
    },
    {
      title: 'The Warm Minimalist',
      description:
        'Muted warm neutrals with simple lines. Your palette does the talking, quietly.',
    },
  ],
};

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

const DEEP_AUTUMN: SeasonInfo = {
  season: 'Deep Autumn',
  tagline: 'Rich, warm, and dramatic.',
  description:
    'Deep Autumn is the darkest of the warm seasons. Chocolate, forest, and bronze anchor you — while light pastels can wash out your depth.',
  palette: [
    { name: 'Deep Olive', hex: '#4A5D23', recommendation: 'Casual outerwear' },
    { name: 'Dark Chocolate', hex: '#4A2A17', recommendation: 'Tailoring and coats' },
    { name: 'Burnt Orange', hex: '#C95A2B', recommendation: 'A bold accent colour' },
    { name: 'Mahogany', hex: '#7A3B2E', recommendation: 'Leather goods' },
    { name: 'Deep Teal', hex: '#2F5D5A', recommendation: 'Evening pieces' },
    { name: 'Bronze', hex: '#8C6B2F', recommendation: 'Metallic accents' },
    { name: 'Espresso', hex: '#3B2318', recommendation: 'The base of your wardrobe' },
    { name: 'Deep Rust', hex: '#9E3B1F', recommendation: 'Statement pieces' },
    { name: 'Forest Green', hex: '#2F4F2F', recommendation: 'Trousers and skirts' },
    { name: 'Warm Plum', hex: '#6B3A5A', recommendation: 'Evening accessories' },
  ],
  neutrals: [
    { name: 'Espresso', hex: '#3B2318', recommendation: 'The base of your wardrobe' },
    { name: 'Dark Chocolate', hex: '#4A2A17', recommendation: 'Tailoring' },
    { name: 'Deep Olive', hex: '#4A5D23', recommendation: 'Casual pieces' },
    { name: 'Charcoal Brown', hex: '#3A322A', recommendation: 'Winter outerwear' },
    { name: 'Black-Brown', hex: '#2A241F', recommendation: 'Evening pieces' },
  ],
  avoid: [
    { name: 'Baby Blue', hex: '#A8C8E8', recommendation: 'Too light and cool for you' },
    { name: 'Soft Turquoise', hex: '#8FD3C7', recommendation: 'Washes out your depth' },
    { name: 'Hot Pink', hex: '#FF4D9D', recommendation: 'Fights your warmth' },
    { name: 'Dove Grey', hex: '#C9CDD4', recommendation: 'Dims your richness' },
  ],
  archetypes: [
    {
      title: 'The Rich Classic',
      description:
        'Deep, warm colour anchors you. Chocolate, forest, and bronze in structured pieces are unmistakably yours.',
    },
    {
      title: 'The Dramatic Earth',
      description:
        'You carry darkness with warmth — espresso and deep rust give you presence without harshness.',
    },
    {
      title: 'The Timeless Romantic',
      description:
        'Rich jewel-warm tones in luxurious fabrics. Your palette feels both vintage and modern.',
    },
  ],
};

const DEEP_WINTER: SeasonInfo = {
  season: 'Deep Winter',
  tagline: 'Dark, cool, and commanding.',
  description:
    'Deep Winter is the cool, high-depth season. Black, navy, and jewel tones intensify you — while pale warm shades can fade you into the background.',
  palette: [
    { name: 'Black Ink', hex: '#1A1A1A', recommendation: 'The base of your wardrobe' },
    { name: 'Deep Navy', hex: '#0E1B3A', recommendation: 'Tailoring' },
    { name: 'Emerald', hex: '#00594C', recommendation: 'Evening pieces' },
    { name: 'Wine', hex: '#6E1423', recommendation: 'A rich accent colour' },
    { name: 'Royal Purple', hex: '#4A2E8A', recommendation: 'Statement outerwear' },
    { name: 'Deep Teal', hex: '#00565C', recommendation: 'Blouses and dresses' },
    { name: 'Dark Charcoal', hex: '#2A2D34', recommendation: 'Winter layers' },
    { name: 'Dark Magenta', hex: '#8E2A6B', recommendation: 'A bold accent colour' },
    { name: 'Deep Plum', hex: '#4A235A', recommendation: 'Evening accessories' },
    { name: 'Black-Blue', hex: '#1B2A55', recommendation: 'Denim and casual pieces' },
  ],
  neutrals: [
    { name: 'Black Ink', hex: '#1A1A1A', recommendation: 'The base of your wardrobe' },
    { name: 'Deep Navy', hex: '#0E1B3A', recommendation: 'Tailoring and denim' },
    { name: 'Dark Charcoal', hex: '#2A2D34', recommendation: 'Winter layers' },
    { name: 'Charcoal', hex: '#3A3F44', recommendation: 'Everyday tailoring' },
    { name: 'Deep Slate', hex: '#232936', recommendation: 'Evening pieces' },
  ],
  avoid: [
    { name: 'Warm Cream', hex: '#F2E8D5', recommendation: 'Too warm and pale for you' },
    { name: 'Light Caramel', hex: '#C89F7A', recommendation: 'Dulls your cool depth' },
    { name: 'Beige', hex: '#D8C3A5', recommendation: 'Fades your richness' },
    { name: 'Muted Gold', hex: '#C7A84B', recommendation: 'Fights your cool tone' },
  ],
  archetypes: [
    {
      title: 'The Dark Icon',
      description:
        'Deep, saturated colour with sharp tailoring. You are at your most magnetic in black and jewel tones.',
    },
    {
      title: 'The Modern Classic',
      description:
        'Navy, emerald, and burgundy suit your depth. Clean, deliberate silhouettes are your language.',
    },
    {
      title: 'The Bold Minimalist',
      description:
        'You need no colour noise — deep tones and precise structure carry your look completely.',
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

const BRIGHT_WINTER: SeasonInfo = {
  season: 'Bright Winter',
  tagline: 'Clear, icy, and electric.',
  description:
    'Bright Winter pairs cool clarity with the highest contrast of all. Pure white and black sharpened with electric colour make you shine — while muted earthy tones can wash you out.',
  palette: [
    { name: 'Pure White', hex: '#FFFFFF', recommendation: 'Crisp shirts and blouses' },
    { name: 'Black Ink', hex: '#000000', recommendation: 'Structured evening pieces' },
    { name: 'Royal Blue', hex: '#1E3FBF', recommendation: 'Statement outerwear' },
    { name: 'Hot Pink', hex: '#FF2E9A', recommendation: 'A bold accent colour' },
    { name: 'Electric Blue', hex: '#0A5CD8', recommendation: 'Evening wear' },
    { name: 'Crimson', hex: '#C8102E', recommendation: 'Lip colour and accessories' },
    { name: 'Emerald', hex: '#009B6B', recommendation: 'Statement pieces' },
    { name: 'Magenta', hex: '#D40078', recommendation: 'Dresses and blouses' },
    { name: 'Icy Blue', hex: '#A8D8F0', recommendation: 'Light layering' },
    { name: 'Purple', hex: '#5E2EC0', recommendation: 'Evening accessories' },
  ],
  neutrals: [
    { name: 'Pure White', hex: '#FFFFFF', recommendation: 'The base of your wardrobe' },
    { name: 'Black Ink', hex: '#000000', recommendation: 'Structured pieces' },
    { name: 'Charcoal', hex: '#3A3F44', recommendation: 'Tailoring' },
    { name: 'Silver', hex: '#9AA3AE', recommendation: 'Metallic accents' },
    { name: 'Mid Grey', hex: '#6E727A', recommendation: 'Everyday neutrals' },
  ],
  avoid: [
    { name: 'Light Caramel', hex: '#C89F7A', recommendation: 'Too muted for your clarity' },
    { name: 'Muted Olive', hex: '#6B6B4A', recommendation: 'Dims your brightness' },
    { name: 'Warm Brown', hex: '#7A5540', recommendation: 'Fights your cool tone' },
    { name: 'Beige', hex: '#D8C3A5', recommendation: 'Washes out your contrast' },
  ],
  archetypes: [
    {
      title: 'The Electric Classic',
      description:
        'Pure white, black, and electric colour create your signature contrast. You make a statement by walking in.',
    },
    {
      title: 'The High-Contrast Minimalist',
      description:
        'Sharp, graphic dressing suits you. Hot pink against black, royal blue against white — flawless.',
    },
    {
      title: 'The Bold Modernist',
      description:
        'You carry saturated colour with clarity and confidence. Your energy is unmistakable.',
    },
  ],
};

export const SEASONS: Record<string, SeasonInfo> = {
  'Light Spring': LIGHT_SPRING,
  'True Warm Spring': TRUE_WARM_SPRING,
  'Bright Spring': BRIGHT_SPRING,
  'Light Summer': LIGHT_SUMMER,
  'True Cool Summer': TRUE_COOL_SUMMER,
  'Soft Summer': SOFT_SUMMER,
  'Soft Autumn': SOFT_AUTUMN,
  'Warm Autumn': WARM_AUTUMN,
  'Deep Autumn': DEEP_AUTUMN,
  'Deep Winter': DEEP_WINTER,
  'Cool Winter': COOL_WINTER,
  'Bright Winter': BRIGHT_WINTER,
};

/**
 * The season you would land in if your undertone had read the other way
 * (or one step softer in the same family). Used to frame the confidence
 * score in the report: "Warm Autumn, 87% confidence — runner-up Soft Autumn".
 */
export const RUNNER_UP_SEASONS: Record<string, string> = {
  'Light Spring': 'Light Summer',
  'True Warm Spring': 'Warm Autumn',
  'Bright Spring': 'Bright Winter',
  'Light Summer': 'Light Spring',
  'True Cool Summer': 'Cool Winter',
  'Soft Summer': 'Soft Autumn',
  'Soft Autumn': 'Warm Autumn',
  'Warm Autumn': 'Deep Autumn',
  'Deep Autumn': 'Deep Winter',
  'Deep Winter': 'Cool Winter',
  'Cool Winter': 'Deep Winter',
  'Bright Winter': 'Bright Spring',
};

export interface SeasonFeatures {
  skinHex?: string;
  hairColor?: string;
  eyeColor?: string;
}

export function deriveSeason(undertone: string, features?: SeasonFeatures): string {
  const hasFeatures = Boolean(features?.skinHex || features?.hairColor || features?.eyeColor);
  if (!hasFeatures) {
    if (undertone === 'warm') return 'Warm Autumn';
    if (undertone === 'cool') return 'Cool Winter';
    return 'Soft Summer';
  }

  const family: 'warm' | 'cool' =
    undertone === 'neutral' ? neutralFamily(features) : (undertone as 'warm' | 'cool');

  const value = valueDepth(features);
  const chroma = contrastLevel(features);
  const skinL = skinLightness(features);

  if (family === 'warm') {
    if (value === 'deep') return 'Deep Autumn';
    if (value === 'light') return chroma === 'bright' ? 'Bright Spring' : 'Light Spring';
    if (chroma === 'soft') return 'Soft Autumn';
    if (chroma === 'bright') return 'Bright Spring';
    if (typeof skinL === 'number' && skinL > 0.5) return 'True Warm Spring';
    return 'Warm Autumn';
  }

  if (value === 'deep') return chroma === 'bright' ? 'Bright Winter' : 'Deep Winter';
  if (value === 'light') return 'Light Summer';
  if (chroma === 'soft') return 'Soft Summer';
  if (chroma === 'bright') return 'Bright Winter';
  if (typeof skinL === 'number' && skinL > 0.5) return 'True Cool Summer';
  return 'Cool Winter';
}

function neutralFamily(features?: SeasonFeatures): 'warm' | 'cool' {
  const l = skinLightness(features);
  if (typeof l === 'number') {
    if (l < 0.45) return 'warm';
    if (l > 0.6) return 'cool';
  }

  const hair = (features?.hairColor ?? '').toLowerCase();
  if (/(black|blue|ash|grey|gray|platinum|burgundy)/.test(hair)) return 'cool';
  if (/(red|copper|golden|auburn|strawberry|blonde)/.test(hair)) return 'warm';

  return 'cool';
}

const HAIR_LIGHTNESS: Record<string, number> = {
  'dark brown': 0.22, 'dark blonde': 0.55, 'light brown': 0.45, 'light blonde': 0.7,
  'golden blonde': 0.6, 'strawberry blonde': 0.55, 'dark chestnut': 0.24,
  black: 0.1, brown: 0.34, chestnut: 0.3, blonde: 0.62, platinum: 0.78,
  red: 0.35, auburn: 0.32, burgundy: 0.28, grey: 0.75, gray: 0.75, white: 0.85,
};

const EYE_LIGHTNESS: Record<string, number> = {
  black: 0.1, 'dark brown': 0.18, 'light brown': 0.3,
  brown: 0.22, hazel: 0.3, amber: 0.28, green: 0.35,
  blue: 0.42, 'light blue': 0.5, grey: 0.5, gray: 0.5, dark: 0.15,
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
  const l = hexToLuma(features.skinHex);
  return Number.isFinite(l) ? l : null;
}

type ValueLevel = 'light' | 'medium' | 'deep';

function valueDepth(features?: SeasonFeatures): ValueLevel {
  const sample = [hairLightness(features?.hairColor), skinLightness(features)].filter(
    (v): v is number => typeof v === 'number',
  );
  if (sample.length === 0) return 'medium';
  const avg = sample.reduce((a, b) => a + b, 0) / sample.length;
  if (avg < 0.28) return 'deep';
  if (avg > 0.58) return 'light';
  return 'medium';
}

function contrastLevel(features?: SeasonFeatures): 'soft' | 'true' | 'bright' {
  const skin = skinLightness(features);
  const hair = hairLightness(features?.hairColor);
  const eye = eyeLightness(features?.eyeColor);

  let values: number[];
  if (typeof skin === 'number' && typeof hair === 'number') {
    values = [skin, hair];
  } else if (typeof skin === 'number' && typeof eye === 'number') {
    values = [skin, eye];
  } else {
    return 'true';
  }

  const spread = Math.max(...values) - Math.min(...values);
  if (spread > 0.5) return 'bright';
  if (spread < 0.3) return 'soft';
  return 'true';
}

export function getSeasonInfo(season?: string, undertone?: string): SeasonInfo {
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
