import { useEffect, useMemo, useState } from 'react';
import { Link, useSearch } from 'wouter';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { success, error } from '@/lib/toast';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Bookmark,
  Check,
  Copy,
  Download,
  Printer,
  Share2,
  ShieldCheck,
  ShoppingBag,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CountUp } from '@/components/ui/count-up';
import { ROUTES } from '@/config/navigation';
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
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import CampaignSection from '@/components/editorial/CampaignSection';
import EditorialImage from '@/components/editorial/EditorialImage';
import { CAMPAIGN } from '@/lib/editorial-images';
import { useStyleStore } from '@/store/useStyleStore';
import { useAuthStore } from '@/store/useAuthStore';
import { assetUrl, recommendProducts } from '@/services/api';
import {
  getSeasonInfo,
  mergeAnalysisPalette,
  RUNNER_UP_SEASONS,
  sortByGradient,
  type ColourItem,
} from '@/lib/colour-data';
import type { SkinConcerns } from '@/store/useStyleStore';

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

/** Plain-language explanation + a first step, keyed by the 14 scored concerns. */
const CONCERN_GUIDANCE: Record<
  keyof SkinConcerns,
  { label: string; advice: string; remedy: string }
> = {
  acne: {
    label: 'Acne',
    advice: 'Breakouts appear as redness and raised texture, usually around the T-zone.',
    remedy: 'Keep the routine gentle and non-comedogenic; cleanse twice a day.',
  },
  darkSpots: {
    label: 'Dark spots',
    advice: 'Concentrated melanin reads as patches of deeper tone.',
    remedy: 'Daily SPF is the single biggest lever; brightening serums help fade them.',
  },
  wrinkles: {
    label: 'Wrinkles',
    advice: 'Fine lines in the expression zones reflect movement and dryness.',
    remedy: 'Consistent moisturising and SPF stop them from deepening.',
  },
  pores: {
    label: 'Enlarged pores',
    advice: 'Pores look prominent where oil and texture concentrate.',
    remedy: 'Salicylic acid and hydration keep them looking refined.',
  },
  oiliness: {
    label: 'Oiliness',
    advice: 'The T-zone produces extra sebum and takes on a shine.',
    remedy: 'A balanced moisturiser and midday blotting calm overproduction.',
  },
  dryness: {
    label: 'Dryness',
    advice: 'The skin barrier lacks moisture and can feel tight or flaky.',
    remedy: 'Layer a hydrating serum under a barrier-friendly moisturiser.',
  },
  redness: {
    label: 'Redness',
    advice: 'Visible flushing suggests reactive capillaries near the surface.',
    remedy: 'Avoid hot water and harsh exfoliants; calm with soothing ingredients.',
  },
  eyeBags: {
    label: 'Under-eye bags',
    advice: 'Fluid and soft tissue settle in the under-eye hollow.',
    remedy: 'Sleep and a cold compress help; a corrector hides the shadow instantly.',
  },
  darkCircles: {
    label: 'Dark circles',
    advice: 'A shadowed under-eye area from pigment or translucent skin.',
    remedy: 'A peach-toned corrector lifts the area before concealer.',
  },
  uneven: {
    label: 'Uneven tone',
    advice: 'Complexion colour varies noticeably across zones.',
    remedy: 'Brightening actives plus SPF even it out over a few weeks.',
  },
  sensitivity: {
    label: 'Sensitivity',
    advice: 'The skin reacts quickly to products or weather changes.',
    remedy: 'Keep the routine short, fragrance-free, and patch-test everything.',
  },
  texture: {
    label: 'Texture',
    advice: 'Surface unevenness from congestion or rough patches.',
    remedy: 'Gentle exfoliation plus hydration smooth the surface.',
  },
  firmness: {
    label: 'Firmness',
    advice: 'Reduced elasticity gives the skin a less taut feel.',
    remedy: 'Peptides and gentle facial massage support firmness over time.',
  },
  radiance: {
    label: 'Dullness',
    advice: 'Low glow from dead surface cells and dehydration.',
    remedy: 'Weekly gentle exfoliation plus a hydrating layer restores light.',
  },
};

const KNOWN_SEASONS = [
  'Warm Autumn', 'Deep Autumn', 'Soft Autumn',
  'Cool Winter', 'Deep Winter', 'Bright Winter',
  'Light Summer', 'True Cool Summer', 'Soft Summer',
  'Light Spring', 'True Warm Spring', 'Bright Spring',
];

