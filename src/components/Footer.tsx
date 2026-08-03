import { useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { success } from '@/lib/toast';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import EditorialContainer from '@/components/editorial/EditorialContainer';

const productLinks = [
  { href: '/try-on', label: 'Virtual Try-On' },
  { href: '/report', label: 'Style Report' },
  { href: '/chat', label: 'Stylist' },
  { href: '/pricing', label: 'Pricing' },
];

const companyLinks = [
  { href: '/', label: 'About' },
  { href: '/upload', label: 'Upload a Selfie' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    success('You are on the list');
    setEmail('');
  };

  return (
    <footer className="bg-surface-0 text-gold-primary">
      <EditorialContainer>
        <div className="grid grid-cols-1 gap-12 pt-20 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="D'Fashion — home">
              <span className="whitespace-nowrap font-editorial text-wordmark leading-none font-medium text-gold-primary">
                D&rsquo;Fashion
              </span>
            </Link>
            <p className="mt-6 text-body-sm leading-[1.6] text-gold-soft">
              Colour Intelligence, Personalised.
            </p>
            <p className="mt-3 max-w-xs text-body-sm leading-[1.6] text-gold-muted">
              Discover the colours that were made for you.
            </p>
          </div>

          <nav aria-label="Product">
            <h2 className="text-footer-label font-semibold uppercase tracking-label text-gold-primary">
              Product
            </h2>
            <ul className="mt-6 space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-body-sm text-gold-soft transition-colors duration-200 ease-out hover:text-gold-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="text-footer-label font-semibold uppercase tracking-label text-gold-primary">
              Company
            </h2>
            <ul className="mt-6 space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-body-sm text-gold-soft transition-colors duration-200 ease-out hover:text-gold-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-footer-label font-semibold uppercase tracking-label text-gold-primary">
              Newsletter
            </h2>
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
                  className={cn(
                    'inline-flex min-h-11 items-center justify-center rounded-md border border-gold-border bg-transparent px-6 text-nav font-semibold tracking-button text-gold-primary',
                    'transition-all duration-200 ease-out',
                    'hover:bg-gold-primary hover:text-surface-1',
                    'active:scale-[0.98]',
                  )}
                >
                  Subscribe
                </button>
              </div>
            </form>
            <p className="mt-4 text-caption leading-[1.5] text-gold-muted">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-gold-hairline pt-6 pb-12 md:flex-row md:justify-between">
          <p className="text-caption leading-[1.5] text-gold-muted">
            &copy; {new Date().getFullYear()} D&rsquo;Fashion. Colour intelligence, rendered personal. All rights reserved.
          </p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
            <span className="inline-flex items-center gap-1.5 text-caption text-gold-muted">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              SSL secured
            </span>
            <span className="text-caption text-gold-muted">
              Colour rendering powered by YouCam AI
            </span>
          </div>
        </div>
      </EditorialContainer>
    </footer>
  );
}
