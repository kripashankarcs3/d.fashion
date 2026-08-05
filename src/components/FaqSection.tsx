import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    id: 'item-1',
    question: 'What kind of photo do I need?',
    answer:
      'A clear selfie in natural light works best. Face the window, no sunglasses, no heavy filters. No makeup is ideal but not required — the AI reads skin tone from exposed areas. Avoid flash photography as it washes out your undertone.',
  },
  {
    id: 'item-2',
    question: 'Is my photo stored after analysis?',
    answer:
      'Your original photo is deleted immediately after analysis. The enhanced copy is removed within two hours. We never share photos with third parties. See our Privacy Policy for full details.',
  },
  {
    id: 'item-3',
    question: 'How accurate is the colour season result?',
    answer:
      'The AI reads three measurable properties — undertone, depth, and contrast — from the actual pixel values in your photo. It does not guess from your description. The result is as accurate as the quality of the photo you upload.',
  },
  {
    id: 'item-4',
    question: 'Can my colour season change over time?',
    answer:
      'Your undertone is genetic and does not change. Your depth and contrast can shift slightly with age, weight change, or significant hair colour change — in which case a new analysis will pick up the difference.',
  },
  {
    id: 'item-5',
    question: 'Does it work for all skin tones?',
    answer:
      'Yes. The analysis measures objective pixel ratios and lightness values. It has been tested across the full skin-tone range and performs consistently. The colour season system itself was designed to classify all human colouring.',
  },
  {
    id: 'item-6',
    question: 'What if I disagree with my result?',
    answer:
      'Re-do the analysis with a better photo (natural light, no flash). If you still disagree, the report explains the three axes — undertone, depth, contrast — so you can see exactly why the system placed you in that season and form your own view.',
  },
  {
    id: 'item-7',
    question: 'Is there a refund policy?',
    answer:
      'Yes. If your first analysis produces a clearly incorrect result due to a technical error on our side, contact us within 7 days for a full refund. See our Refund Policy for terms.',
  },
  {
    id: 'item-8',
    question: "Is D'Fashion for men too?",
    answer:
      'Absolutely. Colour season analysis applies equally to all people. The palette, neutrals, and archetypes are presented in a style-neutral way. The try-on features cover hairstyles for all.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function FaqSection() {
  return (
    <section className="bg-surface-1 py-section-xl">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <EditorialContainer width="content">
        {/* Header */}
        <div className="mb-12 max-w-xl">
          <EyebrowLabel rule tone="gold">FAQ</EyebrowLabel>
          <EditorialHeading as="h2" size="xl" className="mt-5">
            Common questions, <Emphasis>honest answers.</Emphasis>
          </EditorialHeading>
        </div>

        {/* Accordion */}
        <Accordion type="multiple" defaultValue={['item-1']}>
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border-b border-gold-hairline"
            >
              <AccordionTrigger className="text-body text-cream-primary font-medium text-left py-5 hover:no-underline [&>svg]:text-gold-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-body-sm text-cream-primary/70 pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </EditorialContainer>
    </section>
  );
}
