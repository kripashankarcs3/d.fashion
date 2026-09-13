/**
 * Perceptual colour distance utilities (OKLab).
 * Used to match garment colours to a user's season palette — nearest
 * perceptual match beats naive RGB distance, which over-weights blue.
 */

export interface Oklab {
  L: number;
  a: number;
  b: number;
}

function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function hexToOklab(hex: string): Oklab | null {
  const value = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return null;
  const r = srgbToLinear(parseInt(value.slice(0, 2), 16));
  const g = srgbToLinear(parseInt(value.slice(2, 4), 16));
  const b = srgbToLinear(parseInt(value.slice(4, 6), 16));

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

/** Euclidean distance in OKLab space (0 = identical, ~1 = opposite). */
export function oklabDistance(x: Oklab, y: Oklab): number {
  return Math.sqrt(
    (x.L - y.L) ** 2 + (x.a - y.a) ** 2 + (x.b - y.b) ** 2,
  );
}

/**
 * Distance from a colour to the closest member of a palette.
 * Small = "belongs to this palette".
 */
export function distanceToPalette(
  hex: string,
  palette: string[],
): number {
  const lab = hexToOklab(hex);
  if (!lab) return Infinity;
  let best = Infinity;
  for (const p of palette) {
    const pl = hexToOklab(p);
    if (!pl) continue;
    const d = oklabDistance(lab, pl);
    if (d < best) best = d;
  }
  return best;
}
