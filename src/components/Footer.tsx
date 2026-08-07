import { useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { success, error } from '@/lib/toast';
import { Lock, MapPin } from 'lucide-react';
import { FaInstagram, FaPinterest, FaYoutube, FaXTwitter } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import HashLink from '@/components/nav/HashLink';
import { subscribeNewsletter } from '@/services/api';
import {
  FOOTER_ACCOUNT_AUTHED,
  FOOTER_ACCOUNT_GUEST,
  FOOTER_COMPANY,
  FOOTER_LEGAL,
  FOOTER_PRODUCT,
  ROUTES,
  SITE_URL,
} from '@/config/navigation';
import { useAuthStore } from '@/store/useAuthStore';

const linkClassName =
  'inline-flex min-h-11 items-center text-body-sm text-gold-soft transition-colors duration-200 ease-out hover:text-gold-primary';

const colHeadingClassName =
  'text-footer-label font-semibold uppercase tracking-label text-gold-primary';

const LANGUAGE_OPTIONS = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'en-IN', label: 'English (India)' },
  { code: 'hi-IN', label: 'हिन्दी' },
];

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/', Icon: FaInstagram },
  { label: 'Pinterest', href: 'https://www.pinterest.com/', Icon: FaPinterest },
  { label: 'YouTube', href: 'https://www.youtube.com/', Icon: FaYoutube },
  { label: 'X (Twitter)', href: 'https://x.com/', Icon: FaXTwitter },
];

type NewsletterStatus = 'idle' | 'loading' | 'success' | 'error';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setNewsletterStatus] = useState<NewsletterStatus>('idle');
  const [lang, setLang] = useState('en-US');
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  /* Guests are never pointed at a gated page from the footer. */
  const accountLinks = isAuthenticated
    ? FOOTER_ACCOUNT_AUTHED
    : FOOTER_ACCOUNT_GUEST;

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || status === 'loading') return;
    setNewsletterStatus('loading');
    try {
      await subscribeNewsletter(email);
      setNewsletterStatus('success');
      success('You are on the list');
      setEmail('');
    } catch {
      setNewsletterStatus('error');
      error('Could not subscribe right now. Please try again.');
    }
  };

  const handleLanguageChange = (code: string) => {
    setLang(code);
    document.documentElement.lang = code;
  };

  const renderLinks = (links: typeof FOOTER_PRODUCT) =>
    links.map((link) => (
      <li key={link.label}>
        {link.hash ? (
          <HashLink href={link.href} hash={link.hash} className={linkClassName}>
            {link.label}
          </HashLink>
        ) : (
          <Link href={link.href} className={linkClassName}>
            {link.label}
          </Link>
        )}
      </li>
    ));

  return (
    <footer className="bg-surface-0 text-gold-primary">
      <EditorialContainer>
        <div className="grid grid-cols-1 gap-12 pt-20 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.1fr] xl:gap-10">
          <div>
            <Link
              href={ROUTES.home}
              className="inline-flex items-center gap-3"
              aria-label="D'Fashion — home"
            >
              <img
                src="/images/campaign/logo3.png"
                alt="D'Fashion"
                className="h-28 w-auto object-contain"
              />
            </Link>
            <p className="mt-6 text-body-sm leading-[1.6] text-gold-soft">
              Colour Intelligence, Personalised.
            </p>
            <p className="mt-3 max-w-xs text-body-sm leading-[1.6] text-gold-muted">
              Discover the colours that were made for you.
            </p>
          </div>

          <nav aria-label="Product">
            <h2 className={colHeadingClassName}>Product</h2>
            <ul className="mt-6 space-y-2">{renderLinks(FOOTER_PRODUCT)}</ul>
          </nav>

          <nav aria-label="Account">
            <h2 className={colHeadingClassName}>Account</h2>
            <ul className="mt-6 space-y-2">{renderLinks(accountLinks)}</ul>
          </nav>

          <nav aria-label="Company">
            <h2 className={colHeadingClassName}>Company</h2>
            <ul className="mt-6 space-y-2">{renderLinks(FOOTER_COMPANY)}</ul>
          </nav>

          <nav aria-label="Legal">
            <h2 className={colHeadingClassName}>Legal</h2>
            <ul className="mt-6 space-y-2">{renderLinks(FOOTER_LEGAL)}</ul>
          </nav>

          <div className="md:col-span-2 xl:col-span-1">
            <h2 className={colHeadingClassName}>Newsletter</h2>
            <form
              className="mt-6"
              onSubmit={handleSubscribe}
              aria-label="Newsletter signup"
            >
              <div className="flex gap-2">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email"
                  autoComplete="email"
                  className={cn(
                    'min-w-0 flex-1 border-0 border-b border-gold-border bg-transparent px-0 pb-2 text-body text-gold-primary',
                    'placeholder:text-gold-muted',
                    'transition-colors duration-200 ease-out',
                    'focus:border-gold-primary focus:outline-none',
                  )}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={cn(
                    'inline-flex min-h-11 items-center justify-center rounded-md border border-gold-border bg-transparent px-6 text-nav font-semibold tracking-button text-gold-primary',
                    'transition-all duration-200 ease-out',
                    'hover:bg-gold-primary hover:text-surface-1',
                    'active:scale-[0.98]',
                    'disabled:cursor-not-allowed disabled:opacity-60',
                  )}
                >
                  {status === 'loading' ? '…' : 'Subscribe'}
                </button>
              </div>
            </form>
            <p className="mt-4 text-caption leading-[1.5] text-gold-muted">
              No spam. Unsubscribe anytime. See our{' '}
              <Link
                href={ROUTES.privacy}
                className="underline underline-offset-2 hover:text-gold-primary"
              >
                privacy policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-gold-hairline pt-6 pb-12">
          <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
            <p className="text-caption leading-[1.5] text-gold-muted">
              &copy; {new Date().getFullYear()} D&rsquo;Fashion. Colour
              intelligence, rendered personal. All rights reserved.
            </p>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-caption text-gold-muted">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                SSL secured
              </span>
              <span className="text-caption text-gold-muted">·</span>
              <span className="text-caption text-gold-muted">
                Colour rendering powered by YouCam AI
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
            <div className="flex items-center gap-3">
              <span className="text-caption uppercase tracking-label text-gold-muted">
                Follow
              </span>
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`D'Fashion on ${label}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-hairline text-gold-soft transition-colors duration-200 ease-out hover:border-gold-primary hover:text-gold-primary"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-5">
              <Link
                href={`${SITE_URL}/sitemap.xml`}
                className="text-caption text-gold-muted transition-colors duration-200 ease-out hover:text-gold-primary"
              >
                Sitemap
              </Link>
              <label className="inline-flex items-center gap-2 text-caption text-gold-muted">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">Language</span>
                <select
                  value={lang}
                  onChange={(event) => handleLanguageChange(event.target.value)}
                  className="border-0 border-b border-gold-border bg-transparent py-1 text-caption text-gold-primary focus:border-gold-primary focus:outline-none"
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.code} value={option.code} className="bg-surface-0">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
      </EditorialContainer>
    </footer>
  );
}
