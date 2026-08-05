import React from 'react';
import { Link } from 'wouter';
import { ROUTES } from '@/config/navigation';

interface Props { children: React.ReactNode; pageName?: string; }
interface State { hasError: boolean; }

export class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60svh] flex flex-col items-center justify-center gap-6 px-6 text-center">
          <h2 className="font-serif text-[length:var(--text-h3)] text-cream-primary">
            Something went wrong on this page
          </h2>
          <p className="text-[length:var(--text-body)] text-cream-primary/80">
            {this.props.pageName ?? 'This page'} encountered an unexpected error. Please try again.
          </p>
          <Link
            href={ROUTES.home}
            className="inline-flex min-h-11 min-w-[var(--size-cta-min-width)] items-center justify-center rounded-md bg-primary px-10 py-3.5 text-nav font-semibold tracking-button text-primary-foreground transition-all duration-200 ease-out hover:bg-gold-light hover:shadow-cta-hover active:scale-[0.98]"
          >
            Go Home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}