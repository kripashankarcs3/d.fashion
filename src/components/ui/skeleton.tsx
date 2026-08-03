import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-surface-4',
        'after:absolute after:inset-0 after:animate-[shimmer_var(--duration-skeleton)_infinite]',
        'after:bg-[linear-gradient(90deg,transparent_0%,rgba(201,168,76,0.14)_50%,transparent_100%)]',
        'after:bg-[length:200%_100%]',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
