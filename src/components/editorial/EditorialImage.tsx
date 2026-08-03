import { cn, srcsetFromUrl } from '@/lib/utils';

type Ratio = 'portrait' | 'tall' | 'square' | 'landscape' | 'wide' | 'fill';
type Scrim = 'none' | 'bottom' | 'left' | 'right' | 'soft';

interface EditorialImageProps {
  src: string;
  alt: string;
  ratio?: Ratio;
  scrim?: Scrim;
  /** Shifts the crop so faces and subjects survive tight aspect ratios. */
  position?: string;
  priority?: boolean;
  sizes?: string;
  zoom?: boolean;
  className?: string;
  imgClassName?: string;
  widths?: number[];
  cinematic?: boolean;
  cinematicIntensity?: number;
  /** Render a full-bleed edge fade so the frame dissolves into #070707. */
  fadeEdges?: boolean;
}

const ratioClasses: Record<Ratio, string> = {
  portrait: 'aspect-[4/5]',
  tall: 'aspect-[3/4.4]',
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[16/9]',
  fill: 'h-full w-full',
};

const scrimClasses: Record<Scrim, string> = {
  none: '',
  bottom: 'scrim-bottom',
  left: 'scrim-left',
  right: 'scrim-right',
  soft: 'scrim-soft',
};

const DEFAULT_WIDTHS = [480, 768, 1080, 1440, 1920];

/**
 * Campaign photography with a directional scrim rather than a flat wash.
 * Intrinsic dimensions and a reserved aspect box keep layout shift at zero.
 */
export default function EditorialImage({
  src,
  alt,
  ratio = 'portrait',
  scrim = 'none',
  position = 'center',
  priority = false,
  sizes = '100vw',
  zoom = false,
  className,
  imgClassName,
  widths = DEFAULT_WIDTHS,
  cinematic = true,
  cinematicIntensity = 0.8,
  fadeEdges = false,
}: EditorialImageProps) {
  return (
    <div className={cn('relative overflow-hidden bg-surface-3', ratioClasses[ratio], className)}>
      <img
        src={src}
        srcSet={srcsetFromUrl(src, widths)}
        sizes={sizes}
        alt={alt}
        width={1600}
        height={2000}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority
          ? ({ fetchpriority: 'high' } as React.ImgHTMLAttributes<HTMLImageElement>)
          : {})}
        style={{ objectPosition: position }}
        className={cn(
          'h-full w-full object-cover',
          cinematic && 'cinematic-image',
          zoom &&
            'transition-transform duration-[var(--duration-image)] ease-[var(--ease-editorial)] motion-safe:group-hover:scale-[1.045]',
          imgClassName,
        )}
      />
      {cinematic && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 cinematic-vignette opacity-45"
        />
      )}
      {scrim !== 'none' && (
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0',
            cinematic
              ? scrim === 'left'
                ? 'cinematic-overlay-left'
                : scrim === 'right'
                  ? 'cinematic-overlay-right'
                  : scrim === 'bottom'
                    ? 'cinematic-overlay-bottom'
                    : scrimClasses[scrim]
              : scrimClasses[scrim]
          )}
          style={cinematic ? { opacity: cinematicIntensity } : undefined}
        />
      )}
      {fadeEdges && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 campaign-fade-edges"
        />
      )}
    </div>
  );
}
