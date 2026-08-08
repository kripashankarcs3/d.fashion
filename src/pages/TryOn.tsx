import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { success } from '@/lib/toast';
import { Bookmark, Download, LoaderCircle, RotateCw, Scissors, Shirt, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/navigation';
import { Badge } from '@/components/ui/badge';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import Reveal from '@/components/editorial/Reveal';
import CampaignSection from '@/components/editorial/CampaignSection';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { CAMPAIGN } from '@/lib/editorial-images';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import { useStyleStore } from '@/store/useStyleStore';
import { useTryOn } from '@/hooks/useTryOn';
import { getSeasonInfo } from '@/lib/colour-data';
import { listTryOnTemplates, assetUrl } from '@/services/api';
import { cn, srcsetFromUrl } from '@/lib/utils';

type Mode = 'outfits' | 'makeup' | 'hair';
type GarmentCategory = 'Dresses' | 'Tops' | 'Bottoms' | 'Outerwear' | 'Ethnic Wear';

interface Garment {
  id: number;
  name: string;
  category: GarmentCategory;
  img: string;
  colourHex: string;
  colourName: string;
  buyUrl?: string;
}

interface Selected {
  kind: 'outfit' | 'look' | 'hair';
  id: string;
  name: string;
  img: string;
  colourName?: string;
  colourHex?: string;
}

const GARMENT_CATEGORIES: GarmentCategory[] = ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Ethnic Wear'];

const garments: Garment[] = [
  // ── Dresses — women's dresses with accurate names ────────────────────────
  { id:101, category:'Dresses', name:'White Wedding Dress', img:'https://images.unsplash.com/photo-qmQI0l28AKs?w=600&q=80', colourHex:'#FFFFFF', colourName:'White', buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:102, category:'Dresses', name:'Colorful Dresses', img:'https://images.unsplash.com/photo-OYYE4g-I5ZQ?w=600&q=80', colourHex:'#E8C4A0', colourName:'Multicolor', buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:103, category:'Dresses', name:'Black Outfit', img:'https://images.unsplash.com/photo-A3MleA0jtoE?w=600&q=80', colourHex:'#1A1A1A', colourName:'Black', buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:104, category:'Dresses', name:'Outdoor Dress', img:'https://images.unsplash.com/photo-vqKnuG8GaQc?w=600&q=80', colourHex:'#3498DB', colourName:'Blue', buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:105, category:'Dresses', name:'Silk Wedding Dress', img:'https://images.unsplash.com/photo-CJBK_N6Le1Y?w=600&q=80', colourHex:'#FDEBD0', colourName:'Ivory', buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:106, category:'Dresses', name:'Floral Dress', img:'https://images.unsplash.com/photo-DPOPc2vhUww?w=600&q=80', colourHex:'#FFFFFF', colourName:'White', buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:107, category:'Dresses', name:'Colorful Standing Dress', img:'https://images.unsplash.com/photo-VsTINCD8GNI?w=600&q=80', colourHex:'#E8C4A0', colourName:'Multicolor', buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },
  { id:108, category:'Dresses', name:'White Sleeveless Dress', img:'https://images.unsplash.com/photo-DnOgzmRYFeg?w=600&q=80', colourHex:'#F5F5F5', colourName:'White', buyUrl:'https://www.myntra.com/women/dresses/new arrivals/new arrivals' },

  // ── Tops — women's tops, blouses, shirts ─────────────────────────────────
  { id:201, category:'Tops', name:'Black Shirt', img:'https://images.unsplash.com/photo-wD6-BLQepzI?w=600&q=80', colourHex:'#1A1A1A', colourName:'Black', buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:202, category:'Tops', name:'Red Top', img:'https://images.unsplash.com/photo-Xs1i1bZjU9Y?w=600&q=80', colourHex:'#E74C3C', colourName:'Red', buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:203, category:'Tops', name:'White Sleeveless Shirt', img:'https://images.unsplash.com/photo-g4nUezDE0Yg?w=600&q=80', colourHex:'#FFFFFF', colourName:'White', buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:204, category:'Tops', name:'Floral Print Blouse', img:'https://images.unsplash.com/photo-xCH1vlk-feA?w=600&q=80', colourHex:'#E8C4A0', colourName:'Multicolor', buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:205, category:'Tops', name:'Green Shirt', img:'https://images.unsplash.com/photo-9gqqULegQho?w=600&q=80', colourHex:'#27AE60', colourName:'Green', buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:206, category:'Tops', name:'Pink Floral Blouse', img:'https://images.unsplash.com/photo-UhBh6y_fQ1U?w=600&q=80', colourHex:'#F8BBD0', colourName:'Pink', buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:207, category:'Tops', name:'Blue Checkered Shirt', img:'https://images.unsplash.com/photo-RqYTuWkTdEs?w=600&q=80', colourHex:'#3498DB', colourName:'Blue', buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:208, category:'Tops', name:'White Shirt with Jeans', img:'https://images.unsplash.com/photo-sjUgmthGSgg?w=600&q=80', colourHex:'#FFFFFF', colourName:'White', buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:209, category:'Tops', name:'White Blazer', img:'https://images.unsplash.com/photo-tOPAaNFUB70?w=600&q=80', colourHex:'#FFFFFF', colourName:'White', buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },
  { id:210, category:'Tops', name:'Light Blue Shirt', img:'https://images.unsplash.com/photo-u-4g3QnRHLo?w=600&q=80', colourHex:'#AED6F1', colourName:'Light Blue', buyUrl:'https://www.ajio.com/women-tops-and-tees/c/830201013' },

  // ── Bottoms — jeans, pants, skirts ───────────────────────────────────────
  { id:301, category:'Bottoms', name:'Blue Denim Jeans', img:'https://images.unsplash.com/photo-EtOMMg1nSR8?w=600&q=80', colourHex:'#1A237E', colourName:'Denim Blue', buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:302, category:'Bottoms', name:'White Top Blue Jeans', img:'https://images.unsplash.com/photo-2s3GhhJz2uY?w=600&q=80', colourHex:'#2E86C1', colourName:'Blue', buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:303, category:'Bottoms', name:'Stack of Jeans', img:'https://images.unsplash.com/photo-aWLTXw6kbDw?w=600&q=80', colourHex:'#1A237E', colourName:'Denim', buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:304, category:'Bottoms', name:'White Shirt Blue Jeans', img:'https://images.unsplash.com/photo-0HQzYawVQSY?w=600&q=80', colourHex:'#2E86C1', colourName:'Blue', buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:305, category:'Bottoms', name:'Folded Blue Jeans', img:'https://images.unsplash.com/photo-9yoXrG6Er_g?w=600&q=80', colourHex:'#2E86C1', colourName:'Blue', buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:306, category:'Bottoms', name:'Denim Jeans Collection', img:'https://images.unsplash.com/photo-m1m2EZOZVwA?w=600&q=80', colourHex:'#1A237E', colourName:'Denim Blue', buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:307, category:'Bottoms', name:'Standing in Jeans', img:'https://images.unsplash.com/photo-zDyJOj8ZXG0?w=600&q=80', colourHex:'#2E86C1', colourName:'Blue', buyUrl:'https://www.myntra.com/women/bottomwear' },
  { id:308, category:'Bottoms', name:'Blue Jeans Back View', img:'https://images.unsplash.com/photo-UinXCaBz44A?w=600&q=80', colourHex:'#2E86C1', colourName:'Denim Blue', buyUrl:'https://www.myntra.com/women/bottomwear' },

  // ── Outerwear — jackets, coats, blazers ─────────────────────────────────
  { id:401, category:'Outerwear', name:'Red Jacket', img:'https://images.unsplash.com/photo-L7MBmE1VbVg?w=600&q=80', colourHex:'#E74C3C', colourName:'Red', buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:402, category:'Outerwear', name:'Beige Trench Coat', img:'https://images.unsplash.com/photo-Xn7GvimQrk8?w=600&q=80', colourHex:'#D2B48C', colourName:'Beige', buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:403, category:'Outerwear', name:'Tan Trench Coat', img:'https://images.unsplash.com/photo-5vrque5NVHI?w=600&q=80', colourHex:'#C19A6B', colourName:'Tan', buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:404, category:'Outerwear', name:'Yellow Winter Coat', img:'https://images.unsplash.com/photo-__Ef8XniGLY?w=600&q=80', colourHex:'#F4D03F', colourName:'Yellow', buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:405, category:'Outerwear', name:'Tan Belted Coat', img:'https://images.unsplash.com/photo-P-71PdbFJZ0?w=600&q=80', colourHex:'#C19A6B', colourName:'Tan', buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:406, category:'Outerwear', name:'Black Dress Coat', img:'https://images.unsplash.com/photo-zu8HjlOZVvM?w=600&q=80', colourHex:'#1A1A1A', colourName:'Black', buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:407, category:'Outerwear', name:'Gray Coat', img:'https://images.unsplash.com/photo-wsE7x-6rdNs?w=600&q=80', colourHex:'#808080', colourName:'Gray', buyUrl:'https://www.myntra.com/women/jackets-and-coats' },
  { id:408, category:'Outerwear', name:'Brown Coat', img:'https://images.unsplash.com/photo-3EbASbuFCwU?w=600&q=80', colourHex:'#8B4513', colourName:'Brown', buyUrl:'https://www.myntra.com/women/jackets-and-coats' },

  // ── Ethnic Wear — sarees, kurtis, ethnic dresses ────────────────────────
  { id:501, category:'Ethnic Wear', name:'Traditional Jewelry Sari', img:'https://images.unsplash.com/photo-KxHcyNOIO_M?w=600&q=80', colourHex:'#E74C3C', colourName:'Red', buyUrl:'https://www.myntra.com/women/ethnic-wear/sarees' },
  { id:502, category:'Ethnic Wear', name:'Green Brown Sari', img:'https://images.unsplash.com/photo-7q-Z4IrqyYY?w=600&q=80', colourHex:'#27AE60', colourName:'Green', buyUrl:'https://www.myntra.com/women/ethnic-wear/sarees' },
  { id:503, category:'Ethnic Wear', name:'Colorful Vibrant Sari', img:'https://images.unsplash.com/photo-dCuCMZ9XnHg?w=600&q=80', colourHex:'#E8C4A0', colourName:'Multicolor', buyUrl:'https://www.myntra.com/women/ethnic-wear/sarees' },
  { id:504, category:'Ethnic Wear', name:'Red Sari', img:'https://images.unsplash.com/photo-d4msn4ZjF4?w=600&q=80', colourHex:'#E74C3C', colourName:'Red', buyUrl:'https://www.myntra.com/women/ethnic-wear/sarees' },
  { id:505, category:'Ethnic Wear', name:'Pink White Sari', img:'https://images.unsplash.com/photo-uJiY0y_XWH4?w=600&q=80', colourHex:'#F8BBD0', colourName:'Pink', buyUrl:'https://www.myntra.com/women/ethnic-wear/sarees' },
  { id:506, category:'Ethnic Wear', name:'Red White Floral Dress', img:'https://images.unsplash.com/photo-Y8bJ61Ozti0?w=600&q=80', colourHex:'#E74C3C', colourName:'Red', buyUrl:'https://www.myntra.com/women/ethnic-wear/kurtis' },
  { id:507, category:'Ethnic Wear', name:'Traditional Cultural Sari', img:'https://images.unsplash.com/photo-K-tVxCdqMLs?w=600&q=80', colourHex:'#E8C4A0', colourName:'Multicolor', buyUrl:'https://www.myntra.com/women/ethnic-wear/sarees' },
  { id:508, category:'Ethnic Wear', name:'Orange White Sari', img:'https://images.unsplash.com/photo-DrdF3zbhCoc?w=600&q=80', colourHex:'#E9A568', colourName:'Orange', buyUrl:'https://www.myntra.com/women/ethnic-wear/sarees' },
  { id:509, category:'Ethnic Wear', name:'Black Gold Sari', img:'https://images.unsplash.com/photo-d_oD0nUwbPc?w=600&q=80', colourHex:'#1A1A1A', colourName:'Black', buyUrl:'https://www.myntra.com/women/ethnic-wear/sarees' },
  { id:510, category:'Ethnic Wear', name:'Yellow Brown Dress', img:'https://images.unsplash.com/photo-09fUy4cAjCU?w=600&q=80', colourHex:'#F4D03F', colourName:'Yellow', buyUrl:'https://www.myntra.com/women/ethnic-wear/kurtis' },
  { id:511, category:'Ethnic Wear', name:'Red Gold Sari', img:'https://images.unsplash.com/photo-tQ14OF1UQn0?w=600&q=80', colourHex:'#E74C3C', colourName:'Red', buyUrl:'https://www.myntra.com/women/ethnic-wear/sarees' },
];

const tabs: { id: Mode; label: string; icon: typeof Shirt }[] = [
  { id: 'outfits', label: 'Outfits', icon: Shirt },
  { id: 'makeup',  label: 'Makeup',  icon: Sparkles },
  { id: 'hair',    label: 'Hair',    icon: Scissors },
];

interface TemplateItem { id: string; title: string; thumb: string; }

export default function TryOn() {
  const referenceImageUrl  = useStyleStore((s) => s.referenceImageUrl);
  const analysisResult     = useStyleStore((s) => s.analysisResult);
  const addWardrobeItem    = useStyleStore((s) => s.addWardrobeItem);
  const { clothes, makeup, hair } = useTryOn();

  const [mode,           setMode]           = useState<Mode>('outfits');
  const [activeCategory, setActiveCategory] = useState<GarmentCategory>('Dresses');
  const [selected,       setSelected]       = useState<Selected | null>(null);
  const [resultUrl,      setResultUrl]      = useState<string | null>(null);
  const [isFallback,     setIsFallback]     = useState(false);

  const selectedGarment = useMemo(() => {
    if (!selected || selected.kind !== 'outfit') return null;
    return garments.find((g) => String(g.id) === selected.id) ?? null;
  }, [selected]);

  const looksQuery = useQuery({
    queryKey: ['tryon-looks'],
    queryFn: () => listTryOnTemplates('look-vto').then((r) => r.data.items),
  });
  const hairQuery = useQuery({
    queryKey: ['tryon-hairs'],
    queryFn: () => listTryOnTemplates('hair-style').then((r) => r.data.items),
  });

  const palette = useMemo(() => {
    if (!analysisResult) return [];
    return getSeasonInfo(analysisResult.colourSeason, analysisResult.colorProfile.undertone).palette;
  }, [analysisResult]);

  const filteredByCategory = garments.filter((g) => g.category === activeCategory);

  const isPending = clothes.isPending || makeup.isPending || hair.isPending;

  const handleSelect = (item: Selected) => {
    setSelected(item);
    setResultUrl(null);
    setIsFallback(false);
  };

  const handleTryOn = () => {
    if (!selected || !referenceImageUrl) return;
    setResultUrl(null);
    setIsFallback(false);
    if (selected.kind === 'outfit') {
      clothes.mutate(
        { garmentUrl: selected.img, garmentName: selected.name, colourHex: selected.colourHex },
        { onSuccess: (r) => { setResultUrl(r.data.resultUrl); setIsFallback(r.data.source === 'fallback'); } },
      );
    } else if (selected.kind === 'look') {
      makeup.mutate(selected.id, {
        onSuccess: (r) => { setResultUrl(r.data.resultUrl); setIsFallback(r.data.source === 'fallback'); },
      });
    } else {
      hair.mutate(selected.id, {
        onSuccess: (r) => { setResultUrl(r.data.resultUrl); setIsFallback(r.data.source === 'fallback'); },
      });
    }
  };

  const handleAddToWardrobe = () => {
    if (selected?.kind !== 'outfit' || !resultUrl) return;
    addWardrobeItem({
      id: `look-${selected.id}-${Date.now()}`,
      imageUrl: resultUrl,
      name: selected.name,
      category: 'Virtual Try-On',
      palette: selected.colourHex ? [selected.colourHex] : [],
      styleTags: [],
      addedAt: new Date().toISOString(),
    });
    success('Saved to your dashboard');
  };

  const handleDownload = async () => {
    if (!resultUrl) return;
    const name = (selected?.name ?? 'tryon-result').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      const res = await fetch(resultUrl, { mode: 'cors' });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tryon-${name}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(resultUrl, '_blank');
    }
  };

  const ctaLabel = isPending
    ? selected?.kind === 'look' ? 'Applying…' : 'Trying On…'
    : resultUrl ? 'Try Again'
    : selected?.kind === 'look' ? 'Apply This Look'
    : selected?.kind === 'hair' ? 'Try This Hairstyle'
    : 'Try On This Outfit';

  return (
    <div className="w-full pb-24">
      {/* ── Hero — full-bleed campaign background like Home page ── */}
      <CampaignSection
        src={CAMPAIGN.archetype.base}
        alt={CAMPAIGN.archetype.alt}
        position={CAMPAIGN.archetype.position}
        anchor="bottom-left"
        height="tall"
        scrim="left"
        priority
        cinematicIntensity={0.95}
        fadeEdges
        className="min-h-[min(88svh,52rem)]"
        contentPadding="pb-24 md:pb-32 lg:pb-40"
      >
        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          {/* Left: copy */}
          <div className="max-w-[38rem]">
            <Reveal variant="fade">
              <EyebrowLabel tone="gold" rule>Virtual Try-On</EyebrowLabel>
            </Reveal>
            <motion.div
              initial={{ clipPath: 'inset(0 0 100% 0)', y: 8 }}
              animate={{ clipPath: 'inset(0 0 0% 0)', y: 0 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="mt-5 will-change-[clip-path]"
            >
              <EditorialHeading as="h1" size="xl" className="text-cream-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                See Your Colours, <Emphasis>On You.</Emphasis>
              </EditorialHeading>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-5 max-w-[44ch] text-lede font-light text-cream-primary/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]"
            >
              Select a category, pick any outfit, and watch it appear on your photo — powered by AI.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {['Dresses', 'Tops', 'Ethnic Wear', 'Outerwear', 'Bottoms'].map((cat) => (
                <span key={cat} className="rounded-sm border border-gold-hairline bg-surface-0/75 px-3 py-1 eyebrow-micro text-gold-primary backdrop-blur-sm">
                  {cat}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: before/after slider — same model, dress changed */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <BeforeAfterSlider
                beforeSrc="https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=500"
                afterColour="#1E3A5F"
                beforeLabel="Original"
                afterLabel="With Outfit"
                className="h-[26rem] w-72 shadow-2xl"
              />
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold-hairline bg-surface-0/90 px-4 py-1.5 text-[0.6rem] uppercase tracking-widest text-gold-primary backdrop-blur-sm"
              >
                ← drag to compare →
              </motion.div>
            </div>
          </motion.div>
        </div>
      </CampaignSection>

      <EditorialContainer width="content" className="pt-12">

        {!referenceImageUrl ? (
          <div className="mx-auto mt-14 w-full max-w-xl border border-gold-hairline bg-surface-3 p-8 text-center">
            <span aria-hidden className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-surface-4 text-gold-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <h2 className="mt-6 font-serif text-[length:var(--text-h5)] text-cream-primary">Upload your selfie first</h2>
            <p className="mx-auto mt-2 max-w-sm text-[length:var(--text-body-sm)] text-cream-primary/80">
              Virtual try-on needs a reference photo of you. Analyse one to unlock your palette.
            </p>
            <Link href={ROUTES.upload} className="mt-8 inline-block">
              <Button size="lg">Upload a Selfie</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Mode tabs */}
            <div className="mt-12 border-b border-gold-hairline">
              <div role="tablist" aria-label="Try-on category" className="flex gap-0">
                {tabs.map((tab) => (
                  <button key={tab.id} type="button" role="tab" aria-selected={mode === tab.id}
                    onClick={() => { setMode(tab.id); setSelected(null); setResultUrl(null); }}
                    className={cn('eyebrow relative px-6 py-4 transition-colors duration-200',
                      mode === tab.id ? 'text-cream-primary' : 'text-cream-primary/55 hover:text-cream-primary')}
                  >
                    {tab.label}
                    {mode === tab.id && (
                      <motion.div layoutId="tab-indicator" className="absolute inset-x-0 bottom-0 h-[2px] bg-gold-primary"
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start"
            >
              {/* Left — options */}
              <section>
                {mode === 'outfits' && (
                  <>
                    {/* Category sub-tabs */}
                    <div className="mb-6 overflow-x-auto scrollbar-none">
                      <div role="group" aria-label="Garment categories" className="flex w-max gap-2 pb-1">
                        {GARMENT_CATEGORIES.map((cat) => (
                          <button key={cat} type="button"
                            onClick={() => { setActiveCategory(cat); setSelected(null); setResultUrl(null); }}
                            className={cn('inline-flex min-h-10 items-center rounded-sm border px-4 eyebrow-micro transition-colors duration-200',
                              activeCategory === cat
                                ? 'border-gold-primary bg-gold-primary text-surface-0'
                                : 'border-gold-hairline bg-surface-3 text-cream-primary/70 hover:border-gold-primary hover:text-cream-primary')}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Garment grid */}
                    <motion.div
                      key={activeCategory}
                      className="grid grid-cols-2 gap-4 sm:grid-cols-3"
                      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
                      initial="hidden" animate="visible"
                    >
                      {filteredByCategory.map((garment) => {
                        const isSelected = selected?.id === String(garment.id);
                        return (
                          <motion.div key={garment.id}
                            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22,1,0.36,1] } } }}
                          >
                            <button type="button"
                              onClick={() => handleSelect({ kind:'outfit', id:String(garment.id), name:garment.name, img:garment.img, colourName:garment.colourName, colourHex:garment.colourHex })}
                              aria-pressed={isSelected}
                              className={cn('group w-full overflow-hidden border text-left transition-all duration-300',
                                isSelected ? 'border-gold-primary' : 'border-gold-hairline hover:border-gold-primary/50')}
                            >
                              <div className="aspect-[3/4] w-full overflow-hidden border-b border-gold-hairline">
                                <img src={garment.img} srcSet={srcsetFromUrl(garment.img, [300,600])}
                                  sizes="(min-width:1024px) 20vw, 40vw" alt={garment.name}
                                  width={300} height={400} loading="lazy"
                                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                />
                              </div>
                              <div className="p-3">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className="h-3 w-3 rounded-full border border-gold-hairline/40 shrink-0"
                                    style={{ backgroundColor: garment.colourHex }} />
                                  <p className="text-[0.6rem] uppercase tracking-wider text-cream-primary/45">{garment.colourName}</p>
                                </div>
                                <p className="text-body-sm font-light text-cream-primary leading-snug">{garment.name}</p>
                              </div>
                            </button>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </>
                )}

                {mode !== 'outfits' && (
                  <TemplateGrid mode={mode}
                    items={mode === 'makeup' ? looksQuery.data : hairQuery.data}
                    isLoading={mode === 'makeup' ? looksQuery.isLoading : hairQuery.isLoading}
                    selectedId={selected?.id ?? null}
                    onSelect={(item) => handleSelect({ kind: mode === 'makeup' ? 'look' : 'hair', id:item.id, name:item.title, img:item.thumb })}
                  />
                )}
              </section>

              {/* Right — studio */}
              <section className="lg:sticky lg:top-24">
                <EditorialHeading as="h2" size="sm">Try-On Studio</EditorialHeading>
                <div className="mt-6 border-t border-gold-hairline pt-6">
                  {selected ? (
                    <>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-cream-primary/55">
                            {selected.kind === 'outfit' ? 'Selected outfit' : selected.kind === 'look' ? 'Selected look' : 'Selected hairstyle'}
                          </p>
                          <p className="mt-1 font-serif text-[length:var(--text-h5)] text-cream-primary">{selected.name}</p>
                        </div>
                        <Badge variant="gold">{selected.colourName ?? (selected.kind === 'look' ? 'Makeup' : selected.kind === 'hair' ? 'Hair' : 'Look')}</Badge>
                      </div>

                      {/* Result: Before/After slider when try-on result available, else side-by-side */}
                      {resultUrl && !isFallback ? (
                        <div className="mt-6">
                          <p className="text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-cream-primary/55 mb-2">
                            Drag to compare
                          </p>
                          <BeforeAfterSlider
                            beforeSrc={assetUrl(referenceImageUrl)}
                            afterSrc={resultUrl}
                            afterColour={selected.colourHex}
                            beforeLabel="You"
                            afterLabel="Try-On"
                            className="aspect-[3/4] w-full"
                          />
                        </div>
                      ) : (
                        <div className="mt-6 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-cream-primary/55">You</p>
                          <div className="mt-2 aspect-[3/4] w-full overflow-hidden border border-gold-hairline">
                            <img src={assetUrl(referenceImageUrl)} alt="Your reference photo"
                              width={480} height={640} className="h-full w-full object-cover"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-cream-primary/55">
                              {resultUrl ? (isFallback ? 'Colour Preview' : 'Try-on') : 'Preview'}
                            </p>
                            {isFallback && resultUrl && (
                              <span className="rounded-sm border border-gold-hairline bg-surface-4 px-2 py-0.5 text-[0.55rem] uppercase tracking-widest text-gold-primary/70">Preview</span>
                            )}
                          </div>
                          <div className="relative mt-2 aspect-[3/4] w-full overflow-hidden border border-gold-hairline">
                            <AnimatePresence mode="wait">
                              <motion.img key={resultUrl ?? selected.img}
                                src={resultUrl ?? selected.img}
                                alt={resultUrl ? `Try-on: ${selected.name}` : selected.name}
                                width={480} height={640}
                                initial={{ opacity:0, scale:1.04 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.97 }}
                                transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
                                className="h-full w-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            </AnimatePresence>
                            {isFallback && resultUrl && selected.colourHex && (
                              <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-multiply"
                                style={{ backgroundColor: selected.colourHex, opacity: 0.4 }} />
                            )}
                          </div>
                          {isFallback && resultUrl && (
                            <p className="mt-1 text-[0.6rem] text-cream-primary/40">Colour preview — AI try-on coming soon</p>
                          )}
                        </div>
                      </div>
                      )}

                      <div className="mt-8 flex flex-col gap-3">
                        <Button size="lg" onClick={handleTryOn} disabled={isPending}>
                          {isPending ? <LoaderCircle className="animate-spin" aria-hidden /> : <RotateCw aria-hidden />}
                          {ctaLabel}
                        </Button>
                        {resultUrl && (
                          <Button variant="secondary" size="lg" onClick={handleDownload}>
                            <Download aria-hidden /> Download Result
                          </Button>
                        )}
                        {resultUrl && selected.kind === 'outfit' && (
                          <>
                            <Button variant="secondary" size="lg" onClick={handleAddToWardrobe}>
                              <Bookmark aria-hidden /> Add to Saved Looks
                            </Button>
                            {selectedGarment?.buyUrl && (
                              <a href={selectedGarment.buyUrl} target="_blank" rel="noopener noreferrer"
                                className="inline-flex min-h-[52px] w-full items-center justify-center bg-gold-primary px-10 text-nav font-semibold uppercase tracking-wider text-surface-0 transition-all hover:bg-gold-dark hover:text-cream-primary active:scale-[0.98]">
                                Buy on Myntra →
                              </a>
                            )}
                          </>
                        )}
                      </div>

                      {(clothes.isError || makeup.isError || hair.isError) && !isFallback && (
                        <p className="mt-4 text-[length:var(--text-body-sm)] text-error">The try-on could not be completed. Please try again.</p>
                      )}
                    </>
                  ) : (
                    <div className="py-16 text-center">
                      <p className="font-serif text-[length:var(--text-h5)] text-cream-primary">Select to begin</p>
                      <p className="mx-auto mt-2 max-w-sm text-[length:var(--text-body-sm)] text-cream-primary/80">
                        Choose a category on the left, then pick an outfit to preview.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          </>
        )}
      </EditorialContainer>
    </div>
  );
}

function TemplateGrid({ mode, items, isLoading, selectedId, onSelect }: {
  mode: Mode;
  items?: TemplateItem[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (item: TemplateItem) => void;
}) {
  // Indian hairstyle fallbacks when YouCam templates unavailable
  const indianHairStyles: TemplateItem[] = [
    { id: 'hair-local-1', title: 'Classic Bun',           thumb: 'https://images.unsplash.com/photo-DqdrdjYK0Lg?w=400&q=80' },
    { id: 'hair-local-2', title: 'Loose Waves',           thumb: 'https://images.unsplash.com/photo-TBOQVZTaO0I?w=400&q=80' },
    { id: 'hair-local-3', title: 'Sleek Low Bun',         thumb: 'https://images.unsplash.com/photo-AchMr9RGTsA?w=400&q=80' },
    { id: 'hair-local-4', title: 'Long Braid',            thumb: 'https://images.unsplash.com/photo-EruaqbLKhE?w=400&q=80' },
    { id: 'hair-local-5', title: 'Bridal Updo',           thumb: 'https://images.unsplash.com/photo-FsMH6MLUjl0?w=400&q=80' },
    { id: 'hair-local-6', title: 'Floral Bun',            thumb: 'https://images.unsplash.com/photo-GZYKEjWucKs?w=400&q=80' },
    { id: 'hair-local-7', title: 'Traditional Braid',     thumb: 'https://images.unsplash.com/photo-2bVL8geilAc?w=400&q=80' },
    { id: 'hair-local-8', title: 'Soft Waves',            thumb: 'https://images.unsplash.com/photo-Hf_k8QvPOGo?w=400&q=80' },
  ];

  // Indian makeup look fallbacks
  const indianMakeupLooks: TemplateItem[] = [
    { id: 'makeup-local-1', title: 'Bridal Glam',         thumb: 'https://images.unsplash.com/photo-iFpqcSJGaCo?w=400&q=80' },
    { id: 'makeup-local-2', title: 'Festive Smokey Eye',  thumb: 'https://images.unsplash.com/photo-5IOIy4tTN4w?w=400&q=80' },
    { id: 'makeup-local-3', title: 'Natural Look',        thumb: 'https://images.unsplash.com/photo-DqdrdjYK0Lg?w=400&q=80' },
    { id: 'makeup-local-4', title: 'Bold Red Lip',        thumb: 'https://images.unsplash.com/photo-fO2myfwWhU0?w=400&q=80' },
    { id: 'makeup-local-5', title: 'Traditional Kajal',   thumb: 'https://images.unsplash.com/photo-Ekr9-YgD9dY?w=400&q=80' },
    { id: 'makeup-local-6', title: 'Gold Crown Glam',     thumb: 'https://images.unsplash.com/photo-hpklBuuel_k?w=400&q=80' },
    { id: 'makeup-local-7', title: 'Minimal Natural',     thumb: 'https://images.unsplash.com/photo-epqDo9CYE1k?w=400&q=80' },
    { id: 'makeup-local-8', title: 'Classic Bridal',      thumb: 'https://images.unsplash.com/photo-VPwSJhu5uhs?w=400&q=80' },
  ];

  if (isLoading) {
    return (
      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse border border-gold-hairline bg-surface-3/40" />
        ))}
      </div>
    );
  }

  // Use local Indian fallbacks when YouCam returns empty
  const displayItems = (items && items.length > 0)
    ? items
    : mode === 'hair' ? indianHairStyles : indianMakeupLooks;

  const isLocalFallback = !items || items.length === 0;

  return (
    <div>
      {isLocalFallback && (
        <p className="mb-4 text-body-sm text-gold-primary/70 border border-gold-hairline/30 bg-gold-primary/5 px-4 py-2 rounded-sm">
          Showing curated Indian {mode === 'hair' ? 'hairstyle' : 'makeup'} styles — AI try-on preview will apply closest match.
        </p>
      )}
      <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3">
        {displayItems.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <button key={item.id} type="button" onClick={() => onSelect(item)} aria-pressed={isSelected}
              className={cn('group overflow-hidden border text-left transition-all duration-300',
                isSelected ? 'border-gold-primary' : 'border-gold-hairline hover:border-gold-primary/50')}
            >
              <div className="aspect-[4/5] w-full overflow-hidden border-b border-gold-hairline bg-surface-3/40">
                {item.thumb ? (
                  <img src={item.thumb} alt={item.title}
                    width={400} height={500} loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-surface-3">
                    <span className="eyebrow text-gold-primary/40">{item.title}</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-serif text-[length:var(--text-body-sm)] font-light text-cream-primary">{item.title}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


