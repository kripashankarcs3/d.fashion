import type { ReactNode } from 'react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  className?: string;
}

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        'relative mx-auto w-full max-w-md overflow-hidden rounded-[8px] border border-gold-hairline bg-surface-3/95 p-8 shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(216,176,103,0.16),transparent_60%)]"
      />
      <div className="relative">
        <h1 className="font-serif text-[length:var(--text-h2)] text-cream-primary">{title}</h1>
        <p className="mt-3 text-[length:var(--text-body)] text-cream-primary/80">{subtitle}</p>

        <div className="mt-8 space-y-5">{children}</div>

        <div className="mt-8 border-t border-border pt-6 text-center text-[length:var(--text-body-sm)] text-cream-primary/80">
          {footer}
        </div>
      </div>
    </div>
  );
}

export function AuthFooterLink({
  children,
  href,
  label,
}: {
  children: ReactNode;
  href: string;
  label: string;
}) {
  return (
    <p>
      {children}{' '}
      <Link
        href={href}
        className="font-medium text-gold-primary underline underline-offset-2 transition-colors duration-200 ease-out hover:text-gold-light"
      >
        {label}
      </Link>
    </p>
  );
}
