import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  [
    'inline-flex items-center whitespace-nowrap rounded-none border px-2.5 py-1.5',
    'eyebrow-micro',
    'transition-colors duration-[var(--duration-fast)] ease-out',
  ].join(' '),
  {
    variants: {
      variant: {
        gold: 'border-gold-border bg-gold-primary/15 text-gold-primary',
        neutral: 'border-transparent bg-surface-4 text-cream-primary/80',
        success: 'border-gold-primary/40 bg-transparent text-gold-light',
        error: 'border-error bg-transparent text-error',
        outline: 'border-gold-border bg-transparent text-cream-primary',
        inverse: 'border-gold-border bg-transparent text-cream-primary',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
