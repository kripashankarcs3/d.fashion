/**
 * Scroll behaviour for route changes.
 *
 * Every page used to reset the scroll position in its own mount effect, which
 * made anchor navigation impossible: the page transition mounts the incoming
 * route more than once, so a late reset would always undo a jump to a section.
 * The router now owns this — see `ScrollManager`.
 */

interface PendingTarget {
  /** Route the section lives on; the intent is dropped if we land elsewhere. */
  path: string;
  /** DOM id of the section to land on. */
  hash: string;
}

let pending: PendingTarget | null = null;

/** Records where a cross-page anchor link is headed, before navigating. */
export function setPendingScrollTarget(path: string, hash: string) {
  pending = { path, hash };
}

/** The section to land on for `path`, or null for a normal top-of-page reset. */
export function pendingScrollTargetFor(path: string): string | null {
  if (!pending) return null;
  if (pending.path !== path) {
    pending = null;
    return null;
  }
  return pending.hash;
}

export function clearPendingScrollTarget() {
  pending = null;
}

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scrolls a section into view. Returns false when it has not mounted yet. */
export function scrollToSection(id: string, smooth = false) {
  const target = document.getElementById(id);
  if (!target) return false;
  target.scrollIntoView({
    behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'instant',
    block: 'start',
  });
  return true;
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'instant' });
}
