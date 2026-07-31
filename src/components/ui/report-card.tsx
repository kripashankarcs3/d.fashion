import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  type CardProps,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface ReportCardProps extends Omit<CardProps, 'title'> {
  title: React.ReactNode;
  value?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const ReportCard = React.forwardRef<HTMLDivElement, ReportCardProps>(
  ({ className, title, value, icon, children, ...props }, ref) => (
    <Card ref={ref} variant="report" className={cn('', className)} {...props}>
      <CardHeader className="flex-row items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {icon && <span aria-hidden="true">{icon}</span>}
          <CardTitle className="truncate text-[length:var(--text-body-sm)] font-semibold">
            {title}
          </CardTitle>
        </div>
        {value && <Badge variant="gold">{value}</Badge>}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  ),
);
ReportCard.displayName = 'ReportCard';

export { ReportCard };
