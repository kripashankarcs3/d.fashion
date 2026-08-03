import { useEffect } from 'react';
import {
  clearPendingScrollTarget,
  pendingScrollTargetFor,
  scrollToSection,
  scrollToTop,
} from '@/lib/scroll';

/** Frames to wait for a section to mount before giving up (~1s at 60fps). */
const MAX_FRAMES = 60;

/**
 * Owns the scroll position on navigation: a new route starts at the top unless
 * an anchor link asked for a specific section, in which case we wait for that
 * section to mount and land on it.
 *
 * Rendered inside the animated page container so it runs when the incoming page
 * does — the transition holds the outgoing route for a moment first.
 */
export default function ScrollManager({ path }: { path: string }) {
  useEffect(() => {
    const target = pendingScrollTargetFor(path);

    if (!target) {
      scrollToTop();
      return;
    }

    let frame = 0;
    let raf = 0;
    const land = () => {
      if (scrollToSection(target)) {
        clearPendingScrollTarget();
        return;
      }
      if (frame >= MAX_FRAMES) {
        scrollToTop();
        clearPendingScrollTarget();
        return;
      }
      frame += 1;
      raf = requestAnimationFrame(land);
    };
    raf = requestAnimationFrame(land);
    return () => cancelAnimationFrame(raf);
  }, [path]);

  return null;
}
