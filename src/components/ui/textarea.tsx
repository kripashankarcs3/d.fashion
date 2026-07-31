import * as React from 'react';
import { cn } from '@/lib/utils';
import { fieldControlVariants } from '@/components/ui/form-control';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        fieldControlVariants(),
        'h-auto min-h-[var(--size-field-height)] resize-y items-start py-3',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
