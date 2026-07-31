import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Skeleton } from '@/components/ui/skeleton';

const cardVariants = cva(
  [
    'rounded-lg border bg-card text-card-foreground',
    'shadow-[var(--shadow-card)]',
    'transition-[box-shadow,border-color,transform] duration-[var(--duration-fast)] ease-out',
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'border-card-border hover:shadow-[var(--shadow-card-hover)]',
        feature:
          'border-transparent bg-cream-dark hover:scale-[1.015] hover:shadow-[var(--shadow-card-hover)]',
        report:
          'border-card-border hover:shadow-[var(--shadow-card-hover)]',
        statistic:
          'border-card-border hover:shadow-[var(--shadow-card-hover)]',
        testimonial:
          'border-card-border hover:scale-[1.01] hover:shadow-[var(--shadow-card-hover)]',
      },
      interactive: {
        true: 'cursor-pointer',
        false: '',
      },
      selected: {
        true: 'border-gold-primary shadow-[var(--shadow-card-hover)]',
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
            'rounded-lg border border-card-border bg-card p-8 shadow-[var(--shadow-card)]',
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
