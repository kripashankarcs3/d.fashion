import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Skeleton } from '@/components/ui/skeleton';

const cardVariants = cva(
  [
    'border bg-card text-card-foreground',
    'transition-[border-color] duration-[var(--duration-normal)] ease-[var(--ease-editorial)]',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'rounded-none border-card-border hover:border-gold-border-hover',
        /* Squared, unshadowed, hairline-only — the editorial default. */
        editorial: 'rounded-none border-transparent bg-transparent',
        /* A quiet tinted surface with no rule at all. */
        surface: 'rounded-none border-transparent bg-surface-4/60',
        feature: 'rounded-none border-transparent bg-surface-4/60 hover:bg-surface-5/60',
        /* A quiet, unassuming surface for dense reporting. */
        report: 'rounded-none border-gold-hairline bg-surface-3/50 hover:border-gold-border',
        statistic: 'rounded-none border-gold-hairline',
        testimonial: 'rounded-none border-gold-hairline hover:border-gold-border',
      },
      interactive: {
        true: 'cursor-pointer',
        false: '',
      },
      selected: {
        true: 'border-gold-primary',
        false: '',
      },
      disabled: {
        true: 'pointer-events-none opacity-40',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      interactive: false,
      selected: false,
      disabled: false,
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, selected, disabled, ...props }, ref) => (
    <div
      ref={ref}
      data-interactive={interactive || undefined}
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        cardVariants({ variant, interactive, selected, disabled }),
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-2 p-8', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'font-serif text-[length:var(--text-h5)] leading-[1.3] text-foreground',
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-[length:var(--text-body-sm)] text-muted-foreground',
      className,
    )}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-8 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-4 p-8 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export interface CardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
}

const CardSkeleton = React.forwardRef<HTMLDivElement, CardSkeletonProps>(
  ({ className, count = 1, ...props }, ref) => (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          ref={i === 0 ? ref : undefined}
          aria-hidden="true"
          className={cn(
            'rounded-none border border-gold-hairline bg-surface-3 p-8',
            className,
          )}
          {...props}
        >
          <Skeleton className="h-5 w-2/3 rounded-md" />
          <Skeleton className="mt-5 h-3 w-full rounded-md" />
          <Skeleton className="mt-2.5 h-3 w-5/6 rounded-md" />
          <Skeleton className="mt-2.5 h-3 w-2/3 rounded-md" />
          <Skeleton className="mt-6 h-8 w-28 rounded-md" />
        </div>
      ))}
    </>
  ),
);
CardSkeleton.displayName = 'CardSkeleton';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardSkeleton,
  cardVariants,
};
