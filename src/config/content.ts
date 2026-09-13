/**
 * Central editorial/content catalogue: journal posts and FAQ answers.
 * Pure data — pages only add layout. Nothing inside a component anymore.
 */

import { CAMPAIGN } from '@/lib/editorial-images';
import type { EditorialPhoto } from '@/lib/editorial-images';
import { BRAND } from '@/config/site';

/* ------------------------------------------------------------------ blog */

export interface BlogPost {
  slug: string;
  image: EditorialPhoto;
  date: string;
  readingTime: string;
  title: string;
  excerpt: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'what-is-colour-season',
    image: CAMPAIGN.season,
    date: 'June 2026',
    readingTime: '6 min',
    title: 'What is a colour season, actually?',
    excerpt:
      'Warm Spring, Cool Winter, Soft Autumn — the names sound like poetry, but each one encodes a measurable relationship between your skin, hair, and eyes. Here is how the system works, and why twelve seasons are better than four.',
  },
  {
    slug: 'reading-your-undertone',
    image: CAMPAIGN.undertone,
    date: 'July 2026',
    readingTime: '5 min',
    title: 'How to read your undertone without squinting',
    excerpt:
      'Vein colour, jewellery tests, white-cloth comparisons — the classic tricks all work, and all fail in the wrong light. A practical guide to finding your warm/cool signal under real-world conditions.',
  },
  {
    slug: 'building-neutral-wardrobe',
    image: CAMPAIGN.archetype,
    date: 'August 2026',
    readingTime: '7 min',
    title: 'Building a neutral wardrobe that isn\u2019t beige',
    excerpt:
      'A \u201cneutral\u201d is any colour quiet enough to support the rest of your outfit. Learn the neutral set that flatters your season — and the three you should stop reaching for.',
  },
  {
    slug: 'lighting-and-analysis',
    image: CAMPAIGN.process,
    date: 'August 2026',
    readingTime: '4 min',
    title: 'Why lighting decides your analysis',
    excerpt:
      'The same face reads three different seasons in three different lights. What the camera sees, what makes a photo unusable, and how to take the shot that gets the most honest result.',
  },
];

/* ------------------------------------------------------------------- faq */

export interface FaqItem {
  question: string;
  answer: string;
}

/** Answers about the analysis pipeline, report accuracy, and how we read photos. */
export const ANALYSIS_FAQS: FaqItem[] = [
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
      'A colour season is a classification of the palette that harmonises most with your natural colouring — your skin, hair, and eyes. The analysis works with the full twelve-season system, from Light Spring to Bright Winter.',
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

/** Answers about photos, account data, retakes, and billing. */
export const ACCOUNT_FAQS: FaqItem[] = [
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

/** Editorial pull quote rendered above the account + privacy section. */
export const SUPPORT_QUOTE = {
  text: 'The analysis reads what a trained stylist would read — your undertone, your depth, your contrast.',
  attribution: BRAND.name + ' — The Science',
};

export interface HomepageFaq extends FaqItem {
  id: string;
}

/** The interstitial FAQ shown on the landing page. */
export const HOMEPAGE_FAQS: HomepageFaq[] = [
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
    question: `Is ${BRAND.name} for men too?`,
    answer:
      'Absolutely. Colour season analysis applies equally to all people. The palette, neutrals, and archetypes are presented in a style-neutral way. The try-on features cover hairstyles for all.',
  },
];