import { motion } from 'framer-motion';
import { Link } from 'wouter';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    note: 'Core colour analysis',
    features: ['1 colour analysis', 'Basic palette view', 'Season identification'],
    featured: false,
    cta: 'Start Free',
    href: '/upload',
  },
  {
    name: 'Essentials',
    price: '₹499',
    period: '/month',
    note: 'Most popular',
    features: ['Full colour report', 'Palette download', 'Makeup shade guide', 'Hair colour options'],
    featured: true,
    cta: 'Get Essentials',
    href: '/pricing',
  },
  {
    name: 'Atelier',
    price: '₹999',
    period: '/month',
    note: 'The complete experience',
    features: ['Everything in Essentials', 'Virtual Try-On', 'AI Stylist Chat', 'Priority support'],
    featured: false,
    cta: 'Go Atelier',
    href: '/pricing',
  },
];

export default function PricingTeaser() {
  return (
    <section className="relative bg-surface-1 py-section-xl">
      <EditorialContainer>
        {/* Header — left-aligned, editorial */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0, 0, 0.2, 1] }}
          className="max-w-2xl"
        >
          <EyebrowLabel rule tone="gold">Pricing</EyebrowLabel>
          <EditorialHeading as="h2" size="lg" className="mt-5 text-cream-primary">
            Choose how deep <Emphasis>you go.</Emphasis>
          </EditorialHeading>
          <p className="mt-5 max-w-md text-lede font-light text-cream-primary/60">
            Start for free. Upgrade when you are ready for more.
          </p>
        </motion.div>

        {/* Plans grid */}
        <div className="mt-20 grid grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0, 0, 0.2, 1] }}
              className={`relative flex flex-col rounded-sm p-8 ${
                plan.featured
                  ? 'border border-gold-primary bg-gold-primary text-surface-1 md:-my-3'
                  : 'border border-gold-hairline bg-surface-3 text-cream-primary'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-2.5 left-8">
                  <span className="rounded-sm bg-surface-1 px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-gold-primary">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className={`text-[0.6875rem] font-semibold uppercase tracking-[0.16em] ${plan.featured ? 'text-surface-2' : 'text-gold-light'}`}>
                  {plan.note}
                </p>
                <h3 className={`mt-2 font-serif text-h4 ${plan.featured ? 'text-surface-1' : 'text-cream-primary'}`}>
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className={`font-serif text-[2.5rem] font-light leading-none ${plan.featured ? 'text-surface-1' : 'text-cream-primary'}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-body-sm ${plan.featured ? 'text-surface-1/60' : 'text-cream-primary/55'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.featured ? 'text-surface-1' : 'text-gold-primary'}`} aria-hidden />
                    <span className={`text-body-sm ${plan.featured ? 'text-surface-1/80' : 'text-cream-primary/80'}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`inline-flex min-h-10 w-full items-center justify-center rounded-sm text-body-sm font-semibold tracking-button transition-all duration-200 ${
                  plan.featured
                    ? 'bg-surface-1 text-gold-primary hover:bg-surface-2'
                    : 'border border-gold-border bg-transparent text-cream-primary hover:border-gold-primary hover:bg-gold-primary/10'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center text-caption text-cream-primary/45"
        >
          No credit card required for the free plan. Cancel anytime.
        </motion.p>
      </EditorialContainer>
    </section>
  );
}
