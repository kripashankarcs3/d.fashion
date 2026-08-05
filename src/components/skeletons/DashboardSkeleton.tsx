import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading skeleton for the Dashboard page.
 * Shows a heading + profile meter strip + grid of placeholder cards.
 */
export default function DashboardSkeleton() {
  return (
    <div className="pt-28 pb-24 min-h-screen bg-surface-0">
      <div className="max-w-6xl mx-auto px-6 space-y-10">

        {/* Page heading */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>

        {/* Profile-completion meter strip */}
        <div className="rounded-xl border border-surface-3 bg-surface-1 p-6 space-y-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-24" />
            ))}
          </div>
        </div>

        {/* Insights / charts row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-surface-3 bg-surface-1 p-6 space-y-4"
            >
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          ))}
        </div>

        {/* Wardrobe section heading */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-56" />
        </div>

        {/* Wardrobe card grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-surface-3 bg-surface-1 overflow-hidden space-y-3 p-4"
            >
              <Skeleton className="h-36 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
