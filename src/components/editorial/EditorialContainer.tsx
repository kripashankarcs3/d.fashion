import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EditorialContainerProps {
  children: ReactNode;
  /** `editorial` is wider than the legacy 1200px content column. */
  width?: 'editorial' | 'content' | 'narrow' | 'reading';
  className?: string;
}

const widthClasses: Record<NonNullable<EditorialContainerProps['width']>, string> = {
  editorial: 'max-w-container-editorial',
  content: 'max-w-container-content',
  narrow: 'max-w-container-narrow',
  reading: 'max-w-container-reading',
};

/**
 * The editorial measure. Uses the fluid `--gutter` so margins grow with the
 * viewport instead of snapping at breakpoints.
 */
export default function EditorialContainer({
  children,
  width = 'editorial',
  className,
}: EditorialContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-[var(--gutter)]', widthClasses[width], className)}>
      {children}
    </div>
  );
}
