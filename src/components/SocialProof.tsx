import { useEffect, useRef, useState } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Star } from 'lucide-react';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';

const stats = [
  { value: 50000, suffix: '+', label: 'Colour profiles created' },
  { value: 4.9, suffix: '/5', label: 'Average satisfaction' },
  { value: 12, suffix: '', label: 'Colour seasons covered' },
];

const starStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const starVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  const formatted = Number.isInteger(target)
    ? Math.round(value).toLocaleString('en-IN')
    : (Math.round(value * 10) / 10).toString();

  return <span ref={ref}>{formatted}{suffix && <span className="text-gold-primary">{suffix}</span>}</span>;
}

const testimonials = [
  {
    name: 'Meera K.',
    season: 'Warm Autumn',
    quote: 'I always suspected certain colours washed me out, but nobody could explain why. This finally gave me the vocabulary.',
    avatar: 'MK',
  },
  {
    name: 'Aarav S.',
    season: 'True Summer',
    quote: 'The undertone analysis explained things I have felt about my own skin for years. It felt personal, not generic.',
    avatar: 'AS',
  },
  {
    name: 'Priya R.',
    season: 'Deep Winter',
    quote: 'I stopped buying clothes that never quite worked. My wardrobe finally feels like it belongs to one person.',
    avatar: 'PR',
  },
];

export default function SocialProof() {
  return (
    <section className="relative bg-surface-2 py-section-xl">
      <EditorialContainer>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0, 0, 0.2, 1] }}
          className="mb-16 text-center"
        >
          <EyebrowLabel rule tone="gold" className="justify-center">
            Social Proof
          </EyebrowLabel>
          <EditorialHeading as="h2" size="lg" className="mt-5 text-cream-primary">
            Trusted by thousands.
          </EditorialHeading>
        </motion.div>

        {/* Stats row — unified rule, no card wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0, 0, 0.2, 1] }}
          className="grid grid-cols-3 border-t border-gold-hairline"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="px-4 py-10 text-center"
            >
              <p className="font-serif text-[3rem] font-light leading-none text-cream-primary">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-caption uppercase tracking-label text-gold-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6, borderColor: 'rgba(201, 168, 76, 0.35)' }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-sm border border-gold-hairline bg-surface-3 p-7"
            >
              {/* Stars — staggered entrance */}
              <motion.div
                variants={starStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                className="flex gap-0.5"
                role="img"
                aria-label="5 out of 5 stars"
              >
                {Array.from({ length: 5 }).map((_, j) => (
                  <motion.span key={j} variants={starVariants}>
                    <Star className="h-3.5 w-3.5 fill-gold-primary text-gold-primary" aria-hidden />
                  </motion.span>
                ))}
              </motion.div>

              {/* Quote */}
              <blockquote className="mt-4 text-body-sm leading-relaxed italic text-cream-primary/72 font-light">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-5 font-serif text-body-sm font-medium text-cream-primary">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-body-sm font-semibold text-cream-primary">{t.name}</p>
                  <p className="text-caption text-gold-primary/80">{t.season}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </EditorialContainer>
    </section>
  );
}
