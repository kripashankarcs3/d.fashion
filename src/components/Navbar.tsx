import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { signOut as firebaseSignOut } from '@/services/auth';
import { useAuthStore } from '@/store/useAuthStore';

const navLinks = [
  { href: '/upload', label: 'Colour Analysis' },
  { href: '/report', label: 'My Report' },
  { href: '/try-on', label: 'Virtual Try-On' },
  { href: '/chat', label: 'Stylist' },
  { href: '/pricing', label: 'Collections' },
  { href: '/dashboard', label: 'Dashboard' },
];

/** Routes that open on a full-bleed dark campaign frame. */
const OVERLAY_ROUTES = new Set(['/']);

const drawerVariants = {
  open: { y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  closed: { y: '-100%', transition: { duration: 0.45, ease: [0.4, 0, 1, 1] } },
};

function Hamburger({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-[11px] w-[22px]">
      <span
        className={cn(
          'absolute left-0 top-0 h-px w-full bg-gold-primary transition-transform duration-400 ease-[var(--ease-editorial)]',
          open && 'top-1/2 -translate-y-1/2 rotate-45',
        )}
      />
      <span
        className={cn(
          'absolute bottom-0 left-0 h-px w-full bg-gold-primary transition-transform duration-400 ease-[var(--ease-editorial)]',
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

  /* Over a campaign frame the header rides transparent in gold ink; once
     the page scrolls past the image it settles onto a surface ground. */
  const overlay = OVERLAY_ROUTES.has(location) && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
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

  const handleSignOut = async () => {
    setAccountOpen(false);
    try {
      await firebaseSignOut();
    } catch {
      // ignore and still clear local session
    }
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
        'fixed inset-x-0 top-0 z-[var(--z-navbar)] border-b transition-[background-color,border-color,color] duration-500 ease-[var(--ease-editorial)]',
        overlay
          ? 'border-gold-hairline/0 bg-transparent text-cream-primary'
          : 'border-gold-hairline bg-surface-1/95 text-cream-primary backdrop-blur-[16px]',
      )}
    >
      <div className="mx-auto w-full max-w-container-editorial px-[var(--gutter)]">
        <nav
          className="flex h-[70px] items-center justify-between gap-8"
          aria-label="Primary"
        >
          <Link
            href="/"
            className="shrink-0 font-display text-[26px] leading-none tracking-[-0.01em] transition-opacity duration-300 hover:opacity-70"
            aria-label="D'Fashion — home"
          >
            <motion.span
              className="inline-block"
              whileHover={{ letterSpacing: '0.01em', opacity: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              D&rsquo;Fashion
            </motion.span>
          </Link>

          <div className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => {
              const active =
                location === link.href ||
                (link.href === '/try-on' && location === '/tryon');
              return (
                <motion.div
                  key={link.href}
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group relative inline-flex min-h-11 items-center eyebrow-micro transition-opacity duration-300 ease-out',
                      active ? 'opacity-100' : 'opacity-65 hover:opacity-100',
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-0 bottom-[18px] h-px origin-left bg-gold-primary transition-transform duration-500 ease-[var(--ease-editorial)]',
                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-5">
            {!isAuthenticated ? (
              <Link
                href="/login"
                className="hidden min-h-11 items-center eyebrow-micro opacity-65 transition-opacity duration-300 hover:opacity-100 lg:inline-flex"
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
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border font-display text-[15px] transition-colors duration-300',
                    overlay
                      ? 'border-gold-border hover:border-gold-light'
                      : 'border-gold-border hover:border-gold-light',
                  )}
                >
                  {initials || '·'}
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      role="menu"
                      aria-label="Account"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-[calc(100%+14px)] z-[var(--z-navbar)] w-60 border border-gold-hairline bg-surface-4 py-3 text-gold-primary shadow-md"
                    >
                      <p className="border-b border-gold-hairline px-5 pb-3 text-body-sm text-gold-primary">
                        {user?.name}
                        <span className="mt-0.5 block text-caption text-gold-muted">
                          {user?.email}
                        </span>
                      </p>
                      {accountMenu.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          className="flex min-h-11 items-center px-5 eyebrow-micro text-gold-soft transition-colors duration-200 hover:bg-surface-5 hover:text-gold-primary"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleSignOut}
                        className="mt-1 flex min-h-11 w-full items-center border-t border-gold-hairline px-5 text-left eyebrow-micro text-error transition-colors duration-200 hover:bg-surface-5"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="hidden lg:block">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                <Link
                  href="/upload"
                  className="btn-campaign"
                >
                  Begin
                </Link>
              </motion.div>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <Hamburger open={menuOpen} />
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-[var(--z-navbar)] flex flex-col bg-surface-0 text-gold-primary will-change-transform lg:hidden"
          >
            <div className="flex h-[70px] shrink-0 items-center justify-between px-[var(--gutter)]">
              <span className="font-display text-[26px] leading-none">
                D&rsquo;Fashion
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center"
              >
                <Hamburger open />
              </button>
            </div>

            <nav
              className="flex flex-1 flex-col justify-center overflow-y-auto px-[var(--gutter)]"
              aria-label="Mobile"
            >
              {navLinks.map((link, index) => {
                const active =
                  location === link.href ||
                  (link.href === '/try-on' && location === '/tryon');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group flex min-h-11 items-baseline gap-4 border-b border-gold-hairline py-5 transition-colors duration-300',
                      active ? 'text-gold-primary' : 'text-gold-soft',
                    )}
                  >
                    <span className="eyebrow-micro text-gold-muted tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-[32px] leading-tight">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="shrink-0 px-[var(--gutter)] pb-10 pt-6">
              {!isAuthenticated ? (
                <Link
                  href="/login"
                  className="mb-4 flex min-h-11 w-full items-center justify-center border border-gold-border eyebrow-micro text-gold-primary transition-colors duration-300 hover:bg-gold-primary hover:text-surface-1"
                >
                  Sign In
                </Link>
              ) : (
                <div className="mb-5 border-b border-gold-hairline pb-5">
                  <p className="text-caption text-gold-muted">
                    {user?.name}
                    <span className="block">{user?.email}</span>
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {accountMenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex min-h-11 items-center justify-center border border-gold-border eyebrow-micro text-gold-soft transition-colors duration-300 hover:text-gold-primary"
                      >
                        {item.label.replace('My ', '')}
                      </Link>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-4 min-h-11 text-left eyebrow-micro text-error"
                  >
                    Sign Out
                  </button>
                </div>
              )}
              <Link
                href="/upload"
                className="flex min-h-[52px] w-full items-center justify-center bg-gold-primary eyebrow-micro text-surface-1 transition-opacity duration-300 hover:opacity-85"
              >
                Begin Your Analysis
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