function buildSampleResult(seasonSlug: string): import('@/store/useStyleStore').AnalysisResult | null {
  // Convert slug to season name: 'warm-autumn' → 'Warm Autumn'
  const seasonName = seasonSlug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  if (!KNOWN_SEASONS.includes(seasonName)) return null;

  // Determine undertone from season name
  const undertone: 'warm' | 'cool' | 'neutral' =
    /autumn|spring/i.test(seasonName) ? 'warm' : 'cool';

  const info = getSeasonInfo(seasonName, undertone);
  if (!info) return null;

  return {
    enhancedImageUrl: '',
    skinConcerns: {
      acne: 0.15, darkSpots: 0.08, wrinkles: 0.05, pores: 0.25,
      oiliness: 0.35, dryness: 0.20, redness: 0.10, eyeBags: 0.18,
      darkCircles: 0.22, uneven: 0.12, sensitivity: 0.10,
      texture: 0.28, firmness: 0.20, radiance: 0.30,
    },
    colorProfile: {
      undertone,
      skinToneHex: undertone === 'warm' ? '#D2A679' : '#C4A0A0',
      eyeColor: 'brown',
      lipColor: 'rose',
      hairColor: undertone === 'warm' ? 'brown' : 'dark brown',
    },
    recommendations: {
      outfitPalette: info.palette.slice(0, 4).map((c) => c.hex),
      avoidColors: info.avoid.slice(0, 3).map((c) => c.hex),
      makeupShades: { foundation: 'Warm Nude', blush: 'Blush', lip: 'Rose' },
      hairColorOptions: ['Natural shade', 'Warm highlights'],
      skincareRoutine: [
        { step: 1, product: 'Gentle cleanser', reason: 'Removes impurities without stripping moisture.' },
        { step: 2, product: 'Vitamin C serum', reason: 'Brightens and protects against free radicals.' },
        { step: 3, product: 'SPF moisturiser', reason: 'Shields skin and keeps it hydrated all day.' },
      ],
      styleInsight: `As a ${seasonName}, you shine in ${undertone === 'warm' ? 'earthy, golden' : 'crisp, cool'} tones.`,
    },
    analyzedAt: new Date().toISOString(),
    colourSeason: seasonName,
    seasonConfidence: 82,
    bestNeutrals: info.neutrals.slice(0, 3).map((c) => c.hex),
    styleArchetypes: info.archetypes,
  };
}

/** How the palette translates into real outfits, through the year. */
const THROUGH_YEAR = [
  {
    season: 'Summer',
    note: 'Breathable fabrics in the lighter half of your palette. Your softest palette colours carry the heat.',
  },
  {
    season: 'Monsoon',
    note: 'Muted versions of your colours hold up to humidity. Let your gold or silver accessories do the shine.',
  },
  {
    season: 'Winter',
    note: 'Go to your deepest neutrals and layered texture — your palette has the depth to anchor warm outerwear.',
  },
  {
    season: 'Festive',
    note: 'Your most saturated palette colours, finished with a metallic accent in your family metal.',
  },
];

/** Renders and downloads a shareable PNG palette card. */
function downloadPaletteCard(
  season: string,
  tagline: string,
  palette: ColourItem[],
  neutrals: ColourItem[],
) {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const cream = '#E8DFC8';
  const gold = '#C9A84C';
  const muted = 'rgba(232,223,200,0.62)';
  const hairline = 'rgba(184,150,74,0.45)';

  ctx.fillStyle = '#0E0E0E';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = hairline;
  ctx.lineWidth = 4;
  ctx.strokeRect(14, 14, W - 28, H - 28);

  ctx.textAlign = 'center';
  ctx.fillStyle = gold;
  ctx.font = '600 34px "Helvetica Neue", Arial, sans-serif';
  ctx.fillText("D'FASHION — COLOUR REPORT", W / 2, 104);

  ctx.fillStyle = cream;
  ctx.font = '400 92px Georgia, "Times New Roman", serif';
  ctx.fillText(season, W / 2, 244);

  ctx.fillStyle = muted;
  ctx.font = 'italic 40px Georgia, serif';
  ctx.fillText(tagline, W / 2, 316);

  const label = (text: string, y: number) => {
    ctx.textAlign = 'center';
    ctx.fillStyle = gold;
    ctx.font = '500 30px "Helvetica Neue", Arial, sans-serif';
    ctx.fillText(text.toUpperCase(), W / 2, y);
  };

  const size = 150;
  const gap = 26;
  const cols = 5;
  const startX = (W - cols * size - (cols - 1) * gap) / 2;
  let startY = 400;

  const drawRow = (items: ColourItem[], withBorder: boolean) => {
    label(withBorder ? 'Neutrals' : 'Your palette', startY - 46);
    items.slice(0, cols).forEach((item, i) => {
      const x = startX + i * (size + gap);
      const y = startY;
      if (withBorder) {
        ctx.strokeStyle = hairline;
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, size, size);
      }
      ctx.fillStyle = item.hex;
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = cream;
      ctx.font = '500 26px "Helvetica Neue", Arial, sans-serif';
      ctx.fillText(item.name.length > 14 ? `${item.name.slice(0, 13)}…` : item.name, x + size / 2, y + size + 40);
      ctx.fillStyle = muted;
      ctx.font = '400 24px "Helvetica Neue", Arial, sans-serif';
      ctx.fillText(item.hex.toUpperCase(), x + size / 2, y + size + 76);
    });
    startY += size + 116;
  };

  drawRow(palette, false);
  if (palette.length > cols) {
    const secondRow = palette.slice(cols, cols * 2);
    if (secondRow.length > 0) {
      secondRow.forEach((item, i) => {
        const x = startX + i * (size + gap);
        const y = startY;
        ctx.fillStyle = item.hex;
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = cream;
        ctx.font = '500 26px "Helvetica Neue", Arial, sans-serif';
        ctx.fillText(item.name.length > 14 ? `${item.name.slice(0, 13)}…` : item.name, x + size / 2, y + size + 40);
        ctx.fillStyle = muted;
        ctx.font = '400 24px "Helvetica Neue", Arial, sans-serif';
        ctx.fillText(item.hex.toUpperCase(), x + size / 2, y + size + 76);
      });
      startY += size + 116;
    }
  }
  drawRow(neutrals, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = muted;
  ctx.font = '400 26px Georgia, serif';
  ctx.fillText('Find your colours at D\u2019Fashion', W / 2, H - 56);

  const anchor = document.createElement('a');
  anchor.href = canvas.toDataURL('image/png');
  anchor.download = `${season.toLowerCase().replace(/[^a-z]+/g, '-')}-palette-card.png`;
  anchor.click();
}

