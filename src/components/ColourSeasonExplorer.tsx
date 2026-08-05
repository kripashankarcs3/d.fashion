import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getSeasonInfo } from '@/lib/colour-data';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import Reveal from '@/components/editorial/Reveal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// ─── Types ────────────────────────────────────────────────────────────────────

type SeasonTab = 'autumn' | 'winter' | 'summer' | 'spring';

interface SeasonCardData {
  name: string;
  undertone: string;
}

// ─── Season tab data ──────────────────────────────────────────────────────────

const SEASON_TABS: { value: SeasonTab; label: string; seasons: SeasonCardData[] }[] = [
  {
    value: 'autumn',
    label: 'Autumn',
    seasons: [
      { name: 'Soft Autumn', undertone: 'neutral-warm' },
      { name: 'Warm Autumn', undertone: 'warm' },
      { name: 'Deep Autumn', undertone: 'deep-warm' },
    ],
  },
  {
    value: 'winter',
    label: 'Winter',
    seasons: [
      { name: 'Cool Winter', undertone: 'cool' },
      { name: 'Deep Winter', undertone: 'deep-cool' },
      { name: 'Bright Winter', undertone: 'bright-cool' },
    ],
  },
  {
    value: 'summer',
    label: 'Summer',
    seasons: [
      { name: 'Light Summer', undertone: 'light-cool' },
      { name: 'True Cool Summer', undertone: 'cool' },
      { name: 'Soft Summer', undertone: 'neutral-cool' },
    ],
  },
  {
    value: 'spring',
    label: 'Spring',
    seasons: [
      { name: 'Light Spring', undertone: 'light-warm' },
      { name: 'True Warm Spring', undertone: 'warm' },
      { name: 'Bright Spring', undertone: 'bright-warm' },
    ],
  },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const panelVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const cardContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Season card ──────────────────────────────────────────────────────────────

function SeasonCard({ name, undertone }: SeasonCardData) {
  const data = getSeasonInfo(name, undertone);
  const swatches = data.palette.slice(0, 5);
  const description = data.archetypes[0]?.description ?? '';

  return (
    <motion.article
      variants={cardVariants}
      whileInView="visible"
      initial="hidden"
      viewport={{ once: true, amount: 0.15 }}
      className="flex flex-col gap-4 rounded-sm border border-gold-hairline bg-surface-0 p-6"
    >
      {/* Season name */}
      <h3 className="font-editorial text-h5 font-light text-cream-primary">{data.season}</h3>

      {/* Swatch row */}
      <div className="flex gap-1.5" aria-label={`${data.season} colour palette`}>
        {swatches.map((colour) => (
          <div
            key={colour.hex}
            className="h-8 flex-1 rounded-sm border border-gold-hairline/20 transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: colour.hex }}
            title={colour.name}
            aria-label={colour.name}
          />
        ))}
      </div>

      {/* One-line description from first archetype */}
      <p className="text-body-sm text-cream-primary/65 leading-relaxed">{description}</p>
    </motion.article>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ColourSeasonExplorer() {
  const [activeTab, setActiveTab] = useState<SeasonTab>('autumn');

  return (
    <section
      id="colour-season-explorer"
      className="bg-surface-1 py-section-xl"
      aria-labelledby="season-explorer-heading"
    >
      <EditorialContainer>
        {/* Eyebrow */}
        <Reveal variant="fade">
          <EyebrowLabel rule tone="gold">
            Your Season Family
          </EyebrowLabel>
        </Reveal>

        {/* Heading */}
        <div className="mt-6">
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)', y: 8 }}
            whileInView={{ clipPath: 'inset(0 0 0% 0)', y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="will-change-[clip-path]"
          >
            <EditorialHeading
              as="h2"
              size="xl"
              id="season-explorer-heading"
              className="text-cream-primary"
            >
              Explore the <Emphasis>four seasons.</Emphasis>
            </EditorialHeading>
          </motion.div>
        </div>

        {/* Lede */}
        <Reveal variant="fade" delay={0.14}>
          <p className="mt-4 max-w-[60ch] text-lede text-cream-primary/70">
            Every person falls into one of twelve colour seasons within four families. Explore the
            families to see where you might belong.
          </p>
        </Reveal>

        {/* Gold gradient rule */}
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="mb-12 mt-10 h-px origin-left bg-gradient-to-r from-gold-primary via-gold-light/50 to-transparent will-change-transform"
        />

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as SeasonTab)}
          defaultValue="autumn"
        >
          {/* Tab list */}
          <TabsList
            className={cn(
              'h-auto w-full justify-start gap-0 rounded-none bg-transparent p-0',
              'border-b border-gold-hairline',
            )}
          >
            {SEASON_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  // Reset shadcn defaults
                  'rounded-none bg-transparent shadow-none',
                  // Layout
                  'px-5 py-3 text-body font-medium',
                  // Inactive state
                  'text-cream-primary/45 transition-colors duration-200',
                  // Active state — gold underline
                  'data-[state=active]:bg-transparent data-[state=active]:text-gold-light',
                  'data-[state=active]:shadow-[inset_0_-2px_0_0_theme(colors.gold.primary)]',
                  // Hover
                  'hover:text-cream-primary/80',
                  // Focus
                  'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none',
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab panels */}
          {SEASON_TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0 pt-10 outline-none">
              <AnimatePresence mode="wait">
                {activeTab === tab.value && (
                  <motion.div
                    key={tab.value}
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <motion.div
                      variants={cardContainerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                      {tab.seasons.map((season) => (
                        <SeasonCard key={season.name} {...season} />
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      </EditorialContainer>
    </section>
  );
}
