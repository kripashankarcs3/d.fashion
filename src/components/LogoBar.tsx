import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

const LOGOS = [
  { name: 'Vogue India', fontStyle: 'font-serif tracking-wider' },
  { name: "Harper's Bazaar", fontStyle: 'font-serif tracking-tight' },
  { name: 'Elle', fontStyle: 'font-serif tracking-[0.35em]' },
  { name: 'Forbes India', fontStyle: 'font-serif tracking-wide' },
  { name: 'TechCrunch', fontStyle: 'font-sans font-medium tracking-tight' },
  { name: 'Product Hunt', fontStyle: 'font-sans font-semibold tracking-normal' },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * "As seen in" press / partner logo strip — placed between ResumeAnalysisBanner
 * and ProblemStrip on the Home page.
 *
 * Uses text-based logo stand-ins at ~60 % opacity rendered in serif / sans
 * at a small size so they read as legitimate press logos before real assets
 * are available.
 */
export default function LogoBar() {
  return (
    <section
      aria-label="Press mentions"
      className="w-full border-y border-gold-hairline bg-surface-0 py-6"
    >
      {/* ── Desktop: single flex row ──────────────────────────────────── */}
      <div className="hidden md:flex md:items-center md:px-[var(--gutter)]">
        <LogoLabel className="shrink-0 pr-10" />
        <motion.nav
          aria-label="Press mentions"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="flex flex-1 items-center justify-evenly"
        >
          {LOGOS.map((logo) => (
            <LogoItem key={logo.name} logo={logo} />
          ))}
        </motion.nav>
      </div>

      {/* ── Mobile: stacked label + horizontal scroll ─────────────────── */}
      <div className="flex flex-col gap-4 md:hidden">
        <LogoLabel className="px-[var(--gutter)]" />
        <div className="overflow-x-auto scrollbar-none">
          <motion.nav
            aria-label="Press mentions"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex w-max items-center gap-8 px-[var(--gutter)] pb-1"
          >
            {LOGOS.map((logo) => (
              <LogoItem key={logo.name} logo={logo} />
            ))}
          </motion.nav>
        </div>
      </div>
    </section>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function LogoLabel({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        'eyebrow uppercase tracking-label text-gold-muted',
        className,
      )}
    >
      As seen in
    </p>
  );
}

function LogoItem({
  logo,
}: {
  logo: { name: string; fontStyle: string };
}) {
  return (
    <motion.span
      variants={itemVariants}
      className={cn(
        'shrink-0 select-none text-[0.875rem] text-cream-primary/60',
        logo.fontStyle,
      )}
    >
      {logo.name}
    </motion.span>
  );
}
