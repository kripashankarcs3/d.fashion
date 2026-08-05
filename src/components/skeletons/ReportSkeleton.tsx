import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading skeleton for the Report page.
 * Mirrors the report layout: season title, confidence bar,
 * swatch palette grid, section headings, and swatch rows.
 */
export default function ReportSkeleton() {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-surface-0">
      <div className="max-w-4xl mx-auto px-6 space-y-12">

        {/* Season title + confidence bar */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-2 w-40 rounded-full" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Palette swatch grid — 8 swatches */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-full" />
            ))}
          </div>
        </div>

        {/* Neutrals row */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-28" />
          <div className="flex gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-full" />
            ))}
          </div>
        </div>

        {/* Section: Makeup shades */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-44" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>

        {/* Section: Product recommendations */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-52" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-surface-3 bg-surface-1 p-4 space-y-3">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
