import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md text-[length:var(--text-nav)] leading-[var(--text-nav--line-height)] font-semibold tracking-button',
    'transition-all duration-[var(--duration-fast)] ease-out',
    'enabled:active:scale-[0.98]',
    'disabled:cursor-not-allowed disabled:opacity-40',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-primary text-primary-foreground',
          'enabled:hover:scale-[1.01] enabled:hover:bg-gold-light enabled:hover:shadow-cta-hover',
          'enabled:active:bg-gold-dark',
        ].join(' '),
        secondary: [
          'border border-primary bg-transparent text-primary',
          'enabled:hover:scale-[1.01] enabled:hover:bg-primary enabled:hover:text-primary-foreground',
          'enabled:active:bg-gold-dark enabled:active:text-primary-foreground',
        ].join(' '),
        tertiary: [
          'bg-transparent text-espresso-light',
          'bg-no-repeat bg-left-bottom bg-[linear-gradient(var(--color-gold-primary),var(--color-gold-primary))] bg-[length:0%_var(--size-underline)]',
          'enabled:hover:text-espresso enabled:hover:bg-[length:100%_var(--size-underline)]',
        ].join(' '),
        destructive: [
          'bg-destructive text-destructive-foreground',
          'enabled:hover:scale-[1.01] enabled:hover:bg-error/90',
          'enabled:active:bg-error/80',
        ].join(' '),
        icon: [
          'bg-primary text-primary-foreground',
          'enabled:hover:scale-[1.01] enabled:hover:bg-gold-light enabled:hover:shadow-cta-hover',
          'enabled:active:bg-gold-dark',
          '[&_svg]:size-5',
        ].join(' '),
        link: [
          'bg-transparent text-espresso',
          'bg-no-repeat bg-left-bottom bg-[linear-gradient(var(--color-gold-primary),var(--color-gold-primary))] bg-[length:0%_var(--size-underline)]',
          'enabled:hover:bg-[length:100%_var(--size-underline)]',
        ].join(' '),
        outline: [
          'border border-border bg-background text-foreground',
          'enabled:hover:bg-muted enabled:hover:text-foreground',
        ].join(' '),
        ghost: [
          'bg-transparent text-foreground',
          'enabled:hover:bg-cream-dark enabled:hover:text-foreground',
        ].join(' '),
      },
      size: {
        default: 'min-h-11 px-8 py-3.5',
        sm: 'min-h-11 px-4',
        lg: 'min-h-11 min-w-[var(--size-cta-min-width)] px-10 py-3.5',
        icon: 'h-11 w-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading ? true : disabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        )}
        {children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
