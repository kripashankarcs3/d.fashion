import { motion, type Variants } from 'framer-motion';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import Reveal from '@/components/editorial/Reveal';

// ─── Card data ────────────────────────────────────────────────────────────────

interface ScienceColumn {
  number: string;
  title: string;
  body: string;
  visual: React.ReactNode;
}

/** Column 1 — Undertone visual: a horizontal gradient strip with end-labels */
function UndertoneVisual() {
  return (
    <div className="mt-6 space-y-2">
      <div
        aria-hidden
        className="h-6 w-full rounded-sm"
        style={{
          background: 'linear-gradient(to right, #C4793A, #D2A679, #C4A0A0)',
        }}
      />
      <div className="flex justify-between">
        <span className="eyebrow-micro text-cream-primary/50">Warm</span>
        <span className="eyebrow-micro text-cream-primary/50">Neutral</span>
        <span className="eyebrow-micro text-cream-primary/50">Cool</span>
      </div>
    </div>
  );
}

/** Column 2 — Depth visual: a vertical gradient bar with a static mid-point marker */
function DepthVisual() {
  return (
    <div aria-hidden className="mt-6 flex items-stretch gap-3">
      {/* Gradient bar */}
      <div
        className="relative w-6 flex-shrink-0 rounded-sm"
        style={{
          background: 'linear-gradient(to bottom, #F5E6D3, #2C1810)',
          minHeight: '5rem',
        }}
      >
        {/* Static mid-point dot */}
        <span
          className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface-3 bg-gold-light shadow-[0_0_0_2px_rgba(184,151,74,0.4)]"
        />
      </div>
      {/* Side labels */}
      <div className="flex flex-col justify-between py-0.5">
        <span className="eyebrow-micro text-cream-primary/50">Light</span>
        <span className="eyebrow-micro text-cream-primary/50">Medium</span>
        <span className="eyebrow-micro text-cream-primary/50">Deep</span>
      </div>
    </div>
  );
}

/** Column 3 — Contrast visual: three overlapping circles (Venn-like) */
function ContrastVisual() {
  return (
    <div aria-hidden className="relative mt-6 h-20 w-full overflow-visible">
      {/* Skin — centre-left */}
      <span
        className="absolute h-14 w-14 rounded-full opacity-80 mix-blend-screen"
        style={{ background: '#D2A679', top: '10%', left: '18%' }}
      />
      {/* Hair — centre-right */}
      <span
        className="absolute h-14 w-14 rounded-full opacity-80 mix-blend-screen"
        style={{ background: '#3B2A1A', top: '10%', left: '44%' }}
      />
      {/* Eyes — bottom-centre */}
      <span
        className="absolute h-14 w-14 rounded-full opacity-80 mix-blend-screen"
        style={{ background: '#7B5E3A', top: '30%', left: '31%' }}
      />
    </div>
  );
}

const columns: ScienceColumn[] = [
  {
    number: '01',
    title: 'Undertone',
    body: 'The ratio of red to blue in your skin hex determines whether your undertone is warm (more red), cool (more blue), or neutral. This is the single most important axis — it determines which metal, which whites, and which neutrals look alive on you.',
    visual: <UndertoneVisual />,
  },
  {
    number: '02',
    title: 'Depth',
    body: 'The lightness of your skin tone combined with your hair colour determines whether you read as Light, Medium, or Deep. Depth governs contrast — how bold your colours can be before they overwhelm your natural colouring.',
    visual: <DepthVisual />,
  },
  {
    number: '03',
    title: 'Contrast',
    body: 'The spread between your skin tone, hair colour, and eye colour determines your contrast level. High contrast (dark hair, light skin, or striking eye colour) suits bold, definite looks. Low contrast suits softer, blended palettes.',
    visual: <ContrastVisual />,
  },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScienceSection() {
  return (
    <section
      id="the-science"
      className="scroll-mt-[4.375rem] relative overflow-hidden bg-surface-2 py-section-xl"
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 65% 50% at 50% 100%, rgba(184,151,74,0.05) 0%, transparent 70%)',
        }}
      />

      <EditorialContainer>
        {/* Section header */}
        <Reveal variant="fade">
          <EyebrowLabel rule tone="gold">The Science</EyebrowLabel>
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
              How we read{' '}
              <Emphasis>your colours.</Emphasis>
            </EditorialHeading>
          </motion.div>

          <Reveal variant="fade" delay={0.14}>
            <p className="max-w-[52ch] text-lede text-cream-primary/70 lg:pb-2">
              Three measurable properties of your skin, hair, and eyes determine your colour season.
              Our AI reads all three from a single photo.
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

        {/* Three-column cards */}
        <motion.div
          variants={staggerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {columns.map((col) => (
            <motion.div
              key={col.number}
              variants={cardVariants}
              whileHover={{
                y: -4,
                transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
              }}
              style={{ willChange: 'transform' }}
              className="group relative overflow-hidden rounded-sm border border-gold-hairline bg-surface-3 p-8 transition-all duration-300 hover:border-gold-border hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
            >
              {/* Watermark number */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-4 top-4 select-none font-editorial text-[4rem] font-light leading-none text-gold-primary/[0.07] transition-all duration-500 group-hover:text-gold-primary/[0.12]"
              >
                {col.number}
              </span>

              {/* Title */}
              <h3 className="font-editorial text-h5 font-light text-cream-primary">
                {col.title}
              </h3>

              {/* Body */}
              <p className="mt-3 text-body-sm leading-relaxed text-cream-primary/70">{col.body}</p>

              {/* Visual */}
              {col.visual}
            </motion.div>
          ))}
        </motion.div>
      </EditorialContainer>
    </section>
  );
}
