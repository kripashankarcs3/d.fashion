import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { success, error } from '@/lib/toast';
import { ArrowRight, Check, ChevronDown, ChevronUp, MessageSquare, Pencil, RefreshCw, Shirt, Sparkles, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColorSwatch } from '@/components/ui/color-swatch';
import { EmptyAnalysisState } from '@/components/EmptyAnalysisState';
import { ROUTES } from '@/config/navigation';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import { useStyleStore, type AnalysisResult, type SkinConcerns } from '@/store/useStyleStore';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchReports } from '@/services/api';
import { getSeasonInfo } from '@/lib/colour-data';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

const ACTION_LABEL: Record<string, string> = {
  upload: 'Colour analysis',
  tryon: 'Virtual try-on',
  chat: 'Stylist conversation',
  report: 'Report viewed',
};

// ---------------------------------------------------------------------------
// Chart colour constants
// ---------------------------------------------------------------------------
const GOLD = '#F3E2B3';
const CREAM = 'rgba(246,246,248,0.8)';
const SURFACE_3 = 'rgba(255,255,255,0.04)';
const AXIS_TICK_STYLE = { fill: CREAM, fontSize: 11 };

// ---------------------------------------------------------------------------
// Profile Completion Meter (C.8)
// ---------------------------------------------------------------------------
interface CompletionStep {
  label: string;
  done: boolean;
  ctaLabel: string;
  ctaHref: string;
}

