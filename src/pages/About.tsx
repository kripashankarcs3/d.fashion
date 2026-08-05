import { Link } from 'wouter';
import ContentPage, { ProseSection } from '@/components/editorial/ContentPage';
import EditorialImage from '@/components/editorial/EditorialImage';
import { CAMPAIGN } from '@/lib/editorial-images';
import { ROUTES } from '@/config/navigation';

const VALUES = [
  {
    title: 'Rendered personal',
    body: 'No two reports are alike. Every palette is built from your own undertone, depth, and contrast.',
  },
  {
    title: 'Honest about data',
    body: 'Your photo is used once and deleted. We tell you exactly what happens to it in our privacy policy.',
  },
  {
    title: 'Made to wear',
    body: 'Colour guidance that leaves the screen and enters your wardrobe — outfits, makeup, and shopping.',
  },
];

export default function About() {
  return (
    <ContentPage
      eyebrow="About"
      title="Colour intelligence, rendered personal."
      lede="D&rsquo;Fashion started with a simple question: why should understanding the colours that flatter you require an expensive appointment?"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <EditorialImage
          src={CAMPAIGN.season.base}
          alt={CAMPAIGN.season.alt}
          ratio="landscape"
          className="md:h-full"
          cinematic={false}
        />
        <div className="flex flex-col justify-center gap-6">
          {VALUES.map((value) => (
            <div key={value.title} className="border-l-2 border-gold-primary pl-5">
              <h2 className="font-serif text-h5 font-light text-cream-primary">
                {value.title}
              </h2>
              <p className="mt-1.5 text-body-sm leading-relaxed text-cream-primary/70">
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <ProseSection label="Our story" title="From a mirror to a model">
        <p>
          Colour analysis has existed for decades, but it has always been
          exclusive — sessions booked weeks ahead, held in person, priced out
          of reach. We wanted the same rigour available to anyone with a phone.
        </p>
        <p>
          D&rsquo;Fashion reads your skin undertone, depth, and contrast from a
          single photograph in natural light, places you in one of the twelve
          colour seasons, and builds a palette you can actually wear.
        </p>
        <p>
          The technology is ours; the eye is the same one a stylist would
          bring. We are colour enthusiasts first and engineers second.
        </p>
      </ProseSection>

      <ProseSection label="Getting started">
        <p>
          Ready to see your palette?{' '}
          <Link href={ROUTES.upload} className="underline underline-offset-2 hover:text-gold-primary">
            Analyse my colours
          </Link>
          , or read our{' '}
          <Link href={ROUTES.faq} className="underline underline-offset-2 hover:text-gold-primary">
            FAQ
          </Link>{' '}
          first.
        </p>
      </ProseSection>
    </ContentPage>
  );
}
