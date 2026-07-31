import { motion } from 'framer-motion';
import { Link } from 'wouter';
import Container from '@/components/Container';

const easeOut = [0, 0, 0.2, 1] as const;

const scrollToHowItWorks = (event: React.MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault();
  document
    .getElementById('how-it-works')
    ?.scrollIntoView({ behavior: 'smooth' });
};

export default function Hero() {
  return (
    <section className="flex min-h-screen items-center pt-20 pb-16 lg:pt-32 lg:pb-30">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[45fr_55fr] lg:gap-20">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
            className="max-w-[13ch] text-5xl text-espresso md:text-h1 lg:text-display"
          >
            Discover the Colours That Were Made for You.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.4 }}
            className="mt-6 max-w-xl text-xl font-light leading-[1.5] text-espresso-light lg:text-2xl"
          >
            AI-powered colour analysis. Personalised to your skin tone,
            undertone, and style personality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut, delay: 0.6 }}
            className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center"
          >
            <Link
              href="/upload"
              className="inline-flex min-h-11 min-w-[var(--size-cta-min-width)] items-center justify-center rounded-md bg-primary px-10 py-3.5 text-nav font-semibold tracking-button text-primary-foreground transition-all duration-200 ease-out hover:scale-[1.01] hover:bg-gold-light hover:shadow-cta-hover active:scale-[0.98] active:bg-gold-dark"
            >
              Analyse My Colours
            </Link>
            <a
              href="#how-it-works"
              onClick={scrollToHowItWorks}
              className="inline-flex min-h-11 items-center justify-center text-nav text-espresso-light transition-colors duration-200 ease-out hover:text-espresso hover:underline"
            >
              See how it works
            </a>
          </motion.div>
        </div>

        <motion.figure
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0 }}
          className="overflow-hidden lg:h-[calc(100vh-17rem)]"
        >
          <img
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop"
            srcSet="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=640&auto=format&fit=crop 640w, https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=960&auto=format&fit=crop 960w, https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1280&auto=format&fit=crop 1280w, https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop 1600w"
            sizes="(min-width: 1024px) 55vw, 100vw"
            alt="A woman in a neutral-toned outfit, photographed in warm natural light against a cream background"
            width={1600}
            height={2000}
            {...({ fetchpriority: 'high' } as React.ImgHTMLAttributes<HTMLImageElement>)}
            loading="eager"
            decoding="async"
            className="aspect-[3/4] h-full w-full object-cover lg:aspect-auto"
          />
        </motion.figure>
      </Container>
    </section>
  );
}
