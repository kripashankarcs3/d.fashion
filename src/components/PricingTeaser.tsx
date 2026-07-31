import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    note: 'Core colour analysis',
  },
  {
    name: 'Essentials',
    price: '₹499/month',
    note: 'Full report + palette download',
    featured: true,
  },
  {
    name: 'Atelier',
    price: '₹999/month',
    note: 'Try-on, stylist chat, priority',
  },
];

export default function PricingTeaser() {
  return (
    <section className="bg-cream-dark py-30">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
          className="text-center"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
            Pricing
          </p>
          <h2 className="mt-4 font-serif text-[length:var(--text-h2)] text-espresso">
            Choose how deep you go.
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0, 0, 0.2, 1] }}
              className={`rounded-lg bg-white p-8 text-center shadow-card transition-shadow duration-200 ease-out hover:shadow-card-hover ${
                plan.featured ? 'border-2 border-gold-primary' : 'border border-border'
              }`}
            >
              {plan.featured && (
                <span className="inline-flex items-center rounded-sm bg-gold-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-espresso">
                  Most Popular
                </span>
              )}
              <p className="mt-4 font-serif text-[length:var(--text-h4)] text-espresso">
                {plan.name}
              </p>
              <p className="mt-3 text-[length:var(--text-h3)] font-light text-espresso">
                {plan.price}
              </p>
              <p className="mt-2 text-[length:var(--text-body-sm)] text-espresso-light">
                {plan.note}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/pricing">
            <Button variant="secondary" size="lg">
              Compare plans
              <ArrowRight aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
