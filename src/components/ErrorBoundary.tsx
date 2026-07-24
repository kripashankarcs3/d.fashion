import React from 'react';
import { Link } from 'wouter';

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
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6 text-center">
          <p className="text-4xl">⚠️</p>
          <h2 className="font-serif text-2xl">Something went wrong on this page</h2>
          <p className="text-muted-foreground font-accent">
            {this.props.pageName ?? 'This page'} encountered an unexpected error.
          </p>
          <Link href="/" className="bg-foreground text-background px-6 py-3 rounded-full font-accent text-sm">
            Go Home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}