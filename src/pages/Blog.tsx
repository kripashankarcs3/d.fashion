import { motion } from 'framer-motion';
import CampaignSection from '@/components/editorial/CampaignSection';
import EditorialImage from '@/components/editorial/EditorialImage';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import Reveal from '@/components/editorial/Reveal';
import { CAMPAIGN } from '@/lib/editorial-images';

const POSTS = [
  {
    slug: 'what-is-colour-season',
    image: CAMPAIGN.season,
    date: 'June 2026',
    readingTime: '6 min',
    title: 'What is a colour season, actually?',
    excerpt:
      'Warm Spring, Cool Winter, Soft Autumn — the names sound like poetry, but each one encodes a measurable relationship between your skin, hair, and eyes. Here is how the system works, and why twelve seasons are better than four.',
  },
  {
    slug: 'reading-your-undertone',
    image: CAMPAIGN.undertone,
    date: 'July 2026',
    readingTime: '5 min',
    title: 'How to read your undertone without squinting',
    excerpt:
      'Vein colour, jewellery tests, white-cloth comparisons — the classic tricks all work, and all fail in the wrong light. A practical guide to finding your warm/cool signal under real-world conditions.',
  },
  {
    slug: 'building-neutral-wardrobe',
    image: CAMPAIGN.archetype,
    date: 'August 2026',
    readingTime: '7 min',
    title: 'Building a neutral wardrobe that isn\u2019t beige',
    excerpt:
      'A \u201cneutral\u201d is any colour quiet enough to support the rest of your outfit. Learn the neutral set that flatters your season — and the three you should stop reaching for.',
  },
  {
    slug: 'lighting-and-analysis',
    image: CAMPAIGN.process,
    date: 'August 2026',
    readingTime: '4 min',
    title: 'Why lighting decides your analysis',
    excerpt:
      'The same face reads three different seasons in three different lights. What the camera sees, what makes a photo unusable, and how to take the shot that gets the most honest result.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Blog() {
  const [featured, ...rest] = POSTS;

  return (
    <div className="w-full bg-surface-1">
      {/* ── Hero ── */}
      <CampaignSection
        src={CAMPAIGN.archetype.base}
        alt={CAMPAIGN.archetype.alt}
        position={CAMPAIGN.archetype.position}
        anchor="bottom-left"
        height="mid"
        scrim="bottom"
        priority
      >
        <div className="max-w-[42rem]">
          <Reveal variant="fade">
            <EyebrowLabel tone="inverse" rule>Journal</EyebrowLabel>
          </Reveal>
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)', y: 8 }}
            animate={{ clipPath: 'inset(0 0 0% 0)', y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <EditorialHeading as="h1" size="xl" tone="inverse" className="mt-5">
              Colour, <Emphasis>Worn Thoughtfully.</Emphasis>
            </EditorialHeading>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-5 max-w-[44ch] text-lede font-light text-cream-primary/75"
          >
            Essays on the science and style of colour analysis — the thinking behind your palette.
          </motion.p>
        </div>
      </CampaignSection>

      {/* ── Featured post ── */}
      <section className="py-section-xl bg-surface-0">
        <EditorialContainer>
          <Reveal variant="fade">
            <EyebrowLabel tone="gold" rule>Latest Entry</EyebrowLabel>
          </Reveal>

          <motion.article
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 grid grid-cols-1 gap-0 overflow-hidden border border-gold-hairline lg:grid-cols-[3fr_2fr]"
          >
            {/* Image */}
            <div className="overflow-hidden">
              <EditorialImage
                src={featured.image.base}
                alt={featured.image.alt}
                ratio="wide"
                position={featured.image.position}
                zoom
                className="h-full"
                reveal={false}
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center gap-5 bg-surface-3 p-8 lg:p-10">
              <p className="eyebrow text-gold-primary/70">
                {featured.date} · {featured.readingTime} read
              </p>
              <h2 className="font-editorial text-h3 font-light leading-snug text-cream-primary">
                {featured.title}
              </h2>
              <p className="text-body-sm leading-relaxed text-cream-primary/65">
                {featured.excerpt}
              </p>
              <a
                href={`#${featured.slug}`}
                className="eyebrow mt-2 inline-flex items-center gap-3 text-gold-primary transition-opacity hover:opacity-70"
              >
                <span className="h-px w-6 bg-gold-primary" aria-hidden />
                Read entry
              </a>
            </div>
          </motion.article>
        </EditorialContainer>
      </section>

      {/* ── Gold rule ── */}
      <div className="bg-surface-1 pb-0 pt-0">
        <EditorialContainer>
          <div className="h-px bg-gradient-to-r from-gold-primary via-gold-light/40 to-transparent" />
        </EditorialContainer>
      </div>

      {/* ── Remaining posts grid ── */}
      <section className="py-section-xl bg-surface-1">
        <EditorialContainer>
          <Reveal variant="fade">
            <EyebrowLabel tone="gold" rule>More Entries</EyebrowLabel>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <motion.article
                key={post.slug}
                id={post.slug}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group scroll-mt-16 overflow-hidden border border-gold-hairline transition-colors duration-300 hover:border-gold-border"
              >
                <div className="overflow-hidden">
                  <EditorialImage
                    src={post.image.base}
                    alt={post.image.alt}
                    ratio="landscape"
                    position={post.image.position}
                    zoom
                    reveal={false}
                  />
                </div>
                <div className="flex flex-col gap-3 bg-surface-3 p-6">
                  <p className="eyebrow text-gold-primary/60">
                    {post.date} · {post.readingTime} read
                  </p>
                  <h2 className="font-editorial text-h5 font-light leading-snug text-cream-primary transition-colors duration-200 group-hover:text-gold-primary">
                    {post.title}
                  </h2>
                  <p className="text-body-sm leading-relaxed text-cream-primary/60">
                    {post.excerpt}
                  </p>
                  <a
                    href="#"
                    className="mt-1 inline-flex items-center gap-2 eyebrow text-gold-primary hover:opacity-75"
                    aria-label={`Read ${post.title}`}
                  >
                    Read entry <span aria-hidden="true">→</span>
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </EditorialContainer>
      </section>

      {/* ── Subscribe strip ── */}
      <section className="border-t border-gold-hairline bg-surface-2 py-16">
        <EditorialContainer>
          <div className="mx-auto max-w-2xl text-center">
            <Reveal variant="fade">
              <EyebrowLabel tone="gold" className="justify-center">Stay Updated</EyebrowLabel>
              <EditorialHeading as="h2" size="md" className="mt-4">
                Essays on colour, <Emphasis>delivered occasionally.</Emphasis>
              </EditorialHeading>
              <p className="mx-auto mt-4 max-w-[44ch] text-body-sm text-cream-primary/60">
                The science and style of colour analysis — no noise, no promotions, just the thinking behind your palette.
              </p>
            </Reveal>

            <motion.form
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              onSubmit={(e) => e.preventDefault()}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full border-0 border-b border-gold-border bg-transparent pb-2 pt-1 text-body text-cream-primary placeholder:text-cream-primary/35 focus:border-gold-primary focus:outline-none sm:w-72"
              />
              <button
                type="submit"
                className="btn-campaign shrink-0"
              >
                Subscribe →
              </button>
            </motion.form>
          </div>
        </EditorialContainer>
      </section>
    </div>
  );
}
