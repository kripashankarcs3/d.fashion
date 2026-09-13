import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HOMEPAGE_FAQS } from '@/config/content';

const faqs = HOMEPAGE_FAQS;

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
