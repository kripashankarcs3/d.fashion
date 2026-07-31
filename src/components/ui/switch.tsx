import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-input bg-input',
      'transition-colors duration-[var(--duration-fast)] ease-out',
      'before:absolute before:-inset-y-2.5 before:-inset-x-1 before:content-[""]',
      'data-[state=checked]:border-gold-primary data-[state=checked]:bg-primary',
      'disabled:cursor-not-allowed disabled:opacity-40',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block size-5 translate-x-0 rounded-full bg-white shadow-sm ring-0 transition-transform duration-[var(--duration-fast)]',
        'data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-[2px]',
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
