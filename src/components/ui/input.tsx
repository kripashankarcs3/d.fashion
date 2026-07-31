import * as React from 'react';
import { cn } from '@/lib/utils';
import { fieldControlVariants } from '@/components/ui/form-control';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(fieldControlVariants(), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
