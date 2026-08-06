import { motion } from 'framer-motion';
import { Link } from 'wouter';
import CampaignSection from '@/components/editorial/CampaignSection';
import EditorialImage from '@/components/editorial/EditorialImage';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import Reveal from '@/components/editorial/Reveal';
import { CAMPAIGN } from '@/lib/editorial-images';
import { ROUTES } from '@/config/navigation';

const STATS = [
  { value: '50,000+', label: 'Colour profiles created' },
  { value: '12', label: 'Colour seasons covered' },
  { value: '< 3 min', label: 'From photo to palette' },
];

const VALUES = [
  {
    title: 'Rendered personal',
    body: 'No two reports are alike. Every palette is built from your own undertone, depth, and contrast — not from a demographic or a skin-tone dropdown.',
  },
  {
    title: 'Honest about data',
    body: 'Your photo is used once and deleted. We tell you exactly what happens to it — before you upload, not in a footnote.',
  },
  {
    title: 'Made to wear',
    body: 'Colour guidance that leaves the screen and enters your wardrobe — outfits, makeup, shopping, and the mirror.',
  },
];

const SCIENCE = [
  {
    num: '01',
    title: 'Undertone',
    body: 'The red-to-blue ratio in your skin hex determines warm, cool, or neutral — the most important axis in colour dressing.',
  },
  {
    num: '02',
    title: 'Depth',
    body: 'Skin lightness combined with hair darkness places you in the light, medium, or deep range and governs how bold your colours can be.',
  },
  {
    num: '03',
    title: 'Contrast',
    body: 'The spread between skin, hair, and eye lightness determines whether you suit bold, definite looks or softer, blended palettes.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function About() {
  return (
    <div className="w-full bg-surface-1">
      {/* ── 1. Full-bleed hero ── */}
      <CampaignSection
        src={CAMPAIGN.season.base}
        alt={CAMPAIGN.season.alt}
        position={CAMPAIGN.season.position}
        anchor="bottom-left"
        height="tall"
        scrim="bottom"
        priority
      >
        <div className="max-w-[44rem]">
          <Reveal variant="fade">
            <EyebrowLabel tone="inverse" rule>About D&rsquo;Fashion</EyebrowLabel>
          </Reveal>
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)', y: 8 }}
            animate={{ clipPath: 'inset(0 0 0% 0)', y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <EditorialHeading as="h1" size="xl" tone="inverse" className="mt-5">
              Colour Intelligence, <Emphasis>Rendered Personal.</Emphasis>
            </EditorialHeading>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-6 max-w-[42ch] text-lede font-light text-cream-primary/75"
          >
            We started with a simple question: why should understanding the colours that flatter you require an expensive appointment?
          </motion.p>
        </div>
      </CampaignSection>

      {/* ── 2. Stat strip ── */}
      <div className="border-b border-gold-hairline bg-surface-0">
        <EditorialContainer>
          <div className="grid grid-cols-3 divide-x divide-gold-hairline">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                className="px-8 py-10 text-center first:pl-0 last:pr-0"
              >
                <p className="font-editorial text-h1 font-light leading-none text-gold-primary">
                  {stat.value}
                </p>
                <p className="eyebrow mt-2 text-cream-primary/55">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </EditorialContainer>
      </div>

      {/* ── 3. Our story ── */}
      <section className="py-section-xl bg-surface-1">
        <EditorialContainer>
          <Reveal variant="fade">
            <EyebrowLabel tone="gold" rule>Our Story</EyebrowLabel>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <EditorialImage
                src={CAMPAIGN.undertone.base}
                alt={CAMPAIGN.undertone.alt}
                ratio="portrait"
                position={CAMPAIGN.undertone.position}
                zoom
              />
            </motion.div>

            {/* Values + prose */}
            <div className="flex flex-col justify-center gap-8">
              <Reveal variant="rise">
                <p className="text-lede font-light leading-relaxed text-cream-primary/75">
                  Colour analysis has existed for decades, but it has always been exclusive —
                  sessions booked weeks ahead, held in person, priced out of reach. We wanted the
                  same rigour available to anyone with a phone.
                </p>
              </Reveal>

              <div className="flex flex-col gap-6">
                {VALUES.map((v, i) => (
                  <motion.div
                    key={v.title}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    className="border-l-2 border-gold-primary pl-5"
                  >
                    <h3 className="font-serif text-h5 font-light text-cream-primary">
                      {v.title}
                    </h3>
                    <p className="mt-1.5 text-body-sm leading-relaxed text-cream-primary/65">
                      {v.body}
                    </p>
                  </motion.div>
                ))}
              </div>

              <Reveal variant="fade" delay={0.2}>
                <p className="text-body-sm leading-relaxed text-cream-primary/60">
                  D&rsquo;Fashion reads your skin undertone, depth, and contrast from a single
                  photograph in natural light, places you in one of the twelve colour seasons, and
                  builds a palette you can actually wear. The technology is ours; the eye is the
                  same one a stylist would bring.
                </p>
              </Reveal>
            </div>
          </div>
        </EditorialContainer>
      </section>

      {/* ── 4. The Science ── */}
      <section className="py-section-xl bg-surface-2">
        <EditorialContainer>
          <Reveal variant="fade">
            <EyebrowLabel tone="gold" rule>The Science</EyebrowLabel>
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
                How we read <Emphasis>your colours.</Emphasis>
              </EditorialHeading>
            </motion.div>
            <Reveal variant="fade" delay={0.14}>
              <p className="text-lede text-cream-primary/65 lg:pb-2">
                Three measurable properties of your skin, hair, and eyes determine your colour season.
              </p>
            </Reveal>
          </div>

          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="mb-14 mt-10 h-px origin-left bg-gradient-to-r from-gold-primary via-gold-light/50 to-transparent"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {SCIENCE.map((item, i) => (
              <motion.div
                key={item.num}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden rounded-sm border border-gold-hairline bg-surface-3 p-8 transition-all hover:border-gold-border hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
              >
                <span className="pointer-events-none absolute right-4 top-4 select-none font-editorial text-[4rem] font-light leading-none text-gold-primary/[0.07] transition-all group-hover:text-gold-primary/[0.12]">
                  {item.num}
                </span>
                <h3 className="font-editorial text-h5 font-light text-cream-primary">{item.title}</h3>
                <p className="mt-3 text-body-sm leading-relaxed text-cream-primary/65">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </EditorialContainer>
      </section>

      {/* ── 5. Final CTA ── */}
      <CampaignSection
        src={CAMPAIGN.closing.base}
        alt={CAMPAIGN.closing.alt}
        position={CAMPAIGN.closing.position}
        anchor="center"
        height="mid"
        scrim="soft"
        contentClassName="text-center"
      >
        <Reveal variant="rise">
          <EyebrowLabel tone="inverse" className="justify-center">Ready?</EyebrowLabel>
          <EditorialHeading as="h2" size="lg" tone="inverse" className="mt-4">
            Start with a <Emphasis>single photo.</Emphasis>
          </EditorialHeading>
          <p className="mx-auto mt-4 max-w-[40ch] text-body text-cream-primary/75">
            Your palette, neutrals, archetypes, and makeup shades — ready in under three minutes.
          </p>
          <Link href={ROUTES.upload} className="btn-campaign mt-8 inline-block">
            Analyse My Colours →
          </Link>
        </Reveal>
      </CampaignSection>
    </div>
  );
}
