import { motion } from 'framer-motion';

export default function ProblemStrip() {
  return (
    <section className="bg-cream-dark">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex min-h-20 items-center justify-center px-5 py-7 text-center text-body-lg font-normal italic text-espresso-light"
      >
        Because guessing which colours suit you costs time, money, and
        confidence.
      </motion.p>
    </section>
  );
}
