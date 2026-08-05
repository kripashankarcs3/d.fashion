import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin gold reading-progress bar fixed to the very top of the viewport.
 * Driven by document scroll, springs to the scroll position so it never
 * stutters, and renders nothing under prefers-reduced-motion.
 */
export default function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[var(--z-modal)] h-[2px] origin-left bg-gold-primary"
    />
  );
}
