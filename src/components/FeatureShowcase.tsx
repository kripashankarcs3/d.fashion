import { motion, type Variants } from 'framer-motion';
import Container from '@/components/Container';

const features = [
  {
    label: 'COLOUR SEASON',
    headline: 'Colour Season Analysis',
    body: 'A colour wheel, personalised to you. Your season is determined by the undertone, depth, and contrast of your skin — then everything else is read through that lens.',
    image:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop',
    alt: 'A woman wearing warm, muted autumn tones, photographed in soft natural light',
  },
  {
    label: 'SKIN UNDERTONE',
    headline: 'Skin Undertone Detection',
    body: 'Warm, cool, or neutral — the model reads the undertone beneath the surface of your skin and explains what it detected, plainly and without guesswork.',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600&auto=format&fit=crop',
    alt: 'A close-up portrait in warm natural light showing natural skin texture',
  },
  {
    label: 'STYLE ARCHETYPE',
    headline: 'Style Archetype Report',
    body: 'Your report names the two or three archetypes that describe how you present to the world, each with the wardrobe guidance that follows naturally.',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    alt: 'An editorial photograph of a woman in a flowing neutral garment',
  },
  {
    label: 'VIRTUAL TRY-ON',
    headline: 'Virtual Try-On',
    body: 'Watch an outfit update around you in your own palette. The colours move from a report you read to something you can wear.',
    image:
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1600&auto=format&fit=crop',
    alt: 'A minimal rack of garments in muted, natural tones',
  },
];

const textVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0, 0, 0.2, 1] },
  },
};

export default function FeatureShowcase() {
  return (
    <section className="py-30">
      <Container>
        <div className="space-y-[200px]">
          {features.map((feature, index) => {
            const reversed = index % 2 === 1;
            return (
              <motion.article
                key={feature.headline}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
                className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[45fr_55fr] lg:gap-20"
              >
                <div
                  className={
                    reversed
                      ? 'lg:order-2 lg:col-start-1 lg:row-start-1'
                      : ''
                  }
                >
                  <motion.div
                    variants={textVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                  >
                    <motion.p
                      variants={itemVariants}
                      className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-primary"
                    >
                      {feature.label}
                    </motion.p>
                    <motion.h2
                      variants={itemVariants}
                      className="mt-4 font-serif text-h2 text-espresso"
                    >
                      {feature.headline}
                    </motion.h2>
                    <motion.p
                      variants={itemVariants}
                      className="mt-6 max-w-[52ch] text-[17px] leading-[1.7] text-espresso-light"
                    >
                      {feature.body}
                    </motion.p>
                  </motion.div>
                </div>

                <div
                  className={reversed ? 'lg:order-1 lg:col-start-2 lg:row-start-1' : ''}
                >
                  <img
                    src={feature.image}
                    alt={feature.alt}
                    width={1600}
                    height={2000}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
