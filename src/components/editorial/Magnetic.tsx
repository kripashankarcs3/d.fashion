import { useRef, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';

interface MagneticProps {
  children: ReactNode;
  /** Maximum travel in px toward the cursor while hovered. */
  strength?: number;
  className?: string;
}

const FINE_POINTER = '(pointer: fine)';

/**
 * Nudges its child a few pixels toward the cursor while hovered — desktop
 * only. The `pointer: fine` guard keeps it off touch devices (where a tap
 * has no meaningful hover position) and `prefers-reduced-motion` collapses
 * it to a static render, so it never fights an assistive gesture.
 */
export default function Magnetic({
  children,
  strength = 3,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 24, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 280, damping: 24, mass: 0.6 });

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (typeof window === 'undefined' || !window.matchMedia(FINE_POINTER).matches) {
      return;
    }
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const dist = Math.hypot(dx, dy) || 1;
    const pull = Math.min(1, dist / Math.max(rect.width / 2, 1));
    x.set((dx / dist) * strength * pull);
    y.set((dy / dist) * strength * pull);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, willChange: 'transform' }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}
