import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'wouter';
import PageMasthead from '@/components/editorial/PageMasthead';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import CampaignSection from '@/components/editorial/CampaignSection';
import { CAMPAIGN } from '@/lib/editorial-images';
import { ROUTES } from '@/config/navigation';
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
  const [annual, setAnnual] = useState(false);

  return (
    <div className="w-full pt-28 pb-24">
      <EditorialContainer width="content">
        <PageMasthead
          label="Pricing"
          title={
            <>
              A Collection, Not <Emphasis>a Menu.</Emphasis>
            </>
          }
          lede="Start free. Upgrade when your wardrobe demands it."
          aside={
            <div className="inline-flex items-center gap-4 rounded-md border border-border bg-surface-3 px-5 py-2.5">
              <span
                className={cn(
                  'text-nav transition-colors duration-200 ease-out',
                  !annual ? 'text-cream-primary' : 'text-cream-primary/55',
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
                  annual ? 'bg-gold-primary' : 'bg-surface-4',
                )}
              >
                <motion.span
                  aria-hidden="true"
                  className="absolute left-1 top-1 h-4 w-4 rounded-full bg-gold-light shadow-sm will-change-transform"
                  animate={{ x: annual ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              </button>
              <span
                className={cn(
                  'text-nav transition-colors duration-200 ease-out',
                  annual ? 'text-cream-primary' : 'text-cream-primary/55',
                )}
              >
                Annual
                <span className="ml-1 text-gold-primary">Save 2 months</span>
              </span>
            </div>
          }
          className="pb-0"
        />

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
                  'relative flex flex-col p-8',
                  plan.popular
                    ? 'border border-gold-primary/50 bg-surface-4 text-cream-primary'
                    : 'border border-gold-hairline bg-surface-3 text-cream-primary transition-colors duration-300 hover:border-gold-border',
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-6">
                    <Badge variant="gold" className="uppercase tracking-[var(--tracking-label)]">
                      Most Popular
                    </Badge>
                  </span>
                )}

                <h2 className={cn('font-serif text-[length:var(--text-h3)]', plan.popular ? 'text-cream-primary' : 'text-cream-primary')}>
                  {plan.title}
                </h2>
                <p className={cn('mt-1 text-[length:var(--text-body-sm)]', plan.popular ? 'text-cream-primary/70' : 'text-cream-primary/80')}>
                  {plan.tagline}
                </p>

                <div className="mt-8 min-h-[6rem]">
                  <div className="flex items-end gap-2">
                    <span className={cn('relative overflow-hidden text-[length:var(--text-h2)] font-light', plan.popular ? 'text-cream-primary' : 'text-cream-primary')}>
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
                      <span className={cn('mb-1.5 text-[length:var(--text-body-sm)]', plan.popular ? 'text-cream-primary/60' : 'text-cream-primary/55')}>
                        /month
                      </span>
                    )}
                  </div>
                  {annual && plan.monthly !== 0 && (
                    <p className={cn('mt-2 text-[length:var(--text-caption)] tabular-nums', plan.popular ? 'text-cream-primary/60' : 'text-cream-primary/55')}>
                      {formatInr(annualPayable)}/year — {formatInr(monthlyEquivalent)}/month
                      <span className="ml-1 text-gold-primary">
                        · Save {formatInr(savings)}
                      </span>
                    </p>
                  )}
                  {plan.monthly === 0 && (
                    <p className={cn('mt-2 text-[length:var(--text-caption)]', plan.popular ? 'text-cream-primary/60' : 'text-cream-primary/55')}>
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
                        className={cn('mt-0.5 h-4 w-4 shrink-0', plan.popular ? 'text-gold-light' : 'text-gold-primary')}
                        aria-hidden="true"
                      />
                      <span className={cn('text-[length:var(--text-body-sm)]', plan.popular ? 'text-cream-primary/85' : 'text-cream-primary')}>
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
                        className={cn('mt-0.5 h-4 w-4 shrink-0', plan.popular ? 'text-cream-primary/60' : 'text-cream-primary/55')}
                        aria-hidden="true"
                      />
                      <span className={cn('text-[length:var(--text-body-sm)]', plan.popular ? 'text-cream-primary/60' : 'text-cream-primary/55')}>
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
          <div className="flex flex-col items-center text-center">
            <EyebrowLabel rule tone="gold">At a Glance</EyebrowLabel>
            <EditorialHeading as="h2" size="lg" className="mt-4">
              Compare the <Emphasis>Plans</Emphasis>
            </EditorialHeading>
          </div>
          <div className="mt-8 overflow-x-auto border border-gold-hairline bg-surface-3">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="w-[45%] text-left text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-cream-primary/55">
                    Feature
                  </TableHead>
                  {PLANS.map((plan) => (
                    <TableHead
                      key={plan.name}
                      className="text-center text-[length:var(--text-caption)] font-medium uppercase tracking-[var(--tracking-label)] text-cream-primary"
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
                    <TableCell className="text-[length:var(--text-body-sm)] text-cream-primary">
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
                                className="h-4 w-4 text-cream-primary/40"
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
          <div className="flex flex-col items-center text-center">
            <EyebrowLabel rule tone="gold">The Fine Print</EyebrowLabel>
            <EditorialHeading as="h2" size="lg" className="mt-4">
              What&rsquo;s Included in <Emphasis>Each Plan</Emphasis>
            </EditorialHeading>
          </div>
          <Accordion type="single" collapsible className="mt-8 w-full">
            {PLANS.map((plan) => (
              <AccordionItem
                key={plan.name}
                value={plan.name}
                className="border-b border-gold-hairline"
              >
                <AccordionTrigger className="text-left text-[length:var(--text-body-sm)] font-medium text-cream-primary">
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
                        className="flex items-start gap-3 text-[length:var(--text-body-sm)] text-cream-primary/80"
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
          <div className="flex flex-col items-center text-center">
            <EyebrowLabel rule tone="gold">Questions</EyebrowLabel>
            <EditorialHeading as="h2" size="lg" className="mt-4">
              Frequently <Emphasis>Asked</Emphasis>
            </EditorialHeading>
          </div>
          <div className="mt-10">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b border-gold-hairline py-6">
                <h3 className="font-editorial text-h5 font-light text-cream-primary">
                  {faq.q}
                </h3>
                <p className="mt-2 text-body-sm text-cream-primary/80">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20">
          <CampaignSection
            src={CAMPAIGN.atelier.base}
            alt={CAMPAIGN.atelier.alt}
            position={CAMPAIGN.atelier.position}
            anchor="center"
            scrim="soft"
            height="mid"
            contentClassName="text-center"
          >
            <EditorialHeading as="h2" size="lg" tone="inverse">
              Start free. <Emphasis>No credit card.</Emphasis>
            </EditorialHeading>
            <p className="mx-auto mt-3 max-w-md text-body text-cream-primary/80">
              Your colour analysis is free forever. Upgrade only when you&rsquo;re
              ready.
            </p>
            <Link
              href={`${ROUTES.signup}?plan=Starter`}
              className="btn-campaign mt-8 inline-block"
            >
              Get Started Free →
            </Link>
          </CampaignSection>
        </div>
      </EditorialContainer>
    </div>
  );
}
