/**
 * Central art direction for D'Fashion campaign photography.
 *
 * Keeping the catalogue in one place is what makes the site read as a single
 * shoot rather than a set of independently sourced pages. Every entry carries
 * its own alt text and a crop focal point, because the same frame is used at
 * several aspect ratios across the site.
 */

export interface EditorialPhoto {
  src: string;
  alt: string;
  /** CSS object-position — keeps the subject in frame on tight crops. */
  position: string;
}

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=1600&auto=format&fit=crop`;

export const CAMPAIGN: Record<string, EditorialPhoto> = {
  /* Homepage opening spread. */
  opening: {
    src: unsplash('1524504388940-b1c1722653e1'),
    alt: 'A woman in a neutral-toned outfit photographed in warm natural light',
    position: 'center 28%',
  },
  /* Closing spread — darker, quieter, end-of-magazine register. */
  closing: {
    src: unsplash('1483985988355-763728e1935b'),
    alt: 'A muted editorial fashion still life in warm neutral tones',
    position: 'center 40%',
  },
  /* Colour season chapter. */
  season: {
    src: unsplash('1509631179647-0177331693ae'),
    alt: 'A woman dressed in warm autumn tones in soft natural light',
    position: 'center 30%',
  },
  /* Undertone chapter — close skin reading. */
  undertone: {
    src: unsplash('1544005313-94ddf0286df2'),
    alt: 'Close portrait in warm natural light showing natural skin texture',
    position: 'center 30%',
  },
  /* Archetype chapter. */
  archetype: {
    src: unsplash('1490481651871-ab68de25d43d'),
    alt: 'Editorial photograph of a woman in a flowing neutral garment',
    position: 'center 32%',
  },
  /* Try-on chapter. */
  tryOn: {
    src: unsplash('1489987707025-afc232f7ea0f'),
    alt: 'A minimal rack of garments in muted natural tones',
    position: 'center',
  },
  /* Process chapter — quiet, studio-like. */
  process: {
    src: unsplash('1487222477894-8943e31ef7b2'),
    alt: 'Folded neutral fabrics arranged in soft studio light',
    position: 'center',
  },
  /* Atelier / pricing chapter. */
  atelier: {
    src: unsplash('1445205170230-053b83016050'),
    alt: 'A tailoring atelier interior with garments in warm light',
    position: 'center 45%',
  },
};

/** The four editorial chapters used by the homepage feature sequence. */
export const CHAPTER_KEYS = ['season', 'undertone', 'archetype', 'tryOn'] as const;
