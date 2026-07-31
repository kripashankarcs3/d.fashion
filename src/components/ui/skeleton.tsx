import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-cream-dark',
        'after:absolute after:inset-0 after:animate-[shimmer_var(--duration-skeleton)_infinite]',
        'after:bg-[linear-gradient(90deg,transparent_0%,rgba(184,151,74,0.14)_50%,transparent_100%)]',
        'after:bg-[length:200%_100%]',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
