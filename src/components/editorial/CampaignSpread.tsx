import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import EyebrowLabel from './EyebrowLabel';
import Reveal from './Reveal';
import { cn } from '@/lib/utils';

interface CampaignSpreadProps {
  id?: string;
  /** Small uppercase gold label, e.g. "COLOUR SEASON". */
  label: string;
  /** Oversized serif headline. Wrap the emphasised phrase in
   *  <em className="display-italic text-gold-primary">. Author line breaks
   *  with <br /> — the display face balances lines otherwise. */
  heading: ReactNode;
  body: string;
  children?: ReactNode; // CTA block
  photo: { src: string; alt: string };
  /** Which side the photograph sits on. Copy always takes the other side. */
  photoSide?: 'left' | 'right';
  /** Photograph width on desktop. Keep inside 55–65%. */
  photoWidth?: string; // e.g. 'md:w-[62%]'
  /** object-position for the photo, e.g. '62% 34%'. */
  objectPosition?: string;
  /** Section min-height on desktop. */
  heightClassName?: string; // default 'md:min-h-[85vh] lg:min-h-[92vh]'
  /** Headline size. Keep the top of the clamp between 5.5rem and 7rem. */
  headingSize?: string; // default 'clamp(2.75rem, 5.4vw, 6.5rem)'
  priority?: boolean;
  className?: string;
}

export default function CampaignSpread({
  id,
  label,
  heading,
  body,
  children,
  photo,
  photoSide = 'right',
  photoWidth = 'md:w-[62%]',
  objectPosition = '50% 34%',
  heightClassName = 'md:min-h-[85vh] lg:min-h-[92vh]',
  headingSize = 'clamp(2.75rem, 5.4vw, 6.5rem)',
  priority = false,
  className,
}: CampaignSpreadProps) {
  const mirrored = photoSide === 'left';

  return (
    <section
      id={id}
      className={cn(
        'relative isolate flex flex-col overflow-hidden md:block',
        mirrored ? 'campaign-ground-mirror' : 'campaign-ground',
        heightClassName,
        className,
      )}
    >
      {/* Photograph — bleeds off its edge, dissolves into the page ground */}
      <div
        className={cn(
          'relative order-2 aspect-[4/5] w-full overflow-hidden',
          'md:absolute md:inset-y-0 md:order-none md:aspect-auto md:h-full',
          photoWidth,
          mirrored ? 'md:left-0' : 'md:right-0',
        )}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          style={{ objectPosition }}
          className="campaign-photo-grade h-full w-full object-cover"
        />
        {/* Vignette sits UNDER the dissolve: once the frame has resolved to the
            page's black, nothing may darken it further or the seam reappears. */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0',
            mirrored ? 'campaign-vignette-mirror' : 'campaign-vignette',
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 campaign-dissolve',
            mirrored && 'campaign-dissolve-mirror',
          )}
        />
      </div>

      {/* Copy — vertically centred against the full spread */}
      <div
        className={cn(
          'relative z-10 order-1 flex items-center md:absolute md:inset-0 md:order-none',
          mirrored && 'md:justify-end',
        )}
      >
        <div
          className="w-full max-w-[46rem] py-20 md:max-w-[38rem] md:py-0"
          style={
            mirrored
              ? { paddingRight: 'clamp(1.5rem, 4.5vw, 6rem)', paddingLeft: 'clamp(1.5rem, 4.5vw, 6rem)' }
              : { paddingLeft: 'clamp(1.5rem, 5vw, 7rem)', paddingRight: 'clamp(1.5rem, 3vw, 3rem)' }
          }
        >
          <Reveal variant="fade">
            <div className={cn('flex', mirrored && 'md:justify-end')}>
              <EyebrowLabel
                tone="inverse"
                className={cn(
                  'flex items-center gap-4 text-[11px] text-cream-primary/75',
                  mirrored && 'md:flex-row-reverse',
                )}
              >
                <span className="h-px w-10 bg-gold-primary" aria-hidden="true" />
                {label}
              </EyebrowLabel>
            </div>
          </Reveal>

          <Reveal variant="fade" delay={0.08} amount={0.15}>
            <h2
              className={cn(
                'font-display mt-8 text-cream-primary',
                mirrored && 'md:text-right md:ml-auto',
              )}
              style={{
                fontSize: headingSize,
                lineHeight: 0.94,
                letterSpacing: '-0.025em',
                /* The display face balances lines by default; here the breaks
                   are authored, so let them sit where they were written. */
                textWrap: 'wrap',
              }}
            >
              {heading}
            </h2>
          </Reveal>

          <motion.div
            initial={{ scaleX: 0, originX: mirrored ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            className={cn(
              'mt-10 h-px w-20',
              mirrored
                ? 'bg-gradient-to-l from-gold-primary to-transparent md:ml-auto'
                : 'bg-gradient-to-r from-gold-primary to-transparent',
            )}
            aria-hidden="true"
          />

          <Reveal variant="fade" delay={0.28} amount={0.15}>
            <p
              className={cn(
                'mt-8 max-w-[34ch] font-sans text-[15px] font-light leading-[1.7] text-cream-primary/75 md:max-w-[560px]',
                mirrored && 'md:ml-auto md:text-right',
              )}
            >
              {body}
            </p>
          </Reveal>

          {children && (
            <Reveal variant="rise" delay={0.34} amount={0.15}>
              <div className={cn(mirrored && 'md:flex md:justify-end')}>{children}</div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
