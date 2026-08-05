import type { ReactNode } from 'react';
import EditorialContainer from './EditorialContainer';
import EyebrowLabel from './EyebrowLabel';
import EditorialHeading from './EditorialHeading';
import { cn } from '@/lib/utils';

interface ContentPageProps {
  eyebrow: string;
  title: ReactNode;
  /** Short italic lede under the headline. */
  lede?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

/** A labelled prose block used across the trust/marketing pages. */
export function ProseSection({
  id,
  label,
  title,
  children,
}: {
  id?: string;
  label: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-[4.375rem] border-t border-gold-hairline py-8">
      <EyebrowLabel tone="gold">{label}</EyebrowLabel>
      {title && (
        <h2 className="mt-3 font-editorial text-h3 font-light text-cream-primary">
          {title}
        </h2>
      )}
      <div className="mt-5 max-w-prose space-y-4 text-body leading-[1.7] text-cream-primary/80">
        {children}
      </div>
    </section>
  );
}

/**
 * Shared shell for the marketing / trust pages (privacy, terms, about, faq…)
 * so each one reads as part of the same editorial system without duplicating
 * the header treatment.
 */
export default function ContentPage({
  eyebrow,
  title,
  lede,
  children,
  className,
  contentClassName,
}: ContentPageProps) {
  return (
    <div className={cn('w-full pb-24', className)}>
      <header className="border-b border-gold-hairline pb-10 pt-28">
        <EditorialContainer>
          <EyebrowLabel tone="gold">{eyebrow}</EyebrowLabel>
          <EditorialHeading as="h1" size="xl" className="mt-4">
            {title}
          </EditorialHeading>
          {lede && (
            <p className="mt-3 max-w-2xl font-editorial italic text-h5 font-light text-cream-primary/60">
              {lede}
            </p>
          )}
        </EditorialContainer>
      </header>

      <EditorialContainer width="content" className={cn('mt-12', contentClassName)}>
        {children}
      </EditorialContainer>
    </div>
  );
}
