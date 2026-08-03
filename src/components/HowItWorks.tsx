import { motion, type Variants } from 'framer-motion';
import { Link } from 'wouter';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import Reveal from '@/components/editorial/Reveal';
import { CAMPAIGN } from '@/lib/editorial-images';

const steps = [
  {
    number: '01',
    title: 'Upload Your Photo',
    description:
      'A clear selfie in natural light is all it takes. No filters, no makeup — just your face.',
    tag: 'Under 1 min',
  },
  {
    number: '02',
    title: 'AI Reads Your Colours',
    description:
      'The model reads skin undertone, depth, and contrast. Your colour season emerges in seconds.',
    tag: 'Instant',
  },
  {
    number: '03',
    title: 'Receive Your Style Profile',
    description:
      'A complete palette, style archetypes, makeup shades, and wardrobe guidance — personalised to you.',
    tag: 'Full Report',
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
      className="scroll-mt-16 relative overflow-hidden bg-surface-2 py-section-xl"
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
              Three steps to your{' '}
              <Emphasis>palette.</Emphasis>
            </EditorialHeading>
          </motion.div>

          <Reveal variant="fade" delay={0.14}>
            <div className="flex flex-col gap-5 lg:items-start lg:pb-2">
              <p className="max-w-[48ch] text-lede text-cream-primary/70">
                From selfie to full style profile — no appointments, no guesswork, no subscription required to start.
              </p>
              <Link
                href="/upload"
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
        <motion.div
          variants={staggerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-0 grid grid-cols-1 gap-5 md:grid-cols-3"
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
            </motion.div>
          ))}
        </motion.div>
      </EditorialContainer>
    </section>
  );
}
