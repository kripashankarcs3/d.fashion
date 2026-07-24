import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Check, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

const tiers = [
  {
    name: 'Style Explorer',
    monthly: '0',
    annual: '0',
    description: 'For those just beginning to digitize their wardrobe.',
    cta: 'Start Free',
    ctaVariant: 'secondary',
    features: [
      '10 items upload per month',
      'Basic AI style analysis',
      '1 monthly style report',
      'Standard community support',
      'Mobile app access',
    ],
    missing: ['Virtual Try-On', 'AI Stylist Chat', 'Unlimited uploads', 'PDF export'],
  },
  {
    name: 'Style Curator',
    monthly: '19',
    annual: '15',
    description: 'The complete digital atelier experience.',
    popular: true,
    cta: 'Start 14-Day Trial',
    ctaVariant: 'primary',
    features: [
      'Unlimited wardrobe uploads',
      'Full Virtual Try-On access',
      'Weekly intelligence reports',
      '24/7 AI Stylist Chat',
      'Color palette extraction',
      'PDF report export',
      'Priority support',
      'Mobile & desktop apps',
    ],
    missing: ['Multiple profiles', 'Early model access', 'API access'],
  },
  {
    name: 'Style Director',
    monthly: '49',
    annual: '39',
    description: 'For professionals, stylists, and power users.',
    cta: 'Get Director Access',
    ctaVariant: 'dark',
    features: [
      'Everything in Curator',
      'Up to 5 separate profiles',
      'High-res PDF export',
      'Early access to new AI models',
      'REST API access',
      'White-label reports',
      'Dedicated account manager',
      'Custom integrations',
    ],
    missing: [],
  },
];

const faqs = [
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel directly from your account settings at any time — no hidden fees, no questions asked.' },
  { q: 'What happens to my data if I cancel?', a: 'Your wardrobe data is yours. You can export everything before cancelling and we delete it within 30 days after.' },
  { q: 'How accurate is the Virtual Try-On?', a: 'Our neural rendering achieves 92%+ accuracy on fit prediction for standard body types, based on internal benchmarks.' },
  { q: 'Does the free plan expire?', a: 'No. Style Explorer is free forever. You get 10 uploads per month indefinitely with no credit card required.' },
  { q: 'Can I use DeeStyle as a professional stylist?', a: 'Yes! Style Director supports up to 5 client profiles. We\'re also building agency plans — contact us for early access.' },
];

export default function Pricing() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [annual, setAnnual] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="w-full overflow-hidden">
      {/* Hero */}
      <section className="pt-40 pb-16 bg-background relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-primary/8 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-tight mb-6">
              Invest In Your <br /><span className="italic text-gradient-gold">Aesthetic</span>
            </h1>
            <p className="text-xl text-muted-foreground font-accent max-w-2xl mx-auto mb-10">
              Start free. Upgrade when your wardrobe demands it.
            </p>

            {/* Annual / Monthly toggle */}
            <div className="inline-flex items-center gap-4 glass-panel px-5 py-3 rounded-full">
              <span className={`text-sm font-accent font-medium transition-colors ${!annual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-primary' : 'bg-border'}`}
              >
                <motion.div
                  animate={{ x: annual ? 24 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
              <span className={`text-sm font-accent font-medium transition-colors ${annual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Annual <span className="text-primary font-bold">Save 20%</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {tiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl p-8 border transition-all ${
                  tier.popular
                    ? 'border-primary shadow-2xl shadow-primary/10 bg-white scale-105'
                    : 'glass-panel border-border hover:border-primary/30 hover:shadow-lg'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-bold font-accent px-4 py-1.5 rounded-full tracking-widest shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-serif text-xl mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground font-accent text-sm">{tier.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span className="font-serif text-5xl">${annual ? tier.annual : tier.monthly}</span>
                    <span className="text-muted-foreground font-accent text-sm mb-2">/month</span>
                  </div>
                  {annual && tier.monthly !== '0' && (
                    <p className="text-xs text-muted-foreground font-accent mt-1">Billed annually (${parseInt(tier.annual) * 12}/yr)</p>
                  )}
                </div>

                <Link href="/upload">
                  <button className={`w-full py-3 rounded-xl font-accent font-medium text-sm transition-all mb-8 ${
                    tier.ctaVariant === 'primary'
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
                      : tier.ctaVariant === 'dark'
                      ? 'bg-foreground text-background hover:bg-foreground/90'
                      : 'border border-border hover:border-primary/50 hover:bg-secondary text-foreground'
                  }`}>
                    {tier.cta}
                  </button>
                </Link>

                <div className="space-y-3">
                  {tier.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-accent text-foreground">{f}</span>
                    </div>
                  ))}
                  {tier.missing.map((f, j) => (
                    <div key={j} className="flex items-start gap-3 opacity-40">
                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-3 h-0.5 bg-muted-foreground rounded" />
                      </div>
                      <span className="text-sm font-accent text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-muted-foreground font-accent text-sm mt-10">
            All plans include 14-day free trial. No credit card required for Explorer.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-secondary/30 border-t border-border">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-10">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-serif">Frequently Asked</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="glass-panel rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-serif text-lg">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: expandedFaq === i ? 45 : 0 }}
                    className="text-primary text-2xl leading-none flex-shrink-0 font-light"
                  >+</motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: expandedFaq === i ? 'auto' : 0, opacity: expandedFaq === i ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-muted-foreground font-accent text-sm leading-relaxed">{faq.a}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[#1A1209] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Sparkles className="w-10 h-10 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Start free. No credit card.</h2>
          <p className="text-white/60 font-accent mb-8">10 uploads per month, forever. Upgrade only when you're ready.</p>
          <Link href="/upload" className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-accent font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
