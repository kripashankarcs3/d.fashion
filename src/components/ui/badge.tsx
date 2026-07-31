import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  [
    'inline-flex items-center whitespace-nowrap rounded-md border px-2.5 py-1',
    'text-[length:var(--text-caption)] font-semibold leading-none',
    'transition-colors duration-[var(--duration-fast)] ease-out',
  ].join(' '),
  {
    variants: {
      variant: {
        gold: 'border-transparent bg-gold-primary text-espresso',
        neutral: 'border-transparent bg-cream-dark text-espresso-light',
        success: 'border-gold-primary bg-cream-dark text-espresso',
        error: 'border-error bg-white text-espresso',
        outline: 'border-gold-primary bg-transparent text-espresso',
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
