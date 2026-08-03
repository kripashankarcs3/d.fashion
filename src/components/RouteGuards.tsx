import type { ReactNode } from 'react';
import { Redirect, useLocation, useSearch } from 'wouter';
import { AUTHENTICATED_HOME, loginPathFor } from '@/config/navigation';
import { useAuthStore } from '@/store/useAuthStore';

interface GuardProps {
  children: ReactNode;
  /** Rendered while Firebase is still resolving the first auth-state check. */
  fallback: ReactNode;
}

/**
 * Wraps a route that requires a session. Unauthenticated visitors are sent to
 * the login page with a `?redirect=` back to where they were headed, so signing
 * in resumes their intent instead of dumping them on the dashboard.
 */
export function Protected({ children, fallback }: GuardProps) {
  const [location] = useLocation();
  const search = useSearch();
  const authReady = useAuthStore((s) => s.authReady);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!authReady) return <>{fallback}</>;
  if (!isAuthenticated) {
    const destination = search ? `${location}?${search}` : location;
    return <Redirect to={loginPathFor(destination)} />;
  }

  return <>{children}</>;
}

/**
 * Wraps the sign-in / sign-up routes. An authenticated visitor never sees them;
 * they go to their `?redirect=` target, or to the app home.
 */
export function GuestOnly({ children, fallback }: GuardProps) {
  const search = useSearch();
  const authReady = useAuthStore((s) => s.authReady);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!authReady) return <>{fallback}</>;

  if (isAuthenticated) {
    const target =
      new URLSearchParams(search).get('redirect') || AUTHENTICATED_HOME;
    return <Redirect to={target} />;
  }

  return <>{children}</>;
}
