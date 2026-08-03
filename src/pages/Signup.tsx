import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useSearch } from 'wouter';
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

export default function Signup() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const plan = new URLSearchParams(search).get('plan');
  const redirectTo = new URLSearchParams(search).get('redirect') || '/';

  const setSession = useAuthStore((s) => s.setSession);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => { window.scrollTo(0, 0); }, []);

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
    <div className="grid min-h-screen grid-cols-1 bg-[#070707] lg:grid-cols-2">
      {/* LEFT: editorial campaign image — runs under the form's left edge so
          the dissolve resolves there instead of at the grid line */}
      <div className="relative hidden lg:block">
        <EditorialImage
          src={CAMPAIGN.opening.src}
          alt={CAMPAIGN.opening.alt}
          ratio="fill"
          scrim="right"
          position="center 30%"
          priority
          cinematicIntensity={1}
          className="absolute inset-y-0 left-0 w-full lg:right-auto lg:w-[calc(100%+6rem)]"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <EyebrowLabel tone="inverse">D&rsquo;Fashion</EyebrowLabel>
          <EditorialHeading size="lg" tone="inverse" className="mt-4 max-w-[14ch]">
            Colour Intelligence, <Emphasis>Personalised.</Emphasis>
          </EditorialHeading>
        </div>
      </div>

      {/* RIGHT: form — clean, minimal. Same ground as the dissolve endpoint. */}
      <div className="relative z-10 flex items-center justify-center bg-[#070707] p-8 lg:p-16">
        <div className="w-full max-w-md">
          <EyebrowLabel tone="muted" className="mb-6">
            Create Account
          </EyebrowLabel>
          <EditorialHeading as="h1" size="md">
            Create your account.
          </EditorialHeading>
          <p className="mt-3 text-body text-cream-primary/80">
            Your analysis, saved looks, and colour report will always stay with you.
          </p>

          {plan && (
            <p className="mt-8 flex items-center gap-2 rounded-sm border border-gold-primary/40 bg-gold-primary/10 px-4 py-3 text-[length:var(--text-body-sm)] text-cream-primary">
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-primary" />
              You&rsquo;re choosing the{' '}
              <span className="font-semibold">{plan}</span> plan.
            </p>
          )}

          {error && (
            <div
              role="alert"
              className="mt-8 flex items-start gap-2 rounded-sm border border-error/30 bg-error/5 px-4 py-3 text-body-sm text-error"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-10">
            <GoogleSignInButton
              label="Sign up with Google"
              onSuccess={() => {
                success("Welcome to D'Fashion!");
                navigate(redirectTo);
              }}
              onError={(message) => setError(message)}
            />
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gold-hairline" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] text-cream-primary/50">
              <span className="bg-[#070707] px-3 font-medium">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
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
            </div>
            <div>
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
            </div>
            <div>
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
            </div>
            <Button type="submit" className="w-full" loading={mutation.isPending}>
              Create account
            </Button>
          </form>

          <div className="mt-8 border-t border-gold-hairline pt-6 text-center text-body-sm text-cream-primary/80">
            <AuthFooterLink href="/login" label="Sign in">
              Already have an account?
            </AuthFooterLink>
          </div>
        </div>
      </div>
    </div>
  );
}
