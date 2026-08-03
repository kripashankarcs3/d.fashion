import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'relative inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-none',
    'font-sans text-[length:var(--text-caption)] font-medium uppercase leading-none tracking-eyebrow',
    'transition-[background-color,color,border-color,opacity] duration-[var(--duration-normal)] ease-[var(--ease-editorial)]',
    'disabled:cursor-not-allowed disabled:opacity-40',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        /* Solid gold. The single loudest element on any page — used sparingly. */
        primary: [
          'bg-gold-primary text-surface-0',
          'enabled:hover:bg-gold-light',
        ].join(' '),
        /* Thin-rule outline. The default for anything that is not the one CTA. */
        secondary: [
          'border border-gold-border bg-transparent text-cream-primary',
          'enabled:hover:border-gold-primary enabled:hover:bg-gold-primary/10 enabled:hover:text-gold-primary',
        ].join(' '),
        /* Warm accent — reserved for moments that carry the brand colour. */
        accent: [
          'bg-primary text-surface-0',
          'enabled:hover:bg-gold-dark enabled:hover:text-cream-primary',
        ].join(' '),
        /* On dark campaign grounds. */
        inverse: [
          'bg-gold-primary text-surface-0',
          'enabled:hover:bg-gold-light',
        ].join(' '),
        inverseOutline: [
          'border border-gold-border bg-transparent text-cream-primary',
          'enabled:hover:border-gold-border-hover enabled:hover:bg-gold-primary/10 enabled:hover:text-gold-light',
        ].join(' '),
        tertiary: [
          'bg-transparent text-cream-primary/70',
          'bg-no-repeat bg-left-bottom bg-[linear-gradient(var(--color-gold-primary),var(--color-gold-primary))] bg-[length:0%_1px]',
          'enabled:hover:text-cream-primary enabled:hover:bg-[length:100%_1px]',
        ].join(' '),
        destructive: [
          'bg-destructive text-destructive-foreground',
          'enabled:hover:bg-error/90',
        ].join(' '),
        icon: [
          'bg-surface-4 text-cream-primary',
          'enabled:hover:bg-surface-5',
          '[&_svg]:size-5',
        ].join(' '),
        link: [
          'bg-transparent text-cream-primary',
          'bg-no-repeat bg-left-bottom bg-[linear-gradient(var(--color-gold-primary),var(--color-gold-primary))] bg-[length:0%_1px]',
          'enabled:hover:bg-[length:100%_1px]',
        ].join(' '),
        outline: [
          'border border-gold-border bg-transparent text-cream-primary',
          'enabled:hover:border-gold-primary enabled:hover:bg-gold-primary/10',
        ].join(' '),
        ghost: [
          'bg-transparent text-cream-primary/80',
          'enabled:hover:bg-gold-primary/10 enabled:hover:text-gold-primary',
        ].join(' '),
      },
      size: {
        default: 'min-h-11 px-7 py-3.5',
        sm: 'min-h-11 px-5',
        lg: 'min-h-[52px] min-w-[var(--size-cta-min-width)] px-10 py-4',
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
