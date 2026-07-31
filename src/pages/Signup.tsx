import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useSearch } from 'wouter';
import { success } from '@/lib/toast';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthCard, { AuthFooterLink } from '@/components/AuthCard';
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
      navigate('/dashboard');
    },
    onError: (err) => {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message
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
    <section className="w-full pt-30 pb-24">
      <div className="mx-auto w-full max-w-[var(--container-narrow)] px-5 md:px-8">
        <AuthCard
          title="Create your account."
          subtitle="Your analysis, palette, and saved reports will follow you wherever you sign in."
          footer={
            <AuthFooterLink href="/login" label="Sign in">
              Already have an account?
            </AuthFooterLink>
          }
        >
          {plan && (
            <p className="flex items-center gap-2 rounded-md border border-gold-primary/30 bg-gold-primary/10 px-4 py-3 text-[length:var(--text-body-sm)] text-espresso">
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-primary" />
              You&rsquo;re choosing the{' '}
              <span className="font-semibold">{plan}</span> plan.
            </p>
          )}

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-error/30 bg-error/5 px-4 py-3 text-body-sm text-error"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

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
        </AuthCard>
      </div>
    </section>
  );
}
