import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'relative grid size-5 shrink-0 cursor-pointer place-content-center rounded-sm border border-input bg-white',
      'transition-colors duration-[var(--duration-fast)] ease-out',
      'before:absolute before:-inset-3 before:content-[""]',
      'data-[state=checked]:border-gold-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      'disabled:cursor-not-allowed disabled:opacity-40',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="grid place-content-center text-current">
      <Check className="size-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
