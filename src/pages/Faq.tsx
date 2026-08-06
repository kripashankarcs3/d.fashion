import { Link } from 'wouter';
import { motion } from 'framer-motion';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import Reveal from '@/components/editorial/Reveal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ROUTES } from '@/config/navigation';

const ANALYSIS_FAQS = [
  {
    question: 'How does the colour analysis work?',
    answer:
      'You upload a clear photo taken in natural light. Our model reads your skin undertone, depth, and contrast, then places you in one of the twelve colour seasons and builds a palette around it. The whole analysis takes under a minute.',
  },
  {
    question: 'What kind of photo should I upload?',
    answer:
      'A front-facing photo in soft natural light, no filters, no heavy makeup, with your face clearly visible. Avoid harsh shadows and strong artificial light — the model needs to read your natural skin tone.',
  },
  {
    question: 'What is a colour season?',
    answer:
      'A colour season is a classification of the palette that harmonises most with your natural colouring — your skin, hair, and eyes. D\u2019Fashion works with the full twelve-season system, from Light Spring to Bright Winter.',
  },
  {
    question: 'What is my season confidence score?',
    answer:
      'It reflects how clearly your undertone could be read. A high score means the warm/cool signal was decisive; a lower score simply means you sit closer to neutral, so muted, blended colours tend to suit you best.',
  },
  {
    question: 'Is colour analysis medically accurate?',
    answer:
      'No — it is a styling tool, not a medical or dermatological assessment. It reads colour relationships the way a personal stylist would, and it is very good at that. For skin health concerns, consult a professional.',
  },
];

const ACCOUNT_FAQS = [
  {
    question: 'What happens to my photo?',
    answer:
      'Your original upload is used once and deleted immediately. The enhanced copy used to build your report is removed automatically within two hours. We never share your photos publicly. See the privacy policy for full details.',
  },
  {
    question: 'Can I retake the analysis?',
    answer:
      'Yes. Run a new analysis any time — lighting, season, and even changes in your natural colouring can shift the result. Every run is stored in your dashboard so you can compare.',
  },
  {
    question: 'How do refunds work?',
    answer:
      'If a one-time purchase fails to deliver an analysis we refund it in full. Subscriptions can be cancelled before the next billing cycle. See the terms of service for details.',
  },
  {
    question: 'How can I delete my data?',
    answer:
      'Saved reports can be removed from your dashboard at any time. For anything else, contact us and we will delete or export your data on request.',
  },
];

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [...ANALYSIS_FAQS, ...ACCOUNT_FAQS].map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

export default function Faq() {
  return (
    <div className="w-full bg-surface-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

      {/* ── Hero masthead ── */}
      <header className="relative overflow-hidden bg-surface-0 pb-16 pt-28">
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(243,226,179,0.06) 0%, transparent 70%)',
          }}
        />
        <EditorialContainer>
          <Reveal variant="fade">
            <EyebrowLabel tone="gold" rule>Support</EyebrowLabel>
          </Reveal>
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)', y: 8 }}
            animate={{ clipPath: 'inset(0 0 0% 0)', y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="mt-5 will-change-[clip-path]"
          >
            <EditorialHeading as="h1" size="xl">
              Common Questions, <Emphasis>Honest Answers.</Emphasis>
            </EditorialHeading>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-5 max-w-[44ch] text-lede text-cream-primary/65"
          >
            Straight answers about analysis, privacy, and your report.
          </motion.p>

          {/* Gold gradient rule */}
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="mt-10 h-px origin-left bg-gradient-to-r from-gold-primary via-gold-light/50 to-transparent"
          />
        </EditorialContainer>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="py-section-xl bg-surface-1"
      >
        <EditorialContainer width="content">
          <Reveal variant="fade">
            <EyebrowLabel tone="gold" rule>About the Analysis</EyebrowLabel>
          </Reveal>
          <div className="mt-8">
            <Accordion type="single" collapsible className="w-full">
              {ANALYSIS_FAQS.map(({ question, answer }, index) => (
                <AccordionItem
                  key={question}
                  value={`analysis-${index}`}
                  className="border-gold-hairline"
                >
                  <AccordionTrigger className="text-left font-serif text-h5 font-light text-cream-primary hover:no-underline hover:text-gold-primary [&>svg]:text-gold-primary">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="text-body leading-[1.7] text-cream-primary/70">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </EditorialContainer>
      </motion.section>

      {/* ── Pull quote strip ── */}
      <div className="border-y border-gold-hairline bg-surface-2 py-14">
        <EditorialContainer>
          <motion.blockquote
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="font-editorial text-h3 font-light italic leading-snug text-cream-primary/80">
              &ldquo;The analysis reads what a trained stylist would read —
              your undertone, your depth, your contrast.&rdquo;
            </p>
            <footer className="mt-5">
              <span className="eyebrow text-gold-primary/70">D&rsquo;Fashion — The Science</span>
            </footer>
          </motion.blockquote>
        </EditorialContainer>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="py-section-xl bg-surface-1"
      >
        <EditorialContainer width="content">
          <Reveal variant="fade">
            <EyebrowLabel tone="gold" rule>Account &amp; Privacy</EyebrowLabel>
          </Reveal>
          <div className="mt-8">
            <Accordion type="single" collapsible className="w-full">
              {ACCOUNT_FAQS.map(({ question, answer }, index) => (
                <AccordionItem
                  key={question}
                  value={`account-${index}`}
                  className="border-gold-hairline"
                >
                  <AccordionTrigger className="text-left font-serif text-h5 font-light text-cream-primary hover:no-underline hover:text-gold-primary [&>svg]:text-gold-primary">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="text-body leading-[1.7] text-cream-primary/70">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </EditorialContainer>
      </motion.section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-gold-hairline bg-surface-0 py-16">
        <EditorialContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center"
          >
            <div>
              <EyebrowLabel tone="gold">Still have questions?</EyebrowLabel>
              <EditorialHeading as="h2" size="md" className="mt-4">
                We reply to <Emphasis>everything.</Emphasis>
              </EditorialHeading>
              <p className="mt-4 text-body-sm text-cream-primary/65 leading-relaxed">
                Usually within two working days. Include the email you signed up with for account or payment questions.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row md:justify-end">
              <Link
                href={ROUTES.contact}
                className="btn-campaign inline-flex items-center justify-center"
              >
                Contact Us →
              </Link>
              <Link
                href={ROUTES.pricing}
                className="inline-flex min-h-11 items-center justify-center border border-gold-hairline px-6 eyebrow text-cream-primary/60 transition-colors hover:border-gold-border hover:text-cream-primary"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </EditorialContainer>
      </section>
    </div>
  );
}
