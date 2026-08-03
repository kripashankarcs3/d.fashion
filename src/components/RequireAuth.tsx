import type { ReactNode } from 'react';
import { Redirect, useLocation } from 'wouter';
import { useAuthStore } from '@/store/useAuthStore';

const PUBLIC_PATHS = new Set(['/login', '/signup']);

interface RequireAuthProps {
  children: ReactNode;
  fallback: ReactNode;
}

export default function RequireAuth({ children, fallback }: RequireAuthProps) {
  const [location] = useLocation();
  const authReady = useAuthStore((s) => s.authReady);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!authReady) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    if (PUBLIC_PATHS.has(location)) {
      return <>{children}</>;
    }

    const redirect =
      location !== '/'
        ? `?redirect=${encodeURIComponent(location)}`
        : '';

    return <Redirect to={`/login${redirect}`} />;
  }

  if (PUBLIC_PATHS.has(location)) {
    const params = new URLSearchParams(window.location.search);
    const target = params.get('redirect') || '/';
    return <Redirect to={target} />;
  }

  return <>{children}</>;
}
