import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { success } from '@/lib/toast';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthCard, { AuthFooterLink } from '@/components/AuthCard';
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

export default function Login() {
  const [, navigate] = useLocation();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const mutation = useMutation({
    mutationFn: () => login(email.trim(), password),
    onSuccess: (response) => {
      const { token, user } = response.data;
      setSession(token, user);
      success(`Welcome back, ${user.name.split(' ')[0]}`);
      navigate('/dashboard');
    },
    onError: (err) => {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message
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
    <section className="w-full pt-30 pb-24">
      <div className="mx-auto w-full max-w-[var(--container-narrow)] px-5 md:px-8">
        <AuthCard
          title="Welcome back."
          subtitle="Sign in to your account to keep your palette, reports, and wardrobe in sync."
          footer={
            <AuthFooterLink href="/signup" label="Create an account">
              New to D'Fashion?
            </AuthFooterLink>
          }
        >
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                aria-invalid={fieldErrors.password ? true : undefined}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              />
              {fieldErrors.password && <FieldError id="password-error">{fieldErrors.password}</FieldError>}
            </div>
            <Button type="submit" className="w-full" loading={mutation.isPending}>
              Sign in
            </Button>
          </form>
        </AuthCard>
      </div>
    </section>
  );
}
