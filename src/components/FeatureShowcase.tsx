import { motion, type Variants } from 'framer-motion';
import Container from '@/components/Container';
import { cn, srcsetFromUrl } from '@/lib/utils';

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
                  className={cn(
                    "relative overflow-hidden rounded-lg bg-cream-dark border border-border shadow-md aspect-[4/5] w-full group cursor-pointer",
                    reversed ? 'lg:order-1 lg:col-start-2 lg:row-start-1' : ''
                  )}
                >
                  <img
                    src={feature.image}
                    srcSet={srcsetFromUrl(feature.image, [640, 960, 1280, 1600])}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    alt={feature.alt}
                    width={1600}
                    height={2000}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Dynamic Visualizations depending on feature index */}
                  {index === 0 && (
                    /* Colour Season Wheel Visualizer */
                    <div className="absolute inset-0 flex items-center justify-center bg-espresso/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="w-48 h-48 rounded-full border-[10px] border-double border-gold-light/40 flex items-center justify-center relative shadow-gold-glow"
                        style={{
                          background: "conic-gradient(from 0deg, #E8845B, #B8974A, #3E6B5E, #8E3B5A, #C19A6B, #E8845B)"
                        }}
                      >
                        <div className="w-24 h-24 rounded-full bg-espresso flex items-center justify-center shadow-lg border border-gold-primary/30">
                          <span className="font-serif text-[10px] text-gold-light uppercase tracking-widest text-center px-1">
                            Seasons
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {index === 1 && (
                    /* Skin Undertone Scanning Laser Animation */
                    <div className="absolute inset-0 pointer-events-none">
                      <motion.div
                        animate={{ y: ["0%", "100%", "0%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-primary to-transparent shadow-[0_0_12px_rgba(184,151,74,0.8)] z-20"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-gold-primary/5 to-transparent opacity-20 mix-blend-overlay" />
                    </div>
                  )}

                  {index === 2 && (
                    /* Elegant Border Overlay for Archetype */
                    <div aria-hidden className="pointer-events-none absolute inset-4 rounded border border-gold-light/40 opacity-70" />
                  )}

                  {index === 3 && (
                    /* Virtual Try-On visual grid overlay */
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-gold-primary/10 via-transparent to-transparent">
                      <div className="absolute bottom-4 left-4 rounded bg-espresso/70 px-3 py-1.5 backdrop-blur-sm border border-gold-light/20 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-gold-light animate-pulse" />
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-cream-primary">
                          Palette Synced
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
