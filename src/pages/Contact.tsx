import { useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Clock, Instagram } from 'lucide-react';
import EditorialImage from '@/components/editorial/EditorialImage';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import Reveal from '@/components/editorial/Reveal';
import { CAMPAIGN } from '@/lib/editorial-images';
import { ROUTES } from '@/config/navigation';
import { cn } from '@/lib/utils';

const SUPPORT_EMAIL = 'hello@deestyle.example.com';

const inputClass = cn(
  'w-full border-0 border-b border-gold-border bg-transparent pb-2.5 pt-1 text-body text-cream-primary',
  'placeholder:text-cream-primary/30',
  'transition-colors duration-200',
  'focus:border-gold-primary focus:outline-none',
);

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@dfashion.app',
  },
  {
    icon: Clock,
    label: 'Response time',
    value: 'Within 2 working days',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@dfashion.app',
  },
];

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Support request from ${name || 'a visitor'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="w-full bg-surface-1">

      {/* ── Hero masthead ── */}
      <header className="relative overflow-hidden bg-surface-0 pb-16 pt-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 55% 45% at 50% 100%, rgba(243,226,179,0.06) 0%, transparent 70%)',
          }}
        />
        <EditorialContainer>
          <Reveal variant="fade">
            <EyebrowLabel tone="gold" rule>Contact</EyebrowLabel>
          </Reveal>
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)', y: 8 }}
            animate={{ clipPath: 'inset(0 0 0% 0)', y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="mt-5 will-change-[clip-path]"
          >
            <EditorialHeading as="h1" size="xl">
              Get in <Emphasis>Touch.</Emphasis>
            </EditorialHeading>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-5 max-w-[44ch] text-lede text-cream-primary/65"
          >
            Support, press, and partnerships — we read everything.
          </motion.p>
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="mt-10 h-px origin-left bg-gradient-to-r from-gold-primary via-gold-light/50 to-transparent"
          />
        </EditorialContainer>
      </header>

      {/* ── Main content ── */}
      <section className="py-section-xl bg-surface-1">
        <EditorialContainer>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[3fr_2fr] lg:items-start">

            {/* ── Left: Form ── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <EyebrowLabel tone="gold" className="mb-8">Send a message</EyebrowLabel>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gold-border bg-gold-primary/5 p-8"
                >
                  <p className="font-editorial text-h4 font-light text-cream-primary">
                    Your message is on its way.
                  </p>
                  <p className="mt-2 text-body-sm text-cream-primary/65">
                    We'll reply within two working days.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="eyebrow text-gold-primary/70"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className={cn(inputClass, 'mt-2')}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="eyebrow text-gold-primary/70"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={cn(inputClass, 'mt-2')}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="eyebrow text-gold-primary/70"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us how we can help…"
                      className={cn(inputClass, 'mt-2 resize-none leading-relaxed')}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-campaign inline-flex items-center gap-3"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Send Message →
                  </button>
                </form>
              )}
            </motion.div>

            {/* ── Right: Image + info ── */}
            <div className="flex flex-col gap-8">
              {/* Editorial image */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <EditorialImage
                  src={CAMPAIGN.atelier.base}
                  alt={CAMPAIGN.atelier.alt}
                  ratio="portrait"
                  position={CAMPAIGN.atelier.position}
                  zoom
                />
              </motion.div>

              {/* Response time */}
              <Reveal variant="rise" delay={0.1}>
                <div className="border-l-2 border-gold-primary bg-surface-3 p-6">
                  <p className="eyebrow text-gold-primary/70 mb-2">Response time</p>
                  <p className="font-editorial text-h5 font-light text-cream-primary">
                    Usually within two working days.
                  </p>
                  <p className="mt-2 text-body-sm text-cream-primary/60 leading-relaxed">
                    For account or payment issues, include the email you signed up with.
                  </p>
                </div>
              </Reveal>

              {/* Before you write */}
              <Reveal variant="rise" delay={0.2}>
                <div className="border border-gold-hairline p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="h-5 w-5 text-gold-primary" aria-hidden="true" />
                    <h2 className="font-serif text-h5 font-light text-cream-primary">
                      Before you write
                    </h2>
                  </div>
                  <ul className="space-y-2.5 text-body-sm text-cream-primary/65">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-primary/50" aria-hidden />
                      The{' '}
                      <Link href={ROUTES.faq} className="underline underline-offset-2 hover:text-gold-primary ml-1">
                        FAQ
                      </Link>{' '}
                      answers most questions about analysis and reports.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-primary/50" aria-hidden />
                      Our{' '}
                      <Link href={ROUTES.privacy} className="underline underline-offset-2 hover:text-gold-primary ml-1">
                        privacy policy
                      </Link>{' '}
                      explains what happens to your photos.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-primary/50" aria-hidden />
                      You can delete saved reports anytime from your dashboard.
                    </li>
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </EditorialContainer>
      </section>

      {/* ── Contact info strip ── */}
      <div className="border-t border-gold-hairline bg-surface-0">
        <EditorialContainer>
          <div className="grid grid-cols-1 divide-y divide-gold-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {CONTACT_INFO.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 px-6 py-8 first:pl-0 last:pr-0"
              >
                <item.icon className="h-5 w-5 shrink-0 text-gold-primary/60" aria-hidden="true" />
                <div>
                  <p className="eyebrow text-cream-primary/40">{item.label}</p>
                  <p className="mt-0.5 text-body-sm text-cream-primary">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </EditorialContainer>
      </div>

    </div>
  );
}
