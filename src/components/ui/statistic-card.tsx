import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  type CardProps,
} from '@/components/ui/card';

export interface StatisticCardProps extends CardProps {
  value: React.ReactNode;
  label: React.ReactNode;
  description?: React.ReactNode;
}

const StatisticCard = React.forwardRef<HTMLDivElement, StatisticCardProps>(
  ({ className, value, label, description, ...props }, ref) => (
    <Card ref={ref} variant="statistic" className={cn('', className)} {...props}>
      <CardContent className="flex flex-col gap-1">
        <span className="font-serif text-[length:var(--text-h2)] leading-none text-gold-primary">
          {value}
        </span>
        <span className="text-[length:var(--text-body-sm)] font-medium text-foreground">
          {label}
        </span>
        {description && (
          <span className="text-[length:var(--text-caption)] text-muted-foreground">
            {description}
          </span>
        )}
      </CardContent>
    </Card>
  ),
);
StatisticCard.displayName = 'StatisticCard';

export { StatisticCard };