function ProfileCompletionMeter({
  analysisResult,
  savedReportsCount,
  wardrobeCount,
  tryonDone,
}: {
  analysisResult: AnalysisResult;
  savedReportsCount: number;
  wardrobeCount: number;
  tryonDone: boolean;
}) {
  const steps: CompletionStep[] = [
    {
      label: 'Photo analysed',
      done: Boolean(analysisResult),
      ctaLabel: 'Analyse photo',
      ctaHref: ROUTES.upload,
    },
    {
      label: 'Report read',
      done: savedReportsCount > 0,
      ctaLabel: 'Read report',
      ctaHref: ROUTES.report,
    },
    {
      label: 'Wardrobe added',
      done: wardrobeCount > 0,
      ctaLabel: 'Add item',
      ctaHref: ROUTES.tryOn,
    },
    {
      label: 'Try-on done',
      done: tryonDone,
      ctaLabel: 'Try it on',
      ctaHref: ROUTES.tryOn,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const pct = Math.round((completedCount / steps.length) * 100);
  const allDone = completedCount === steps.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-8 border border-gold-hairline bg-surface-3 p-6"
      aria-label="Profile completion"
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
            Profile Completion
          </p>
          <p className="mt-0.5 font-serif text-[length:var(--text-h5)] text-cream-primary">
            {allDone ? 'All steps complete' : `${completedCount} of ${steps.length} steps done`}
          </p>
        </div>
        <span
          className="shrink-0 font-serif text-2xl tabular-nums text-gold-primary"
          aria-hidden="true"
        >
          {pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pct}% complete`}
        className="mt-4 h-1 w-full overflow-hidden rounded-full bg-surface-4"
      >
        <motion.div
          className="h-full rounded-full bg-gold-primary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </div>

      {/* Steps row */}
      <ol className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {steps.map((step) => (
          <li key={step.label} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              {step.done ? (
                <span
                  aria-label="Complete"
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-primary"
                >
                  <Check className="h-3 w-3 text-surface-0" strokeWidth={3} aria-hidden="true" />
                </span>
              ) : (
                <span
                  aria-label="Incomplete"
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold-hairline bg-transparent"
                  aria-hidden="true"
                />
              )}
              <span
                className={`text-[length:var(--text-caption)] leading-tight ${step.done ? 'text-cream-primary' : 'text-cream-primary/55'
                  }`}
              >
                {step.label}
              </span>
            </div>
            {!step.done && (
              <Link
                href={step.ctaHref}
                className="ml-7 inline-flex items-center gap-1 text-[length:var(--text-caption)] text-gold-primary underline-offset-2 transition-opacity duration-150 hover:opacity-80 hover:underline"
              >
                {step.ctaLabel}
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            )}
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Palette Usage donut chart
// ---------------------------------------------------------------------------
interface PaletteSlice {
  name: string;
  hex: string;
  count: number;
}

function buildPaletteUsageData(
  wardrobeItems: { palette: string[] }[],
  seasonPalette: { name: string; hex: string }[],
): PaletteSlice[] {
  // Count occurrences of each hex across all wardrobe item palettes
  const counts: Record<string, number> = {};
  for (const item of wardrobeItems) {
    for (const hex of item.palette) {
      const normalised = hex.toUpperCase();
      counts[normalised] = (counts[normalised] ?? 0) + 1;
    }
  }

  // Map to season palette names where possible, or use the hex as label
  const seen = new Set<string>();
  const result: PaletteSlice[] = [];

  for (const [hex, count] of Object.entries(counts)) {
    const match = seasonPalette.find(
      (c) => c.hex.toUpperCase() === hex,
    );
    const name = match?.name ?? hex;
    if (!seen.has(hex)) {
      seen.add(hex);
      result.push({ name, hex, count });
    }
  }

  return result.sort((a, b) => b.count - a.count).slice(0, 10);
}

function PaletteUsageChart({
  wardrobeItems,
  seasonPalette,
}: {
  wardrobeItems: { palette: string[] }[];
  seasonPalette: { name: string; hex: string }[];
}) {
  const data = buildPaletteUsageData(wardrobeItems, seasonPalette);

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-[length:var(--text-body-sm)] text-cream-primary/55">
          Save wardrobe looks to see your palette usage breakdown.
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="80%"
          dataKey="count"
          nameKey="name"
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.hex} fill={entry.hex} stroke="transparent" />
          ))}
        </Pie>
        <RechartsTooltip
          contentStyle={{
            background: '#1A1810',
            border: '1px solid rgba(243,226,179,0.25)',
            borderRadius: 4,
            color: CREAM,
            fontSize: 12,
          }}
          formatter={(value: number, name: string) => [
            `${value} item${value !== 1 ? 's' : ''}`,
            name,
          ]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ---------------------------------------------------------------------------
// Skin Score Trends line chart
// ---------------------------------------------------------------------------
const CONCERN_LABELS: Record<keyof SkinConcerns, string> = {
  acne: 'Acne',
  darkSpots: 'Dark Spots',
  wrinkles: 'Wrinkles',
  pores: 'Pores',
  oiliness: 'Oiliness',
  dryness: 'Dryness',
  redness: 'Redness',
  eyeBags: 'Eye Bags',
  darkCircles: 'Dark Circles',
  uneven: 'Uneven Tone',
  sensitivity: 'Sensitivity',
  texture: 'Texture',
  firmness: 'Firmness',
  radiance: 'Radiance',
};

const TREND_LINE_COLOURS = [GOLD, '#E07D7D', '#7DB8E0'];

function getTopConcerns(analyses: AnalysisResult[], topN = 3): (keyof SkinConcerns)[] {
  // Sum each concern across all analyses to find the most prominent ones
  const totals: Partial<Record<keyof SkinConcerns, number>> = {};
  for (const analysis of analyses) {
    for (const [key, value] of Object.entries(analysis.skinConcerns) as [
      keyof SkinConcerns,
      number,
    ][]) {
      totals[key] = (totals[key] ?? 0) + value;
    }
  }
  return (Object.entries(totals) as [keyof SkinConcerns, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([key]) => key);
}

function SkinScoreTrendsChart({
  current,
  history,
}: {
  current: AnalysisResult;
  history: AnalysisResult[];
}) {
  // All analyses in chronological order (history is oldest-first after slice)
  const allAnalyses = [...history, current].sort(
    (a, b) => new Date(a.analyzedAt).getTime() - new Date(b.analyzedAt).getTime(),
  );

  if (allAnalyses.length < 2) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-[length:var(--text-body-sm)] text-cream-primary/55">
          Complete 2+ analyses to see your skin score trends over time.
        </p>
      </div>
    );
  }

  const topConcerns = getTopConcerns(allAnalyses);

  const chartData = allAnalyses.map((a) => ({
    date: format(new Date(a.analyzedAt), 'MMM yy'),
    ...Object.fromEntries(
      topConcerns.map((k) => [CONCERN_LABELS[k], a.skinConcerns[k]]),
    ),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(243,226,179,0.12)" />
        <XAxis dataKey="date" tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} />
        <YAxis
          domain={[0, 100]}
          tick={AXIS_TICK_STYLE}
          axisLine={false}
          tickLine={false}
        />
        <RechartsTooltip
          contentStyle={{
            background: '#1A1810',
            border: '1px solid rgba(243,226,179,0.25)',
            borderRadius: 4,
            color: CREAM,
            fontSize: 12,
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, color: CREAM, paddingTop: 8 }}
          iconType="circle"
          iconSize={8}
        />
        {topConcerns.map((concern, i) => (
          <Line
            key={concern}
            type="monotone"
            dataKey={CONCERN_LABELS[concern]}
            stroke={TREND_LINE_COLOURS[i] ?? GOLD}
            strokeWidth={2}
            dot={{ r: 3, fill: TREND_LINE_COLOURS[i] ?? GOLD }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// ---------------------------------------------------------------------------
// Wardrobe Coverage bar chart
// ---------------------------------------------------------------------------
interface CoverageBar {
  name: string;
  hex: string;
  count: number;
  inWardrobe: number;
}

function buildCoverageData(
  wardrobeItems: { palette: string[] }[],
  seasonPalette: { name: string; hex: string }[],
): CoverageBar[] {
  const wardrobeHexes = new Set(
    wardrobeItems.flatMap((item) => item.palette.map((h) => h.toUpperCase())),
  );

  return seasonPalette.map((colour) => {
    const upperHex = colour.hex.toUpperCase();
    const count = wardrobeItems.filter((item) =>
      item.palette.some((h) => h.toUpperCase() === upperHex),
    ).length;
    return {
      name: colour.name,
      hex: colour.hex,
      count,
      inWardrobe: wardrobeHexes.has(upperHex) ? 1 : 0,
    };
  });
}

function WardrobeCoverageChart({
  wardrobeItems,
  seasonPalette,
}: {
  wardrobeItems: { palette: string[] }[];
  seasonPalette: { name: string; hex: string }[];
}) {
  const data = buildCoverageData(wardrobeItems, seasonPalette);
  const covered = data.filter((d) => d.inWardrobe > 0).length;
  const total = data.length;

  return (
    <div>
      <p className="mb-3 text-[length:var(--text-caption)] text-cream-primary/55">
        {covered} of {total} palette colours represented in your wardrobe
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 8, bottom: 40, left: -24 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(243,226,179,0.12)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: CREAM, fontSize: 9 }}
            axisLine={false}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={AXIS_TICK_STYLE}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <RechartsTooltip
            contentStyle={{
              background: '#1A1810',
              border: '1px solid rgba(243,226,179,0.25)',
              borderRadius: 4,
              color: CREAM,
              fontSize: 12,
            }}
            formatter={(value: number) => [
              `${value} item${value !== 1 ? 's' : ''}`,
              'Wardrobe items',
            ]}
          />
          <Bar dataKey="count" radius={[2, 2, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.hex}
                fill={entry.inWardrobe > 0 ? entry.hex : SURFACE_3}
                stroke={entry.inWardrobe > 0 ? 'transparent' : 'rgba(243,226,179,0.2)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Insights section (collapsible on mobile)
// ---------------------------------------------------------------------------
function InsightsSection({
  analysisResult,
  analysisHistory,
  wardrobeItems,
  seasonPalette,
}: {
  analysisResult: AnalysisResult;
  analysisHistory: AnalysisResult[];
  wardrobeItems: { palette: string[] }[];
  seasonPalette: { name: string; hex: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="mt-16"
    >
      {/* Mobile toggle */}
      <div className="flex items-end justify-between gap-4">
        <SectionHeading label="Insights" title="Visual Insights" />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="md:hidden inline-flex min-h-11 items-center gap-1.5 text-nav text-cream-primary/80 transition-colors hover:text-cream-primary"
        >
          {open ? (
            <>
              Collapse <ChevronUp className="h-4 w-4" aria-hidden="true" />
            </>
          ) : (
            <>
              Expand <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      {/* Charts grid — always visible on md+, toggled on mobile */}
      <div className={`mt-6 ${open ? 'block' : 'hidden md:block'}`}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* Palette Usage */}
          <div className="border border-gold-hairline bg-surface-3 p-6">
            <h3 className="font-serif text-[length:var(--text-h5)] text-cream-primary">
              Palette Usage
            </h3>
            <p className="mt-1 text-[length:var(--text-caption)] text-cream-primary/55">
              Wardrobe items by colour
            </p>
            <PaletteUsageChart
              wardrobeItems={wardrobeItems}
              seasonPalette={seasonPalette}
            />
          </div>

          {/* Skin Score Trends */}
          <div className="border border-gold-hairline bg-surface-3 p-6">
            <h3 className="font-serif text-[length:var(--text-h5)] text-cream-primary">
              Skin Score Trends
            </h3>
            <p className="mt-1 text-[length:var(--text-caption)] text-cream-primary/55">
              Top 3 skin concerns over time
            </p>
            <SkinScoreTrendsChart
              current={analysisResult}
              history={analysisHistory}
            />
          </div>

          {/* Wardrobe Coverage */}
          <div className="border border-gold-hairline bg-surface-3 p-6 lg:col-span-2 xl:col-span-1">
            <h3 className="font-serif text-[length:var(--text-h5)] text-cream-primary">
              Wardrobe Coverage
            </h3>
            <p className="mt-1 text-[length:var(--text-caption)] text-cream-primary/55">
              Palette colours in your wardrobe
            </p>
            <WardrobeCoverageChart
              wardrobeItems={wardrobeItems}
              seasonPalette={seasonPalette}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

async function copyHex(hex: string) {
  try {
    await navigator.clipboard.writeText(hex);
    success(`Hex copied: ${hex}`);
  } catch {
    error('Could not copy the hex value');
  }
}

function PaletteRow({ colours }: { colours: { name: string; hex: string }[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {colours.map((colour) => (
        <button
          key={colour.hex + colour.name}
          type="button"
          onClick={() => void copyHex(colour.hex)}
          aria-label={`Copy ${colour.name} hex`}
          title={`${colour.name} · ${colour.hex}`}
          className="h-7 w-7 rounded-sm shadow-[var(--shadow-swatch)] transition-transform duration-200 ease-out hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-primary"
          style={{ backgroundColor: colour.hex }}
        />
      ))}
    </div>
  );
}

function compareSummary(current: AnalysisResult, previous: AnalysisResult) {
  const currentSeason = getSeasonInfo(
    current.colourSeason,
    current.colorProfile.undertone,
  );
  const previousSeason = getSeasonInfo(
    previous.colourSeason,
    previous.colorProfile.undertone,
  );
  if (previousSeason.season === currentSeason.season) {
    return `Your season stayed ${currentSeason.season}. Your palette is consistent with your last analysis.`;
  }
  return `Your season shifted from ${previousSeason.season} to ${currentSeason.season}. Update your wardrobe staples to your current palette.`;
}

// ---------------------------------------------------------------------------
// Wardrobe item card with Rename / Delete / Re-try-on actions
// ---------------------------------------------------------------------------
function WardrobeItemCard({
  item,
  onRename,
  onDelete,
}: {
  item: { id: string; imageUrl: string; name: string; category: string; palette: string[] };
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(item.name);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function commitRename() {
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== item.name) {
      onRename(item.id, trimmed);
    } else {
      setDraftName(item.name);
    }
    setEditingName(false);
  }

  function handleRenameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitRename();
    if (e.key === 'Escape') {
      setDraftName(item.name);
      setEditingName(false);
    }
  }

  function handleDelete() {
    onDelete(item.id);
    success('Look removed from wardrobe');
  }

  const retryOnHref = `${ROUTES.tryOn}?item=${item.id}`;

  return (
    <motion.div
      key={item.id}
      className="group overflow-hidden border border-gold-hairline bg-surface-3"
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {item.imageUrl && (
        <div className="aspect-[4/5] w-full overflow-hidden border-b border-gold-hairline">
          <img
            src={item.imageUrl}
            alt={item.name}
            width={480}
            height={600}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:scale-[1.03]"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-6">
        {/* Name row: inline edit or static */}
        <div className="flex items-center gap-2">
          {editingName ? (
            <input
              type="text"
              value={draftName}
              autoFocus
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={commitRename}
              onKeyDown={handleRenameKeyDown}
              className="flex-1 bg-transparent font-serif text-[length:var(--text-h5)] text-cream-primary outline-none border-b border-gold-primary/60 focus:border-gold-primary"
              aria-label="Rename wardrobe item"
            />
          ) : (
            <p className="flex-1 font-serif text-[length:var(--text-h5)] text-cream-primary truncate">
              {item.name}
            </p>
          )}
          {!editingName && (
            <button
              type="button"
              aria-label="Rename this look"
              onClick={() => {
                setDraftName(item.name);
                setEditingName(true);
              }}
              className="h-8 w-8 shrink-0 flex items-center justify-center rounded-sm text-cream-primary/40 transition-colors duration-150 hover:text-gold-primary hover:bg-surface-4"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        <p className="mt-1 text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-cream-primary/55">
          {item.category}
        </p>

        {/* Palette swatches */}
        {item.palette.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.palette.map((hex) => (
              <span
                key={hex}
                aria-hidden="true"
                className="h-6 w-6 rounded-sm border border-gold-hairline"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        )}

        {/* Action footer */}
        <div className="mt-4 pt-4 border-t border-gold-hairline flex items-center gap-2">
          {/* Re-try-on link */}
          <Link
            href={retryOnHref}
            aria-label="Re-try-on this look"
            title="Re-try-on"
            className="h-8 w-8 flex items-center justify-center rounded-sm text-cream-primary/40 transition-colors duration-150 hover:text-gold-primary hover:bg-surface-4"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>

          {/* Delete with inline confirm */}
          <div className="ml-auto flex items-center gap-2">
            {confirmDelete ? (
              <>
                <span className="text-[length:var(--text-caption)] text-cream-primary/70">
                  Delete?
                </span>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="h-8 px-3 text-[length:var(--text-caption)] rounded-sm bg-red-900/30 text-red-400 border border-red-800/40 transition-colors duration-150 hover:bg-red-900/50"
                  aria-label="Confirm delete"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-sm text-cream-primary/40 transition-colors duration-150 hover:text-cream-primary hover:bg-surface-4"
                  aria-label="Cancel delete"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                aria-label="Delete this look"
                title="Delete"
                className="h-8 w-8 flex items-center justify-center rounded-sm text-cream-primary/40 transition-colors duration-150 hover:text-red-400 hover:bg-surface-4"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const analysisResult = useStyleStore((s) => s.analysisResult);
  const analysisHistory = useStyleStore((s) => s.analysisHistory);
  const renameWardrobeItem = useStyleStore((s) => s.renameWardrobeItem);
  const removeWardrobeItem = useStyleStore((s) => s.removeWardrobeItem);
  const savedReports = useStyleStore((s) => s.savedReports);
  const wardrobeItems = useStyleStore((s) => s.wardrobeItems);
  const activityLog = useStyleStore((s) => s.activityLog);
  const isAuthed = Boolean(useAuthStore((s) => s.token));
  const [cloudReports, setCloudReports] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    if (!isAuthed) return;
    let cancelled = false;
    fetchReports()
      .then((res) => {
        if (cancelled) return;
        const reports = res.data.history
          .map((item) => item.report)
          .filter((report): report is AnalysisResult => Boolean(report));
        setCloudReports(reports);
      })
      .catch(() => {
        // Cloud history is best-effort; local reports still render.
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthed]);

  const allSavedReports = [
    ...cloudReports,
    ...savedReports,
  ].filter(
    (report, index, all) =>
      all.findIndex((other) => other.analyzedAt === report.analyzedAt) === index,
  );

  const seasonInfo = analysisResult
    ? getSeasonInfo(analysisResult.colourSeason, analysisResult.colorProfile.undertone)
    : null;

  const history = activityLog.slice(0, 8);
  const tryonDone = activityLog.some((e) => e.action === 'tryon');

  return (
    <div className="w-full pt-28 pb-24">
      <EditorialContainer width="content">
        {!analysisResult || !seasonInfo ? (
          <>
            <div className="border border-gold-hairline bg-surface-3 p-8">
              <EmptyAnalysisState
                title="Your colour identity is waiting"
                description="Upload your first photo to begin. Your season, palette, and saved looks will live here."
              />
            </div>

            <QuickActions />
          </>
        ) : (
          <>
            {/* Header — hairline divider, no card */}
            <motion.header
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="border-b border-gold-hairline pb-10"
            >
              <EyebrowLabel tone="gold">Your Colour Identity</EyebrowLabel>
              <EditorialHeading as="h1" size="lg" className="mt-4">
                {seasonInfo.season}
              </EditorialHeading>
              <p className="mt-2 eyebrow text-cream-primary/55">
                Analysed {format(new Date(analysisResult.analyzedAt), 'MMMM yyyy')} ·{' '}
                {analysisResult.colorProfile.undertone} undertone
              </p>
            </motion.header>

            {/* Profile Completion Meter */}
            <ProfileCompletionMeter
              analysisResult={analysisResult}
              savedReportsCount={allSavedReports.length}
              wardrobeCount={wardrobeItems.length}
              tryonDone={tryonDone}
            />

            {/* Current palette strip */}
            <div className="mt-10 flex flex-wrap items-center gap-3 border-b border-gold-hairline pb-6">
              <span className="eyebrow text-cream-primary/55">Current palette</span>
              <motion.div className="flex flex-wrap gap-2">
                {seasonInfo.palette.slice(0, 6).map((colour, idx) => (
                  <motion.span
                    key={colour.hex}
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.3 + idx * 0.05,
                    }}
                    className="h-8 w-8 rounded-sm border border-gold-hairline"
                    style={{ backgroundColor: colour.hex }}
                  />
                ))}
              </motion.div>
            </div>

            {/* Full colour palette */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12"
            >
              <SectionHeading label="Your Palette" title="Your Colour Palette" />
              <div className="mt-6 border border-gold-hairline bg-surface-3 p-8">
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                  {seasonInfo.palette.map((colour) => (
                    <ColorSwatch key={colour.hex + colour.name} {...colour} />
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Saved items */}
            <section className="mt-16">
              <div className="flex items-end justify-between gap-4">
                <SectionHeading label="Wardrobe" title="Saved Looks" />
                <Link
                  href={ROUTES.tryOn}
                  className="inline-flex min-h-11 items-center gap-2 text-nav text-cream-primary/80 transition-colors duration-200 ease-out hover:text-cream-primary hover:underline"
                >
                  Try on new looks
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              {wardrobeItems.length === 0 ? (
                <div className="mt-6 border border-gold-hairline bg-surface-3 p-8">
                  <p className="font-serif text-[length:var(--text-h5)] text-cream-primary">
                    No saved looks yet.
                  </p>
                  <p className="mt-2 max-w-md text-[length:var(--text-body-sm)] text-cream-primary/80">
                    When you try on an outfit, save it here to build your
                    personal wardrobe archive.
                  </p>
                  <Link href={ROUTES.tryOn} className="mt-6 inline-block">
                    <Button variant="secondary" size="lg">
                      Explore Virtual Try-On
                    </Button>
                  </Link>
                </div>
              ) : (
                <motion.div
                  className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1 } },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.05 }}
                >
                  {wardrobeItems.map((item) => (
                    <WardrobeItemCard
                      key={item.id}
                      item={item}
                      onRename={renameWardrobeItem}
                      onDelete={removeWardrobeItem}
                    />
                  ))}
                </motion.div>
              )}
            </section>

            {/* Saved reports */}
            {allSavedReports.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="mt-16"
              >
                <SectionHeading label="Saved" title="Saved Reports" />
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {allSavedReports.map((report) => {
                    const reportSeason = getSeasonInfo(
                      report.colourSeason,
                      report.colorProfile.undertone,
                    );
                    return (
                      <div
                        key={report.analyzedAt}
                        className="border border-gold-hairline bg-surface-3 p-6"
                      >
                        <p className="text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
                          Saved report
                        </p>
                        <h3 className="mt-2 font-serif text-[length:var(--text-h5)] text-cream-primary">
                          {reportSeason.season}
                        </h3>
                        <p className="mt-1 text-[length:var(--text-caption)] text-cream-primary/55">
                          Analysed {format(new Date(report.analyzedAt), 'MMMM yyyy')}
                        </p>
                        <PaletteRow colours={reportSeason.palette} />
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* Compare with previous */}
            {analysisHistory.length > 0 &&
              analysisHistory[analysisHistory.length - 1] && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-16"
                >
                  <SectionHeading label="Progress" title="Compare with Previous" />
                  <div className="mt-6 border border-gold-hairline bg-surface-3 p-8">
                    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                      {(() => {
                        const previous =
                          analysisHistory[analysisHistory.length - 1];
                        const previousSeason = getSeasonInfo(
                          previous.colourSeason,
                          previous.colorProfile.undertone,
                        );
                        return (
                          <div>
                            <p className="text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
                              Previous analysis
                            </p>
                            <h3 className="mt-2 font-serif text-[length:var(--text-h4)] text-cream-primary">
                              {previousSeason.season}
                            </h3>
                            <p className="mt-1 text-[length:var(--text-caption)] text-cream-primary/55">
                              Analysed{' '}
                              {format(new Date(previous.analyzedAt), 'MMMM yyyy')}
                            </p>
                            <PaletteRow colours={previousSeason.palette} />
                          </div>
                        );
                      })()}
                      <div>
                        <p className="text-[0.625rem] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
                          Current analysis
                        </p>
                        <h3 className="mt-2 font-serif text-[length:var(--text-h4)] text-cream-primary">
                          {seasonInfo.season}
                        </h3>
                        <p className="mt-1 text-[length:var(--text-caption)] text-cream-primary/55">
                          Analysed{' '}
                          {format(new Date(analysisResult.analyzedAt), 'MMMM yyyy')}
                        </p>
                        <PaletteRow colours={seasonInfo.palette} />
                      </div>
                    </div>
                    <div className="mt-8 border-t border-gold-hairline pt-6">
                      <p className="max-w-2xl text-[length:var(--text-body-sm)] text-cream-primary/80">
                        {compareSummary(
                          analysisResult,
                          analysisHistory[analysisHistory.length - 1],
                        )}
                      </p>
                    </div>
                  </div>
                </motion.section>
              )}

            {/* Analysis history */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="mt-16"
            >
              <SectionHeading label="Activity" title="Analysis History" />
              <div className="mt-6 border border-gold-hairline bg-surface-3 p-8">
                {history.length === 0 ? (
                  <p className="text-[length:var(--text-body-sm)] text-cream-primary/80">
                    Your analysis history will appear here after your next
                    analysis.
                  </p>
                ) : (
                  <ul className="divide-y divide-gold-hairline">
                    {history.map((event) => (
                      <li
                        key={event.id}
                        className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-surface-4 text-gold-primary"
                        >
                          {event.action === 'upload' ? (
                            <Sparkles className="h-4 w-4" />
                          ) : event.action === 'tryon' ? (
                            <Shirt className="h-4 w-4" />
                          ) : event.action === 'chat' ? (
                            <MessageSquare className="h-4 w-4" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[length:var(--text-body-sm)] font-medium text-cream-primary">
                            {event.label}
                          </p>
                          <p className="text-[length:var(--text-caption)] text-cream-primary/55">
                            {ACTION_LABEL[event.action] ?? 'Activity'}
                          </p>
                        </div>
                        <time
                          className="shrink-0 text-[length:var(--text-caption)] tabular-nums text-cream-primary/55"
                          dateTime={event.timestamp}
                        >
                          {format(new Date(event.timestamp), 'MMM yyyy')}
                        </time>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.section>

            {/* Insights — recharts visualisations */}
            <InsightsSection
              analysisResult={analysisResult}
              analysisHistory={analysisHistory}
              wardrobeItems={wardrobeItems}
              seasonPalette={seasonInfo.palette}
            />

            <QuickActions />
          </>
        )}
      </EditorialContainer>
    </div>
  );
}

function SectionHeading({ label, title }: { label?: string; title: string }) {
  return (
    <div>
      {label && <EyebrowLabel tone="gold">{label}</EyebrowLabel>}
      <EditorialHeading as="h2" size="sm" className={label ? 'mt-3' : ''}>
        {title}
      </EditorialHeading>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { href: '/upload', title: 'New Analysis', description: 'Upload another selfie', icon: Upload },
    { href: '/try-on', title: 'Virtual Try-On', description: 'See colours on you', icon: Shirt },
    { href: '/chat', title: 'AI Stylist', description: 'Get personalised advice', icon: MessageSquare },
    { href: '/report', title: 'Full Report', description: 'Revisit your analysis', icon: Sparkles },
  ];

  return (
    <section className="mt-16">
      <SectionHeading label="Quick Actions" title="Jump In" />
      <motion.div
        className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {actions.map((action) => (
          <motion.div
            key={action.href}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            whileHover={{ y: -4, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
            style={{ willChange: 'transform' }}
          >
            <Link
              href={action.href}
              className="group flex h-full flex-col border border-gold-hairline bg-surface-3 p-6 transition-colors duration-300 hover:border-gold-primary/40"
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-sm bg-surface-4 text-gold-primary transition-colors duration-200 ease-out group-hover:bg-gold-primary group-hover:text-surface-0"
              >
                <action.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-6 font-serif text-[length:var(--text-h5)] text-cream-primary">
                {action.title}
              </h3>
              <p className="mt-1 text-[length:var(--text-body-sm)] text-cream-primary/80">
                {action.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-nav text-gold-primary">
                Open
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
