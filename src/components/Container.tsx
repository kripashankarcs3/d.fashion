import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  className?: string;
  children: ReactNode;
}

export default function Container({ className, children }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8 xl:px-0',
        className,
      )}
    >
      {children}
    </div>
  );
}
