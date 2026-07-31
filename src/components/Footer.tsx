import { useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Container from '@/components/Container';

const productLinks = [
  { href: '/try-on', label: 'Virtual Try-On' },
  { href: '/report', label: 'Style Report' },
  { href: '/chat', label: 'AI Stylist' },
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
    toast.success('You are on the list');
    setEmail('');
  };

  return (
    <footer className="bg-espresso text-cream-primary">
      <Container>
        <div className="grid grid-cols-1 gap-12 pt-20 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="D'Fashion — home">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream-primary">
                <span className="font-editorial text-xl leading-none font-medium text-espresso">
                  D
                </span>
              </span>
              <span className="whitespace-nowrap font-editorial text-wordmark leading-none font-medium text-cream-primary">
                D&rsquo;Fashion
              </span>
            </Link>
            <p className="mt-6 text-body-sm leading-[1.6] text-cream-primary/70">
              Colour Intelligence, Personalised.
            </p>
            <p className="mt-3 max-w-xs text-body-sm leading-[1.6] text-cream-primary/60">
              Discover the colours that were made for you.
            </p>
          </div>

          <nav aria-label="Product">
            <h2 className="text-footer-label font-semibold uppercase tracking-label">
              Product
            </h2>
            <ul className="mt-6 space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-body-sm text-cream-primary/80 transition-colors duration-200 ease-out hover:text-gold-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="text-footer-label font-semibold uppercase tracking-label">
              Company
            </h2>
            <ul className="mt-6 space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-body-sm text-cream-primary/80 transition-colors duration-200 ease-out hover:text-gold-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-footer-label font-semibold uppercase tracking-label">
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
                    'min-w-0 flex-1 rounded-md border border-cream-primary/40 bg-espresso px-4 text-body text-cream-primary',
                    'placeholder:text-cream-primary/50',
                    'transition-colors duration-200 ease-out',
                    'focus:border-gold-light focus:outline-none focus:ring-1 focus:ring-gold-light',
                  )}
                />
                <button
                  type="submit"
                  className={cn(
                    'inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-6 text-nav font-semibold tracking-button text-primary-foreground',
                    'transition-all duration-200 ease-out',
                    'hover:bg-gold-light hover:scale-[1.01] hover:shadow-gold-glow',
                    'active:scale-[0.98] active:bg-gold-dark',
                  )}
                >
                  Subscribe
                </button>
              </div>
            </form>
            <p className="mt-4 text-caption leading-[1.5] text-cream-primary/50">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-cream-primary/15 pt-6 pb-12 md:flex-row md:justify-between">
          <p className="text-caption text-cream-primary/60">
            &copy; {new Date().getFullYear()} D&rsquo;Fashion. All rights
            reserved.
          </p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
            <span className="inline-flex items-center gap-1.5 text-caption text-cream-primary/60">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              SSL secured
            </span>
            <span className="text-caption text-cream-primary/60">
              Powered by YouCam AI
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
