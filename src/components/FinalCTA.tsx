import { motion } from 'framer-motion';
import { Link } from 'wouter';

export default function FinalCTA() {
  return (
    <section className="bg-espresso py-40 text-center">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
        className="mx-auto max-w-2xl px-5"
      >
        <h2 className="font-serif text-h1 text-cream-primary">
          Your colours are waiting.
        </h2>
        <p className="mt-6 text-body-lg text-cream-primary/80">
          No credit card required. Results in under 60 seconds.
        </p>
        <div className="mt-10">
          <Link
            href="/upload"
            className="inline-flex min-h-11 min-w-[var(--size-cta-min-width)] items-center justify-center rounded-md bg-gold-light px-10 py-3.5 text-nav font-semibold tracking-button text-espresso transition-all duration-200 ease-out hover:scale-[1.01] hover:bg-gold-primary hover:shadow-cta-hover active:scale-[0.98] active:bg-gold-dark"
          >
            Start for Free
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
