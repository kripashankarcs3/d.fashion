import ContentPage from '@/components/editorial/ContentPage';
import EditorialImage from '@/components/editorial/EditorialImage';
import { CAMPAIGN } from '@/lib/editorial-images';

const POSTS = [
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
      'A &ldquo;neutral&rdquo; is any colour quiet enough to support the rest of your outfit. Learn the neutral set that flatters your season — and the three you should stop reaching for.',
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

function PostCard({
  post,
}: {
  post: (typeof POSTS)[number];
}) {
  return (
    <article
      id={post.slug}
      className="scroll-mt-[4.375rem] group overflow-hidden border border-gold-hairline"
    >
      <EditorialImage
        src={post.image.base}
        alt={post.image.alt}
        ratio="landscape"
        cinematic={false}
      />
      <div className="flex flex-col gap-3 p-6">
        <p className="text-caption uppercase tracking-label text-gold-muted">
          {post.date} · {post.readingTime} read
        </p>
        <h2 className="font-serif text-h4 font-light leading-snug text-cream-primary transition-colors duration-200 group-hover:text-gold-primary">
          {post.title}
        </h2>
        <p className="text-body-sm leading-[1.7] text-cream-primary/70">
          {post.excerpt}
        </p>
        <a
          href="#"
          className="mt-1 inline-flex items-center gap-2 text-nav font-semibold tracking-button text-gold-primary hover:opacity-80"
          aria-label={`Read ${post.title}`}
        >
          Read entry <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

export default function Blog() {
  return (
    <ContentPage
      eyebrow="Journal"
      title="Colour, worn thoughtfully"
      lede="Essays on the science and style of colour analysis — the thinking behind your palette."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {POSTS.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </ContentPage>
  );
}
