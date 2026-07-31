import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Container from '@/components/Container';
import { useAuthStore } from '@/store/useAuthStore';

const navLinks = [
  { href: '/upload', label: 'Color Analysis' },
  { href: '/report', label: 'My Report' },
  { href: '/try-on', label: 'Virtual Try-On' },
  { href: '/chat', label: 'AI Stylist' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/dashboard', label: 'Dashboard' },
];

const drawerVariants = {
  open: { x: 0, transition: { duration: 0.35, ease: [0, 0, 0.2, 1] } },
  closed: { x: '100%', transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } },
};

function Hamburger({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-[18px] w-6">
      <span
        className={cn(
          'absolute left-0 top-0 h-0.5 w-6 bg-current transition-transform duration-300 ease-out',
          open && 'top-1/2 -translate-y-1/2 rotate-45',
        )}
      />
      <span
        className={cn(
          'absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 bg-current transition-opacity duration-300 ease-out',
          open && 'opacity-0',
        )}
      />
      <span
        className={cn(
          'absolute bottom-0 left-0 h-0.5 w-6 bg-current transition-transform duration-300 ease-out',
          open && 'bottom-1/2 translate-y-1/2 -rotate-45',
        )}
      />
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [location] = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearSession = useAuthStore((s) => s.clearSession);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [location]);

  useEffect(() => {
    if (!accountOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAccountOpen(false);
    };
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [accountOpen]);

  const accountMenu = [
    { href: '/dashboard', label: 'My Profile' },
    { href: '/report', label: 'My Reports' },
    { href: '/pricing', label: 'Subscription' },
  ];

  const handleSignOut = () => {
    setAccountOpen(false);
    clearSession();
  };

  const initials = (user?.name ?? '')
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !drawerRef.current) return;
      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>('a[href], button'),
      ).filter((el) => !el.hasAttribute('disabled'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[var(--z-navbar)] transition-[background-color,backdrop-filter] duration-300 ease-out',
        scrolled
          ? 'bg-cream-primary/80 backdrop-blur-[20px]'
          : 'bg-transparent',
      )}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between" aria-label="Primary">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="D'Fashion — home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream-dark">
              <span className="font-editorial text-xl font-medium leading-none text-espresso">
                D
              </span>
            </span>
            <span
              className="whitespace-nowrap font-editorial text-wordmark leading-none font-medium text-espresso"
              style={{ width: 'var(--size-wordmark)' }}
            >
              D&rsquo;Fashion
            </span>
          </Link>

          <div className="hidden items-center lg:flex lg:gap-8">
            {navLinks.map((link) => {
              const active = location === link.href || (link.href === '/try-on' && location === '/tryon');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative inline-flex min-h-11 items-center text-nav text-espresso-light transition-colors duration-200 ease-out hover:text-espresso',
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute inset-x-0 bottom-0 h-[var(--size-underline)] origin-left bg-gold-primary transition-transform duration-200 ease-out',
                      active
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100',
                    )}
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 lg:gap-6">
            {!isAuthenticated ? (
              <Link
                href="/login"
                className="hidden min-h-11 items-center text-nav font-medium text-espresso-light transition-colors duration-200 ease-out hover:text-espresso lg:inline-flex"
              >
                Sign In
              </Link>
            ) : (
              <div ref={accountRef} className="relative hidden lg:block">
                <button
                  type="button"
                  onClick={() => setAccountOpen((open) => !open)}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  aria-label="Account menu"
                  className="flex h-11 w-11 items-center justify-center rounded-md bg-cream-dark font-serif text-lg font-medium text-espresso transition-colors duration-200 ease-out hover:text-gold-primary"
                >
                  {initials || '·'}
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      role="menu"
                      aria-label="Account"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 top-[calc(100%+8px)] z-[var(--z-navbar)] w-56 overflow-hidden rounded-lg border border-border bg-white py-2 shadow-card"
                    >
                      <p className="border-b border-border px-4 pb-2 text-body-sm text-espresso-muted">
                        {user?.name}
                        <span className="block text-caption">{user?.email}</span>
                      </p>
                      {accountMenu.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          className="flex min-h-11 items-center px-4 text-body-sm text-espresso transition-colors duration-200 ease-out hover:bg-cream-dark hover:text-gold-primary"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleSignOut}
                        className="flex min-h-11 w-full items-center px-4 text-left text-body-sm text-error transition-colors duration-200 ease-out hover:bg-cream-dark"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <Link
              href="/upload"
              className="hidden min-h-11 items-center justify-center rounded-md bg-primary px-8 text-nav font-semibold tracking-button text-primary-foreground transition-all duration-200 ease-out hover:bg-gold-light hover:shadow-gold-glow hover:scale-[1.01] active:scale-[0.98] active:bg-gold-dark lg:inline-flex"
            >
              Get Started
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="flex h-11 w-11 items-center justify-center rounded-md text-espresso transition-colors duration-200 ease-out hover:text-gold-primary lg:hidden"
            >
              <Hamburger open={menuOpen} />
            </button>
          </div>
        </nav>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-[var(--z-navbar)] flex flex-col bg-espresso text-cream-primary lg:hidden"
          >
            <div className="flex h-16 items-center justify-between px-5">
              <span className="whitespace-nowrap font-editorial text-wordmark leading-none font-medium text-cream-primary">
                D&rsquo;Fashion
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-md text-cream-primary transition-colors duration-200 ease-out hover:text-gold-light"
              >
                <Hamburger open />
              </button>
            </div>
            <nav
              className="flex flex-1 flex-col overflow-y-auto px-5"
              aria-label="Mobile"
            >
              {navLinks.map((link) => {
                const active = location === link.href || (link.href === '/try-on' && location === '/tryon');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex min-h-11 items-center border-b border-cream-primary/10 py-6 text-body text-cream-primary transition-colors duration-200 ease-out hover:text-gold-light',
                      active && 'text-gold-primary',
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-5 pb-8">
              {!isAuthenticated ? (
                <Link
                  href="/login"
                  className="mb-4 flex min-h-11 w-full items-center justify-center rounded-md border border-cream-primary/20 text-nav font-medium text-cream-primary transition-colors duration-200 ease-out hover:text-gold-light"
                >
                  Sign In
                </Link>
              ) : (
                <div className="mb-4 border-b border-cream-primary/10 pb-4">
                  <p className="text-caption text-cream-primary/70">
                    {user?.name}
                    <span className="block">{user?.email}</span>
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {accountMenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex min-h-11 items-center justify-center rounded-md border border-cream-primary/20 text-caption text-cream-primary transition-colors duration-200 ease-out hover:text-gold-light"
                      >
                        {item.label.replace('My ', '')}
                      </Link>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-3 w-full text-left text-caption text-error transition-colors duration-200 ease-out hover:text-gold-light"
                  >
                    Sign Out
                  </button>
                </div>
              )}
              <Link
                href="/upload"
                className="flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-8 py-3.5 text-nav font-semibold tracking-button text-primary-foreground transition-all duration-200 ease-out hover:bg-gold-light hover:scale-[1.01] active:scale-[0.98] active:bg-gold-dark"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
