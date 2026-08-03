import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EditorialSplitProps {
  media: ReactNode;
  children: ReactNode;
  /** Asymmetry is the point — perfect halves read as a template. */
  ratio?: '55-45' | '60-40' | '45-55' | '40-60';
  reversed?: boolean;
  align?: 'center' | 'start' | 'end';
  gap?: 'normal' | 'wide';
  className?: string;
}

const ratioClasses: Record<NonNullable<EditorialSplitProps['ratio']>, string> = {
  '55-45': 'lg:grid-cols-[55fr_45fr]',
  '60-40': 'lg:grid-cols-[60fr_40fr]',
  '45-55': 'lg:grid-cols-[45fr_55fr]',
  '40-60': 'lg:grid-cols-[40fr_60fr]',
};

const alignClasses = {
  center: 'lg:items-center',
  start: 'lg:items-start',
  end: 'lg:items-end',
};

export default function EditorialSplit({
  media,
  children,
  ratio = '55-45',
  reversed = false,
  align = 'center',
  gap = 'normal',
  className,
}: EditorialSplitProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1',
        gap === 'wide' ? 'gap-12 lg:gap-24' : 'gap-10 lg:gap-16',
        ratioClasses[ratio],
        alignClasses[align],
        className,
      )}
    >
      <div className={cn('min-w-0', reversed && 'lg:order-2')}>{media}</div>
      <div className={cn('min-w-0', reversed && 'lg:order-1')}>{children}</div>
    </div>
  );
}
