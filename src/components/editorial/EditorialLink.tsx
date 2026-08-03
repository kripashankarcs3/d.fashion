import type { ReactNode } from 'react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

interface EditorialLinkProps {
  href: string;
  children: ReactNode;
  tone?: 'ink' | 'inverse' | 'muted';
  arrow?: boolean;
  className?: string;
}

const toneClasses: Record<NonNullable<EditorialLinkProps['tone']>, string> = {
  ink: 'text-cream-primary',
  muted: 'text-cream-primary/70 hover:text-cream-primary',
  inverse: 'text-cream-primary/80 hover:text-cream-primary',
};

const ruleClasses: Record<NonNullable<EditorialLinkProps['tone']>, string> = {
  ink: 'bg-gold-primary',
  muted: 'bg-gold-primary',
  inverse: 'bg-gold-primary',
};

/**
 * Text link with an underline that expands from the left on hover — the
 * quiet counterpart to the button system.
 */
export default function EditorialLink({
  href,
  children,
  tone = 'ink',
  arrow = true,
  className,
}: EditorialLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group/link relative inline-flex min-h-11 items-center gap-3 eyebrow transition-colors duration-200 ease-out',
        toneClasses[tone],
        className,
      )}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className={cn(
            'absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-editorial)] group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100',
            ruleClasses[tone],
          )}
        />
      </span>
      {arrow && (
        <span
          aria-hidden="true"
          className="translate-y-px transition-transform duration-500 ease-[var(--ease-editorial)] group-hover/link:translate-x-1.5"
        >
          &#8594;
        </span>
      )}
    </Link>
  );
}
