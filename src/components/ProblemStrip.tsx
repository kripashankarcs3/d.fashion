import { motion } from 'framer-motion';

const MARQUEE_ITEMS = [
  'Colour Season Analysis',
  'Skin Undertone Detection',
  'Virtual Try-On',
  'Style Archetypes',
  'AI Stylist Chat',
  'Palette Download',
  'Wardrobe Builder',
  'Makeup Shades',
];

/** A slow marquee that reads as an understated brand statement, not a ticker. */
export default function ProblemStrip() {
  return (
    <section
      aria-hidden="true"
      className="relative overflow-hidden border-y border-gold-hairline bg-surface-0 py-4"
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-surface-0 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-surface-0 to-transparent" />

      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
        className="flex w-max will-change-transform"
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-6 px-8 eyebrow text-gold-muted"
          >
            <span aria-hidden className="h-px w-3 bg-gold-primary/35" />
            {item}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
