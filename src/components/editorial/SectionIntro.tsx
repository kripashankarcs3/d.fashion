import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import EyebrowLabel from './EyebrowLabel';
import EditorialHeading from './EditorialHeading';
import Reveal from './Reveal';

interface SectionIntroProps {
  label: string;
  title: ReactNode;
  /** Sits in the right column, so the header reads as a spread, not a stack. */
  copy?: ReactNode;
  aside?: ReactNode;
  size?: 'lg' | 'md';
  tone?: 'ink' | 'inverse';
  align?: 'split' | 'stacked';
  className?: string;
}

/**
 * Section header composed as an asymmetric two-column spread rather than a
 * centred title-and-subtitle block.
 */
export default function SectionIntro({
  label,
  title,
  copy,
  aside,
  size = 'lg',
  tone = 'ink',
  align = 'split',
  className,
}: SectionIntroProps) {
  const inverse = tone === 'inverse';

  return (
    <div
      className={cn(
        'border-t pt-8 md:pt-10',
        inverse ? 'border-gold-border' : 'border-gold-hairline',
        className,
      )}
    >
      <Reveal variant="fade">
        <EyebrowLabel tone={inverse ? 'inverse' : 'muted'}>{label}</EyebrowLabel>
      </Reveal>

      <div
        className={cn(
          'mt-6 grid grid-cols-1 gap-x-16 gap-y-6',
          align === 'split' && (copy || aside) && 'lg:grid-cols-[1fr_auto] lg:items-end',
        )}
      >
        <Reveal variant="mask" delay={0.05}>
          <EditorialHeading size={size} tone={tone} className="max-w-[16ch]">
            {title}
          </EditorialHeading>
        </Reveal>

        {(copy || aside) && (
          <Reveal variant="fade" delay={0.15} className="lg:pb-2">
            {copy && (
              <p
                className={cn(
                  'max-w-[42ch] text-body leading-[1.7]',
                  inverse ? 'text-cream-primary/65' : 'text-cream-primary/70',
                )}
              >
                {copy}
              </p>
            )}
            {aside}
          </Reveal>
        )}
      </div>
    </div>
  );
}
