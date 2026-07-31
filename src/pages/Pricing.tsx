import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'wouter';
import { Check, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface Plan {
  name: string;
  title: string;
  tagline: string;
  monthly: number;
  popular?: boolean;
  cta: string;
  features: string[];
  missing: string[];
  included: string[];
}

const PLANS: Plan[] = [
  {
    name: 'Starter',
    title: 'Starter Collection',
    tagline: 'Core colour analysis only.',
    monthly: 0,
    cta: 'Get Started with Starter',
    features: [
      'Colour season analysis',
      'Personal colour palette',
      'Skin undertone report',
      'Colours to avoid',
    ],
    missing: [
      'Full wardrobe report',
      'Palette download',
      'Virtual try-on',
      'AI stylist chat',
    ],
    included: [
      'One analysis on upload',
      'Your colour season and palette',
      'Skin undertone reading',
      'A clear list of colours to avoid',
    ],
  },
  {
    name: 'Essentials',
    title: 'Essentials Collection',
    tagline: 'Your complete colour identity.',
    monthly: 499,
    popular: true,
    cta: 'Get Started with Essentials',
    features: [
      'Everything in Starter',
      'Full wardrobe report',
      'Colour palette download',
      'Best neutrals guide',
      'Analysis history',
    ],
    missing: ['Virtual try-on', 'AI stylist chat'],
    included: [
      'Unlimited re-analysis',
      'Downloadable colour palette',
      'Best neutrals for your season',
      'Wardrobe recommendations',
      'Saved analysis history',
    ],
  },
  {
    name: 'Atelier',
    title: 'Atelier Collection',
    tagline: 'The full atelier experience.',
    monthly: 999,
    cta: 'Get Started with Atelier',
    features: [
      'Everything in Essentials',
      'Virtual try-on',
      'AI stylist chat',
      'Priority updates',
      'Early access to new features',
    ],
    missing: [],
    included: [
      'Unlimited virtual try-on',
      '24/7 AI stylist conversations',
      'Priority support',
      'Early access to every new feature',
      'Personal style archetypes',
    ],
  },
];

const COMPARE: { feature: string; starter: boolean; essentials: boolean; atelier: boolean }[] = [
  { feature: 'Colour season analysis', starter: true, essentials: true, atelier: true },
  { feature: 'Personal colour palette', starter: true, essentials: true, atelier: true },
  { feature: 'Skin undertone report', starter: true, essentials: true, atelier: true },
  { feature: 'Colours to avoid', starter: true, essentials: true, atelier: true },
  { feature: 'Full wardrobe report', starter: false, essentials: true, atelier: true },
  { feature: 'Colour palette download', starter: false, essentials: true, atelier: true },
  { feature: 'Best neutrals guide', starter: false, essentials: true, atelier: true },
  { feature: 'Saved analysis history', starter: false, essentials: true, atelier: true },
  { feature: 'Virtual try-on', starter: false, essentials: false, atelier: true },
  { feature: 'AI stylist chat', starter: false, essentials: false, atelier: true },
  { feature: 'Priority updates', starter: false, essentials: false, atelier: true },
  { feature: 'Early access to new features', starter: false, essentials: false, atelier: true },
];

const faqs = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel directly from your account at any time — no hidden fees, no questions asked.',
  },
  {
    q: 'What happens to my analysis if I cancel?',
    a: 'Your colour identity is yours. Download your palette before you leave and we keep nothing after 30 days.',
  },
  {
    q: 'How accurate is the colour analysis?',
    a: 'The analysis reads your undertone, depth, and contrast from a clear photo in natural light. The more accurate the photo, the more accurate the season.',
  },
  {
    q: 'Does the free plan ever expire?',
    a: 'No. Starter is free forever — your colour analysis and palette stay with you, with no credit card required.',
  },
  {
    q: 'Can I use Atelier as a professional stylist?',
    a: 'Yes. Atelier is built for stylists and power users who want try-on, chat, and early access for their clients.',
  },
];

