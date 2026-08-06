import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import HashLink from '@/components/nav/HashLink';
import {
  ACCOUNT_MENU,
  APP_NAV,
  MARKETING_NAV,
  OVERLAY_ROUTES,
  ROUTES,
  type NavLink,
} from '@/config/navigation';
import { signOut as firebaseSignOut } from '@/services/auth';
import { useAuthStore } from '@/store/useAuthStore';

const drawerVariants = {
  open: { y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  closed: { y: '-100%', transition: { duration: 0.45, ease: [0.4, 0, 1, 1] } },
};

function Hamburger({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-[0.6875rem] w-[1.375rem]">
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

  /* Signed-out visitors get the marketing story; signed-in members get the
     product. No nav link dead-ends at a login redirect; the CTA deliberately
     routes guests through sign-in (it resumes via ?redirect=/upload). */
  const navLinks: NavLink[] = isAuthenticated ? APP_NAV : MARKETING_NAV;
  const ctaLabel = isAuthenticated ? 'New Analysis' : 'Begin Analysis';

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

  const handleSignOut = async () => {
    setAccountOpen(false);
    setMenuOpen(false);
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
    <>
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
          className="flex h-16 items-center justify-between gap-8"
          aria-label="Primary"
        >
          <Link
            href={ROUTES.home}
            className="shrink-0 font-display text-[1.625rem] leading-none tracking-[-0.01em] transition-opacity duration-300 hover:opacity-70"
            aria-label="D'Fashion — home"
          >
            <motion.span
              className="inline-block will-change-[opacity]"
              whileHover={{ opacity: 0.65 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              D&rsquo;Fashion
            </motion.span>
          </Link>

          <div className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => {
              const active = !link.hash && location === link.href;
              const className = cn(
                'group relative inline-flex min-h-11 items-center eyebrow-micro transition-opacity duration-300 ease-out',
                active ? 'opacity-100' : 'opacity-65 hover:opacity-100',
              );
              const underline = (
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-x-0 bottom-[1.125rem] h-px origin-left bg-gold-primary transition-transform duration-500 ease-[var(--ease-editorial)]',
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                  )}
                />
              );
              return (
                <motion.div
                  key={link.label}
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                >
                  {link.hash ? (
                    <HashLink href={link.href} hash={link.hash} className={className}>
                      {link.label}
                      {underline}
                    </HashLink>
                  ) : (
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={className}
                    >
                      {link.label}
                      {underline}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-5">
            {!isAuthenticated ? (
              <Link
                href={ROUTES.login}
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-border font-display text-[0.9375rem] transition-colors duration-300 hover:border-gold-light"
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
                      className="absolute right-0 top-[calc(100%+0.875rem)] z-[var(--z-navbar)] w-60 border border-gold-hairline bg-surface-4 py-3 text-gold-primary shadow-md"
                    >
                      <p className="border-b border-gold-hairline px-5 pb-3 text-body-sm text-gold-primary">
                        {user?.name}
                        <span className="mt-0.5 block text-caption text-gold-muted">
                          {user?.email}
                        </span>
                      </p>
                      {ACCOUNT_MENU.map((item) => (
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
                <Link href={ROUTES.upload} className="btn-campaign">
                  {ctaLabel}
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
    </header>

      {/* Outside <header> on purpose. The header carries `backdrop-blur`, and a
          non-`none` backdrop-filter makes an element the containing block for
          its fixed-position descendants — nested in there, this drawer's
          `fixed inset-0` resolved against the 70px-tall header instead of the
          viewport, collapsing the panel and pushing the first nav links off
          screen where they could not be tapped. */}
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
            <div className="flex h-16 shrink-0 items-center justify-between px-[var(--gutter)]">
              <span className="font-display text-[1.625rem] leading-none">
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

            {/* `min-h-0` lets this flex child actually shrink so it can scroll;
                the links are centred with `my-auto` rather than
                `justify-center`, which would push the first ones out of reach
                above the scroll origin once the list is taller than the panel. */}
            <nav
              className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[var(--gutter)]"
              aria-label="Mobile"
            >
              <div className="my-auto w-full">
              {navLinks.map((link, index) => {
                const active = !link.hash && location === link.href;
                const className = cn(
                  'group flex min-h-11 items-baseline gap-4 border-b border-gold-hairline py-5 transition-colors duration-300',
                  active ? 'text-gold-primary' : 'text-gold-soft',
                );
                const body = (
                  <>
                    <span className="eyebrow-micro text-gold-muted tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-[2rem] leading-tight">
                      {link.label}
                    </span>
                  </>
                );
                return link.hash ? (
                  <HashLink
                    key={link.label}
                    href={link.href}
                    hash={link.hash}
                    className={className}
                    onNavigate={() => setMenuOpen(false)}
                  >
                    {body}
                  </HashLink>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={className}
                    onClick={() => setMenuOpen(false)}
                  >
                    {body}
                  </Link>
                );
              })}
              </div>
            </nav>

            <div className="shrink-0 px-[var(--gutter)] pb-10 pt-6">
              {!isAuthenticated ? (
                <Link
                  href={ROUTES.login}
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
                  <ul className="mt-4 space-y-1">
                    {ACCOUNT_MENU.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex min-h-11 items-center eyebrow-micro text-gold-soft transition-colors duration-300 hover:text-gold-primary"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-2 min-h-11 text-left eyebrow-micro text-error"
                  >
                    Sign Out
                  </button>
                </div>
              )}
              <Link
                href={ROUTES.upload}
                className="flex min-h-[3.25rem] w-full items-center justify-center bg-gold-primary eyebrow-micro text-surface-1 transition-opacity duration-300 hover:opacity-85"
              >
                {isAuthenticated ? 'Start a New Analysis' : 'Begin Your Analysis'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
