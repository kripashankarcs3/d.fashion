import { motion } from 'framer-motion';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import Reveal from '@/components/editorial/Reveal';
import UploadFlow from '@/components/UploadFlow';
import { ShieldCheck, Clock, Zap } from 'lucide-react';

// Local campaign image — AI-generated Indian woman portrait
const HERO_IMG = '/images/campaign/model ok.png';

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Original deleted instantly',
    body: 'Your photo is used once for analysis, then permanently removed.',
  },
  {
    icon: Clock,
    title: 'Enhanced copy removed in 2 hrs',
    body: 'The processed version disappears automatically — no manual action needed.',
  },
  {
    icon: Zap,
    title: 'Results in under 3 minutes',
    body: 'AI reads undertone, depth, and contrast. Your palette is ready immediately.',
  },
];

export default function Upload() {
  return (
    <div className="w-full min-h-[100svh] bg-surface-1">

      {/* ── Hero — full-bleed dark portrait ── */}
      <section className="relative isolate overflow-hidden min-h-[min(95svh,56rem)] flex items-start bg-[#070707]">
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <img
            src={HERO_IMG}
            alt="Woman in warm natural light — colour analysis"
            className="h-full w-full object-contain"
            style={{
              filter: 'brightness(0.6) contrast(1.1) saturate(0.9)',
              transform: 'translate(6%, 10%)',
            }}
          />
          {/* Left scrim so text is readable */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(7,7,7,0.92) 0%, rgba(7,7,7,0.72) 30%, rgba(7,7,7,0.3) 60%, transparent 85%)',
            }}
          />
          {/* Bottom fade into page */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(7,7,7,0.85) 0%, transparent 40%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative w-full px-[var(--gutter)] pb-16 pt-32">
          <div className="mx-auto w-full max-w-container-editorial">
            <div className="max-w-[40rem]">
              <Reveal variant="fade">
                <EyebrowLabel tone="gold" rule>Colour Analysis</EyebrowLabel>
              </Reveal>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                className="mt-5"
              >
                <EditorialHeading
                  as="h1"
                  size="xl"
                  className="text-cream-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                >
                  Upload your photo <Emphasis>to begin.</Emphasis>
                </EditorialHeading>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-5 max-w-[44ch] text-lede font-light text-cream-primary/80"
              >
                One clear photo in natural light. Your colour season, palette, and
                style profile — ready in under three minutes.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.75 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                {['< 3 min results', 'Photo deleted instantly', 'AI-powered analysis'].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-sm border border-gold-hairline bg-surface-0/75 px-3 py-1 eyebrow-micro text-gold-primary backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              {/* Stats row — bottom-anchored */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.95 }}
                className="mt-14 flex gap-10 border-t border-gold-hairline pt-8"
              >
                {[
                  { v: '12', l: 'Colour Seasons' },
                  { v: '98%', l: 'Match Accuracy' },
                  { v: '<30s', l: 'Avg. Analysis' },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="font-editorial text-h4 font-light text-gold-primary">{s.v}</p>
                    <p className="eyebrow text-gold-muted">{s.l}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── Floating palette card — right side, desktop only ── */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 1.2 },
            x: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 1.2 },
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 },
          }}
          className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 rounded-xl border border-gold-hairline bg-surface-3/85 px-6 py-6 backdrop-blur-md will-change-transform lg:right-16 lg:flex"
        >
          <div className="text-center">
            <p className="font-serif text-h5 font-light text-gold-primary">Warm Autumn</p>
            <p className="text-[0.5625rem] uppercase tracking-eyebrow text-gold-muted">
              Your Season
            </p>
          </div>
          <div className="h-px w-8 bg-gold-primary/35" />
          <div className="flex flex-wrap justify-center gap-1.5" aria-hidden="true">
            {['#C19A6B', '#B7410E', '#C7953A', '#D2A679', '#32311E'].map((hex) => (
              <span
                key={hex}
                className="h-5 w-5 rounded-full border border-gold-hairline"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
          <div className="text-center">
            <p className="font-serif text-h5 font-light text-gold-primary">98%</p>
            <p className="text-[0.5625rem] uppercase tracking-eyebrow text-gold-muted">
              Match
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Trust strip — with hero image as faded background ── */}
      <div className="relative border-b border-gold-hairline overflow-hidden">
        {/* Faded background image continuation */}
        <div className="absolute inset-0 -z-10">
          <img
            src={HERO_IMG}
            alt=""
            aria-hidden
            className="h-full w-full object-cover object-[center_60%]"
            style={{ filter: 'brightness(0.25) contrast(1.1) saturate(0.7)' }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: 'rgba(7,7,7,0.55)' }}
          />
        </div>
        <EditorialContainer width="narrow">
          <div className="grid grid-cols-1 gap-0 divide-y divide-gold-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {TRUST_ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4 px-6 py-7 first:pl-0 last:pr-0"
              >
                <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold-primary" aria-hidden="true" />
                <div>
                  <p className="eyebrow text-cream-primary/80">{item.title}</p>
                  <p className="mt-1 text-body-sm text-cream-primary/50 leading-relaxed">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </EditorialContainer>
      </div>

      {/* ── Upload form ── */}
      <section className="py-section-xl">
        <EditorialContainer width="narrow">
          <UploadFlow />
        </EditorialContainer>
      </section>

    </div>
  );
}
