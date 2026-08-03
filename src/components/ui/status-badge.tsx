import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge, badgeVariants, type BadgeProps } from '@/components/ui/badge';

type StatusTone = NonNullable<BadgeProps['variant']>;

export interface StatusBadgeProps extends BadgeProps {
  tone?: StatusTone;
  icon?: React.ReactNode;
  hideDot?: boolean;
}

const statusDotColors: Record<StatusTone, string> = {
  gold: 'bg-gold-primary',
  neutral: 'bg-gold-primary/40',
  success: 'bg-gold-primary',
  error: 'bg-error',
  outline: 'bg-gold-primary/40',
  inverse: 'bg-gold-primary',
};

function StatusBadge({
  className,
  variant,
  tone = 'neutral',
  icon,
  hideDot = false,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <Badge
      variant={tone}
      className={cn('gap-1.5', className)}
      {...props}
    >
      {!hideDot && (
        <span aria-hidden="true" className="inline-flex">
          {icon ?? (
            <span
              className={cn(
                'inline-block size-1.5 rounded-pill',
                statusDotColors[tone],
              )}
            />
          )}
        </span>
      )}
      {children}
    </Badge>
  );
}

export { StatusBadge, badgeVariants };
