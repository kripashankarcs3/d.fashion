import type { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="absolute -top-[100px] left-5 z-[var(--z-modal)] rounded-md bg-espresso px-5 py-3 text-body-sm font-medium text-cream-primary shadow-md transition-[top] duration-200 ease-out focus:top-5 focus:outline-none focus:ring-2 focus:ring-gold-primary"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 scroll-mt-18 outline-none">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
