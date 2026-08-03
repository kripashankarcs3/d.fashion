import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { success } from '@/lib/toast';
import {
  Bookmark,
  LoaderCircle,
  RotateCw,
  Scissors,
  Shirt,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageMasthead from '@/components/editorial/PageMasthead';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import { useStyleStore } from '@/store/useStyleStore';
import { useTryOn } from '@/hooks/useTryOn';
import { getSeasonInfo } from '@/lib/colour-data';
import { listTryOnTemplates } from '@/services/api';
import { cn, srcsetFromUrl } from '@/lib/utils';

type Mode = 'outfits' | 'makeup' | 'hair';

interface Garment {
  id: number;
  name: string;
  category: string;
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

const garments: Garment[] = [
  {
    id: 1,
    name: 'Double-Breasted Linen Blazer',
    category: 'Outerwear',
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    colourHex: '#C19A6B',
    colourName: 'Camel',
    buyUrl: 'https://www.farfetch.com/shopping/women/tailoring-1/items.aspx',
  },
  {
    id: 2,
    name: 'Silk Midi Dress',
    category: 'Dresses',
    img: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=800&q=80',
    colourHex: '#B7410E',
    colourName: 'Rust',
    buyUrl: 'https://www.farfetch.com/shopping/women/dresses-1/items.aspx',
  },
  {
    id: 3,
    name: 'Pleated Trousers',
    category: 'Bottoms',
    img: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&q=80',
    colourHex: '#556B2F',
    colourName: 'Olive',
    buyUrl: 'https://www.farfetch.com/shopping/women/pants-1/items.aspx',
  },
  {
    id: 4,
    name: 'Trench Coat',
    category: 'Outerwear',
    img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80',
    colourHex: '#B8860B',
    colourName: 'Goldenrod',
    buyUrl: 'https://www.farfetch.com/shopping/women/coats-1/items.aspx',
  },
  {
    id: 5,
    name: 'Leather Moto Jacket',
    category: 'Outerwear',
    img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    colourHex: '#8B4513',
    colourName: 'Saddle Brown',
    buyUrl: 'https://www.farfetch.com/shopping/women/jackets-1/items.aspx',
  },
  {
    id: 6,
    name: 'Oversized Knit',
    category: 'Tops',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    colourHex: '#D2691E',
    colourName: 'Chocolate',
    buyUrl: 'https://www.farfetch.com/shopping/women/knitwear-1/items.aspx',
  },
  {
    id: 7,
    name: 'Structured Evening Gown',
    category: 'Dresses',
    img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
    colourHex: '#1F4ED8',
    colourName: 'Electric Blue',
    buyUrl: 'https://www.farfetch.com/shopping/women/dresses-1/items.aspx',
  },
  {
    id: 8,
    name: 'Cashmere Turtleneck',
    category: 'Tops',
    img: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80',
    colourHex: '#3A3F44',
    colourName: 'Charcoal',
    buyUrl: 'https://www.farfetch.com/shopping/women/knitwear-1/items.aspx',
  },
  {
    id: 9,
    name: 'Satin Slip Skirt',
    category: 'Bottoms',
    img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80',
    colourHex: '#C9A2A4',
    colourName: 'Dusty Rose',
    buyUrl: 'https://www.farfetch.com/shopping/women/skirts-1/items.aspx',
  },
  {
    id: 10,
    name: 'Tailored Wool Coat',
    category: 'Outerwear',
    img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80',
    colourHex: '#16213E',
    colourName: 'Navy',
    buyUrl: 'https://www.farfetch.com/shopping/women/coats-1/items.aspx',
  },
  {
    id: 11,
    name: 'Organic Cotton Tee',
    category: 'Tops',
    img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    colourHex: '#F4F1EA',
    colourName: 'Soft White',
    buyUrl: 'https://www.farfetch.com/shopping/women/tops-1/items.aspx',
  },
  {
    id: 12,
    name: 'Velvet Wrap Dress',
    category: 'Dresses',
    img: 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=800&q=80',
    colourHex: '#7D6678',
    colourName: 'Dusty Plum',
    buyUrl: 'https://www.farfetch.com/shopping/women/dresses-1/items.aspx',
  },
  {
    id: 13,
    name: 'Linen Utility Jacket',
    category: 'Outerwear',
    img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
    colourHex: '#8A8D7A',
    colourName: 'Grey Sage',
    buyUrl: 'https://www.farfetch.com/shopping/women/jackets-1/items.aspx',
  },
  {
    id: 14,
    name: 'High-Rise Denim Jeans',
    category: 'Bottoms',
    img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    colourHex: '#6C7A94',
    colourName: 'Slate Blue',
    buyUrl: 'https://www.farfetch.com/shopping/women/denim-1/items.aspx',
  },
  {
    id: 15,
    name: 'Statement Blazer',
    category: 'Outerwear',
    img: 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=800&q=80',
    colourHex: '#A4161A',
    colourName: 'Crimson',
    buyUrl: 'https://www.farfetch.com/shopping/women/tailoring-1/items.aspx',
  },
  {
    id: 16,
    name: 'Classic Little Black Dress',
    category: 'Dresses',
    img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
    colourHex: '#1A1A1A',
    colourName: 'Black Ink',
    buyUrl: 'https://www.farfetch.com/shopping/women/dresses-1/items.aspx',
  },
  {
    id: 17,
    name: 'Satin Evening Blouse',
    category: 'Tops',
    img: 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?w=800&q=80',
    colourHex: '#E8B4C8',
    colourName: 'Icy Pink',
    buyUrl: 'https://www.farfetch.com/shopping/women/tops-1/items.aspx',
  },
  {
    id: 18,
    name: 'Cashmere Scarf',
    category: 'Accessories',
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    colourHex: '#B8974A',
    colourName: 'Antique Gold',
    buyUrl: 'https://www.farfetch.com/shopping/women/accessories-1/items.aspx',
  },
  {
    id: 19,
    name: 'Knitted Cardigan',
    category: 'Tops',
    img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
    colourHex: '#954535',
    colourName: 'Chestnut',
    buyUrl: 'https://www.farfetch.com/shopping/women/knitwear-1/items.aspx',
  },
  {
    id: 20,
    name: 'Wide-Leg Linen Pants',
    category: 'Bottoms',
    img: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800&q=80',
    colourHex: '#F3E7CF',
    colourName: 'Warm Ivory',
    buyUrl: 'https://www.farfetch.com/shopping/women/pants-1/items.aspx',
  },
];

const tabs: { id: Mode; label: string; icon: typeof Shirt }[] = [
  { id: 'outfits', label: 'Outfits', icon: Shirt },
  { id: 'makeup', label: 'Makeup', icon: Sparkles },
  { id: 'hair', label: 'Hair', icon: Scissors },
];

export default function TryOn() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const referenceImageUrl = useStyleStore((s) => s.referenceImageUrl);
  const analysisResult = useStyleStore((s) => s.analysisResult);
  const addWardrobeItem = useStyleStore((s) => s.addWardrobeItem);
  const { clothes, makeup, hair } = useTryOn();

  const [mode, setMode] = useState<Mode>('outfits');
  const [activeColour, setActiveColour] = useState<string | null>(null);
  const [selected, setSelected] = useState<Selected | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

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
    return getSeasonInfo(
      analysisResult.colourSeason,
      analysisResult.colorProfile.undertone,
    ).palette;
  }, [analysisResult]);

  const availableColours = useMemo(() => {
    const garmentHexes = new Set(garments.map((g) => g.colourHex.toLowerCase()));
    return palette.filter((c) => garmentHexes.has(c.hex.toLowerCase()));
  }, [palette]);

  const filtered =
    activeColour === null
      ? garments
      : garments.filter((g) => g.colourHex.toLowerCase() === activeColour);

  const isPending = clothes.isPending || makeup.isPending || hair.isPending;
  const isError = clothes.isError || makeup.isError || hair.isError;

  const handleSelect = (item: Selected) => {
    setSelected(item);
    setResultUrl(null);
  };

  const handleTryOn = () => {
    if (!selected || !referenceImageUrl) return;
    setResultUrl(null);
    if (selected.kind === 'outfit') {
      clothes.mutate(
        { garmentUrl: selected.img, garmentName: selected.name },
        { onSuccess: (response) => setResultUrl(response.data.resultUrl) },
      );
    } else if (selected.kind === 'look') {
      makeup.mutate(selected.id, {
        onSuccess: (response) => setResultUrl(response.data.resultUrl),
      });
    } else {
      hair.mutate(selected.id, {
        onSuccess: (response) => setResultUrl(response.data.resultUrl),
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

  const ctaLabel = (() => {
    if (isPending) return selected?.kind === 'look' ? 'Applying…' : 'Trying On…';
    if (resultUrl) return 'Try Again';
    if (selected?.kind === 'look') return 'Apply This Look';
    if (selected?.kind === 'hair') return 'Try This Hairstyle';
    return 'Try On This Outfit';
  })();

  return (
    <div className="w-full pt-28 pb-24">
      <EditorialContainer width="content">
        {/* Header */}
        <PageMasthead
          label="Virtual Try-On"
          title={
            <>
              See Your Colours, <Emphasis>On You.</Emphasis>
            </>
          }
          lede="Try an outfit, makeup look, or hairstyle — all in your palette."
        />

        {!referenceImageUrl ? (
          <div className="mx-auto mt-14 w-full max-w-xl border border-gold-hairline bg-surface-3 p-8 text-center">
            <span
              aria-hidden="true"
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-surface-4 text-gold-primary"
            >
              <Sparkles className="h-5 w-5" />
            </span>
            <h2 className="mt-6 font-serif text-[length:var(--text-h5)] text-cream-primary">
              Upload your selfie first
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-[length:var(--text-body-sm)] text-cream-primary/80">
              Virtual try-on needs a reference photo of you. Analyse one to
              unlock your palette.
            </p>
            <Link href="/upload" className="mt-8 inline-block">
              <Button size="lg">Upload a Selfie</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Tabs — text-only, underline active */}
            <div className="mt-12 border-b border-gold-hairline">
              <div role="tablist" aria-label="Try-on category" className="flex gap-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={mode === tab.id}
                    onClick={() => {
                      setMode(tab.id);
                      setSelected(null);
                      setResultUrl(null);
                      setActiveColour(null);
                    }}
                    className={cn(
                      'eyebrow relative px-6 py-4 transition-colors duration-200 ease-out',
                      mode === tab.id
                        ? 'text-cream-primary'
                        : 'text-cream-primary/55 hover:text-cream-primary',
                    )}
                  >
                    {tab.label}
                    {mode === tab.id && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="absolute inset-x-0 bottom-0 h-[2px] bg-gold-primary"
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
              {/* Left — options */}
              <section>
                <div className="flex items-baseline justify-between gap-4">
                  <EditorialHeading as="h2" size="sm">
                    {mode === 'outfits'
                      ? 'Curated for Your Palette'
                      : mode === 'makeup'
                        ? 'Makeup Looks'
                        : 'Hair Styles'}
                  </EditorialHeading>
                </div>

                {mode === 'outfits' && (
                  <>
                    <div
                      className="mt-6 flex flex-wrap items-center gap-3"
                      role="group"
                      aria-label="Filter outfits by colour"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveColour(null)}
                        className={cn(
                          'inline-flex min-h-11 items-center rounded-sm border px-4 text-nav transition-colors duration-200 ease-out',
                          activeColour === null
                            ? 'border-gold-primary bg-gold-primary text-surface-0'
                            : 'border-gold-hairline bg-surface-3 text-cream-primary/80 hover:border-gold-primary hover:text-cream-primary',
                        )}
                      >
                        All
                      </button>
                      {availableColours.map((colour) => {
                        const active = activeColour === colour.hex.toLowerCase();
                        return (
                          <button
                            key={colour.hex}
                            type="button"
                            onClick={() =>
                              setActiveColour(
                                active ? null : colour.hex.toLowerCase(),
                              )
                            }
                            aria-pressed={active}
                            className={cn(
                              'inline-flex min-h-11 items-center gap-2 rounded-sm border px-4 text-nav transition-colors duration-200 ease-out',
                              active
                                ? 'border-gold-primary bg-surface-4 text-cream-primary'
                                : 'border-gold-hairline bg-surface-3 text-cream-primary/80 hover:border-gold-primary hover:text-cream-primary',
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className="h-4 w-4 rounded-sm border border-gold-hairline"
                              style={{ backgroundColor: colour.hex }}
                            />
                            {colour.name}
                          </button>
                        );
                      })}
                    </div>

                    <motion.div
                      className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2"
                      variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.06 } },
                      }}
                      initial="hidden"
                      animate="visible"
                      key={activeColour ?? 'all'}
                    >
                      {filtered.map((garment) => {
                        const isSelected = selected?.id === String(garment.id);
                        return (
                          <motion.div
                            key={garment.id}
                            variants={{
                              hidden: { opacity: 0, y: 20, scale: 0.97 },
                              visible: {
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                              },
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleSelect({
                                  kind: 'outfit',
                                  id: String(garment.id),
                                  name: garment.name,
                                  img: garment.img,
                                  colourName: garment.colourName,
                                  colourHex: garment.colourHex,
                                })
                              }
                              aria-pressed={isSelected}
                              className={cn(
                                'group w-full overflow-hidden border text-left transition-all duration-300 ease-out',
                                isSelected
                                  ? 'border-gold-primary'
                                  : 'border-gold-hairline hover:border-gold-primary/50',
                              )}
                            >
                              <div className="aspect-[4/5] w-full overflow-hidden border-b border-gold-hairline">
                                <img
                                  src={garment.img}
                                  srcSet={srcsetFromUrl(garment.img, [400, 800, 1600])}
                                  sizes="(min-width: 1024px) 25vw, 50vw"
                                  alt={garment.name}
                                  width={480}
                                  height={600}
                                  loading="lazy"
                                  className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-[1.04]"
                                />
                              </div>
                              <div className="border-t border-gold-hairline p-5">
                                <p className="eyebrow text-cream-primary/55">
                                  {garment.category}
                                </p>
                                <p className="mt-1 font-editorial text-h5 font-light text-cream-primary">
                                  {garment.name}
                                </p>
                              </div>
                            </button>
                          </motion.div>
                        );
                      })}
                    </motion.div>

                    {filtered.length === 0 && (
                      <p className="mt-8 text-[length:var(--text-body-sm)] text-cream-primary/80">
                        No outfit in this colour yet — try another shade from your
                        palette.
                      </p>
                    )}
                  </>
                )}

                {mode !== 'outfits' && (
                  <TemplateGrid
                    mode={mode}
                    items={mode === 'makeup' ? looksQuery.data : hairQuery.data}
                    isLoading={mode === 'makeup' ? looksQuery.isLoading : hairQuery.isLoading}
                    selectedId={selected?.id ?? null}
                    onSelect={(item) =>
                      handleSelect({
                        kind: mode === 'makeup' ? 'look' : 'hair',
                        id: item.id,
                        name: item.title,
                        img: item.thumb,
                      })
                    }
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
                            {selected.kind === 'outfit'
                              ? 'Selected outfit'
                              : selected.kind === 'look'
                                ? 'Selected look'
                                : 'Selected hairstyle'}
                          </p>
                          <p className="mt-1 font-serif text-[length:var(--text-h5)] text-cream-primary">
                            {selected.name}
                          </p>
                        </div>
                        <Badge variant="gold">
                          {selected.colourName ??
                            (selected.kind === 'look'
                              ? 'Makeup'
                              : selected.kind === 'hair'
                                ? 'Hair'
                                : 'Look')}
                        </Badge>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-cream-primary/55">
                            You
                          </p>
                          <div className="mt-2 aspect-[3/4] w-full overflow-hidden border border-gold-hairline">
                            <img
                              src={referenceImageUrl}
                              alt="Your reference photo"
                              width={480}
                              height={640}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-cream-primary/55">
                            {resultUrl ? 'Try-on' : 'Preview'}
                          </p>
                          <div className="mt-2 aspect-[3/4] w-full overflow-hidden border border-gold-hairline">
                            <AnimatePresence mode="wait">
                              <motion.img
                                key={resultUrl ?? selected.img}
                                src={resultUrl ?? selected.img}
                                alt={
                                  resultUrl
                                    ? `Try-on result: ${selected.name}`
                                    : selected.name
                                }
                                width={480}
                                height={640}
                                initial={{ opacity: 0, scale: 1.04 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                style={{ willChange: 'transform, opacity' }}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex flex-col gap-3">
                        <Button
                          size="lg"
                          onClick={handleTryOn}
                          disabled={isPending}
                        >
                          {isPending ? (
                            <LoaderCircle className="animate-spin" aria-hidden="true" />
                          ) : (
                            <RotateCw aria-hidden="true" />
                          )}
                          {ctaLabel}
                        </Button>

                        {resultUrl && selected.kind === 'outfit' && (
                          <>
                            <Button
                              variant="secondary"
                              size="lg"
                              onClick={handleAddToWardrobe}
                            >
                              <Bookmark aria-hidden="true" />
                              Add to Saved Looks
                            </Button>

                            {selectedGarment?.buyUrl && (
                              <Button
                                asChild
                                variant="primary"
                                size="lg"
                                className="bg-gold-primary text-surface-0 hover:bg-gold-dark hover:text-cream-primary w-full uppercase tracking-wider font-semibold"
                              >
                                <a
                                  href={selectedGarment.buyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  BUY EXACT MATCH →
                                </a>
                              </Button>
                            )}
                          </>
                        )}
                      </div>

                      {isError && (
                        <p className="mt-4 text-[length:var(--text-body-sm)] text-error">
                          The try-on could not be completed. Please try again in a
                          moment.
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="py-16 text-center">
                      <p className="font-serif text-[length:var(--text-h5)] text-cream-primary">
                        Select to begin
                      </p>
                      <p className="mx-auto mt-2 max-w-sm text-[length:var(--text-body-sm)] text-cream-primary/80">
                        Choose an outfit, makeup look, or hairstyle to preview it
                        on your photo.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </EditorialContainer>
    </div>
  );
}

interface TemplateItem {
  id: string;
  title: string;
  thumb: string;
}

function TemplateGrid({
  mode,
  items,
  isLoading,
  selectedId,
  onSelect,
}: {
  mode: Mode;
  items?: TemplateItem[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (item: TemplateItem) => void;
}) {
  if (isLoading) {
    return (
      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/5] animate-pulse border border-gold-hairline bg-surface-3/40"
          />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <p className="mt-8 text-[length:var(--text-body-sm)] text-cream-primary/80">
        {mode === 'makeup'
          ? 'Makeup looks are not available right now.'
          : 'Hairstyles are not available right now.'}{' '}
        Please try again later.
      </p>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
      {items.map((item) => {
        const isSelected = selectedId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            aria-pressed={isSelected}
            className={cn(
              'group overflow-hidden border text-left transition-all duration-300 ease-out',
              isSelected
                ? 'border-gold-primary'
                : 'border-gold-hairline hover:border-gold-primary/50',
            )}
          >
            <div className="aspect-[4/5] w-full overflow-hidden border-b border-gold-hairline bg-surface-3/40">
              {item.thumb ? (
                <img
                  src={item.thumb}
                  srcSet={srcsetFromUrl(item.thumb, [400, 800, 1600])}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  alt={item.title}
                  width={480}
                  height={600}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-[1.04]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-full w-full items-center justify-center text-gold-primary"
                >
                  {mode === 'makeup' ? (
                    <Sparkles className="h-8 w-8" />
                  ) : (
                    <Scissors className="h-8 w-8" />
                  )}
                </span>
              )}
            </div>
            <div className="border-t border-gold-hairline p-5">
              <p className="font-editorial text-h5 font-light text-cream-primary">
                {item.title}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
