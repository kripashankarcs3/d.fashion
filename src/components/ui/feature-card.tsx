import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardDescription,
  CardTitle,
  type CardProps,
} from '@/components/ui/card';

export interface FeatureCardProps extends Omit<CardProps, 'title'> {
  media?: React.ReactNode;
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, media, icon, title, description, ...props }, ref) => (
    <Card ref={ref} variant="feature" className={cn('overflow-hidden', className)} {...props}>
      {media && (
        <div className="aspect-[16/10] w-full overflow-hidden bg-cream-primary">
          {media}
        </div>
      )}
      <div className="flex flex-col gap-2 p-8">
        {icon && <span aria-hidden="true">{icon}</span>}
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </div>
    </Card>
  ),
);
FeatureCard.displayName = 'FeatureCard';

export { FeatureCard };
