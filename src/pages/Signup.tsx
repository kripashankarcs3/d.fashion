import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useSearch } from 'wouter';
import { motion } from 'framer-motion';
import { success } from '@/lib/toast';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthFooterLink } from '@/components/AuthCard';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import EditorialImage from '@/components/editorial/EditorialImage';
import EditorialHeading, { Emphasis } from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import { CAMPAIGN } from '@/lib/editorial-images';
import { AUTHENTICATED_HOME, ROUTES } from '@/config/navigation';
import { register } from '@/services/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { isAxiosError } from '@/lib/utils';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-[length:var(--text-body-sm)] text-error">
      {children}
    </p>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Signup() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const plan = new URLSearchParams(search).get('plan');
  const redirectTo =
    new URLSearchParams(search).get('redirect') || AUTHENTICATED_HOME;

  const setSession = useAuthStore((s) => s.setSession);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const mutation = useMutation({
    mutationFn: () => register(name.trim(), email.trim(), password),
    onSuccess: (response) => {
      const { token, user } = response.data;
      setSession(token, user);
      success(`Welcome to D'Fashion, ${user.name.split(' ')[0]}`);
      navigate(redirectTo);
    },
    onError: (err) => {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message
        : err instanceof Error
          ? err.message
          : undefined;
      setError(message ?? 'Unable to create your account. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: FieldErrors = {};
    if (!name.trim()) next.name = 'Please enter your name.';
    if (!email.trim()) next.email = 'Please enter your email.';
    else if (!EMAIL_REGEX.test(email.trim()))
      next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Please choose a password.';
    else if (password.length < 8)
      next.password = 'Password must be at least 8 characters.';

    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    setError('');
    mutation.mutate();
  };

  return (
    <div className="grid min-h-[100svh] grid-cols-1 bg-[#0B0B0E] lg:grid-cols-2 overflow-hidden">
      {/* LEFT: editorial campaign image — runs under the form's left edge so
          the dissolve resolves there instead of at the grid line */}
      <div className="relative hidden lg:block overflow-visible min-h-[600px] h-full">
        <EditorialImage
          src={CAMPAIGN.opening.base}
          alt={CAMPAIGN.opening.alt}
          ratio="fill"
          scrim="right"
          position="40% 30%"
          priority
          cinematicIntensity={1.2}
          className="absolute inset-y-0 left-0 w-[calc(100%+8rem)] h-full"
        />
        {/* Darkening overlay mask to keep model slightly in the background */}
        <div className="absolute inset-0 bg-[#0B0B0E]/40 z-10" />

        <div className="absolute inset-0 flex flex-col justify-center p-12 lg:p-16 z-20 bg-gradient-to-tr from-[#0B0B0E] via-[#0B0B0E]/60 to-[#0B0B0E]/30">
          <EyebrowLabel tone="inverse">D&rsquo;Fashion</EyebrowLabel>
          <EditorialHeading size="lg" tone="inverse" className="mt-4 max-w-[16ch] leading-tight font-light text-shadow-sm">
            Colour Intelligence, <Emphasis>Personalised.</Emphasis>
          </EditorialHeading>

          <p className="mt-6 max-w-[28rem] text-[length:var(--text-body-sm)] leading-[1.7] text-cream-primary/70 font-sans tracking-wide">
            D&rsquo;Fashion bridges the gap between advanced spectral analysis and haute couture.
            Our proprietary AI algorithms scan your skin tone, undertone, and contrast ratios
            to curate a bespoke wardrobe aligned with your natural harmony.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-cream-primary/10 pt-6">
            <div>
              <span className="block text-[0.625rem] uppercase tracking-wider text-gold-primary">AI Technology</span>
              <span className="mt-1 block text-body-sm font-medium text-cream-primary/90">Spectral Analysis</span>
            </div>
            <div>
              <span className="block text-[0.625rem] uppercase tracking-wider text-gold-primary">Curations</span>
              <span className="mt-1 block text-body-sm font-medium text-cream-primary/90">Seasonal Palettes</span>
            </div>
            <div>
              <span className="block text-[0.625rem] uppercase tracking-wider text-gold-primary">Wardrobe</span>
              <span className="mt-1 block text-body-sm font-medium text-cream-primary/90">Personal Stylist</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: form — clean, minimal. Same ground as the dissolve endpoint. */}
      <div className="relative z-10 flex flex-col items-center p-6 sm:p-12 lg:py-24 justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.08,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
          className="relative w-full max-w-[23.5rem] my-auto py-10"
        >
          <div className="relative z-10">
            <motion.div variants={itemVariants}>
              <EyebrowLabel tone="muted" className="mb-4">
                Create Account
              </EyebrowLabel>
            </motion.div>

            <motion.div variants={itemVariants}>
              <EditorialHeading as="h1" size="md">
                Create your account.
              </EditorialHeading>
            </motion.div>

            <motion.p variants={itemVariants} className="mt-2 text-body text-cream-primary/80">
              Your analysis, saved looks, and colour report will always stay with you.
            </motion.p>

            {plan && (
              <motion.p
                variants={itemVariants}
                className="mt-6 flex items-center gap-2 rounded-sm border border-gold-primary/40 bg-gold-primary/10 px-4 py-3 text-[length:var(--text-body-sm)] text-cream-primary"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-primary" />
                You&rsquo;re choosing the{' '}
                <span className="font-semibold">{plan}</span> plan.
              </motion.p>
            )}

            {error && (
              <motion.div
                variants={itemVariants}
                role="alert"
                className="mt-4 flex items-start gap-2 rounded-sm border border-error/30 bg-error/5 px-4 py-3 text-body-sm text-error"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="mt-6">
              <GoogleSignInButton
                label="Sign up with Google"
                onSuccess={() => {
                  success("Welcome to D'Fashion!");
                  navigate(redirectTo);
                }}
                onError={(message) => setError(message)}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="relative my-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gold-hairline" />
              </div>
              <div className="relative flex justify-center text-[0.625rem] uppercase tracking-[0.2em] text-cream-primary/50">
                <span className="bg-[#0B0B0E] px-3 font-medium">or continue with email</span>
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <motion.div variants={itemVariants}>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  aria-invalid={fieldErrors.name ? true : undefined}
                  aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                />
                {fieldErrors.name && <FieldError id="name-error">{fieldErrors.name}</FieldError>}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={fieldErrors.email ? true : undefined}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                />
                {fieldErrors.email && <FieldError id="email-error">{fieldErrors.email}</FieldError>}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  aria-invalid={fieldErrors.password ? true : undefined}
                  aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                />
                {fieldErrors.password && <FieldError id="password-error">{fieldErrors.password}</FieldError>}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button type="submit" className="w-full" loading={mutation.isPending}>
                  Create account
                </Button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-6 border-t border-gold-hairline pt-5 text-center text-body-sm text-cream-primary/80">
              <AuthFooterLink href={ROUTES.login} label="Sign in">
                Already have an account?
              </AuthFooterLink>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

