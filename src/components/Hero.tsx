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
    <section className="relative isolate flex min-h-screen items-center overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-30">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-40 -top-44 h-[34rem] w-[34rem] rounded-full bg-white/70 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -25, 25, 0], y: [0, 30, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[36%] top-[10%] h-96 w-96 rounded-full bg-gold-light/25 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -40, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-32 top-[20%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,175,113,0.55),rgba(184,151,74,0.18)_55%,transparent_75%)] blur-2xl"
        />
        <motion.div
          animate={{ x: [0, -30, 30, 0], y: [0, 25, -25, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-44 right-[26%] h-[26rem] w-[26rem] rounded-full bg-gold-primary/20 blur-[110px]"
        />
      </div>

      <Container className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[45fr_55fr] lg:gap-20">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut, delay: 0.05 }}
            className="mb-6 flex items-center gap-3"
          >
            <span aria-hidden className="h-px w-10 bg-gold-primary" />
            <span className="text-label uppercase tracking-label text-gold-dark">
              AI Personal Styling
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
            className="max-w-[13ch] text-5xl text-espresso md:text-h1 lg:text-display"
          >
            Discover the <span className="bg-gradient-to-r from-espresso to-gold-primary bg-clip-text text-transparent">Colours</span> That Were Made for You.
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
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.15 }}
          className="relative mx-auto w-full max-w-[440px] sm:max-w-[500px] lg:max-w-none"
        >
          <div
            aria-hidden
            className="absolute inset-0 translate-x-4 translate-y-4 rounded-[1.75rem] border border-gold-primary/40 lg:translate-x-5 lg:translate-y-5"
          />
          <div
            aria-hidden
            className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-gold-primary/25 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-gold-light/30 blur-3xl"
          />

          <div className="relative overflow-hidden rounded-[1.75rem] bg-cream-dark shadow-lg group cursor-pointer">
            {/* Sliding Shine Gradient Overlay */}
            <motion.div
              initial={{ x: '-105%' }}
              whileHover={{ x: '105%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
              style={{ skewX: -20 }}
            />
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
              className="aspect-[4/5] h-auto w-full object-cover object-[center_30%]"
            />

            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-espresso/35 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-3 rounded-[1.25rem] border border-gold-light/30"
            />

            <div className="absolute right-4 top-4 sm:right-5 sm:top-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-espresso/90 px-4 py-1.5 backdrop-blur-sm">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold-light" />
                <span className="text-[length:var(--text-caption)] uppercase tracking-label text-cream-primary">
                  AI Colour Analysis
                </span>
              </span>
            </div>
          </div>

          <figcaption className="absolute -bottom-5 left-5 z-10 sm:-bottom-6 sm:left-7">
            <div
              aria-hidden
              className="absolute -inset-3 rounded-xl bg-espresso/80 shadow-gold-glow"
            />
            <div className="relative">
              <p className="text-micro uppercase tracking-label text-gold-light">
                The Season Edit
              </p>
              <p className="mt-1 font-serif text-[1.75rem] italic leading-[1.05] text-cream-primary sm:text-[2.25rem]">
                Autumn, Warm Skin
              </p>
            </div>
          </figcaption>
        </motion.figure>
      </Container>
    </section>
  );
}
