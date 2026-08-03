import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EyebrowLabelProps {
  children: ReactNode;
  /** A leading rule anchors the label to the column edge. */
  rule?: boolean;
  tone?: 'ink' | 'muted' | 'inverse' | 'gold';
  size?: 'default' | 'micro';
  as?: ElementType;
  className?: string;
}

const toneClasses: Record<NonNullable<EyebrowLabelProps['tone']>, string> = {
  ink: 'text-cream-primary',
  muted: 'text-cream-primary/55',
  inverse: 'text-cream-primary/70',
  gold: 'text-gold-light',
};

const ruleClasses: Record<NonNullable<EyebrowLabelProps['tone']>, string> = {
  ink: 'bg-gold-primary/40',
  muted: 'bg-gold-primary/25',
  inverse: 'bg-gold-primary/40',
  gold: 'bg-gold-primary/60',
};

/**
 * The small uppercase register that opens every editorial section —
 * COLLECTION 03, YOUR SEASON, CURATED FOR YOU.
 */
export default function EyebrowLabel({
  children,
  rule = false,
  tone = 'muted',
  size = 'default',
  as: Component = 'span',
  className,
}: EyebrowLabelProps) {
  return (
    <Component
      className={cn(
        'inline-flex items-center gap-4',
        size === 'micro' ? 'eyebrow-micro' : 'eyebrow',
        toneClasses[tone],
        className,
      )}
    >
      {rule && (
        <span aria-hidden="true" className={cn('h-px w-10 shrink-0', ruleClasses[tone])} />
      )}
      {children}
    </Component>
  );
}
