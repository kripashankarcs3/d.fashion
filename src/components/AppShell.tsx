import type { ReactNode } from 'react';
import { useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ScrollProgress from '@/components/ScrollProgress';
import { cn } from '@/lib/utils';

const AUTH_ROUTES = new Set(['/login', '/signup']);

/** Full-screen "app" pages, not marketing pages — no footer/newsletter chrome
 *  below them and no page-level scroll, the way a chat app fills its window. */
const APP_SCREEN_ROUTES = new Set(['/chat']);

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [location] = useLocation();

  if (AUTH_ROUTES.has(location)) {
    return <>{children}</>;
  }

  const isAppScreen = APP_SCREEN_ROUTES.has(location);

  return (
    <div className={cn('flex min-h-[100svh] flex-col bg-surface-1', isAppScreen && 'h-[100svh] overflow-hidden')}>
      <a
        href="#main-content"
        className="absolute -top-[6.25rem] left-5 z-[var(--z-modal)] rounded-md bg-surface-3 px-5 py-3 text-body-sm font-medium text-cream-primary shadow-md transition-[top] duration-200 ease-out focus:top-5 focus:outline-none focus:ring-2 focus:ring-gold-primary"
      >
        Skip to content
      </a>
      {!isAppScreen && <ScrollProgress />}
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className={cn('flex-1 scroll-mt-16 outline-none', isAppScreen && 'min-h-0 overflow-hidden')}
      >
        {children}
      </main>
      {!isAppScreen && <Footer />}
      {!isAppScreen && <BackToTop />}
    </div>
  );
}
