import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { success, error } from '@/lib/toast';
import * as Dialog from '@radix-ui/react-dialog';
import { Bookmark, Check, Copy, Printer, Share2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ColorSwatch,
  type ColorSwatchItem,
} from '@/components/ui/color-swatch';
import { EmptyAnalysisState } from '@/components/EmptyAnalysisState';
import { useStyleStore } from '@/store/useStyleStore';
import {
  getSeasonInfo,
  mergeAnalysisPalette,
  sortByGradient,
  type ColourItem,
} from '@/lib/colour-data';

const MAKEUP_SHADE_HEXES: Record<string, string> = {
  Peach: '#F4C29A',
  'Warm Nude': '#D9A06F',
  Coral: '#E8845B',
  'Deep Red': '#8E1F2F',
  Rose: '#C0586E',
  'Soft Pink': '#E8B4C8',
  'Neutral Beige': '#D9B08C',
  Taupe: '#B08B6E',
  'Berry': '#8E3B5A',
  'Warm Bronze': '#B06A3B',
  Blush: '#D98A87',
  Mocha: '#7A4A3B',
  Nude: '#E3B79C',
  'Classic Red': '#B22234',
  Mauve: '#A78B9E',
};

interface SectionProps {
  label: string;
  title: string;
  children: React.ReactNode;
}

function Section({ label, title, children }: SectionProps) {
  return (
    <Card variant="report" className="p-8">
      <p className="text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
        {label}
      </p>
      <h2 className="mt-2 font-serif text-[length:var(--text-h4)] text-espresso">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </Card>
  );
}

function AvoidSwatch({ colour }: { colour: ColourItem }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(colour.hex);
      success(`${colour.name} hex copied`);
    } catch {
      error('Could not copy the hex value');
    }
  };

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => void handleCopy()}
          aria-label={`${colour.name}, hex ${colour.hex}, avoid`}
          className="group inline-flex flex-col items-start gap-1.5 rounded-md transition-colors duration-[var(--duration-fast)] ease-out"
        >
          <span
            aria-hidden="true"
            className="block h-20 w-20 rounded-md shadow-[var(--shadow-swatch)] transition-[transform,box-shadow] duration-[var(--duration-fast)] ease-out group-hover:scale-[1.03] group-hover:shadow-[var(--shadow-swatch-hover)] group-focus-visible:scale-[1.03] group-focus-visible:shadow-[var(--shadow-swatch-hover)]"
            style={{
              backgroundColor: colour.hex,
              backgroundImage:
                'linear-gradient(to top right, transparent calc(50% - 1px), rgba(192,57,43,0.75) calc(50% - 1px), rgba(192,57,43,0.75) calc(50% + 1px), transparent calc(50% + 1px))',
            }}
          />
          <span className="text-[length:var(--text-caption)] text-espresso-muted">
            {colour.name}
          </span>
          <span className="text-[length:var(--text-micro)] tabular-nums text-espresso-muted/70">
            {colour.hex}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent
        className="flex flex-col gap-0.5 text-[length:var(--text-label)]"
        side="top"
      >
        <span className="font-medium text-espresso">{colour.name}</span>
        <span className="text-espresso-muted">{colour.hex}</span>
        <span className="text-espresso-muted">Avoid — keep away from your face</span>
      </TooltipContent>
    </Tooltip>
  );
}

function Trait({ label, value, swatch }: { label: string; value: string; swatch?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[length:var(--text-caption)] font-medium uppercase tracking-[var(--tracking-label)] text-espresso-muted">
        {label}
      </span>
      <span className="flex items-center gap-2">
        {swatch && (
          <span
            aria-hidden="true"
            className="h-5 w-5 rounded-sm shadow-[var(--shadow-swatch)]"
            style={{ backgroundColor: swatch }}
          />
        )}
        <span className="text-[length:var(--text-body-sm)] capitalize text-espresso">
          {value}
        </span>
      </span>
    </div>
  );
}