function formatInr(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

export default function Pricing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [annual, setAnnual] = useState(false);

  return (
    <div className="w-full pt-28 pb-24">
      <div className="mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
            Pricing
          </p>
          <h1 className="mt-3 font-serif text-[length:var(--text-h1)] text-espresso">
            A Collection, Not a Menu.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-[length:var(--text-body)] text-espresso-light">
            Start free. Upgrade when your wardrobe demands it.
          </p>

          {/* Monthly / annual toggle */}
          <div className="mt-10 inline-flex items-center gap-4 rounded-md border border-border bg-cream-dark px-5 py-2.5">
            <span
              className={cn(
                'text-nav transition-colors duration-200 ease-out',
                !annual ? 'text-espresso' : 'text-espresso-muted',
              )}
            >
              Monthly
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={annual}
              onClick={() => setAnnual((value) => !value)}
              className={cn(
                'relative h-6 w-12 rounded-full transition-colors duration-200 ease-out',
                annual ? 'bg-gold-primary' : 'bg-espresso-muted/40',
              )}
            >
              <motion.span
                aria-hidden="true"
                className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
                animate={{ left: annual ? 24 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            </button>
            <span
              className={cn(
                'text-nav transition-colors duration-200 ease-out',
                annual ? 'text-espresso' : 'text-espresso-muted',
              )}
            >
              Annual
              <span className="ml-1 text-gold-primary">Save 2 months</span>
            </span>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
          {PLANS.map((plan) => {
            const annualPayable = plan.monthly === 0 ? 0 : plan.monthly * 10;
            const monthlyEquivalent =
              plan.monthly === 0 ? 0 : Math.floor(annualPayable / 12);
            const savings =
              plan.monthly === 0 ? 0 : plan.monthly * 12 - annualPayable;
            const price = annual ? monthlyEquivalent : plan.monthly;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0, scale: plan.popular ? 1.02 : 1 }}
                transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
                className={cn(
                  'relative flex flex-col rounded-lg p-8',
                  plan.popular
                    ? 'border-2 border-gold-primary bg-white shadow-card'
                    : 'border border-border bg-cream-primary shadow-card',
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-6">
                    <Badge variant="gold" className="uppercase tracking-[var(--tracking-label)]">
                      Most Popular
                    </Badge>
                  </span>
                )}

                <h2 className="font-serif text-[length:var(--text-h3)] text-espresso">
                  {plan.title}
                </h2>
                <p className="mt-1 text-[length:var(--text-body-sm)] text-espresso-light">
                  {plan.tagline}
                </p>

                <div className="mt-8 min-h-[96px]">
                  <div className="flex items-end gap-2">
                    <span className="relative overflow-hidden text-[length:var(--text-h2)] font-light text-espresso">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={annual ? 'annual' : 'monthly'}
                          initial={{ y: 12, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -12, opacity: 0 }}
                          transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
                          className="inline-block"
                        >
                          {plan.monthly === 0 ? 'Free' : formatInr(price)}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    {plan.monthly !== 0 && (
                      <span className="mb-1.5 text-[length:var(--text-body-sm)] text-espresso-muted">
                        /month
                      </span>
                    )}
                  </div>
                  {annual && plan.monthly !== 0 && (
                    <p className="mt-2 text-[length:var(--text-caption)] tabular-nums text-espresso-muted">
                      {formatInr(annualPayable)}/year — {formatInr(monthlyEquivalent)}/month
                      <span className="ml-1 text-gold-primary">
                        · Save {formatInr(savings)}
                      </span>
                    </p>
                  )}
                  {plan.monthly === 0 && (
                    <p className="mt-2 text-[length:var(--text-caption)] text-espresso-muted">
                      Free forever. No credit card required.
                    </p>
                  )}
                </div>

                <Link
                  href={`/signup?plan=${encodeURIComponent(plan.name)}`}
                  className="mt-8"
                >
                  <Button
                    variant={plan.popular ? 'primary' : 'secondary'}
                    size="lg"
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-gold-primary"
                        aria-hidden="true"
                      />
                      <span className="text-[length:var(--text-body-sm)] text-espresso">
                        {feature}
                      </span>
                    </li>
                  ))}
                  {plan.missing.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 opacity-45"
                    >
                      <Minus
                        className="mt-0.5 h-4 w-4 shrink-0 text-espresso-muted"
                        aria-hidden="true"
                      />
                      <span className="text-[length:var(--text-body-sm)] text-espresso-muted">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Feature comparison */}
        <div className="mx-auto mt-16 w-full max-w-4xl">
          <h2 className="text-center font-serif text-[length:var(--text-h3)] text-espresso">
            Compare the Plans
          </h2>
          <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-white shadow-card">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="w-[45%] text-left text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-espresso-muted">
                    Feature
                  </TableHead>
                  {PLANS.map((plan) => (
                    <TableHead
                      key={plan.name}
                      className="text-center text-[length:var(--text-caption)] font-medium uppercase tracking-[var(--tracking-label)] text-espresso"
                    >
                      {plan.title}
                      {plan.popular && (
                        <span className="ml-1 text-gold-primary">· Most Popular</span>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPARE.map((row) => (
                  <TableRow key={row.feature} className="border-border">
                    <TableCell className="text-[length:var(--text-body-sm)] text-espresso">
                      {row.feature}
                    </TableCell>
                    {[row.starter, row.essentials, row.atelier].map(
                      (included, index) => (
                        <TableCell key={index} className="text-center">
                          {included ? (
                            <span className="inline-flex items-center justify-center">
                              <Check
                                className="h-4 w-4 text-gold-primary"
                                aria-hidden="true"
                              />
                              <span className="sr-only">Included</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center">
                              <Minus
                                className="h-4 w-4 text-espresso-muted/50"
                                aria-hidden="true"
                              />
                              <span className="sr-only">Not included</span>
                            </span>
                          )}
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* What's included */}
        <div className="mx-auto mt-16 w-full max-w-3xl">
          <h2 className="text-center font-serif text-[length:var(--text-h3)] text-espresso">
            What&rsquo;s Included in Each Plan
          </h2>
          <Accordion type="single" collapsible className="mt-8 w-full">
            {PLANS.map((plan) => (
              <AccordionItem
                key={plan.name}
                value={plan.name}
                className="border-b border-border"
              >
                <AccordionTrigger className="text-left text-[length:var(--text-body-sm)] font-medium text-espresso">
                  {plan.title}
                  {plan.popular && (
                    <span className="ml-2 text-gold-primary">· Most Popular</span>
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {plan.included.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[length:var(--text-body-sm)] text-espresso-light"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-gold-primary"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-20 w-full max-w-3xl">
          <h2 className="text-center font-serif text-[length:var(--text-h3)] text-espresso">
            Frequently Asked
          </h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-lg border border-border bg-white p-6 shadow-card"
              >
                <h3 className="font-serif text-[length:var(--text-h5)] text-espresso">
                  {faq.q}
                </h3>
                <p className="mt-2 text-[length:var(--text-body-sm)] text-espresso-light">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 rounded-lg bg-espresso px-8 py-12 text-center">
          <h2 className="font-serif text-[length:var(--text-h3)] text-cream-primary">
            Start free. No credit card.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[length:var(--text-body)] text-cream-primary/80">
            Your colour analysis is free forever. Upgrade only when you&rsquo;re
            ready.
          </p>
          <Link href="/signup?plan=Starter" className="mt-8 inline-block">
            <Button size="lg">Get Started Free</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
