import { Link } from 'wouter';
import ContentPage from '@/components/editorial/ContentPage';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ROUTES } from '@/config/navigation';

const FAQS = [
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
    question: 'What happens to my photo?',
    answer:
      'Your original upload is used once and deleted immediately. The enhanced copy used to build your report is removed automatically within two hours. We never share your photos publicly. See the privacy policy for full details.',
  },
  {
    question: 'Is colour analysis medically accurate?',
    answer:
      'No — it is a styling tool, not a medical or dermatological assessment. It reads colour relationships the way a personal stylist would, and it is very good at that. For skin health concerns, consult a professional.',
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
  mainEntity: FAQS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

export default function Faq() {
  return (
    <ContentPage
      eyebrow="Support"
      title="Frequently asked questions"
      lede="Straight answers about analysis, privacy, and your report."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <Accordion type="single" collapsible className="w-full">
        {FAQS.map(({ question, answer }, index) => (
          <AccordionItem
            key={question}
            value={`faq-${index}`}
            className="border-gold-hairline"
          >
            <AccordionTrigger className="text-left font-serif text-h5 font-light text-cream-primary hover:no-underline hover:text-gold-primary">
              {question}
            </AccordionTrigger>
            <AccordionContent className="text-body leading-[1.7] text-cream-primary/75">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <p className="mt-10 text-body-sm text-cream-primary/70">
        Still stuck?{' '}
        <Link href={ROUTES.contact} className="underline underline-offset-2 hover:text-gold-primary">
          Contact us
        </Link>{' '}
        — we reply within two working days.
      </p>
    </ContentPage>
  );
}
