import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Size = 'campaign' | 'xl' | 'lg' | 'md' | 'sm';

interface EditorialHeadingProps {
  children: ReactNode;
  size?: Size;
  as?: ElementType;
  tone?: 'ink' | 'inverse';
  className?: string;
  id?: string;
}

const sizeClasses: Record<Size, string> = {
  campaign: 'text-campaign',
  xl: 'text-editorial-xl',
  lg: 'text-editorial-lg',
  md: 'text-editorial-md',
  sm: 'text-editorial-sm',
};

/**
 * Fluid serif display heading. Wrap the words carried in italic with
 * <Emphasis> — italics are for deliberate emphasis, not decoration.
 */
export default function EditorialHeading({
  children,
  size = 'lg',
  as: Component = 'h2',
  tone = 'ink',
  className,
  id,
}: EditorialHeadingProps) {
  return (
    <Component
      id={id}
      className={cn(
        'font-display',
        sizeClasses[size],
        tone === 'inverse' ? 'text-cream-primary' : 'text-cream-primary',
        className,
      )}
    >
      {children}
    </Component>
  );
}

export function Emphasis({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <em className={cn('display-italic', className)}>{children}</em>;
}
