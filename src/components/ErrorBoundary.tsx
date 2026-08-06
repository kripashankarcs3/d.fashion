import React from 'react';
import { Link } from 'wouter';
import { ROUTES } from '@/config/navigation';

interface Props { children: React.ReactNode; pageName?: string; }
interface State { hasError: boolean; }

/**
 * Catches a render error in one page so the rest of the app stays usable.
 *
 * There is deliberately no automatic reset. Navigation already clears the
 * error: the router keys the page container on the location, so changing route
 * unmounts this boundary and mounts a fresh one. Resetting on any prop change
 * instead — as this used to, by comparing `props.children` between renders —
 * never worked, because React builds a new element object for `children` on
 * every parent render. A page that threw deterministically would be re-rendered
 * (and re-throw) on the next unrelated parent update, flickering between the
 * error screen and the broken page. Recovery in place is the user's call, via
 * the Try Again button.
 */
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
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-gold-border px-8 py-3 text-nav font-semibold text-gold-primary transition-all hover:bg-gold-primary/10"
            >
              Try Again
            </button>
            <Link
              href={ROUTES.home}
              className="inline-flex min-h-11 min-w-[var(--size-cta-min-width)] items-center justify-center rounded-md bg-primary px-10 py-3.5 text-nav font-semibold tracking-button text-primary-foreground transition-all duration-200 ease-out hover:bg-gold-light hover:shadow-cta-hover active:scale-[0.98]"
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}