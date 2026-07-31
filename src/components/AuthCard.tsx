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
        'mx-auto w-full max-w-md rounded-lg border border-border bg-white p-8 shadow-card',
        className,
      )}
    >
      <h1 className="font-serif text-h2 text-espresso">{title}</h1>
      <p className="mt-3 text-body text-espresso-light">{subtitle}</p>

      <div className="mt-8 space-y-5">{children}</div>

      <div className="mt-8 border-t border-border pt-6 text-center text-body-sm text-espresso-light">
        {footer}
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
