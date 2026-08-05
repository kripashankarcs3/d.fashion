import { motion } from 'framer-motion';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import Reveal from '@/components/editorial/Reveal';
import { CountUp } from '@/components/ui/count-up';

const stats = [
  {
    prefix: '₹',
    value: 11000,
    suffix: '',
    label: 'average wasted per year on clothes worn fewer than 3 times',
  },
  {
    prefix: '',
    value: 33,
    suffix: '%',
    label: 'of the average wardrobe is never worn after purchase',
  },
  {
    prefix: '',
    value: 18,
    suffix: ' min',
    label: 'lost each morning deciding what to wear',
  },
];

export default function ProblemSection() {
  return (
    <section className="bg-surface-1 py-section-xl">
      <EditorialContainer>
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-12">
          {/* ── Left column: editorial statement ───────────────────── */}
          <div className="lg:w-[45%]">
            <Reveal variant="rise">
              <EyebrowLabel rule tone="gold" as="p" className="mb-6">
                The Problem
              </EyebrowLabel>
              <EditorialHeading as="h2" size="lg" className="mb-8">
                You've bought clothes that looked{' '}
                <Emphasis>wrong on you</Emphasis> — and couldn't say why.
              </EditorialHeading>
              <p className="text-body-sm leading-relaxed text-cream-primary/70">
                Most people choose clothes by what catches the eye. But colours interact with your
                skin, hair, and eyes. When the combination is wrong, even expensive clothes look
                off.
              </p>
            </Reveal>
          </div>

          {/* ── Right column: stat cards ────────────────────────────── */}
          <div className="lg:w-[55%]">
            <div className="flex flex-col divide-y divide-gold-hairline border-t border-gold-hairline">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.14,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="py-8"
                >
                  <p className="font-editorial text-h1 text-gold-primary leading-none">
                    <CountUp
                      target={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </p>
                  <p className="mt-2 text-body-sm text-cream-primary/70">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Citation */}
            <p className="mt-4 text-caption text-cream-primary/35">
              Sources: ThredUp Resale Report, ONS Time Use Survey
            </p>
          </div>
        </div>
      </EditorialContainer>
    </section>
  );
}
