import type { ReactNode } from 'react';
import { useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const AUTH_ROUTES = new Set(['/login', '/signup']);

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [location] = useLocation();

  if (AUTH_ROUTES.has(location)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-1">
      <a
        href="#main-content"
        className="absolute -top-[100px] left-5 z-[var(--z-modal)] rounded-md bg-surface-3 px-5 py-3 text-body-sm font-medium text-cream-primary shadow-md transition-[top] duration-200 ease-out focus:top-5 focus:outline-none focus:ring-2 focus:ring-gold-primary"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 scroll-mt-16 outline-none">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
