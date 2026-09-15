import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTryOnUsage } from '@/hooks/useTryOnUsage';

/** "3 / 9 try-ons used" pill — shared by the dashboard and try-on page.
 *  Renders nothing until the usage for the signed-in account is known. */
export function TryOnQuotaPill({ className }: { className?: string }) {
  const { data } = useTryOnUsage();
  if (!data) return null;
  const exhausted = data.used >= data.limit;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border px-3 py-1 eyebrow-micro backdrop-blur-sm',
        exhausted
          ? 'border-gold-primary/60 bg-gold-primary/15 text-gold-primary'
          : 'border-gold-hairline bg-surface-0/75 text-cream-primary/70',
        className,
      )}
      title={exhausted ? 'Free AI try-on limit reached' : 'Free AI try-ons remaining'}
    >
      <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
      {data.used} / {data.limit} try-ons used
    </span>
  );
}