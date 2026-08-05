import { motion, useReducedMotion } from 'framer-motion';
import { CAMPAIGN_ASSETS } from '@/lib/campaign-assets.generated';
import { cn } from '@/lib/utils';

type Ratio = 'portrait' | 'tall' | 'square' | 'landscape' | 'wide' | 'fill';
type Scrim = 'none' | 'bottom' | 'left' | 'right' | 'soft';

interface EditorialImageProps {
  /** Extension-less base path of a self-hosted campaign image, e.g.
   *  "/images/campaign/opening". The optimizer emits `${src}-<w>.<fmt>` for
   *  every width/format plus `${src}-lqip.webp`. */
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
  /** Wipe the sharp image up with `clip-path` + a slow settle when it
   *  scrolls into view (LQIP stays visible beneath). Priority images skip
   *  this so the LCP never waits on an entrance animation. */
  reveal?: boolean;
}

const ratioClasses: Record<Ratio, string> = {
  portrait: 'aspect-[4/5]',
  tall: 'aspect-[3/4.4]',
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[16/9]',
  fill: 'h-full w-full',
};

/* Intrinsic aspect pair per ratio, used to derive the width/height attributes
   so the browser reserves the correct box and CLS stays at zero. */
const ratioAspects: Record<Exclude<Ratio, 'fill'>, [number, number]> = {
  portrait: [4, 5],
  tall: [3, 4.4],
  square: [1, 1],
  landscape: [4, 3],
  wide: [16, 9],
};

/* Concrete pixel dimensions per ratio. Used as intrinsic size hints on <img>
   so the browser can reserve the exact layout box without loading the image,
   preventing Cumulative Layout Shift. The `fill` ratio gets a sensible
   landscape default since its container dictates the actual rendered size. */
const RATIO_DIMENSIONS: Record<string, [number, number]> = {
  fill: [1600, 1000],
  portrait: [1200, 1600],
  wide: [1600, 900],
  square: [1000, 1000],
};

const scrimClasses: Record<Scrim, string> = {
  none: '',
  bottom: 'scrim-bottom',
  left: 'scrim-left',
  right: 'scrim-right',
  soft: 'scrim-soft',
};

export const CAMPAIGN_WIDTHS = [480, 768, 1080, 1440, 1920];

const REFERENCE_WIDTH = 1600;

/** Builds a `srcset` for one format of a campaign base path. */
export function campaignSrcset(src: string, ext: string, widths: number[]): string {
  return widths.map((w) => `${src}-${w}.${ext} ${w}w`).join(', ');
}

/**
 * Campaign photography with a directional scrim rather than a flat wash.
 * Emits a real `<picture>` (AVIF → WebP → JPEG) over a base64 LQIP, so the
 * frame decodes progressively and never blanks while loading.
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
  widths = CAMPAIGN_WIDTHS,
  cinematic = true,
  cinematicIntensity = 0.8,
  fadeEdges = false,
  reveal = true,
}: EditorialImageProps) {
  const slug = src.split('/').pop() ?? '';
  const asset = CAMPAIGN_ASSETS[slug];
  const reduceMotion = useReducedMotion();

  // Use explicit pixel-pair hint when available (covers fill, portrait, wide, square)
  // so the browser can reserve the exact layout box and CLS stays at zero.
  // Fall back to the aspect-ratio computation for ratios not in the map (tall, landscape).
  let width: number;
  let height: number;
  if (RATIO_DIMENSIONS[ratio]) {
    [width, height] = RATIO_DIMENSIONS[ratio];
  } else if (ratio === 'fill') {
    width = asset?.width ?? 1920;
    height = asset?.height ?? 2880;
  } else {
    const [aspectW, aspectH] = ratioAspects[ratio];
    width = REFERENCE_WIDTH;
    height = Math.round((REFERENCE_WIDTH * aspectH) / aspectW);
  }

  const fallbackWidth = widths[Math.floor((widths.length - 1) / 2)] ?? 1080;

  const picture = (
    <picture>
      <source type="image/avif" srcSet={campaignSrcset(src, 'avif', widths)} sizes={sizes} />
      <source type="image/webp" srcSet={campaignSrcset(src, 'webp', widths)} sizes={sizes} />
      <img
        src={`${src}-${fallbackWidth}.jpg`}
        srcSet={campaignSrcset(src, 'jpg', widths)}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
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
    </picture>
  );

  const animateReveal = reveal && !priority && !reduceMotion;

  return (
    <div
      className={cn('relative overflow-hidden bg-surface-3', ratioClasses[ratio], className)}
      style={
        asset?.lqip
          ? {
              backgroundImage: `url("${asset.lqip}")`,
              backgroundSize: 'cover',
              backgroundPosition: position,
            }
          : undefined
      }
    >
      {animateReveal ? (
        <motion.div
          className="absolute inset-0"
          initial={{ clipPath: 'inset(0 0 8% 0)', scale: 1.06 }}
          whileInView={{ clipPath: 'inset(0 0 0% 0)', scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: 'clip-path, transform' }}
        >
          {picture}
        </motion.div>
      ) : (
        picture
      )}
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
