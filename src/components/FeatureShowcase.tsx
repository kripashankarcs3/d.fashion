import { motion } from 'framer-motion';
import { Link } from 'wouter';
import CampaignSpread from '@/components/editorial/CampaignSpread';
import { CAMPAIGN } from '@/lib/editorial-images';

const CHAPTERS = [
  {
    id: 'colour-season',
    label: 'COLOUR SEASON',
    heading: (
      <>
        Your Colour
        <br />
        Season,{' '}
        <em className="display-italic text-gold-primary">Decoded.</em>
      </>
    ),
    body: 'A personalised colour wheel built on your skin undertone, depth, and contrast. Everything from outfit picks to makeup shades flows through this single lens.',
    cta: 'GET MY SEASON →',
    href: '/upload',
    photo: CAMPAIGN.season,
    photoSide: 'right' as const,
    photoWidth: 'md:w-[62%]',
    heightClassName: 'min-h-[max(34rem,min(82svh,50rem))] lg:min-h-[max(36rem,min(88svh,54rem))]',
    headingSize: 'clamp(2.5rem, 1.0rem + 3.6vw, 5.75rem)',
    objectPosition: '62% 34%',
  },
  {
    id: 'skin-undertone',
    label: 'SKIN UNDERTONE',
    heading: (
      <>
        Warm, Cool,
        <br />
        or Neutral —{' '}
        <em className="display-italic text-gold-primary">Precisely.</em>
      </>
    ),
    body: 'The model reads the undertone beneath your skin in seconds and explains exactly what it found — no guesswork, no generic answers.',
    cta: 'ANALYSE MY UNDERTONE →',
    href: '/upload',
    photo: CAMPAIGN.undertone,
    photoSide: 'left' as const,
    photoWidth: 'md:w-[58%]',
    heightClassName: 'min-h-[max(32rem,min(80svh,48rem))] lg:min-h-[max(34rem,min(86svh,52rem))]',
    headingSize: 'clamp(2.25rem, 0.9rem + 3.2vw, 5.25rem)',
    objectPosition: '30% 28%',
  },
  {
    id: 'style-archetype',
    label: 'STYLE ARCHETYPE',
    heading: (
      <>
        The Archetypes
        <br />
        <em className="display-italic text-gold-primary">That Define You.</em>
      </>
    ),
    body: 'Your report names the two or three archetypes that describe how you present to the world, each paired with the wardrobe guidance that follows naturally.',
    cta: 'SEE SAMPLE REPORT →',
    href: '/report',
    photo: CAMPAIGN.archetype,
    photoSide: 'right' as const,
    photoWidth: 'md:w-[65%]',
    heightClassName: 'min-h-[max(33rem,min(82svh,49rem))] lg:min-h-[max(35rem,min(90svh,53rem))]',
    headingSize: 'clamp(2.4rem, 0.95rem + 3.4vw, 5.5rem)',
    objectPosition: '70% 30%',
  },
  {
    id: 'virtual-try-on',
    label: 'VIRTUAL TRY-ON',
    heading: (
      <>
        See It On You
        <br />
        <em className="display-italic text-gold-primary">Before You Buy.</em>
      </>
    ),
    body: 'Watch an outfit, makeup look, or hairstyle rendered in your exact palette. Your colours move from the report to something you can actually wear.',
    cta: 'TRY IT ON →',
    href: '/try-on',
    photo: CAMPAIGN.tryOn,
    photoSide: 'left' as const,
    photoWidth: 'md:w-[60%]',
    heightClassName: 'min-h-[max(30rem,min(78svh,46rem))] lg:min-h-[max(32rem,min(84svh,50rem))]',
    headingSize: 'clamp(2.25rem, 0.9rem + 3.1vw, 5rem)',
    objectPosition: '35% 30%',
  },
];

export default function FeatureShowcase() {
  return (
    <div className="flex flex-col">
      {CHAPTERS.map((chapter) => (
        <CampaignSpread
          key={chapter.id}
          id={chapter.id}
          label={chapter.label}
          heading={chapter.heading}
          body={chapter.body}
          photo={chapter.photo}
          photoSide={chapter.photoSide}
          photoWidth={chapter.photoWidth}
          heightClassName={chapter.heightClassName}
          headingSize={chapter.headingSize}
          objectPosition={chapter.objectPosition}
        >
          <motion.div
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={chapter.href}
              className="btn-campaign mt-10 inline-block rounded-none border-gold-border px-[1.75rem] py-[0.875rem] text-center text-[0.6875rem] hover:border-gold-border-hover hover:bg-gold-primary/10"
            >
              {chapter.cta}
            </Link>
          </motion.div>
        </CampaignSpread>
      ))}
    </div>
  );
}
