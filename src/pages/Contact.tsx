import { useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { Mail, MessageSquare } from 'lucide-react';
import ContentPage, { ProseSection } from '@/components/editorial/ContentPage';
import { ROUTES } from '@/config/navigation';
import { cn } from '@/lib/utils';

const SUPPORT_EMAIL = 'hello@deestyle.example.com';

const inputClassName = cn(
  'w-full border-0 border-b border-gold-border bg-transparent px-0 pb-2 pt-1 text-body text-cream-primary',
  'placeholder:text-gold-muted',
  'transition-colors duration-200 ease-out',
  'focus:border-gold-primary focus:outline-none',
);

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Support request from ${name || 'a visitor'}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <ContentPage
      eyebrow="Contact"
      title="Get in touch"
      lede="Support, press, and partnerships — we read everything."
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="contact-name"
              className="text-caption font-medium uppercase tracking-label text-gold-muted"
            >
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClassName}
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="text-caption font-medium uppercase tracking-label text-gold-muted"
            >
              Your email
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className={inputClassName}
            />
          </div>
          <div>
            <label
              htmlFor="contact-message"
              className="text-caption font-medium uppercase tracking-label text-gold-muted"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className={cn(inputClassName, 'resize-none leading-relaxed')}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md border border-gold-border bg-transparent px-8 py-3 text-nav font-semibold tracking-button text-gold-primary transition-all duration-200 ease-out hover:bg-gold-primary hover:text-surface-1 active:scale-[0.98]"
          >
            <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
            Compose in your email app
          </button>
        </form>

        <div className="space-y-6">
          <ProseSection label="Response time">
            <p>
              We reply to every message, usually within two working days. For
              account or payment issues, include the email you signed up with.
            </p>
          </ProseSection>

          <div className="border border-gold-hairline p-6">
            <MessageSquare className="h-5 w-5 text-gold-primary" aria-hidden="true" />
            <h2 className="mt-3 font-serif text-h5 font-light text-cream-primary">
              Before you write
            </h2>
            <ul className="mt-3 space-y-2 text-body-sm text-cream-primary/70">
              <li>
                · The{' '}
                <Link href={ROUTES.faq} className="underline underline-offset-2 hover:text-gold-primary">
                  FAQ
                </Link>{' '}
                answers most questions about analysis and reports.
              </li>
              <li>
                · Our{' '}
                <Link href={ROUTES.privacy} className="underline underline-offset-2 hover:text-gold-primary">
                  privacy policy
                </Link>{' '}
                explains what happens to your photos.
              </li>
              <li>
                · You can delete saved reports anytime from your dashboard.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ContentPage>
  );
}
