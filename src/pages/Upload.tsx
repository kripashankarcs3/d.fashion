import { motion } from 'framer-motion';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import Reveal from '@/components/editorial/Reveal';
import UploadFlow from '@/components/UploadFlow';
import { ShieldCheck, Clock, Zap } from 'lucide-react';

// Pexels — dark editorial portrait, woman in warm lighting, unique to this page
const HERO_IMG = 'https://images.pexels.com/photos/3756345/pexels-photo-3756345.jpeg?auto=compress&cs=tinysrgb&w=1400';

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
      <section className="relative isolate overflow-hidden min-h-[min(80svh,48rem)] flex items-end bg-[#070707]">
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <img
            src={HERO_IMG}
            alt="Woman in warm natural light — colour analysis"
            className="h-full w-full object-cover object-center"
            style={{ filter: 'brightness(0.55) contrast(1.1) saturate(0.85)' }}
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
                initial={{ clipPath: 'inset(0 0 100% 0)', y: 8 }}
                animate={{ clipPath: 'inset(0 0 0% 0)', y: 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                className="mt-5 will-change-[clip-path]"
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
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <div className="border-b border-gold-hairline bg-surface-2">
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
