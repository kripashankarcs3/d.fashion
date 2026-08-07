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
import { login } from '@/services/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { isAxiosError } from '@/lib/utils';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
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

export default function Login() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const redirectTo =
    new URLSearchParams(search).get('redirect') || AUTHENTICATED_HOME;
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const mutation = useMutation({
    mutationFn: () => login(email.trim(), password),
    onSuccess: (response) => {
      const { token, user } = response.data;
      setSession(token, user);
      success(`Welcome back, ${user.name.split(' ')[0]}`);
      navigate(redirectTo);
    },
    onError: (err) => {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message
        : err instanceof Error
          ? err.message
          : undefined;
      setError(message ?? 'Unable to sign in. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: FieldErrors = {};
    if (!email.trim()) next.email = 'Please enter your email.';
    else if (!EMAIL_REGEX.test(email.trim()))
      next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Please enter your password.';

    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    setError('');
    mutation.mutate();
  };

  return (
    <div className="relative grid h-[100svh] grid-cols-1 bg-[#0B0B0E] lg:grid-cols-2 overflow-hidden">
      {/* One model photo stretched across the whole page background */}
        {/* Centered band so the model reads smaller; edges dissolve into the
            page background with a mask so there is no hard cut. */}
        <div
          className="absolute inset-y-0 left-1/2 w-[66.7%] -translate-x-1/2 opacity-80"
          aria-hidden="true"
          style={{
            maskImage:
              'linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)',
          }}
        >
          <EditorialImage
            src={CAMPAIGN.opening.base}
            alt={CAMPAIGN.opening.alt}
            ratio="fill"
            scrim="right"
            position="center 20%"
            priority
            cinematicIntensity={0.3}
            imgClassName="brightness-[1.1] contrast-[1.05] saturate-[1.0]"
            className="absolute inset-0 w-full h-full"
          />
        </div>

      {/* Dark overlay to keep text & form legible */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background: 'rgba(11,11,14,0.35)',
        }}
      />

      {/* LEFT: text over the photo */}
      <div className="relative z-10 hidden lg:block overflow-hidden h-full">
        {/* Text centered in the middle */}
        <div className="absolute inset-0 flex flex-col justify-center p-12 lg:p-16 z-20 opacity-80">
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

      {/* RIGHT: form over the same photo */}
      <div className="relative z-10 overflow-hidden">
        {/* Form — scrollable internally if content overflows */}
        <div className="relative z-10 flex h-full flex-col items-center overflow-y-auto p-6 sm:px-12 py-8 justify-center">
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
          className="relative w-full max-w-[23.5rem] py-0"
        >
          <div className="relative z-10">
            <motion.div variants={itemVariants}>
              <EyebrowLabel tone="muted" className="mb-4">
                Account Access
              </EyebrowLabel>
            </motion.div>

            <motion.div variants={itemVariants}>
              <EditorialHeading as="h1" size="md">
                Welcome back.
              </EditorialHeading>
            </motion.div>

            <motion.p variants={itemVariants} className="mt-2 text-body text-cream-primary/80">
              Sign in to keep your palette, reports, and wardrobe in sync.
            </motion.p>

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
                onSuccess={() => {
                  success('Welcome back!');
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
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  aria-invalid={fieldErrors.password ? true : undefined}
                  aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                />
                {fieldErrors.password && <FieldError id="password-error">{fieldErrors.password}</FieldError>}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button type="submit" className="w-full" loading={mutation.isPending}>
                  Sign in
                </Button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-6 border-t border-gold-hairline pt-5 text-center text-body-sm text-cream-primary/80">
              <AuthFooterLink href={ROUTES.signup} label="Create an account">
                New to D'Fashion?
              </AuthFooterLink>
            </motion.div>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}

