import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import EditorialContainer from './EditorialContainer';
import EyebrowLabel from './EyebrowLabel';
import EditorialHeading from './EditorialHeading';
import Reveal from './Reveal';
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
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-[4.375rem] border-t border-gold-hairline py-8"
    >
      <EyebrowLabel tone="gold">{label}</EyebrowLabel>
      {title && (
        <h2 className="mt-3 font-editorial text-h3 font-light text-cream-primary">
          {title}
        </h2>
      )}
      <div className="mt-5 max-w-prose space-y-4 text-body leading-[1.7] text-cream-primary/80">
        {children}
      </div>
    </motion.section>
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
    <div className={cn('relative w-full pb-24 overflow-hidden', className)}>
      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 65% 55% at 50% 0%, rgba(243,226,179,0.05) 0%, transparent 80%)',
        }}
      />

      <header className="border-b border-gold-hairline pb-10 pt-28">
        <EditorialContainer>
          <Reveal variant="fade">
            <EyebrowLabel tone="gold">{eyebrow}</EyebrowLabel>
          </Reveal>
          <Reveal variant="mask" delay={0.15}>
            <EditorialHeading as="h1" size="xl" className="mt-4">
              {title}
            </EditorialHeading>
          </Reveal>
          {lede && (
            <Reveal variant="rise" delay={0.35}>
              <p className="mt-3 max-w-2xl font-editorial italic text-h5 font-light text-cream-primary/60">
                {lede}
              </p>
            </Reveal>
          )}
        </EditorialContainer>
      </header>

      <EditorialContainer width="content" className={cn('mt-12', contentClassName)}>
        {children}
      </EditorialContainer>
    </div>
  );
}

