import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { success } from '@/lib/toast';
import { Bookmark, ChevronLeft, ChevronRight, Download, LoaderCircle, MoreVertical, RotateCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/navigation';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import Reveal from '@/components/editorial/Reveal';
import CampaignSection from '@/components/editorial/CampaignSection';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { CAMPAIGN } from '@/lib/editorial-images';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import { useStyleStore } from '@/store/useStyleStore';
import { useTryOn } from '@/hooks/useTryOn';
import { assetUrl, getGarments } from '@/services/api';
import { INDIAN_HAIR_STYLES, INDIAN_MAKEUP_LOOKS } from '@/lib/tryon-styles';
import { cn, srcsetFromUrl } from '@/lib/utils';

type Mode = 'outfits' | 'makeup' | 'hair';
type GarmentCategory = 'Everyday' | 'Office' | 'Casual' | 'Festive' | 'Wedding' | 'Party' | 'Bridal' | 'Traditional' | 'Suit' | 'Lehenga';
type Gender = 'All' | 'Women' | 'Men';

// The full garment catalogue now lives on the server (GET /api/garments) —
// fetched once, cached indefinitely, filtered client-side exactly as before.
type Garment = import('@/services/api').Garment;

interface Selected {
  kind: 'outfit' | 'look' | 'hair';
  id: string;
  name: string;
  img: string;
  colourName?: string;
  colourHex?: string;
}

const GARMENT_CATEGORIES: GarmentCategory[] = ['Everyday', 'Office', 'Casual', 'Festive', 'Wedding', 'Party', 'Bridal', 'Traditional', 'Suit', 'Lehenga'];


interface TemplateItem { id: string; title: string; thumb: string; }

const tabs: { id: Mode; label: string }[] = [
  { id: 'outfits', label: 'Outfits' },
  { id: 'makeup', label: 'Makeup' },
  { id: 'hair', label: 'Hair' },
];

export default function TryOn() {
  const referenceImageUrl = useStyleStore((s) => s.referenceImageUrl);
  const analysisResult = useStyleStore((s) => s.analysisResult);
  const addWardrobeItem = useStyleStore((s) => s.addWardrobeItem);
  const { clothes, makeup, hair } = useTryOn();
  const [, setLocation] = useLocation();

  // The catalogue comes from the server (GET /api/garments) — fetched once
  // per session, cached indefinitely, filtered client-side as before.
  const garmentsQuery = useQuery({
    queryKey: ['garments'],
    queryFn: () => getGarments(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
  // Memoised so the `?? []` fallback is one stable array, not a fresh one per
  // render that would re-run every memo depending on it.
  const garments: Garment[] = useMemo(
    () => garmentsQuery.data?.garments ?? [],
    [garmentsQuery.data],
  );

  // Try-on renders onto the analysed photo, so it is only meaningful once the
  // colour analysis has run. Both halves are persisted, and a reference photo
  // can be set without an analysis, so the page checks for both.
  const hasAnalysis = Boolean(referenceImageUrl && analysisResult);

  const [mode, setMode] = useState<Mode>('outfits');
  const [activeCategory, setActiveCategory] = useState<GarmentCategory>('Everyday');
  const [genderFilter, setGenderFilter] = useState<Gender>('All');
  const [selected, setSelected] = useState<Selected | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const categoryScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollCategories = (dir: 1 | -1) => {
    categoryScrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  const selectedGarment = useMemo(() => {
    if (!selected || selected.kind !== 'outfit') return null;
    return garments.find((g) => String(g.id) === selected.id) ?? null;
  }, [selected, garments]);

  // Hair and makeup come from the curated list in lib/tryon-styles, not from
  // YouCam's template endpoint: the provider's own catalogue is mostly novelty
  // looks (face paint, flags, rainbow dye) that have no place here.
  const styleItems = useMemo(() => {
    const source = mode === 'hair' ? INDIAN_HAIR_STYLES : INDIAN_MAKEUP_LOOKS;
    return genderFilter === 'All' ? source : source.filter((s) => s.gender === genderFilter);
  }, [mode, genderFilter]);

  const filteredByCategory = garments.filter(
    (g) => g.category === activeCategory && (genderFilter === 'All' || g.gender === genderFilter)
  );

  // Categories present in the served catalogue (keeps static type as the
  // ordering contract; filters out any the server doesn't actually carry).
  const availableCategories = useMemo(
    () => GARMENT_CATEGORIES.filter((cat) => garments.some((g) => g.category === cat)),
    [garments],
  );

  const isPending = clothes.isPending || makeup.isPending || hair.isPending;

  const handleSelect = (item: Selected) => {
    setSelected(item);
    setResultUrl(null);
    setIsFallback(false);
  };

  const handleTryOn = () => {
    if (!selected) return;
    // Reached without an analysis (a stale reference photo, or a direct link
    // into the page) — send them to run one rather than rendering the garment
    // onto a stand-in photo that is not theirs.
    if (!hasAnalysis || !referenceImageUrl) {
      setLocation(ROUTES.upload);
      return;
    }
    setResultUrl(null);
    setIsFallback(false);
    const refUrl = referenceImageUrl;
    if (selected.kind === 'outfit') {
      // Bundled garments are sent as their app-relative path so the server can
      // read them off disk — prefixing the origin would hand the try-on provider
      // a URL it cannot reach.
      clothes.mutate(
        { garmentUrl: selected.img, garmentName: selected.name, garmentImg: selected.img, colourHex: selected.colourHex, personImageUrl: refUrl },
        {
          onSuccess: (r) => {
            setResultUrl(r.data.resultUrl);
            setIsFallback(r.data.source === 'fallback');
          },
          onError: () => {
            setResultUrl(selected.img);
            setIsFallback(true);
          },
        },
      );
    } else if (selected.kind === 'look') {
      makeup.mutate({ productId: selected.id, productName: selected.name, productThumb: selected.img }, {
        onSuccess: (r) => {
          setResultUrl(r.data.resultUrl);
          setIsFallback(r.data.source === 'fallback');
        },
        onError: () => {
          setResultUrl(refUrl);
          setIsFallback(true);
        },
      });
    } else {
      hair.mutate({ styleId: selected.id, styleName: selected.name, styleThumb: selected.img }, {
        onSuccess: (r) => {
          setResultUrl(r.data.resultUrl);
          setIsFallback(r.data.source === 'fallback');
        },
        onError: () => {
          setResultUrl(refUrl);
          setIsFallback(true);
        },
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
      {/* Hero — full-bleed campaign background like Home page */}
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
              {GARMENT_CATEGORIES.map((cat) => (
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

      <EditorialContainer width="content" className="pt-2 max-w-[1440px] px-2 sm:px-4 lg:px-6 mx-auto">

        {!hasAnalysis ? (
          <div className="mx-auto mt-14 w-full max-w-xl border border-gold-hairline bg-surface-3 p-8 text-center">
            <span aria-hidden className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-surface-4 text-gold-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <h2 className="mt-6 font-serif text-[length:var(--text-h5)] text-cream-primary">Run your colour analysis first</h2>
            <p className="mx-auto mt-2 max-w-sm text-[length:var(--text-body-sm)] text-cream-primary/80">
              Virtual try-on renders onto your analysed photo. Upload a selfie and
              analyse it once — then every garment, look and hairstyle here is yours to try.
            </p>
            <Link href={ROUTES.upload} className="mt-8 inline-block">
              <Button size="lg">Analyse My Colours</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Mode tabs */}
            <div className="mt-2 border-b border-gold-hairline w-full">
              <div role="tablist" aria-label="Try-on category" className="flex gap-0 justify-start">
                {tabs.map((tab) => (
                  <button key={tab.id} type="button" role="tab" aria-selected={mode === tab.id}
                    onClick={() => { setMode(tab.id); setSelected(null); setResultUrl(null); }}
                    className={cn('eyebrow relative px-5 py-2.5 text-xs transition-colors duration-200',
                      mode === tab.id ? 'text-cream-primary font-medium' : 'text-cream-primary/55 hover:text-cream-primary')}
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2.5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_350px] lg:items-start w-full"
            >
              {/* Left — options (Exactly 3 columns per row) */}
              <section className="w-full">
                {/* Gender Filter sub-tabs: ALL | WOMEN | MEN — applies to every mode */}
                <div className="mb-2 flex items-center gap-1.5 justify-start">
                  <span className="text-[0.58rem] font-medium uppercase tracking-wider text-cream-primary/50 shrink-0">
                    Gender:
                  </span>
                  {(['All', 'Women', 'Men'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => { setGenderFilter(g); setSelected(null); setResultUrl(null); }}
                      className={cn(
                        'inline-flex h-6 items-center rounded-sm border px-2.5 text-[0.58rem] font-semibold uppercase tracking-wider transition-all duration-200 shrink-0',
                        genderFilter === g
                          ? 'border-gold-primary bg-gold-primary text-surface-0 shadow-sm'
                          : 'border-gold-hairline/60 bg-surface-3/60 text-cream-primary/70 hover:border-gold-primary/60 hover:text-cream-primary'
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                {mode === 'outfits' && (
                  <>
                    {/* Category sub-tabs */}
                    <div className="mb-3 flex items-center gap-1 justify-start">
                      <button type="button" onClick={() => scrollCategories(-1)} aria-label="Scroll categories left"
                        className="h-7 w-6 shrink-0 flex items-center justify-center rounded-sm border border-gold-hairline bg-surface-3 text-cream-primary/70 transition-colors hover:border-gold-primary hover:text-cream-primary">
                        <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
                      </button>
                      <div ref={categoryScrollRef} className="scrollbar-none overflow-x-auto overscroll-x-contain flex-1">
                        <div role="group" aria-label="Garment categories" className="flex w-max gap-1 pb-0.5 justify-start">
                          {availableCategories.map((cat) => (
                            <button key={cat} type="button"
                              onClick={() => { setActiveCategory(cat); setSelected(null); setResultUrl(null); }}
                              className={cn('inline-flex h-7 items-center rounded-sm border px-2.5 text-[0.62rem] font-medium uppercase tracking-wider transition-colors duration-200 shrink-0',
                                activeCategory === cat
                                  ? 'border-gold-primary bg-gold-primary text-surface-0 font-semibold'
                                  : 'border-gold-hairline bg-surface-3 text-cream-primary/70 hover:border-gold-primary hover:text-cream-primary')}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button type="button" onClick={() => scrollCategories(1)} aria-label="Scroll categories right"
                        className="h-7 w-6 shrink-0 flex items-center justify-center rounded-sm border border-gold-hairline bg-surface-3 text-cream-primary/70 transition-colors hover:border-gold-primary hover:text-cream-primary">
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </div>

                    {/* Garment grid (Exactly 3 Columns per row) */}
                    {garmentsQuery.isLoading && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="aspect-[3/4] w-full animate-pulse rounded-sm border border-gold-hairline/40 bg-surface-1/40" />
                        ))}
                      </div>
                    )}
                    {garmentsQuery.isError && (
                      <p className="border border-gold-hairline bg-surface-3 p-4 text-[0.72rem] text-cream-primary/70">
                        The catalogue couldn&rsquo;t be loaded. Refresh the page to try again.
                      </p>
                    )}
                    {!garmentsQuery.isLoading && !garmentsQuery.isError && (
                    <motion.div
                      key={activeCategory}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
                      initial="hidden" animate="visible"
                    >
                      {filteredByCategory.map((garment) => {
                        const isSelected = selected?.id === String(garment.id);
                        return (
                          <motion.div key={garment.id}
                            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } } }}
                          >
                            <button type="button"
                              onClick={() => handleSelect({ kind: 'outfit', id: String(garment.id), name: garment.name, img: garment.img, colourName: garment.colourName, colourHex: garment.colourHex })}
                              aria-pressed={isSelected}
                              className={cn('group w-full overflow-hidden border text-left transition-all duration-300 rounded-sm',
                                isSelected ? 'border-gold-primary bg-surface-1 shadow-[0_0_10px_rgba(201,168,76,0.2)]' : 'border-gold-hairline/60 bg-surface-1/40 hover:border-gold-primary/60')}
                            >
                              <div className="aspect-[3/4] w-full overflow-hidden border-b border-gold-hairline/40 bg-surface-2">
                                <img src={garment.img} srcSet={srcsetFromUrl(garment.img, [300, 600])}
                                  sizes="(min-width:1024px) 18vw, 36vw" alt={garment.name}
                                  width={300} height={400} loading="lazy"
                                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                                />
                              </div>
                              <div className="p-2">
                                <div className="flex items-center gap-1 mb-0.5">
                                  <span className="h-1.5 w-1.5 rounded-full border border-gold-hairline/40 shrink-0"
                                    style={{ backgroundColor: garment.colourHex }} />
                                  <p className="text-[0.52rem] uppercase tracking-wider text-cream-primary/45 truncate">{garment.colourName}</p>
                                </div>
                                <p className="text-[0.72rem] font-light text-cream-primary leading-tight line-clamp-1">{garment.name}</p>
                              </div>
                            </button>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                    )}
                  </>
                )}

                {mode !== 'outfits' && (
                  <TemplateGrid
                    items={styleItems}
                    selectedId={selected?.id ?? null}
                    onSelect={(item) => handleSelect({ kind: mode === 'makeup' ? 'look' : 'hair', id: item.id, name: item.title, img: item.thumb })}
                  />
                )}
              </section>

              {/* Right — studio (Shifted Upwards so Buttons never cut off) */}
              <section className="lg:sticky lg:top-14 w-full max-w-[350px] mx-auto lg:mx-0">
                <div>
                  {selected ? (
                    <>
                      {/* Result: Pure BeforeAfter Slider view when try-on result available */}
                      {resultUrl && !isFallback ? (
                        <div>
                          <p className="text-[0.52rem] uppercase tracking-wider text-cream-primary/55 mb-1">
                            Drag to compare
                          </p>
                          <div className="relative aspect-[3/4] max-h-[470px] w-full overflow-hidden border border-gold-hairline rounded-sm shadow-md mx-auto">
                            <BeforeAfterSlider
                              beforeSrc={assetUrl(referenceImageUrl)}
                              afterSrc={resultUrl}
                              afterColour={selected.colourHex}
                              beforeLabel="You"
                              afterLabel="Try-On"
                              className="h-full w-full"
                            />

                            {/* Top-Right 3-Dots Dropdown Menu */}
                            <div ref={menuRef} className="absolute top-2.5 right-2.5 z-30">
                              <button
                                onClick={() => setMenuOpen((prev) => !prev)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-hairline bg-surface-0/85 text-cream-primary backdrop-blur-md transition-all hover:bg-gold-primary hover:text-surface-0 hover:border-gold-primary active:scale-95 shadow-lg"
                                title="More options"
                                aria-label="More options"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              <AnimatePresence>
                                {menuOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                    transition={{ duration: 0.15, ease: 'easeOut' }}
                                    className="absolute right-0 top-10 z-40 min-w-[190px] overflow-hidden rounded-md border border-gold-hairline bg-surface-1/95 p-1 shadow-2xl backdrop-blur-md"
                                  >
                                    <button
                                      onClick={() => {
                                        setMenuOpen(false);
                                        handleDownload();
                                      }}
                                      className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-xs uppercase tracking-wider text-cream-primary transition-colors hover:bg-gold-primary/15 hover:text-gold-primary"
                                    >
                                      <Download className="h-4 w-4 text-gold-primary" />
                                      <span>Download</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setMenuOpen(false);
                                        handleAddToWardrobe();
                                      }}
                                      className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-xs uppercase tracking-wider text-cream-primary transition-colors hover:bg-gold-primary/15 hover:text-gold-primary"
                                    >
                                      <Bookmark className="h-4 w-4 text-gold-primary" />
                                      <span>Add to Saved Looks</span>
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="relative aspect-[3/4] max-h-[470px] w-full overflow-hidden border border-gold-hairline rounded-sm shadow-md mx-auto">
                            <AnimatePresence mode="wait">
                              <motion.img key={resultUrl ?? selected.img}
                                src={resultUrl ?? selected.img}
                                alt={resultUrl ? `Try-on: ${selected.name}` : selected.name}
                                width={480} height={640}
                                initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                onError={(e) => {
                                  if (selected?.img && e.currentTarget.src !== selected.img) {
                                    e.currentTarget.src = selected.img;
                                  }
                                }}
                              />
                            </AnimatePresence>
                            {isFallback && resultUrl && selected.colourHex && (
                              <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-multiply"
                                style={{ backgroundColor: selected.colourHex, opacity: 0.4 }} />
                            )}

                            {/* Top-Right 3-Dots Dropdown Menu */}
                            <div ref={menuRef} className="absolute top-2.5 right-2.5 z-30">
                              <button
                                onClick={() => setMenuOpen((prev) => !prev)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-hairline bg-surface-0/85 text-cream-primary backdrop-blur-md transition-all hover:bg-gold-primary hover:text-surface-0 hover:border-gold-primary active:scale-95 shadow-lg"
                                title="More options"
                                aria-label="More options"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              <AnimatePresence>
                                {menuOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                    transition={{ duration: 0.15, ease: 'easeOut' }}
                                    className="absolute right-0 top-10 z-40 min-w-[190px] overflow-hidden rounded-md border border-gold-hairline bg-surface-1/95 p-1 shadow-2xl backdrop-blur-md"
                                  >
                                    <button
                                      onClick={() => {
                                        setMenuOpen(false);
                                        handleDownload();
                                      }}
                                      className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-xs uppercase tracking-wider text-cream-primary transition-colors hover:bg-gold-primary/15 hover:text-gold-primary"
                                    >
                                      <Download className="h-4 w-4 text-gold-primary" />
                                      <span>Download</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setMenuOpen(false);
                                        handleAddToWardrobe();
                                      }}
                                      className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-xs uppercase tracking-wider text-cream-primary transition-colors hover:bg-gold-primary/15 hover:text-gold-primary"
                                    >
                                      <Bookmark className="h-4 w-4 text-gold-primary" />
                                      <span>Add to Saved Looks</span>
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CTA Buttons Side-by-Side in 1 Row */}
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <Button size="sm" onClick={handleTryOn} disabled={isPending} className="h-10 text-[0.6rem] px-1.5">
                          {isPending ? <LoaderCircle className="animate-spin" aria-hidden /> : <RotateCw aria-hidden />}
                          {ctaLabel}
                        </Button>
                        {selectedGarment?.buyUrl && (
                          <a href={selectedGarment.buyUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex h-10 w-full items-center justify-center bg-gold-primary px-2 text-[0.6rem] font-semibold uppercase tracking-wider text-surface-0 transition-all hover:bg-gold-dark hover:text-cream-primary active:scale-[0.98] rounded-sm">
                            Buy on Myntra →
                          </a>
                        )}
                      </div>

                      {(clothes.isError || makeup.isError || hair.isError) && !isFallback && (
                        <p className="mt-2 text-[length:var(--text-body-sm)] text-error">The try-on could not be completed. Please try again.</p>
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

function TemplateGrid({ items, selectedId, onSelect }: {
  items: TemplateItem[];
  selectedId: string | null;
  onSelect: (item: TemplateItem) => void;
}) {
  return (
    <div>
      <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3">
        {items.map((item) => {
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


