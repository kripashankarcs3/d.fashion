import fs from "fs";
import path from "path";
import Product from "../models/product.model";
import { distanceToPalette, hexToOklab, oklabDistance } from "../utils/colour";
import { getSeasonProfile } from "../utils/colourAnalysis";

export interface GarmentEntry {
  id: number;
  name: string;
  category: string;
  gender: string;
  img: string;
  colourHex: string;
  colourName: string;
  buyUrl?: string;
}

const DATA_PATH = path.resolve(__dirname, "../data/garments.json");

let cached: GarmentEntry[] | null = null;

export function getGarments(): GarmentEntry[] {
  if (!cached) {
    try {
      cached = JSON.parse(fs.readFileSync(DATA_PATH, "utf8")) as GarmentEntry[];
    } catch (err) {
      // tsc does not copy JSON assets, so a build that skips the copy:assets
      // step leaves dist/data empty and every catalogue route 500s.
      throw new Error(
        `Garment catalogue missing at ${DATA_PATH} — run "npm run copy:assets" ` +
          `in server/ (it is part of "npm run build"). Cause: ${(err as Error).message}`,
      );
    }
  }
  return cached;
}

/**
 * Idempotent catalogue seed into Mongo — upserts by externalId, skips
 * entirely when the stored count already matches the JSON. Safe to call
 * on every server start.
 */
export async function seedGarments(): Promise<void> {
  const garments = getGarments();
  const existing = await Product.countDocuments({ externalId: { $ne: null } });
  if (existing === garments.length) return;

  let upserted = 0;
  for (const g of garments) {
    await Product.updateOne(
      { externalId: `garment-${g.id}` },
      {
        $set: {
          externalId: `garment-${g.id}`,
          name: g.name,
          category: g.category,
          brand: "",
          price: undefined,
          image: g.img,
          description: g.buyUrl ?? "",
          skinType: [],
          skinTone: [],
          colourHex: g.colourHex,
          colourName: g.colourName,
          gender: g.gender,
          buyUrl: g.buyUrl ?? "",
        },
      },
      { upsert: true },
    );
    upserted += 1;
  }
  console.log(`[seed] Garment catalogue synced: ${upserted}/${garments.length} items`);
}

export interface GarmentMatch {
  externalId: string;
  name: string;
  category: string;
  gender: string;
  /** Same field name as the catalogue entries (`GarmentEntry.img`) — the
   *  client renders both with one Garment type. */
  img: string;
  colourHex: string;
  colourName: string;
  buyUrl?: string;
  matchScore: number;
}

/**
 * Colour-matched garment recommendations: perceptual (OKLab) distance
 * from each garment to the user's season palette, with avoid-colours
 * excluded. Cheapest wins; entries with a buyUrl are preferred.
 */
export function matchGarmentsToSeason(
  season: string,
  undertone: "warm" | "cool" | "neutral",
  opts: { gender?: string; category?: string; limit?: number } = {},
): GarmentMatch[] {
  const garments = getGarments();
  const limit = opts.limit ?? 12;
  const profile = getSeasonProfile(season, undertone);
  const avoidLabs = profile.avoid
    .map(hexToOklab)
    .filter((l): l is NonNullable<ReturnType<typeof hexToOklab>> => l !== null);

  const scored = garments
    .filter((g) => (opts.gender ? g.gender === opts.gender : true))
    .filter((g) => (opts.category ? g.category === opts.category : true))
    .map((g) => {
      const lab = hexToOklab(g.colourHex);
      if (!lab) return null;
      // Hard exclusion: too close to any avoid colour (0.12 ≈ visibly
      // different in OKLab; anything closer reads as "the same colour").
      for (const av of avoidLabs) {
        if (oklabDistance(lab, av) < 0.12) return null;
      }
      const matchScore = distanceToPalette(g.colourHex, profile.palette);
      return { g, matchScore };
    })
    .filter((s): s is { g: GarmentEntry; matchScore: number } => s !== null);

  // buyUrl-bearing entries first (within a tolerance band — a near-tie
  // shouldn't drop a shoppable item), then by closeness.
  scored.sort((a, b) => a.matchScore - b.matchScore);
  const shoppable = scored.filter((s) => s.g.buyUrl);
  const nonShoppable = scored.filter((s) => !s.g.buyUrl);
  const picked = [...shoppable, ...nonShoppable].slice(0, limit);

  return picked.map(({ g, matchScore }) => ({
    externalId: `garment-${g.id}`,
    name: g.name,
    category: g.category,
    gender: g.gender,
    img: g.img,
    colourHex: g.colourHex,
    colourName: g.colourName,
    buyUrl: g.buyUrl || undefined,
    matchScore,
  }));
}
