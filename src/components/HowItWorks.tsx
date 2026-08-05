import { motion, type Variants } from 'framer-motion';
import { Link } from 'wouter';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import Reveal from '@/components/editorial/Reveal';
import { CAMPAIGN, type EditorialPhoto } from '@/lib/editorial-images';
import { ROUTES } from '@/config/navigation';

interface Step {
  number: string;
  title: string;
  description: string;
  tag: string;
  needs: string[];
  image: EditorialPhoto;
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Upload Your Photo',
    description:
      'A clear selfie in natural light is all it takes. No filters, no makeup — just your face.',
    tag: '~30 sec',
    needs: ['Natural light', 'No filters', 'Face the camera', 'Bare face preferred'],
    image: CAMPAIGN.process,
  },
  {
    number: '02',
    title: 'AI Reads Your Colours',
    description:
      'The model reads skin undertone, depth, and contrast. Your colour season emerges in seconds.',
    tag: '~90 sec',
    needs: ['Nothing — fully automatic'],
    image: CAMPAIGN.undertone,
  },
  {
    number: '03',
    title: 'Receive Your Style Profile',
    description:
      'A complete palette, style archetypes, makeup shades, and wardrobe guidance — personalised to you.',
    tag: 'Instant',
    needs: ['Check your email', 'Or view in-app'],
    image: CAMPAIGN.atelier,
  },
  {
    number: '04',
    title: 'Wear It',
    description:
      'Take your palette shopping, into your wardrobe, and to the mirror. The colours that suit you don\'t change.',
    tag: 'Yours forever',
    needs: ['No re-analysis needed', 'Share with friends'],
    image: CAMPAIGN.closing,
  },
];

const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-[4.375rem] relative overflow-hidden bg-surface-2 py-section-xl"
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(184,151,74,0.06) 0%, transparent 70%)',
        }}
      />

      <EditorialContainer>
        {/* Section header — left-aligned, editorial register */}
        <Reveal variant="fade">
          <EyebrowLabel rule tone="gold">Process</EyebrowLabel>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-[45fr_55fr] lg:items-end">
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)', y: 8 }}
            whileInView={{ clipPath: 'inset(0 0 0% 0)', y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="will-change-[clip-path]"
          >
            <EditorialHeading as="h2" size="xl" className="text-cream-primary">
              Four steps to your{' '}
              <Emphasis>palette.</Emphasis>
            </EditorialHeading>
          </motion.div>

          <Reveal variant="fade" delay={0.14}>
            <div className="flex flex-col gap-5 lg:items-start lg:pb-2">
              <p className="max-w-[48ch] text-lede text-cream-primary/70">
                From selfie to full style profile — no appointments, no guesswork, no subscription required to start.
              </p>
              <Link
                href={ROUTES.upload}
                className="eyebrow inline-flex items-center gap-3 text-gold-primary transition-colors duration-200 hover:text-gold-light"
              >
                <span className="h-px w-6 bg-gold-primary" aria-hidden />
                Start your analysis
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Gold gradient rule — grows left to right on scroll */}
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="mb-16 mt-10 h-px origin-left bg-gradient-to-r from-gold-primary via-gold-light/50 to-transparent will-change-transform"
        />

        {/* Steps */}
        <div className="relative">
          {/* Desktop connector — a line that draws itself across the badge
              line while the section scrolls into view. Sits behind the
              opaque cards, so only the gaps read as connecting. */}
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 top-6 hidden md:block"
            fill="none"
          >
            <motion.path
              d="M0 20 H1200"
              stroke="rgba(201,168,76,0.4)"
              strokeWidth="1"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            />
          </motion.svg>

          {/* Mobile connector — same line, running vertically through the
              stacked cards. */}
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 1 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute bottom-4 left-4 top-4 w-px md:hidden"
            fill="none"
          >
            <motion.path
              d="M0.5 0 V100"
              stroke="rgba(201,168,76,0.4)"
              strokeWidth="1"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.svg>

          <motion.div
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-0 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
          >
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
              whileTap={{ y: -2, transition: { duration: 0.1 } }}
              style={{ willChange: 'transform' }}
              className="group relative overflow-hidden rounded-sm border border-gold-hairline bg-surface-3 p-8 transition-all duration-300 hover:border-gold-border hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
            >
              {/* Watermark number */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-3 -top-4 select-none font-editorial text-[7rem] font-light leading-none text-gold-primary/[0.06] transition-all duration-500 group-hover:text-gold-primary/[0.10]"
              >
                {step.number}
              </span>

              {/* Tag */}
              <div className="mb-6 flex items-start justify-between gap-2">
                <motion.span
                  whileHover={{ scale: 1.15, rotate: 3 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-hairline bg-surface-4 font-editorial text-body text-gold-soft transition-all duration-300 group-hover:bg-gold-primary group-hover:text-surface-1"
                >
                  {idx + 1}
                </motion.span>
                <span className="eyebrow rounded-sm border border-gold-hairline bg-surface-4 px-2.5 py-1 text-gold-muted">
                  {step.tag}
                </span>
              </div>

              <h3 className="font-editorial text-h5 font-light text-cream-primary">
                {step.title}
              </h3>
              <p className="mt-3 text-body-sm leading-relaxed text-cream-primary/70">
                {step.description}
              </p>

              {/* Micro-list */}
              {step.needs.length > 0 && (
                <ul className="mt-4 flex flex-col gap-1.5">
                  {step.needs.map((need) => (
                    <li key={need} className="flex items-center gap-2 text-caption text-cream-primary/50">
                      <span className="h-px w-3 shrink-0 bg-gold-primary/40" aria-hidden />
                      {need}
                    </li>
                  ))}
                </ul>
              )}

              {/* Hover-reveal duration chip */}
              <div className="mt-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-caption text-gold-primary/80 font-medium">{step.tag}</span>
              </div>
            </motion.div>
          ))}
          </motion.div>
        </div>
      </EditorialContainer>
    </section>
  );
}
