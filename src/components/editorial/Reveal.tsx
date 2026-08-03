import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  /** `mask` wipes the element up from a clipped baseline — for headlines. */
  variant?: 'mask' | 'rise' | 'fade';
  delay?: number;
  className?: string;
  amount?: number;
}

/**
 * Slow, controlled entrance. Honours prefers-reduced-motion by rendering
 * the final state immediately rather than animating faster.
 */
export default function Reveal({
  children,
  variant = 'rise',
  delay = 0,
  className,
  amount = 0.25,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const hidden =
    variant === 'mask'
      ? { clipPath: 'inset(0 0 100% 0)', y: 12, opacity: 1 }
      : variant === 'fade'
        ? { opacity: 0 }
        : { opacity: 0, y: 28 };

  const shown =
    variant === 'mask'
      ? { clipPath: 'inset(0 0 0% 0)', y: 0, opacity: 1 }
      : variant === 'fade'
        ? { opacity: 1 }
        : { opacity: 1, y: 0 };

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={inView ? shown : hidden}
      transition={{
        duration: variant === 'mask' ? 1.05 : 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
      className={cn(variant === 'mask' && 'will-change-[clip-path]', className)}
    >
      {children}
    </motion.div>
  );
}
