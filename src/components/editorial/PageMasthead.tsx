import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import EyebrowLabel from './EyebrowLabel';
import EditorialHeading from './EditorialHeading';
import Reveal from './Reveal';

interface PageMastheadProps {
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  /** Actions or metadata that belong beside the title, not beneath it. */
  aside?: ReactNode;
  size?: 'xl' | 'lg' | 'md';
  className?: string;
}

/**
 * Interior-page opening. Quieter than a campaign hero, but still editorial:
 * left-aligned, hairline-anchored, fluid serif.
 */
export default function PageMasthead({
  label,
  title,
  lede,
  aside,
  size = 'lg',
  className,
}: PageMastheadProps) {
  return (
    <header className={cn('border-b border-gold-hairline pb-10 md:pb-14', className)}>
      <Reveal variant="fade">
        <EyebrowLabel tone="muted">{label}</EyebrowLabel>
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Reveal variant="mask" delay={0.05}>
            <EditorialHeading as="h1" size={size} className="max-w-[15ch]">
              {title}
            </EditorialHeading>
          </Reveal>

          {lede && (
            <Reveal variant="fade" delay={0.15}>
              <p className="mt-6 max-w-[52ch] text-lede text-cream-primary/80">{lede}</p>
            </Reveal>
          )}
        </div>

        {aside && (
          <Reveal variant="fade" delay={0.2} className="lg:pb-1">
            {aside}
          </Reveal>
        )}
      </div>
    </header>
  );
}
