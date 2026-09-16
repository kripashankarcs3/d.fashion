import { Link } from 'wouter';
import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTryOnUsage } from '@/hooks/useTryOnUsage';

/** "2 / 9 AI try-ons used · 7 left" — shared by the dashboard and try-on page.
 *  Renders nothing until the usage for the signed-in account is known. */
export function TryOnQuotaPill({ full = false, className }: { full?: boolean; className?: string }) {
  const { data } = useTryOnUsage();
  if (!data) return null;

  if (data.unlimited || data.limit === null) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-2 rounded-sm border border-gold-hairline bg-surface-0/75 backdrop-blur-sm',
          full ? 'w-full justify-center px-4 py-2' : 'px-3 py-1.5',
          className,
        )}
      >
        <BadgeCheck className={cn('shrink-0 text-gold-primary', full ? 'h-4 w-4' : 'h-3.5 w-3.5')} aria-hidden />
        <span className={cn('font-semibold tracking-wider text-cream-primary', full ? 'text-sm' : 'text-xs')}>
          Unlimited AI try-ons
        </span>
      </span>
    );
  }

  const remaining = Math.max(0, data.limit - data.used);
  const exhausted = remaining <= 0;
  const content = (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-sm border backdrop-blur-sm',
        full ? 'w-full justify-center px-4 py-2' : 'px-3 py-1.5',
        exhausted
          ? 'border-gold-primary/60 bg-gold-primary/15 text-gold-primary'
          : 'border-gold-hairline bg-surface-0/75 text-cream-primary/70',
        className,
      )}
      title={exhausted ? 'Try-on limit reached — get 1 more for ₹5' : `${remaining} AI try-on${remaining === 1 ? '' : 's'} left`}
    >
      <BadgeCheck className={cn('shrink-0 text-gold-primary', full ? 'h-4 w-4' : 'h-3.5 w-3.5')} aria-hidden />
      <span className={cn('font-semibold tracking-wider text-cream-primary tabular-nums', full ? 'text-sm' : 'text-xs')}>
        {data.used}
        <span className="text-cream-primary/55"> / {data.limit}</span>
      </span>
      <span className={cn('uppercase', full ? 'eyebrow-micro' : 'eyebrow-micro')}>AI try-ons used</span>
      <span className="text-gold-primary">
        <span aria-hidden>·</span> {exhausted ? 'Get 1 more — ₹5' : `${remaining} left`}
      </span>
    </span>
  );

  return exhausted ? <Link href="/payment?kind=topup">{content}</Link> : content;
}