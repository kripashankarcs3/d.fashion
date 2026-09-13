import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

/** Mirror of the server's SeasonInfoDTO — one source of truth (server). */
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

interface SeasonsResponse {
  success: boolean;
  count: number;
  seasons: SeasonInfo[];
  runnerUps: Record<string, string>;
}

/**
 * All 12 seasons from GET /api/seasons. Cached for the session
 * (staleTime Infinity) — the data is static per deploy.
 */
export function useSeasons() {
  return useQuery({
    queryKey: ['seasons'],
    queryFn: async () => (await api.get<SeasonsResponse>('/seasons')).data,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

/**
 * Synchronous season lookup for components that render before the
 * prefetch lands: returns null until the seasons query has data.
 */
export function useSeasonInfo(season?: string, undertone?: string) {
  const { data } = useSeasons();
  if (!data) return null;
  const seasons = data.seasons;
  if (!season || !seasons.some((s) => s.season === season)) {
    // Unknown season — fall back to the undertone default, then Warm Autumn
    // (mirrors the previous getSeasonInfo fallback chain).
    const fallback =
      undertone === 'warm'
        ? 'Warm Autumn'
        : undertone === 'cool'
          ? 'Cool Winter'
          : 'Soft Summer';
    return seasons.find((s) => s.season === fallback) ?? seasons[0] ?? null;
  }
  return seasons.find((s) => s.season === season) ?? null;
}

export function useRunnerUpSeasons() {
  const { data } = useSeasons();
  return data?.runnerUps ?? null;
}

/**
 * Map of season name → SeasonInfo, for components that need to look up
 * many saved reports' seasons inside a render loop. Empty map until the
 * seasons query lands.
 */
export function useSeasonMap(): Record<string, SeasonInfo> {
  const { data } = useSeasons();
  if (!data) return {};
  return Object.fromEntries(data.seasons.map((s) => [s.season, s]));
}

/**
 * Map of season name → palette ColourItems, for components that look up
 * several seasons by name (e.g. testimonial season chips). Empty map
 * until the seasons query lands.
 */
export function getSeasonPalettes(): Record<string, ColourItem[]> {
  // useSeasons is cached by react-query, so this reads from the shared
  // cache without a new request. Wrapping in a hook-free read keeps
  // call sites simple; called only from components inside the provider.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data } = useSeasons();
  if (!data) return {};
  return Object.fromEntries(data.seasons.map((s) => [s.season, s.palette]));
}

/* ------------------------------------------------- pure palette helpers */

function hexToLuma(hex: string): number {
  const value = hex.replace('#', '');
  if (value.length !== 6) return 0;
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Sort swatches light → dark for gradient display. */
export function sortByGradient<T extends { hex: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => hexToLuma(a.hex) - hexToLuma(b.hex));
}

/** The season palette plus any extra hexes the analysis returned. */
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
