import { motion, type Variants } from 'framer-motion';
import { Link } from 'wouter';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import Reveal from '@/components/editorial/Reveal';
import { getSeasonInfo } from '@/lib/colour-data';
import { ROUTES } from '@/config/navigation';

// ─── Static Warm Autumn data ──────────────────────────────────────────────────

const seasonData = getSeasonInfo('Warm Autumn', 'warm');

// ─── Animation variants ───────────────────────────────────────────────────────

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const subSectionVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const subSectionItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Warm-tone dots for season family indicator ───────────────────────────────

const WARM_DOTS = ['#C19A6B', '#B7410E', '#C7953A'] as const;

// ─── Sub-sections ─────────────────────────────────────────────────────────────

function SeasonBadge() {
  return (
    <motion.div variants={subSectionItemVariants} className="flex flex-col gap-3">
      <EyebrowLabel size="micro" tone="gold">
        Your Colour Season
      </EyebrowLabel>
      <p className="font-editorial text-h2 font-light leading-none text-cream-primary">
        {seasonData.season}
      </p>
      {/* Warm-tone family dots */}
      <div className="flex items-center gap-2" aria-label="Warm tone family">
        {WARM_DOTS.map((hex) => (
          <span
            key={hex}
            className="h-3.5 w-3.5 rounded-full border border-gold-hairline"
            style={{ backgroundColor: hex }}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="text-body-sm text-cream-primary/70">{seasonData.tagline}</p>
    </motion.div>
  );
}

function YourPalette() {
  const displaySwatches = seasonData.palette.slice(0, 8);

  return (
    <motion.div variants={subSectionItemVariants} className="flex flex-col gap-3">
      <EyebrowLabel size="micro" tone="gold">
        Your Palette
      </EyebrowLabel>
      <div className="grid grid-cols-4 grid-rows-2 gap-1.5">
        {displaySwatches.map((colour) => (
          <div
            key={colour.hex}
            className="h-10 w-full rounded-sm border border-gold-hairline/20 transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: colour.hex }}
            title={colour.name}
            aria-label={colour.name}
          />
        ))}
      </div>
      <p className="text-body-sm text-cream-primary/60">
        Colours that work with your natural colouring
      </p>
    </motion.div>
  );
}

function ArchetypeCard() {
  const archetype = seasonData.archetypes[0];

  return (
    <motion.div variants={subSectionItemVariants} className="flex flex-col gap-3">
      <EyebrowLabel size="micro" tone="gold">
        Your Style Archetype
      </EyebrowLabel>
      <p className="font-editorial text-h5 font-light text-cream-primary">
        {archetype.title}
      </p>
      <p className="text-body-sm text-cream-primary/70">{archetype.description}</p>
    </motion.div>
  );
}

function ColoursToAvoid() {
  const avoidSwatches = seasonData.avoid.slice(0, 4);

  return (
    <motion.div variants={subSectionItemVariants} className="flex flex-col gap-3">
      <EyebrowLabel size="micro" tone="muted">
        Avoid
      </EyebrowLabel>
      <div className="flex gap-1.5">
        {avoidSwatches.map((colour) => (
          <div key={colour.hex} className="relative flex-1">
            <div
              className="h-10 w-full rounded-sm border border-gold-hairline/20"
              style={{ backgroundColor: colour.hex }}
              title={colour.name}
              aria-label={`Avoid: ${colour.name}`}
            />
            {/* ✗ overlay */}
            <span
              className="pointer-events-none absolute inset-0 flex items-center justify-center text-[0.6rem] font-bold leading-none text-white/70 select-none"
              aria-hidden="true"
            >
              ✗
            </span>
          </div>
        ))}
      </div>
      <p className="text-body-sm text-cream-primary/60">
        These clash with your undertone and will make you look tired.
      </p>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SampleReportSection() {
  return (
    <section
      id="sample-report"
      className="scroll-mt-[4.375rem] relative overflow-hidden bg-surface-0 py-section-xl"
    >
      <EditorialContainer>
        {/* Section header */}
        <Reveal variant="fade">
          <EyebrowLabel rule tone="gold">
            Sample Report
          </EyebrowLabel>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[45fr_55fr] lg:items-end">
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)', y: 8 }}
            whileInView={{ clipPath: 'inset(0 0 0% 0)', y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="will-change-[clip-path]"
          >
            <EditorialHeading as="h2" size="xl" className="text-cream-primary">
              See exactly <Emphasis>what you'll receive.</Emphasis>
            </EditorialHeading>
          </motion.div>

          <Reveal variant="fade" delay={0.14}>
            <p className="max-w-[52ch] text-lede text-cream-primary/70 lg:pb-2">
              A sample Warm Autumn report — built from real colour science, not stock photos.
            </p>
          </Reveal>
        </div>

        {/* Gold gradient rule */}
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="mb-16 mt-10 h-px origin-left bg-gradient-to-r from-gold-primary via-gold-light/50 to-transparent will-change-transform"
        />

        {/* Report Preview Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="relative overflow-hidden rounded-sm border border-gold-hairline bg-surface-1 p-8 md:p-12"
        >
          {/* SAMPLE watermark */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
          >
            <span
              className="font-editorial text-[12rem] font-light leading-none text-gold-primary/[0.04] rotate-[-15deg]"
              style={{ userSelect: 'none' }}
            >
              SAMPLE
            </span>
          </div>

          {/* 2×2 sub-section grid */}
          <motion.div
            variants={subSectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="relative grid grid-cols-1 gap-10 sm:grid-cols-2"
          >
            <SeasonBadge />
            <YourPalette />
            <ArchetypeCard />
            <ColoursToAvoid />
          </motion.div>
        </motion.div>

        {/* CTA below card */}
        <Reveal variant="fade" delay={0.1}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={ROUTES.upload}
              className="btn-campaign inline-flex items-center gap-2 px-8 py-3 text-body font-medium"
            >
              Get Your Report →
            </Link>
            <Link
              href="/report?sample=warm-autumn"
              className="eyebrow text-gold-primary underline-offset-4 transition-colors duration-200 hover:text-gold-light hover:underline"
            >
              View full sample →
            </Link>
          </div>
        </Reveal>
      </EditorialContainer>
    </section>
  );
}