interface SectionProps {
  label: string;
  title: string;
  children: React.ReactNode;
}

function Section({ label, title, children }: SectionProps) {
  return (
    <section className="border-t border-gold-hairline pt-8">
      <EyebrowLabel tone="gold">{label}</EyebrowLabel>
      <EditorialHeading as="h2" size="sm" className="mt-3">
        {title}
      </EditorialHeading>
      <div className="mt-6">{children}</div>
    </section>
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
            className="block h-20 w-20 rounded-md shadow-[var(--shadow-swatch)] transition-[transform,box-shadow] duration-[var(--duration-fast)] ease-out group-hover:scale-[1.03] group-hover:shadow-[var(--shadow-swatch-hover)] group-focus-visible:scale-[1.03] group-focus-visible:shadow-[var(--shadow-swatch-hover)] will-change-transform"
            style={{
              backgroundColor: colour.hex,
              backgroundImage:
                'linear-gradient(to top right, transparent calc(50% - 1px), rgba(192,57,43,0.75) calc(50% - 1px), rgba(192,57,43,0.75) calc(50% + 1px), transparent calc(50% + 1px))',
            }}
          />
          <span className="text-[length:var(--text-caption)] text-cream-primary/55">
            {colour.name}
          </span>
          <span className="max-w-20 text-[length:var(--text-micro)] leading-snug text-cream-primary/40">
            {colour.recommendation}
          </span>
          <span className="text-[length:var(--text-micro)] tabular-nums text-cream-primary/40">
            {colour.hex}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent
        className="flex max-w-64 flex-col gap-0.5 text-[length:var(--text-label)]"
        side="top"
      >
        <span className="font-medium text-cream-primary">{colour.name}</span>
        <span className="text-cream-primary/55">{colour.hex}</span>
        <span className="text-cream-primary/55">{colour.recommendation}</span>
        <span className="text-cream-primary/55">Avoid — keep away from your face</span>
      </TooltipContent>
    </Tooltip>
  );
}

function Trait({ label, value, swatch }: { label: string; value: string; swatch?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[length:var(--text-caption)] font-medium uppercase tracking-[var(--tracking-label)] text-cream-primary/55">
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
        <span className="text-[length:var(--text-body-sm)] capitalize text-cream-primary">
          {value}
        </span>
      </span>
    </div>
  );
}

