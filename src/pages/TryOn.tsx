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
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  },
  {
    id: 2,
    name: 'Silk Midi Dress',
    category: 'Dresses',
    img: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=800&q=80',
    colourHex: '#B7410E',
    colourName: 'Rust',
  },
  {
    id: 3,
    name: 'Pleated Trousers',
    category: 'Bottoms',
    img: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&q=80',
    colourHex: '#556B2F',
    colourName: 'Olive',
  },
  {
    id: 4,
    name: 'Trench Coat',
    category: 'Outerwear',
    img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80',
    colourHex: '#B8860B',
    colourName: 'Goldenrod',
  },
  {
    id: 5,
    name: 'Leather Moto Jacket',
    category: 'Outerwear',
    img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    colourHex: '#8B4513',
    colourName: 'Saddle Brown',
  },
  {
    id: 6,
    name: 'Oversized Knit',
    category: 'Tops',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    colourHex: '#D2691E',
    colourName: 'Chocolate',
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
      <div className="mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
            Virtual Try-On
          </p>
          <h1 className="mt-3 font-serif text-[length:var(--text-h1)] text-espresso">
            See Your Colours, On You.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-[length:var(--text-body)] text-espresso-light">
            Try an outfit, a makeup look, or a new hairstyle — all in your
            palette.
          </p>
        </div>

        {!referenceImageUrl ? (
          <Card variant="report" className="mx-auto mt-14 w-full max-w-xl p-8 text-center">
            <span
              aria-hidden="true"
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-cream-dark text-gold-primary"
            >
              <Sparkles className="h-5 w-5" />
            </span>
            <h2 className="mt-6 font-serif text-[length:var(--text-h5)] text-espresso">
              Upload your selfie first
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-[length:var(--text-body-sm)] text-espresso-light">
              Virtual try-on needs a reference photo of you. Analyse one to
              unlock your palette.
            </p>
            <Link href="/upload" className="mt-8 inline-block">
              <Button size="lg">Upload a Selfie</Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Tabs */}
            <div className="mt-12 flex justify-center">
              <div
                role="tablist"
                aria-label="Try-on category"
                className="inline-flex items-center gap-1 rounded-md border border-border bg-cream-dark p-1.5"
              >
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
                      'inline-flex min-h-10 items-center gap-2 rounded-md px-5 text-nav transition-colors duration-200 ease-out',
                      mode === tab.id
                        ? 'bg-gold-primary text-espresso'
                        : 'text-espresso-light hover:text-espresso',
                    )}
                  >
                    <tab.icon className="h-4 w-4" aria-hidden="true" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
              {/* Left — options */}
              <section>
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-serif text-[length:var(--text-h3)] text-espresso">
                    {mode === 'outfits'
                      ? 'Curated for Your Palette'
                      : mode === 'makeup'
                        ? 'Makeup Looks'
                        : 'Hair Styles'}
                  </h2>
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
                          'inline-flex min-h-11 items-center rounded-md border px-4 text-nav transition-colors duration-200 ease-out',
                          activeColour === null
                            ? 'border-gold-primary bg-gold-primary text-espresso'
                            : 'border-border bg-white text-espresso-light hover:border-gold-primary hover:text-espresso',
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
                              'inline-flex min-h-11 items-center gap-2 rounded-md border px-4 text-nav transition-colors duration-200 ease-out',
                              active
                                ? 'border-gold-primary bg-cream-dark text-espresso'
                                : 'border-border bg-white text-espresso-light hover:border-gold-primary hover:text-espresso',
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className="h-4 w-4 rounded-sm shadow-[var(--shadow-swatch)]"
                              style={{ backgroundColor: colour.hex }}
                            />
                            {colour.name}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {filtered.map((garment) => {
                        const isSelected = selected?.id === String(garment.id);
                        return (
                          <button
                            key={garment.id}
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
                              'group overflow-hidden rounded-lg border text-left transition-all duration-200 ease-out',
                              isSelected
                                ? 'border-gold-primary bg-white shadow-card'
                                : 'border-border bg-white shadow-card hover:border-gold-primary',
                            )}
                          >
                            <div className="aspect-[4/5] w-full overflow-hidden border-b border-border">
                              <img
                                src={garment.img}
                                srcSet={srcsetFromUrl(garment.img, [400, 800, 1600])}
                                sizes="(min-width: 1024px) 25vw, 50vw"
                                alt={garment.name}
                                width={480}
                                height={600}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                              />
                            </div>
                            <div className="p-6">
                              <p className="text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-espresso-muted">
                                {garment.category}
                              </p>
                              <p className="mt-1 font-serif text-[length:var(--text-h5)] text-espresso">
                                {garment.name}
                              </p>
                              <p className="mt-2 flex items-center gap-2 text-[length:var(--text-body-sm)] text-espresso-light">
                                <span
                                  aria-hidden="true"
                                  className="h-4 w-4 rounded-sm shadow-[var(--shadow-swatch)]"
                                  style={{ backgroundColor: garment.colourHex }}
                                />
                                {garment.colourName}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {filtered.length === 0 && (
                      <p className="mt-8 text-[length:var(--text-body-sm)] text-espresso-light">
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
                <h2 className="font-serif text-[length:var(--text-h3)] text-espresso">
                  Try-On Studio
                </h2>
                <Card variant="report" className="mt-6 p-8">
                  {selected ? (
                    <>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-espresso-muted">
                            {selected.kind === 'outfit'
                              ? 'Selected outfit'
                              : selected.kind === 'look'
                                ? 'Selected look'
                                : 'Selected hairstyle'}
                          </p>
                          <p className="mt-1 font-serif text-[length:var(--text-h5)] text-espresso">
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
                          <p className="text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-espresso-muted">
                            You
                          </p>
                          <div className="mt-2 aspect-[3/4] w-full overflow-hidden rounded-md border border-border">
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
                          <p className="text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-espresso-muted">
                            {resultUrl ? 'Try-on' : 'Preview'}
                          </p>
                          <div className="mt-2 aspect-[3/4] w-full overflow-hidden rounded-md border border-border">
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
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
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
                          <Button
                            variant="secondary"
                            size="lg"
                            onClick={handleAddToWardrobe}
                          >
                            <Bookmark aria-hidden="true" />
                            Add to Saved Looks
                          </Button>
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
                      <p className="font-serif text-[length:var(--text-h5)] text-espresso">
                        Select to begin
                      </p>
                      <p className="mx-auto mt-2 max-w-sm text-[length:var(--text-body-sm)] text-espresso-light">
                        Choose an outfit, makeup look, or hairstyle to preview it
                        on your photo.
                      </p>
                    </div>
                  )}
                </Card>
              </section>
            </div>
          </>
        )}
      </div>
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
      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/5] animate-pulse rounded-lg border border-border bg-cream-dark"
          />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <p className="mt-8 text-[length:var(--text-body-sm)] text-espresso-light">
        {mode === 'makeup'
          ? 'Makeup looks are not available right now.'
          : 'Hairstyles are not available right now.'}{' '}
        Please try again later.
      </p>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
      {items.map((item) => {
        const isSelected = selectedId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            aria-pressed={isSelected}
            className={cn(
              'group overflow-hidden rounded-lg border text-left transition-all duration-200 ease-out',
              isSelected
                ? 'border-gold-primary bg-white shadow-card'
                : 'border-border bg-white shadow-card hover:border-gold-primary',
            )}
          >
            <div className="aspect-[4/5] w-full overflow-hidden border-b border-border bg-cream-dark">
              {item.thumb ? (
                <img
                  src={item.thumb}
                  srcSet={srcsetFromUrl(item.thumb, [400, 800, 1600])}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  alt={item.title}
                  width={480}
                  height={600}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
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
            <div className="p-5">
              <p className="font-serif text-[length:var(--text-h5)] text-espresso">
                {item.title}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
