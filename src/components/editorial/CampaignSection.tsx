import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import EditorialImage from './EditorialImage';

interface CampaignSectionProps {
  src: string;
  alt: string;
  children: ReactNode;
  /** Overlay anchor. Mobile always resolves to a bottom-anchored stack. */
  anchor?: 'bottom-left' | 'bottom-right' | 'center' | 'top-left';
  height?: 'screen' | 'tall' | 'mid' | 'band';
  scrim?: 'bottom' | 'left' | 'right' | 'soft';
  position?: string;
  priority?: boolean;
  className?: string;
  contentClassName?: string;
  cinematic?: boolean;
  cinematicIntensity?: number;
  fadeEdges?: boolean;
}

const heightClasses: Record<NonNullable<CampaignSectionProps['height']>, string> = {
  screen: 'min-h-[100svh]',
  tall: 'min-h-[82svh] lg:min-h-[88svh]',
  mid: 'min-h-[62svh] lg:min-h-[70svh]',
  band: 'min-h-[46svh] lg:min-h-[54svh]',
};

const anchorClasses: Record<NonNullable<CampaignSectionProps['anchor']>, string> = {
  'bottom-left': 'items-end justify-start text-left',
  'bottom-right': 'items-end justify-start text-left lg:justify-end lg:text-right',
  center: 'items-end justify-start text-left lg:items-center lg:justify-center lg:text-center',
  'top-left': 'items-end justify-start text-left lg:items-start',
};

/**
 * Full-bleed photography carrying typography directly on the frame.
 * The overlay anchor collapses to bottom-left on small screens so copy never
 * lands over a face.
 */
export default function CampaignSection({
  src,
  alt,
  children,
  anchor = 'bottom-left',
  height = 'tall',
  scrim = 'bottom',
  position = 'center',
  priority = false,
  className,
  contentClassName,
  cinematic = true,
  cinematicIntensity = 0.9,
  fadeEdges = true,
}: CampaignSectionProps) {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden bg-[#0B0B0E]',
        heightClasses[height],
        className,
      )}
    >
      <div className="absolute inset-0 -z-10">
        <EditorialImage
          src={src}
          alt={alt}
          ratio="fill"
          scrim={scrim}
          position={position}
          priority={priority}
          sizes="100vw"
          className="h-full w-full"
          cinematic={cinematic}
          cinematicIntensity={cinematicIntensity}
          fadeEdges={fadeEdges}
        />
      </div>

      <div
        className={cn(
          'relative flex h-full min-h-[inherit] px-[var(--gutter)] pb-14 pt-24 md:pb-20 lg:pb-24',
          anchorClasses[anchor],
        )}
      >
        <div className={cn('mx-auto w-full max-w-container-editorial', contentClassName)}>
          {children}
        </div>
      </div>
    </section>
  );
}
