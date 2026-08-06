import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc?: string;
  beforeLabel?: string;
  afterLabel?: string;
  /**
   * When afterSrc is the same as beforeSrc (demo mode), this hex colour
   * is used to tint only the body/torso region (bottom 65% of the image)
   * via a CSS gradient mask — leaving the face area untouched.
   */
  afterColour?: string;
  className?: string;
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = 'Original',
  afterLabel = 'With Outfit',
  afterColour = '#8B4513',
  className,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);
  const effectiveAfterSrc = afterSrc ?? beforeSrc;
  const isDemoMode = !afterSrc || afterSrc === beforeSrc;

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => { dragging.current = true; updatePosition(e.clientX); };
  const onTouchStart = (e: React.TouchEvent) => { dragging.current = true; updatePosition(e.touches[0].clientX); };

  useEffect(() => {
    const onMove  = (e: MouseEvent) => { if (dragging.current) updatePosition(e.clientX); };
    const onTouch = (e: TouchEvent) => { if (dragging.current) updatePosition(e.touches[0].clientX); };
    const onUp    = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onUp);
    };
  }, [updatePosition]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative select-none overflow-hidden rounded-sm border border-gold-hairline cursor-col-resize',
        className,
      )}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* ── After side (full width, behind) ── */}
      <div className="relative h-full w-full">
        <img
          src={effectiveAfterSrc}
          alt={afterLabel}
          draggable={false}
          className="h-full w-full object-cover object-top"
        />
        {/* In demo mode: gradient-masked colour overlay — fades in from 35%
            down so only the outfit/body area is tinted, face is preserved */}
        {isDemoMode && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, transparent 0%, transparent 30%, ${afterColour}99 55%, ${afterColour}cc 100%)`,
              mixBlendMode: 'multiply',
            }}
          />
        )}
      </div>

      {/* ── Before side (clipped, on top) ── */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img
          src={beforeSrc}
          alt={beforeLabel}
          draggable={false}
          className="h-full w-full object-cover object-top"
          style={{ width: containerRef.current?.offsetWidth ?? 'auto' }}
        />
      </div>

      {/* ── Divider ── */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-gold-primary shadow-[0_0_10px_rgba(201,168,76,0.6)]"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      />

      {/* ── Handle ── */}
      <div
        className="pointer-events-none absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gold-primary bg-surface-0/90 shadow-lg backdrop-blur-sm"
        style={{ left: `${position}%` }}
      >
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden>
          <path d="M1 5h16M5 1L1 5l4 4M13 1l4 4-4 4" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* ── Labels ── */}
      <span className="pointer-events-none absolute bottom-3 left-3 rounded-sm bg-surface-0/80 px-2 py-0.5 text-[0.55rem] uppercase tracking-widest text-cream-primary/70 backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute bottom-3 right-3 rounded-sm bg-surface-0/80 px-2 py-0.5 text-[0.55rem] uppercase tracking-widest text-cream-primary/70 backdrop-blur-sm">
        {afterLabel}
      </span>
    </div>
  );
}