export default function Report() {
  const analysisResult = useStyleStore((s) => s.analysisResult);
  const savedReports = useStyleStore((s) => s.savedReports);
  const saveReport = useStyleStore((s) => s.saveReport);
  const [modalColour, setModalColour] = useState<ColourItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setSaved(
      savedReports.some((r) => r.analyzedAt === analysisResult?.analyzedAt),
    );
  }, [savedReports, analysisResult]);

  const seasonInfo = useMemo(
    () =>
      analysisResult
        ? getSeasonInfo(
            analysisResult.colourSeason,
            analysisResult.colorProfile.undertone,
          )
        : null,
    [analysisResult],
  );

  if (!analysisResult || !seasonInfo) {
    return (
      <section className="w-full pt-28 pb-24 relative isolate overflow-hidden min-h-[80vh] flex items-center">
        {/* Background soft glow circles */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{ x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-white/70 blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -20, 20, 0], y: [0, 20, -20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-10 bottom-10 h-[30rem] w-[30rem] rounded-full bg-gold-light/10 blur-[120px]"
          />
        </div>

        <div className="mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8">
          <Card variant="report" className="p-8 shadow-lg border border-border/80">
            <EmptyAnalysisState />
          </Card>
        </div>
      </section>
    );
  }

  const palette = mergeAnalysisPalette(
    seasonInfo.palette,
    analysisResult.recommendations.outfitPalette ?? [],
  );
  const neutrals = sortByGradient(seasonInfo.neutrals);
  const avoid = sortByGradient(seasonInfo.avoid);
  const archetypes =
    analysisResult.styleArchetypes && analysisResult.styleArchetypes.length > 0
      ? analysisResult.styleArchetypes
      : seasonInfo.archetypes;
  const makeupShades = analysisResult.recommendations.makeupShades ?? {
    foundation: seasonInfo.neutrals[0]?.hex ?? seasonInfo.palette[0].hex,
    blush: seasonInfo.palette[5]?.hex ?? seasonInfo.palette[0].hex,
    lip: seasonInfo.palette[6]?.hex ?? seasonInfo.palette[0].hex,
  };
  const makeupHexes = {
    foundation: MAKEUP_SHADE_HEXES[makeupShades.foundation] ?? seasonInfo.neutrals[0]?.hex ?? seasonInfo.palette[0].hex,
    blush: MAKEUP_SHADE_HEXES[makeupShades.blush] ?? seasonInfo.palette[5]?.hex ?? seasonInfo.palette[0].hex,
    lip: MAKEUP_SHADE_HEXES[makeupShades.lip] ?? seasonInfo.palette[6]?.hex ?? seasonInfo.palette[0].hex,
  };
  const hairOptions = analysisResult.recommendations.hairColorOptions ?? [];
  const routine = analysisResult.recommendations.skincareRoutine ?? [];
  const isWarm = analysisResult.colorProfile.undertone === 'warm';

  const copyColour = async (colour: ColourItem) => {
    try {
      await navigator.clipboard.writeText(colour.hex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
      success(`${colour.name} hex copied`);
    } catch {
      error('Could not copy the hex value');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      success('Report link copied to clipboard');
    } catch {
      error('Could not copy the link');
    }
  };

  const handleSave = () => {
    if (!analysisResult) return;
    const didSave = saveReport(analysisResult);
    setSaved(true);
    success(
      didSave
        ? 'Report saved to your dashboard'
        : 'Report is already on your dashboard',
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full pt-16 pb-28">
      <div className="mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start lg:gap-12 print:grid-cols-1">
          {/* Left column — sticky colour profile card */}
          <aside className="lg:sticky lg:top-24 print:static">
            <Card variant="report" className="p-8">
              {analysisResult.enhancedImageUrl && (
                <div className="mb-6 overflow-hidden rounded-md border border-border">
                  <img
                    src={analysisResult.enhancedImageUrl}
                    alt="Your analysed photo"
                    width={640}
                    height={640}
                    loading="eager"
                    className="aspect-square w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <p className="text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
                Your Colour Profile
              </p>
              <h2 className="mt-2 font-serif text-[length:var(--text-h4)] text-espresso">
                {seasonInfo.season}
              </h2>
              <p className="mt-1 text-[length:var(--text-caption)] text-espresso-muted">
                Analysed on{' '}
                {new Date(analysisResult.analyzedAt).toLocaleDateString()}
              </p>

              <div className="my-6 h-px bg-border" aria-hidden="true" />

              <div className="space-y-4">
                <Trait
                  label="Undertone"
                  value={analysisResult.colorProfile.undertone}
                />
                <Trait
                  label="Skin tone"
                  value={analysisResult.colorProfile.skinToneHex}
                  swatch={analysisResult.colorProfile.skinToneHex}
                />
                <Trait label="Eyes" value={analysisResult.colorProfile.eyeColor} />
                <Trait label="Hair" value={analysisResult.colorProfile.hairColor} />
                <Trait label="Lips" value={analysisResult.colorProfile.lipColor} />
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <Link href="/try-on">
                  <Button size="lg" className="w-full">
                    Try On Your Colours
                  </Button>
                </Link>
                <Button
                  variant={saved ? 'ghost' : 'secondary'}
                  className="w-full"
                  onClick={handleSave}
                >
                  {saved ? (
                    <Check aria-hidden="true" />
                  ) : (
                    <Bookmark aria-hidden="true" />
                  )}
                  {saved ? 'Saved to Dashboard' : 'Save to Dashboard'}
                </Button>
                <Button variant="ghost" className="w-full" onClick={handleShare}>
                  <Share2 aria-hidden="true" />
                  Share Report
                </Button>
                <Button variant="ghost" className="w-full" onClick={handlePrint}>
                  <Printer aria-hidden="true" />
                  Print / Save as PDF
                </Button>
              </div>
            </Card>
          </aside>

          {/* Right column — report sections */}
          <div className="space-y-10">
            {/* 1. Colour season — headline finding */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
                Your Colour Season
              </p>
              <motion.h1
                initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0.001 }}
                animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
                transition={{ duration: 0.9, ease: [0, 0, 0.2, 1] }}
                className="mt-3 font-serif text-[40px] leading-[1.05] text-espresso md:text-[64px]"
              >
                {seasonInfo.season}
              </motion.h1>
              <p className="mt-3 font-serif text-[length:var(--text-h5)] italic text-espresso-light">
                {seasonInfo.tagline}
              </p>
              <p className="mt-4 max-w-xl text-[length:var(--text-body)] text-espresso-light">
                {seasonInfo.description}
              </p>
            </div>

            {/* 2. Your colour palette */}
            <Section label="Your Palette" title="Your Colour Palette">
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-5">
                {palette.map((colour, i) => (
                  <motion.div
                    key={colour.hex + colour.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.08,
                      duration: 0.3,
                      ease: [0, 0, 0.2, 1],
                    }}
                  >
                    <ColorSwatch
                      {...colour}
                      onCopy={() => setModalColour(colour)}
                    />
                  </motion.div>
                ))}
              </div>
            </Section>

            {/* 3. Skin undertone analysis */}
            <Section label="Your Undertone" title="Skin Undertone Analysis">
              <p className="max-w-xl text-[length:var(--text-body)] text-espresso-light">
                {isWarm
                  ? 'Your skin reads warm. Gold, olive, and terracotta sit harmoniously against you, while silver, grey, and icy pastels tend to flatten your glow.'
                  : analysisResult.colorProfile.undertone === 'cool'
                    ? 'Your skin reads cool. Silver, jewel tones, and crisp whites intensify you, while earthy golds can leave you looking muted.'
                    : 'Your skin sits between warm and cool. Muted, blended tones suit you best — pure extremes on either side can overbalance your natural harmony.'}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-6">
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-10 w-10 rounded-md shadow-[var(--shadow-swatch)]"
                    style={{ backgroundColor: analysisResult.colorProfile.skinToneHex }}
                  />
                  <span>
                    <span className="block text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-espresso-muted">
                      Detected tone
                    </span>
                    <span className="block text-[length:var(--text-body-sm)] text-espresso">
                      {analysisResult.colorProfile.skinToneHex}
                    </span>
                  </span>
                </span>
                <Badge variant="gold" className="uppercase tracking-[var(--tracking-label)]">
                  {analysisResult.colorProfile.undertone} undertone
                </Badge>
              </div>
            </Section>

            {/* 4. Best neutrals */}
            <Section label="Your Neutrals" title="Best Neutrals">
              <p className="max-w-xl text-[length:var(--text-body-sm)] text-espresso-light">
                Neutrals form the quiet backbone of your wardrobe. These
                harmonise with your season and pair with everything above.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-5">
                {neutrals.map((colour, i) => (
                  <motion.div
                    key={colour.hex + colour.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.08,
                      duration: 0.3,
                      ease: [0, 0, 0.2, 1],
                    }}
                  >
                    <ColorSwatch
                      {...colour}
                      onCopy={() => setModalColour(colour)}
                    />
                  </motion.div>
                ))}
              </div>
            </Section>

            {/* 5. Colours to avoid */}
            <Section label="Colours to Avoid" title="Colours to Avoid">
              <p className="max-w-xl text-[length:var(--text-body-sm)] text-espresso-light">
                These tones work against your season. Wear them sparingly, or
                keep them far from your face.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-5">
                {avoid.map((colour) => (
                  <AvoidSwatch key={colour.hex + colour.name} colour={colour} />
                ))}
              </div>
            </Section>

            {/* 6. Style archetypes */}
            <Section label="Your Archetypes" title="Style Archetypes">
              <div className="space-y-8">
                {archetypes.map((archetype) => (
                  <div key={archetype.title} className="border-l-2 border-gold-primary pl-5">
                    <h3 className="font-serif text-[length:var(--text-h5)] text-espresso">
                      {archetype.title}
                    </h3>
                    <p className="mt-1.5 max-w-xl text-[length:var(--text-body-sm)] text-espresso-light">
                      {archetype.description}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            {/* 7. Wardrobe recommendations */}
            <Section label="Your Wardrobe" title="Wardrobe Recommendations">
              <div>
                <h3 className="text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
                  Makeup shades
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Foundation', hex: makeupHexes.foundation, shade: makeupShades.foundation },
                    { label: 'Blush', hex: makeupHexes.blush, shade: makeupShades.blush },
                    { label: 'Lip', hex: makeupHexes.lip, shade: makeupShades.lip },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-md border border-border bg-cream-dark p-3"
                    >
                      <span
                        aria-hidden="true"
                        className="h-10 w-10 shrink-0 rounded-md shadow-[var(--shadow-swatch)]"
                        style={{ backgroundColor: item.hex }}
                      />
                      <span>
                        <span className="block text-[length:var(--text-body-sm)] font-medium text-espresso">
                          {item.label} · {item.shade}
                        </span>
                        <span className="block text-[length:var(--text-micro)] tabular-nums text-espresso-muted">
                          {item.hex}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {hairOptions.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
                    Hair colours
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-3">
                    {hairOptions.map((option) => (
                      <li
                        key={option}
                        className="rounded-md border border-border bg-cream-dark px-4 py-2.5 text-[length:var(--text-body-sm)] text-espresso"
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {routine.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
                    Skincare routine
                  </h3>
                  <ol className="mt-4 space-y-4">
                    {routine.map((step) => (
                      <li key={step.step} className="flex gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gold-primary font-serif text-[length:var(--text-body-sm)] text-espresso">
                          {step.step}
                        </span>
                        <div>
                          <p className="text-[length:var(--text-body-sm)] font-medium text-espresso">
                            {step.product}
                          </p>
                          <p className="mt-0.5 text-[length:var(--text-caption)] text-espresso-muted">
                            {step.reason}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </Section>

            {/* 8. Share / Save / Try-On CTAs */}
            <div className="rounded-lg bg-espresso px-8 py-12 text-center">
              <h2 className="font-serif text-[length:var(--text-h3)] text-cream-primary">
                Ready to see these colours on you?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[length:var(--text-body)] text-cream-primary/80">
                Try on outfits in your palette, save your report, and share it
                with your stylist.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/try-on">
                  <Button size="lg">Try On Your Colours</Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-cream-primary/40 bg-transparent text-cream-primary hover:bg-cream-primary/10 hover:text-cream-primary"
                  onClick={handleShare}
                >
                  <Share2 aria-hidden="true" />
                  Share Report
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-cream-primary/40 bg-transparent text-cream-primary hover:bg-cream-primary/10 hover:text-cream-primary"
                  onClick={handlePrint}
                >
                  <Printer aria-hidden="true" />
                  Print / Save as PDF
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-cream-primary hover:bg-cream-primary/10 hover:text-cream-primary"
                  onClick={handleSave}
                >
                  {saved ? (
                    <Check aria-hidden="true" />
                  ) : (
                    <Bookmark aria-hidden="true" />
                  )}
                  {saved ? 'Saved to Dashboard' : 'Save to Dashboard'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Colour detail modal */}
      <Dialog.Root
        open={modalColour !== null}
        onOpenChange={(open) => {
          if (!open) setModalColour(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[2000] bg-espresso/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            aria-describedby={
              modalColour ? 'colour-detail-description' : undefined
            }
            className="fixed inset-0 z-[2000] flex flex-col overflow-y-auto bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          >
            {modalColour && (
              <div className="mx-auto flex w-full max-w-[var(--container-narrow)] flex-1 flex-col px-6 py-10 md:py-16">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
                    Colour Detail
                  </p>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close colour detail"
                      className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-cream-dark text-espresso transition-colors duration-200 ease-out hover:border-gold-primary hover:text-gold-primary"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>

                <div
                  className="mt-8 aspect-square w-full rounded-lg shadow-[var(--shadow-md)]"
                  style={{
                    backgroundColor: modalColour.hex,
                    boxShadow:
                      'inset 0 0 0 1px rgba(0,0,0,0.08), var(--shadow-md)',
                  }}
                />

                <Dialog.Title asChild>
                  <h2 className="mt-8 font-serif text-[length:var(--text-h2)] text-espresso">
                    {modalColour.name}
                  </h2>
                </Dialog.Title>
                <p className="mt-1 text-[length:var(--text-body)] tabular-nums text-espresso-muted">
                  {modalColour.hex}
                </p>
                <p
                  id="colour-detail-description"
                  className="mt-4 max-w-md text-[length:var(--text-body)] text-espresso-light"
                >
                  {modalColour.recommendation}
                </p>

                <div className="mt-10">
                  <Button
                    size="lg"
                    onClick={() => void copyColour(modalColour)}
                  >
                    {copied ? (
                      <Check aria-hidden="true" />
                    ) : (
                      <Copy aria-hidden="true" />
                    )}
                    {copied ? 'Copied' : 'Copy hex value'}
                  </Button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
