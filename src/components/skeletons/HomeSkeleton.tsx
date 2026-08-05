/**
 * Loading state for the Home page — intentionally invisible.
 * A plain full-bleed dark screen so the brief lazy-load flash is
 * imperceptible rather than showing skeleton bars.
 */
export default function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-surface-0" aria-hidden="true" />
  );
}
