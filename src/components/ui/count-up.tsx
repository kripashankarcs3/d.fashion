import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface CountUpProps {
  target: number;
  suffix?: string;
  prefix?: string;
  /** Decimal places to show. Omit to auto-format: integers with en-IN
   *  grouping, non-integers to 1 decimal place. */
  decimals?: number;
  duration?: number;
  className?: string;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Counts from 0 to `target` once the element scrolls into view. Renders a
 * static 0 before that, jumps straight to the final value under
 * `prefers-reduced-motion`, and never loops — a set-and-forget counter.
 */
export function CountUp({
  target,
  suffix = '',
  prefix = '',
  decimals,
  duration = 1200,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(target * easeOutCubic(progress));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, reduceMotion]);

  const formatted =
    typeof decimals === 'number'
      ? value.toFixed(decimals)
      : Number.isInteger(target)
        ? Math.round(value).toLocaleString('en-IN')
        : (Math.round(value * 10) / 10).toString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix ? <span className="text-gold-primary">{suffix}</span> : null}
    </span>
  );
}
