import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'wouter';
import { CAMPAIGN } from '@/lib/editorial-images';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import HashLink from '@/components/nav/HashLink';
import { ROUTES } from '@/config/navigation';

const easeEditorial = [0.22, 1, 0.36, 1] as const;

const STATS = [
  { value: '4 Seasons', sub: 'colour profiles' },
  { value: '12 Types', sub: 'style archetypes' },
  { value: '<30 sec', sub: 'AI analysis' },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [0.95, 1.02]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[120vh] overflow-hidden bg-[#070707]"
    >
      {/* ── LAYER 1: Full-bleed image — absolute fill ── */}
      <motion.div
        aria-hidden
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 -z-10 will-change-transform"
      >
        <img
          src={CAMPAIGN.opening.src}
          alt={CAMPAIGN.opening.alt}
          style={{
            objectPosition: 'center 25%',
          }}
          {...({ fetchpriority: 'high' } as React.ImgHTMLAttributes<HTMLImageElement>)}
          loading="eager"
          decoding="async"
          className="campaign-photo-grade campaign-hero-img absolute inset-0 h-full w-full object-cover"
        />
        {/* Cinematic grade + grain overlay to remove seams and add film look */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none campaign-grade-overlay"
        />

        {/* Layered cinematic scrims — vignette first, then the directional
            fade for the copy side, then the edge fade that carries the
            navbar scrim and resolves the bottom edge into the page ground. */}
        <div aria-hidden="true" className="absolute inset-0 campaign-vignette" />
        <div aria-hidden="true" className="absolute inset-0 campaign-fade-left" />
        <div aria-hidden="true" className="absolute inset-0 campaign-fade-edges" />
      </motion.div>

      {/* ── Ambient floating particles ── */}
      <>
        {[
          { top: '15%', left: '8%', size: 3, dur: 5.5, delay: 0, opacity: 0.25 },
          { top: '35%', left: '62%', size: 2, dur: 7.0, delay: 1.2, opacity: 0.18 },
          { top: '60%', left: '82%', size: 4, dur: 6.2, delay: 0.6, opacity: 0.20 },
          { top: '22%', left: '44%', size: 2, dur: 8.0, delay: 2.1, opacity: 0.15 },
          { top: '72%', left: '18%', size: 3, dur: 5.0, delay: 1.7, opacity: 0.22 },
          { top: '48%', left: '90%', size: 2, dur: 6.8, delay: 0.3, opacity: 0.17 },
        ].map((p, i) => (
          <motion.div
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full bg-gold-primary will-change-transform"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [p.opacity * 0.5, p.opacity, p.opacity * 0.5],
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
          />
        ))}
      </>

      {/* ── LAYER 2: Content — lives inside the image ── */}
      <div className="relative flex min-h-[120vh] items-end px-gutter pb-20 pt-36 lg:items-start lg:pb-24 lg:pt-40">
        <div className="w-full max-w-[40rem]">
          {/* Eyebrow label — slide in from the column edge */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: easeEditorial, delay: 0.05 }}
          >
            <EyebrowLabel rule tone="inverse">
              AI Personal Styling
            </EyebrowLabel>
          </motion.div>

          {/* Campaign heading — clip-path mask reveal */}
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0, y: 12 }}
            animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: easeEditorial, delay: 0.2 }}
          >
            <EditorialHeading as="h1" size="campaign" tone="inverse" className="mt-5">
              Discover the Colours <Emphasis>Made for You.</Emphasis>
            </EditorialHeading>
          </motion.div>

          {/* Supporting copy */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.55 }}
            className="mt-6 max-w-[38ch] text-lede font-light text-cream-primary/70"
          >
            AI-powered colour analysis. Personalised to your skin tone, undertone,
            and style personality.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeEditorial, delay: 0.75 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link href={ROUTES.upload} className="btn-campaign">
              Analyse My Colours →
            </Link>
            <HashLink
              href={ROUTES.home}
              hash="how-it-works"
              className="eyebrow text-gold-muted transition-colors hover:text-gold-soft"
            >
              See how it works
            </HashLink>
          </motion.div>

          {/* Stat row — bottom-anchored, staggered */}
          <div className="mt-16 flex gap-8 border-t border-gold-hairline pt-8">
            {STATS.map((s, index) => (
              <motion.div
                key={s.value}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: easeEditorial, delay: 0.9 + index * 0.1 }}
              >
                <p className="font-editorial text-h4 font-light text-gold-primary">
                  {s.value}
                </p>
                <p className="eyebrow text-gold-muted">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating score card — right side, desktop only ── */}
      <motion.div
        initial={{ opacity: 0, x: 32 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -8, 0],
        }}
        transition={{
          opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 1.3 },
          x: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 1.3 },
          y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 },
        }}
        className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 rounded-xl border border-gold-hairline bg-surface-3/85 px-5 py-6 backdrop-blur-md will-change-transform lg:right-12 lg:flex"
      >
        <div className="text-center">
          <p className="font-serif text-h4 font-light text-gold-primary">
            98<span className="text-body-sm text-gold-light">%</span>
          </p>
          <p className="text-[9px] uppercase tracking-eyebrow text-gold-muted">
            Match
          </p>
        </div>
        <div className="h-px w-8 bg-gold-primary/35" />
        <div className="text-center">
          <p className="font-serif text-h5 font-light text-gold-primary">Warm</p>
          <p className="text-[9px] uppercase tracking-eyebrow text-gold-muted">
            Undertone
          </p>
        </div>
        <div className="h-px w-8 bg-gold-primary/35" />
        <div className="text-center">
          <p className="font-serif text-h5 font-light text-gold-primary">4</p>
          <p className="text-[9px] uppercase tracking-eyebrow text-gold-muted">
            Archetypes
          </p>
        </div>
      </motion.div>
    </section>
  );
}
