import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';
import Container from '@/components/Container';

const stats = [
  {
    value: 50000,
    suffix: '+',
    label: 'colour profiles created',
  },
  {
    value: 4.9,
    suffix: '/5',
    label: 'average satisfaction',
  },
  {
    value: 12,
    suffix: '',
    label: 'colour seasons covered',
  },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const duration = 1000;
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

  return (
    <span ref={ref}>
      {formatted}
      {suffix && <span className="align-super text-5xl">{suffix}</span>}
    </span>
  );
}

const testimonials = [
  {
    name: 'Meera K.',
    season: 'Warm Autumn',
    quote:
      'I always suspected certain colours washed me out, but nobody could explain why. This finally gave me the vocabulary.',
  },
  {
    name: 'Aarav S.',
    season: 'True Summer',
    quote:
      'The undertone analysis explained things I have felt about my own skin for years. It felt personal, not generic.',
  },
  {
    name: 'Priya R.',
    season: 'Deep Winter',
    quote:
      'I stopped buying clothes that never quite worked. My wardrobe finally feels like it belongs to one person.',
  },
];

export default function SocialProof() {
  return (
    <section className="py-30">
      <Container>
        <div className="grid grid-cols-1 gap-24 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
            className="space-y-6"
          >
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="rounded-lg border border-border bg-white p-8 shadow-card transition-shadow duration-200 ease-out hover:shadow-card-hover"
              >
                <div
                  className="flex items-center gap-1"
                  role="img"
                  aria-label="5 out of 5 stars"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-gold-primary text-gold-primary"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="mt-4 font-sans text-body italic leading-[1.65] text-espresso-light">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="text-body-sm font-semibold text-espresso">
                    {testimonial.name}
                  </span>
                  <span className="inline-flex items-center rounded-sm bg-gold-primary px-1.5 py-0.5 text-micro font-semibold uppercase tracking-label text-espresso">
                    Verified
                  </span>
                  <span className="text-caption text-gold-primary">
                    {testimonial.season}
                  </span>
                </figcaption>
              </figure>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
            className="flex flex-col justify-center space-y-16"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-7xl font-light text-gold-primary">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-body-sm text-espresso-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