function RadarPanel({ concerns }: { concerns: SkinConcerns }) {
  const entries = (Object.keys(concerns) as (keyof SkinConcerns)[]).map((key) => ({
    key,
    label: CONCERN_GUIDANCE[key].label,
    score: Math.round((concerns[key] ?? 0) * 100),
  }));
  const data = entries.map(({ label, score }) => ({ concern: label, score }));
  const top3 = [...entries].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="border border-gold-hairline p-4">
        <ResponsiveContainer width="100%" height={340}>
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
            <PolarGrid stroke="rgba(184,150,74,0.25)" />
            <PolarAngleAxis
              dataKey="concern"
              tick={{ fill: 'rgba(232,223,200,0.55)', fontSize: 11 }}
            />
            <Radar
              dataKey="score"
              stroke="#C9A84C"
              fill="#C9A84C"
              fillOpacity={0.28}
              isAnimationActive
            />
          </RadarChart>
        </ResponsiveContainer>
        <p className="mt-2 text-center text-[length:var(--text-caption)] text-cream-primary/40">
          Scores out of 100 — lower means closer to your natural baseline
        </p>
      </div>

      <div className="flex flex-col justify-center gap-4">
        <p className="max-w-md text-[length:var(--text-body-sm)] text-cream-primary/70">
          These are the three concerns our scan weighed most heavily in your
          photo. Each comes with the plain-language read and a first step.
        </p>
        {top3.map((item, i) => {
          const guide = CONCERN_GUIDANCE[item.key];
          return (
            <div key={item.key} className="border border-gold-hairline p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-serif text-[length:var(--text-h5)] text-cream-primary">
                  <span className="mr-2 text-gold-primary">0{i + 1}</span>
                  {guide.label}
                </span>
                <span className="rounded-md bg-gold-primary/10 px-2.5 py-1 text-[length:var(--text-body-sm)] font-semibold tabular-nums text-gold-primary">
                  {item.score}%
                </span>
              </div>
              <p className="mt-2 text-[length:var(--text-body-sm)] text-cream-primary/75">
                {guide.advice}
              </p>
              <p className="mt-2 text-[length:var(--text-body-sm)] text-cream-primary/55">
                <span className="font-medium text-gold-primary">First step — </span>
                {guide.remedy}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ShopSection({
  undertone,
  skinType,
  skinTone,
}: {
  undertone: string;
  skinType: string;
  skinTone: string;
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const query = useQuery({
    queryKey: ['products', 'recommend', skinType, skinTone],
    queryFn: async () => (await recommendProducts(skinType, skinTone)).data,
    enabled: isAuthenticated,
  });

  // Auth guard — not signed in
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-start gap-4 border border-gold-hairline p-6">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-6 w-6 text-gold-primary/60" aria-hidden="true" />
          <p className="font-serif text-[length:var(--text-h5)] text-cream-primary">
            Sign up to unlock recommendations
          </p>
        </div>
        <p className="max-w-md text-[length:var(--text-body-sm)] text-cream-primary/60">
          Create a free account to see products curated for your colour season
          and undertone — filtered specifically for your palette.
        </p>
        <Link href={ROUTES.upload}>
          <Button>
            <ShoppingBag className="mr-2 h-4 w-4" aria-hidden="true" />
            Sign Up to Shop Your Palette →
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="gold" className="uppercase tracking-[var(--tracking-label)]">
          <ShoppingBag className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
          Suggested for your palette
        </Badge>
        {undertone && (
          <span className="text-[length:var(--text-caption)] text-cream-primary/40">
            Filtered by your {undertone} undertone
          </span>
        )}
      </div>

      {query.isLoading && (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-none" />
          ))}
        </div>
      )}

      {query.isError && (
        <p className="mt-6 max-w-xl text-[length:var(--text-body-sm)] text-cream-primary/55">
          We couldn&rsquo;t load the shop right now. Try again in a moment, or
          head to your{' '}
          <Link href={ROUTES.tryOn} className="underline underline-offset-2 hover:text-gold-primary">
            try-on
          </Link>{' '}
          to experiment with colours directly.
        </p>
      )}

      {query.data && query.data.products.length === 0 && (
        <div className="mt-6 flex flex-col items-start gap-3 border border-gold-hairline p-6">
          <p className="font-serif text-[length:var(--text-h5)] text-cream-primary">
            Your shop is being styled
          </p>
          <p className="max-w-md text-[length:var(--text-body-sm)] text-cream-primary/60">
            Products curated for your season will appear here. In the meantime,
            every hex in your palette is yours — copy one and start shopping
            anywhere.
          </p>
        </div>
      )}

      {query.data && query.data.products.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {query.data.products.map((product) => (
            <div
              key={product._id}
              className="group border border-gold-hairline bg-surface-3/40 transition-colors duration-200 ease-out hover:border-gold-border"
            >
              {product.image ? (
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={assetUrl(product.image)}
                    alt={product.name}
                    width={480}
                    height={480}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-gold-primary/5">
                  <span className="font-serif text-[length:var(--text-h5)] text-gold-primary/60">
                    {product.brand}
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-1 p-4">
                <p className="text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-gold-primary">
                  {product.category}
                </p>
                <p className="text-[length:var(--text-body)] font-medium leading-snug text-cream-primary">
                  {product.name}
                </p>
                <p className="text-[length:var(--text-body-sm)] text-cream-primary/55">
                  {product.brand}
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="text-[length:var(--text-body)] font-semibold tabular-nums text-gold-primary">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                  {product.description && (
                    <a
                      href={product.description}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[length:var(--text-caption)] font-medium text-gold-primary underline underline-offset-2 transition-colors hover:text-gold-light"
                    >
                      Shop →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
  const [sampleBannerDismissed, setSampleBannerDismissed] = useState(false);

  // Sample mode — ?sample=warm-autumn renders a static demo report
  const search = useSearch();
  const sampleParam = new URLSearchParams(search).get('sample');
  const isSample = Boolean(sampleParam);
  const sampleResult = useMemo(
    () => (sampleParam ? buildSampleResult(sampleParam) : null),
    [sampleParam],
  );

  // Use sample result if no real result and sample param is present
  const effectiveResult = analysisResult ?? sampleResult;

  useEffect(() => {
    setSaved(
      savedReports.some((r) => r.analyzedAt === effectiveResult?.analyzedAt),
    );
  }, [savedReports, effectiveResult]);

  const seasonInfo = useMemo(
    () =>
      effectiveResult
        ? getSeasonInfo(
            effectiveResult.colourSeason,
            effectiveResult.colorProfile.undertone,
          )
        : null,
    [effectiveResult],
  );

  if (!effectiveResult || !seasonInfo) {
    return (
      <section className="w-full pt-28 pb-24 relative isolate overflow-hidden min-h-[80svh] flex items-center">
        {/* Background soft glow circles */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{ x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-gold-primary/10 blur-[100px]"
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
    effectiveResult.recommendations.outfitPalette ?? [],
  );
  const neutrals = sortByGradient(seasonInfo.neutrals);
  const avoid = sortByGradient(seasonInfo.avoid);
  const archetypes =
    effectiveResult.styleArchetypes && effectiveResult.styleArchetypes.length > 0
      ? effectiveResult.styleArchetypes
      : seasonInfo.archetypes;
  const makeupShades = effectiveResult.recommendations.makeupShades ?? {
    foundation: seasonInfo.neutrals[0]?.hex ?? seasonInfo.palette[0].hex,
    blush: seasonInfo.palette[5]?.hex ?? seasonInfo.palette[0].hex,
    lip: seasonInfo.palette[6]?.hex ?? seasonInfo.palette[0].hex,
  };
  const makeupHexes = {
    foundation: MAKEUP_SHADE_HEXES[makeupShades.foundation] ?? seasonInfo.neutrals[0]?.hex ?? seasonInfo.palette[0].hex,
    blush: MAKEUP_SHADE_HEXES[makeupShades.blush] ?? seasonInfo.palette[5]?.hex ?? seasonInfo.palette[0].hex,
    lip: MAKEUP_SHADE_HEXES[makeupShades.lip] ?? seasonInfo.palette[6]?.hex ?? seasonInfo.palette[0].hex,
  };
  const hairOptions = effectiveResult.recommendations.hairColorOptions ?? [];
  const routine = effectiveResult.recommendations.skincareRoutine ?? [];
  const isWarm = effectiveResult.colorProfile.undertone === 'warm';

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
    if (!effectiveResult || isSample) return;
    const didSave = saveReport(effectiveResult);
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

  const handleDownloadCard = () => {
    downloadPaletteCard(
      seasonInfo.season,
      seasonInfo.tagline,
      palette,
      seasonInfo.neutrals,
    );
    success('Palette card download started');
  };

  const confidence = effectiveResult.seasonConfidence;
  const runnerUp = RUNNER_UP_SEASONS[seasonInfo.season] ?? null;

  return (
    <div className="w-full pb-28">
      {/* Sample mode banner */}
      {isSample && !sampleBannerDismissed && sampleResult && (
        <div
          role="status"
          aria-live="polite"
          className="relative flex items-center justify-between gap-3 border-b border-gold-hairline bg-gold-primary/10 px-5 py-3 print:hidden"
        >
          <p className="text-[length:var(--text-body-sm)] text-cream-primary/90">
            <span className="mr-1.5 font-medium text-gold-primary">Sample report</span>
            — This is a sample{' '}
            <span className="font-medium text-cream-primary">
              {sampleResult.colourSeason}
            </span>{' '}
            report. Get your own by uploading a photo.
          </p>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href={ROUTES.upload}
              className="text-[length:var(--text-body-sm)] font-medium text-gold-primary underline underline-offset-2 hover:text-gold-light"
            >
              Analyse my colours →
            </Link>
            <button
              type="button"
              aria-label="Dismiss sample report banner"
              onClick={() => setSampleBannerDismissed(true)}
              className="flex h-7 w-7 items-center justify-center rounded text-cream-primary/55 transition-colors hover:text-cream-primary"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
      <header className="border-b border-gold-hairline pb-10 pt-28">
        <EditorialContainer>
          <EyebrowLabel tone="gold">
            {isSample ? 'Sample Colour Report' : 'Your Colour Report'}
          </EyebrowLabel>
          <EditorialHeading as="h1" size="xl" className="mt-4">
            {seasonInfo.season}
          </EditorialHeading>
          <p className="mt-3 font-editorial italic text-h5 font-light text-cream-primary/60">
            {seasonInfo.tagline}
          </p>

          {typeof confidence === 'number' && (
            <div className="mt-5 max-w-sm">
              {/* "Warm Autumn · 87% confidence" label */}
              <p className="text-[length:var(--text-body-sm)] text-cream-primary/70">
                <span className="font-medium text-cream-primary">{seasonInfo.season}</span>
                <span className="mx-2 text-gold-primary/50">·</span>
                <CountUp target={Math.round(confidence)} suffix="% confidence" duration={1400} />
              </p>
              {/* Thin progress bar */}
              <div
                role="meter"
                aria-label={`Season confidence: ${Math.round(confidence)}%`}
                aria-valuenow={Math.round(confidence)}
                aria-valuemin={0}
                aria-valuemax={100}
                className="relative mt-2 h-0.5 w-full overflow-hidden rounded-full bg-gold-primary/15"
              >
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gold-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(Math.max(confidence, 0), 100)}%` }}
                  transition={{ duration: 1.2, ease: [0.25, 0, 0.2, 1] }}
                />
              </div>
              {/* Runner-up text — only when confidence < 80 */}
              {confidence < 80 && runnerUp && (
                <p className="mt-2 text-[length:var(--text-caption)] text-cream-primary/50">
                  Strong signal towards{' '}
                  <span className="font-medium text-gold-primary">{runnerUp}</span>
                </p>
              )}
            </div>
          )}
        </EditorialContainer>
      </header>

      <EditorialContainer width="content" className="mt-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start lg:gap-12 print:grid-cols-1">
          {/* Left column — sticky colour profile card */}
          <aside className="lg:sticky lg:top-24 print:static">
            <div className="border border-gold-hairline p-6">
              {effectiveResult.enhancedImageUrl && (
                <div className="mb-6 overflow-hidden rounded-sm border border-gold-hairline">
                  <img
                    src={assetUrl(effectiveResult.enhancedImageUrl)}
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

              <EyebrowLabel tone="gold">Your Colour Profile</EyebrowLabel>
              <EditorialHeading as="h2" size="sm" className="mt-3">
                {seasonInfo.season}
              </EditorialHeading>
              <p className="mt-1 text-caption text-cream-primary/55">
                {isSample
                  ? 'Sample report — not a real analysis'
                  : `Analysed on ${new Date(effectiveResult.analyzedAt).toLocaleDateString()}`}
              </p>

              <div className="my-6 h-px bg-gold-hairline" aria-hidden="true" />

              <div className="space-y-4">
                <Trait
                  label="Undertone"
                  value={effectiveResult.colorProfile.undertone}
                />
                <Trait
                  label="Skin tone"
                  value={effectiveResult.colorProfile.skinToneHex}
                  swatch={effectiveResult.colorProfile.skinToneHex}
                />
                <Trait label="Eyes" value={effectiveResult.colorProfile.eyeColor} />
                <Trait label="Hair" value={effectiveResult.colorProfile.hairColor} />
                <Trait label="Lips" value={effectiveResult.colorProfile.lipColor} />
              </div>

              <div className="mt-8 flex flex-col gap-3">
                {isSample ? (
                  <>
                    <Link href={ROUTES.upload}>
                      <Button size="lg" className="w-full">
                        Get Your Own Report →
                      </Button>
                    </Link>
                    <p className="text-center text-[length:var(--text-caption)] text-cream-primary/40">
                      Save, download, and try-on are available on your real report.
                    </p>
                  </>
                ) : (
                  <>
                    <Link href={ROUTES.tryOn}>
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
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={handleDownloadCard}
                    >
                      <Download aria-hidden="true" />
                      Download Palette Card
                    </Button>
                  </>
                )}
              </div>
            </div>
          </aside>

          {/* Right column — report sections */}
          <div className="space-y-10">
            {/* 1. Colour season — headline finding */}
            <Section label="The Finding" title="Your Colour Season">
              <p className="max-w-xl text-body text-cream-primary/80">
                {seasonInfo.description}
              </p>

              {typeof confidence === 'number' && (
                <div className="mt-6 flex flex-wrap items-center gap-6 border border-gold-hairline p-5">
                  <div className="flex items-center gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-primary/60 font-serif text-h5 tabular-nums text-gold-primary"
                    >
                      <CountUp target={Math.round(confidence)} suffix="%" duration={1400} />
                    </span>
                    <div>
                      <p className="text-[length:var(--text-body)] font-medium text-cream-primary">
                        {seasonInfo.season} — analysis confidence
                      </p>
                      <p className="mt-0.5 max-w-md text-[length:var(--text-body-sm)] text-cream-primary/55">
                        {confidence >= 75
                          ? 'Your undertone read decisively — this season is a strong fit.'
                          : confidence >= 55
                            ? 'A clear read with some balance between warm and cool signals.'
                            : 'You sit close to neutral, so muted, blended tones across both families suit you best.'}
                      </p>
                    </div>
                  </div>
                  {runnerUp && confidence < 80 && (
                    <p className="text-[length:var(--text-body-sm)] text-cream-primary/55">
                      Runner-up season:{' '}
                      <span className="font-medium text-gold-primary">
                        {runnerUp}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </Section>

            {/* 2. Skin analysis — the 14 scored concerns */}
            <Section label="Your Skin" title="Skin Analysis">
              <RadarPanel concerns={effectiveResult.skinConcerns} />
              <p className="mt-4 flex items-center gap-2 text-[length:var(--text-caption)] text-cream-primary/40">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                A styling read, not a medical diagnosis — for skin concerns,
                consult a professional.
              </p>
            </Section>

            {/* 2. Your colour palette */}
            <Section label="Your Palette" title="Your Colour Palette">
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-5">
                {palette.map((colour, i) => (
                  <motion.div
                    key={colour.hex + colour.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: Math.min(i * 0.04, 0.6),
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

            {/* 3. Palette in context — top colours worn */}
            <Section label="In Context" title="Your Palette in the World">
              <p className="max-w-xl text-[length:var(--text-body-sm)] text-cream-primary/80">
                Swatches are abstract — here are three of your strongest colours
                translated into styling. Illustrative photography; the palette
                is yours.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {palette.slice(0, 3).map((colour, i) => {
                  const photo = [
                    CAMPAIGN.atelier,
                    CAMPAIGN.season,
                    CAMPAIGN.undertone,
                  ][i];
                  return (
                    <figure
                      key={colour.hex + colour.name}
                      className="group overflow-hidden border border-gold-hairline"
                    >
                      <EditorialImage
                        src={photo.base}
                        alt={photo.alt}
                        ratio="portrait"
                        cinematic
                      />
                      <figcaption className="flex items-center gap-3 border-t border-gold-hairline p-4">
                        <span
                          aria-hidden="true"
                          className="h-9 w-9 shrink-0 rounded-md shadow-[var(--shadow-swatch)]"
                          style={{ backgroundColor: colour.hex }}
                        />
                        <span>
                          <span className="block text-[length:var(--text-body-sm)] font-medium text-cream-primary">
                            {colour.name}
                          </span>
                          <span className="block text-[length:var(--text-caption)] text-cream-primary/55">
                            {colour.recommendation}
                          </span>
                        </span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </Section>

            {/* 3. Skin undertone analysis */}
            <Section label="Your Undertone" title="Skin Undertone Analysis">
              <p className="max-w-xl text-[length:var(--text-body)] text-cream-primary/80">
                {isWarm
                  ? 'Your skin reads warm. Gold, olive, and terracotta sit harmoniously against you, while silver, grey, and icy pastels tend to flatten your glow.'
                  : effectiveResult.colorProfile.undertone === 'cool'
                    ? 'Your skin reads cool. Silver, jewel tones, and crisp whites intensify you, while earthy golds can leave you looking muted.'
                    : 'Your skin sits between warm and cool. Muted, blended tones suit you best — pure extremes on either side can overbalance your natural harmony.'}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-6">
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-10 w-10 rounded-md shadow-[var(--shadow-swatch)]"
                    style={{ backgroundColor: effectiveResult.colorProfile.skinToneHex }}
                  />
                  <span>
                    <span className="block text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-cream-primary/55">
                      Detected tone
                    </span>
                    <span className="block text-[length:var(--text-body-sm)] text-cream-primary">
                      {effectiveResult.colorProfile.skinToneHex}
                    </span>
                  </span>
                </span>
                <Badge variant="gold" className="uppercase tracking-[var(--tracking-label)]">
                  {effectiveResult.colorProfile.undertone} undertone
                </Badge>
              </div>
            </Section>

            {/* 4. Best neutrals */}
            <Section label="Your Neutrals" title="Best Neutrals">
              <p className="max-w-xl text-[length:var(--text-body-sm)] text-cream-primary/80">
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
                      delay: Math.min(i * 0.04, 0.6),
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

            {/* 5. Your season through the year */}
            <Section label="Through the Year" title="Your Season in Every Season">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {THROUGH_YEAR.map((item) => (
                  <div key={item.season} className="border border-gold-hairline p-5">
                    <p className="text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
                      {item.season}
                    </p>
                    <p className="mt-3 text-[length:var(--text-body-sm)] leading-relaxed text-cream-primary/75">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 max-w-xl text-[length:var(--text-caption)] text-cream-primary/45">
                Your season is constant; how much of it you wear shifts with the
                light. Summer pulls from your lighter half, winter from your
                deepest neutrals.
              </p>
            </Section>

            {/* 5. Colours to avoid */}
            <Section label="Colours to Avoid" title="Colours to Avoid">
              <p className="max-w-xl text-[length:var(--text-body-sm)] text-cream-primary/80">
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
                    <h3 className="font-serif text-[length:var(--text-h5)] text-cream-primary">
                      {archetype.title}
                    </h3>
                    <p className="mt-1.5 max-w-xl text-[length:var(--text-body-sm)] text-cream-primary/80">
                      {archetype.description}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            {/* 7. Wardrobe recommendations */}
            <Section label="Your Wardrobe" title="Wardrobe Recommendations">
              <div>
                <h3 className="text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
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
                      className="flex items-center gap-3 rounded-md border border-border bg-surface-3 p-3"
                    >
                      <span
                        aria-hidden="true"
                        className="h-10 w-10 shrink-0 rounded-md shadow-[var(--shadow-swatch)]"
                        style={{ backgroundColor: item.hex }}
                      />
                      <span>
                        <span className="block text-[length:var(--text-body-sm)] font-medium text-cream-primary">
                          {item.label} · {item.shade}
                        </span>
                        <span className="block text-[length:var(--text-micro)] tabular-nums text-cream-primary/55">
                          {item.hex}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {hairOptions.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
                    Hair colours
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-3">
                    {hairOptions.map((option) => (
                      <li
                        key={option}
                        className="rounded-md border border-border bg-surface-3 px-4 py-2.5 text-[length:var(--text-body-sm)] text-cream-primary"
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {routine.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
                    Skincare routine
                  </h3>
                  <ol className="mt-4 space-y-4">
                    {routine.map((step) => (
                      <li key={step.step} className="flex gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gold-primary font-serif text-[length:var(--text-body-sm)] text-surface-0">
                          {step.step}
                        </span>
                        <div>
                          <p className="text-[length:var(--text-body-sm)] font-medium text-cream-primary">
                            {step.product}
                          </p>
                          <p className="mt-0.5 text-[length:var(--text-caption)] text-cream-primary/55">
                            {step.reason}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </Section>

            {/* 8. Shopping — curated products */}
            <Section label="Your Shop" title="Shop Your Colours">
              {isSample ? (
                <div className="flex flex-col items-start gap-4 border border-gold-hairline p-6">
                  <p className="font-serif text-[length:var(--text-h5)] text-cream-primary">
                    Shopping is available on your real report
                  </p>
                  <p className="max-w-md text-[length:var(--text-body-sm)] text-cream-primary/60">
                    Get your colour analysis to unlock curated product recommendations filtered for your season.
                  </p>
                  <Link href={ROUTES.upload}>
                    <Button>Analyse My Colours →</Button>
                  </Link>
                </div>
              ) : (
                <ShopSection
                  undertone={effectiveResult.colorProfile.undertone}
                  skinType={effectiveResult.colorProfile.undertone}
                  skinTone={effectiveResult.colorProfile.skinToneHex}
                />
              )}
            </Section>

            {/* 9. Share / Save / Try-On CTAs */}
            <CampaignSection
              src={CAMPAIGN.closing.base}
              alt={CAMPAIGN.closing.alt}
              position={CAMPAIGN.closing.position}
              anchor="center"
              scrim="soft"
              height="band"
              contentClassName="text-center"
              className="rounded-none"
            >
              <EditorialHeading as="h2" size="lg" tone="inverse">
                {isSample
                  ? 'Want to see your actual colours?'
                  : 'Ready to see these colours on you?'}
              </EditorialHeading>
              <p className="mx-auto mt-3 max-w-md text-body text-cream-primary/80">
                {isSample
                  ? 'Upload a photo to get your personal colour season — takes 90 seconds.'
                  : 'Try on outfits in your palette, save your report, and share it with your stylist.'}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                {isSample ? (
                  <Link href={ROUTES.upload} className="btn-campaign">
                    Analyse My Colours →
                  </Link>
                ) : (
                  <>
                    <Link href={ROUTES.tryOn} className="btn-campaign">
                      Try On Your Colours →
                    </Link>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-gold-border bg-transparent text-cream-primary hover:border-gold-border-hover hover:bg-gold-primary/10 hover:text-gold-light"
                      onClick={handleShare}
                    >
                      <Share2 aria-hidden="true" />
                      Share Report
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-gold-border bg-transparent text-cream-primary hover:border-gold-border-hover hover:bg-gold-primary/10 hover:text-gold-light"
                      onClick={handlePrint}
                    >
                      <Printer aria-hidden="true" />
                      Print / Save as PDF
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="text-cream-primary hover:bg-gold-primary/10 hover:text-gold-light"
                      onClick={handleSave}
                    >
                      {saved ? (
                        <Check aria-hidden="true" />
                      ) : (
                        <Bookmark aria-hidden="true" />
                      )}
                      {saved ? 'Saved to Dashboard' : 'Save to Dashboard'}
                    </Button>
                  </>
                )}
              </div>
            </CampaignSection>
          </div>
        </div>
      </EditorialContainer>

      {/* Colour detail modal */}
      <Dialog.Root
        open={modalColour !== null}
        onOpenChange={(open) => {
          if (!open) setModalColour(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[2000] bg-surface-0/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            aria-describedby={
              modalColour ? 'colour-detail-description' : undefined
            }
            className="fixed inset-0 z-[2000] flex flex-col overflow-y-auto bg-surface-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          >
            {modalColour && (
              <div className="mx-auto flex w-full max-w-[var(--container-narrow)] flex-1 flex-col px-6 py-10 md:py-16">
                <div className="flex items-center justify-between">
                  <p className="text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
                    Colour Detail
                  </p>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close colour detail"
                      className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-surface-3 text-cream-primary transition-colors duration-200 ease-out hover:border-gold-primary hover:text-gold-primary"
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
                  <h2 className="mt-8 font-serif text-[length:var(--text-h2)] text-cream-primary">
                    {modalColour.name}
                  </h2>
                </Dialog.Title>
                <p className="mt-1 text-[length:var(--text-body)] tabular-nums text-cream-primary/55">
                  {modalColour.hex}
                </p>
                <p
                  id="colour-detail-description"
                  className="mt-4 max-w-md text-[length:var(--text-body)] text-cream-primary/80"
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
