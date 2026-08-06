import { motion } from 'framer-motion';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import Reveal from '@/components/editorial/Reveal';
import UploadFlow from '@/components/UploadFlow';
import { ShieldCheck, Clock, Zap } from 'lucide-react';

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

      {/* ── Hero masthead ── */}
      <header className="relative overflow-hidden bg-surface-0 pb-16 pt-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 55% 45% at 50% 100%, rgba(243,226,179,0.07) 0%, transparent 70%)',
          }}
        />
        <EditorialContainer width="narrow">
          <Reveal variant="fade">
            <EyebrowLabel tone="gold" rule>Colour Analysis</EyebrowLabel>
          </Reveal>
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)', y: 8 }}
            animate={{ clipPath: 'inset(0 0 0% 0)', y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="mt-5 will-change-[clip-path]"
          >
            <EditorialHeading as="h1" size="xl">
              Upload your photo <Emphasis>to begin.</Emphasis>
            </EditorialHeading>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-5 max-w-[44ch] text-lede text-cream-primary/65"
          >
            One clear photo in natural light. Your colour season, palette, and
            style profile — ready in under three minutes.
          </motion.p>

          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="mt-10 h-px origin-left bg-gradient-to-r from-gold-primary via-gold-light/50 to-transparent"
          />
        </EditorialContainer>
      </header>

      {/* ── Trust strip ── */}
      <div className="border-b border-gold-hairline bg-surface-2">
        <EditorialContainer width="narrow">
          <div className="grid grid-cols-1 gap-0 divide-y divide-gold-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {TRUST_ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
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
