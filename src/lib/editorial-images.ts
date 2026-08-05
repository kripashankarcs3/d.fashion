/**
 * Central art direction for D'Fashion campaign photography.
 *
 * Keeping the catalogue in one place is what makes the site read as a single
 * shoot rather than a set of independently sourced pages. Every entry carries
 * its own alt text and a crop focal point, because the same frame is used at
 * several aspect ratios across the site.
 *
 * Images are self-hosted under `public/images/campaign/` (see
 * `scripts/optimize-images.mjs`). Each entry's `base` is the extension-less
 * path; the optimizer emits `${base}-<w>.{avif,webp,jpg}` variants plus a
 * `${base}-lqip.webp` placeholder, and `CAMPAIGN_ASSETS` carries the intrinsic
 * dimensions and base64 LQIP consumed by `<picture>`.
 */

export interface EditorialPhoto {
  /** Extension-less base path, e.g. "/images/campaign/opening". */
  base: string;
  alt: string;
  /** CSS object-position — keeps the subject in frame on tight crops. */
  position: string;
}

const campaign = (name: string) => `/images/campaign/${name}`;

export const CAMPAIGN: Record<string, EditorialPhoto> = {
  /* Homepage opening spread. */
  opening: {
    base: campaign('opening'),
    alt: 'A woman in a neutral-toned outfit photographed in warm natural light',
    position: 'center 28%',
  },
  /* Closing spread — darker, quieter, end-of-magazine register. */
  closing: {
    base: campaign('closing'),
    alt: 'A muted editorial fashion still life in warm neutral tones',
    position: 'center 40%',
  },
  /* Colour season chapter. */
  season: {
    base: campaign('season'),
    alt: 'A woman dressed in warm autumn tones in soft natural light',
    position: 'center 30%',
  },
  /* Undertone chapter — close skin reading. */
  undertone: {
    base: campaign('undertone'),
    alt: 'Close portrait in warm natural light showing natural skin texture',
    position: 'center 30%',
  },
  /* Archetype chapter. */
  archetype: {
    base: campaign('archetype'),
    alt: 'Editorial photograph of a woman in a flowing neutral garment',
    position: 'center 32%',
  },
  /* Try-on chapter. */
  tryOn: {
    base: campaign('tryOn'),
    alt: 'A minimal rack of garments in muted natural tones',
    position: 'center',
  },
  /* Process chapter — quiet, studio-like. */
  process: {
    base: campaign('process'),
    alt: 'Folded neutral fabrics arranged in soft studio light',
    position: 'center',
  },
  /* Atelier / pricing chapter. */
  atelier: {
    base: campaign('atelier'),
    alt: 'A tailoring atelier interior with garments in warm light',
    position: 'center 45%',
  },
};

/** The four editorial chapters used by the homepage feature sequence. */
export const CHAPTER_KEYS = ['season', 'undertone', 'archetype', 'tryOn'] as const;
