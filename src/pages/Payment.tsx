import { useMemo, useState } from 'react';
import { useSearch, Link } from 'wouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BadgeCheck, Check, Copy, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import { ROUTES } from '@/config/navigation';
import { PLAN_LABELS, PLAN_PRICES, TOPUP_PRICE_PER_UNIT, UPI } from '@/config/payment';
import { formatPrice } from '@/config/pricing';
import { getPayment, submitPayment, type PaymentKind, type PaymentRecord } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { success, error as toastError } from '@/lib/toast';

type PlanId = 'essentials' | 'atelier';

function useIntent() {
  const search = useSearch();
  return useMemo(() => {
    const params = new URLSearchParams(search);
    const kind: PaymentKind = params.get('kind') === 'topup' ? 'topup' : 'plan';
    const planId: PlanId = params.get('planId') === 'atelier' ? 'atelier' : 'essentials';
    return { kind, planId };
  }, [search]);
}

/** Not-yet-configured looks like a visible placeholder, never a broken <img>. */
function QrImage() {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <div className="flex h-56 w-56 flex-col items-center justify-center gap-2 border border-dashed border-gold-hairline bg-surface-4 p-4 text-center">
        <p className="text-body-sm text-cream-primary/60">
          QR not configured yet. Set <code>VITE_UPI_QR_IMAGE</code>.
        </p>
      </div>
    );
  }
  return (
    <img
      src={UPI.qrImage}
      alt="UPI payment QR code"
      className="h-56 w-56 border border-gold-hairline bg-surface-0 object-contain p-3"
      onError={() => setBroken(true)}
    />
  );
}

export default function Payment() {
  const { kind, planId } = useIntent();
  const accountEmail = useAuthStore((s) => s.user?.email) ?? '';
  const accountName = useAuthStore((s) => s.user?.name) ?? '';
  const [step, setStep] = useState<'pay' | 'proof'>('pay');
  const [utr, setUtr] = useState('');
  const [name, setName] = useState(accountName);
  const [email, setEmail] = useState(accountEmail);
  const [copied, setCopied] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const amount = kind === 'plan' ? PLAN_PRICES[planId] : TOPUP_PRICE_PER_UNIT;
  const label = kind === 'plan' ? PLAN_LABELS[planId] : 'One extra AI try-on';

  const submit = useMutation({
    mutationFn: () =>
      submitPayment({
        kind,
        planId: kind === 'plan' ? planId : undefined,
        topupQty: kind === 'topup' ? 1 : undefined,
        utr: utr.trim(),
        name: name.trim(),
        email: email.trim(),
      }),
    onSuccess: (res) => {
      setPaymentId(res.data.payment.id);
      success('Payment submitted — we’ll review it shortly.');
    },
    onError: (err: any) => {
      toastError(err?.response?.data?.message ?? 'Could not submit the payment. Please try again.');
    },
  });

  const status = useQuery({
    queryKey: ['payment', paymentId],
    queryFn: async () => (await getPayment(paymentId as string)).data.payment,
    enabled: Boolean(paymentId),
    refetchInterval: (query) => (query.state.data?.status === 'pending' ? 4000 : false),
  });

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toastError('Could not copy — select and copy the UPI ID manually.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr.trim() || !name.trim() || !email.trim()) return;
    submit.mutate();
  };

  const resubmit = () => {
    setPaymentId(null);
    setUtr('');
    setName(accountName);
    setEmail(accountEmail);
    queryClient.removeQueries({ queryKey: ['payment'] });
  };

  const record: PaymentRecord | undefined = status.data;

  return (
    <div className="w-full pt-28 pb-24">
      <EditorialContainer width="content">
        <div className="mx-auto max-w-lg">
          <EyebrowLabel rule tone="gold">Payment</EyebrowLabel>
          <EditorialHeading as="h1" size="lg" className="mt-4 text-cream-primary">
            Complete your payment
          </EditorialHeading>
          <p className="mt-3 text-body-sm text-cream-primary/70">
            {label} — {formatPrice(amount)}
          </p>

          {/* Outcome states take over once a request has been submitted. */}
          {record?.status === 'verified' ? (
            <div className="mt-10 border border-gold-primary/50 bg-surface-4 p-8 text-center">
              <BadgeCheck className="mx-auto h-10 w-10 text-gold-primary" aria-hidden />
              <p className="mt-4 font-serif text-h4 text-cream-primary">Payment Verified</p>
              <p className="mt-2 text-body-sm text-cream-primary/70">
                Your access has been activated.
              </p>
              <Link href={ROUTES.tryOn}>
                <Button variant="primary" className="mt-6">Go to Try-On</Button>
              </Link>
            </div>
          ) : record?.status === 'rejected' ? (
            <div className="mt-10 border border-gold-hairline bg-surface-3 p-8 text-center">
              <XCircle className="mx-auto h-10 w-10 text-cream-primary/60" aria-hidden />
              <p className="mt-4 font-serif text-h4 text-cream-primary">Verification Failed</p>
              {record.rejectionReason && (
                <p className="mt-2 text-body-sm text-cream-primary/70">Reason: {record.rejectionReason}</p>
              )}
              <p className="mt-2 text-body-sm text-cream-primary/70">
                Please submit a valid payment proof.
              </p>
              <Button variant="secondary" className="mt-6" onClick={resubmit}>
                Submit a New Request
              </Button>
            </div>
          ) : paymentId ? (
            <div className="mt-10 border border-gold-hairline bg-surface-3 p-8 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-gold-primary" aria-hidden />
              <p className="mt-4 font-serif text-h4 text-cream-primary">Verification Pending</p>
              <p className="mt-2 text-body-sm text-cream-primary/70">
                We&rsquo;ll activate your access as soon as this is reviewed — usually within a few hours.
              </p>
            </div>
          ) : step === 'pay' ? (
            <div className="mt-10 flex flex-col items-center gap-6 border border-gold-hairline bg-surface-3 p-8 text-center">
              <QrImage />
              <div className="flex items-center gap-2">
                <span className="text-body-sm text-cream-primary/80">UPI ID: {UPI.id}</span>
                <button
                  type="button"
                  onClick={copyUpi}
                  className="inline-flex items-center gap-1 text-caption uppercase tracking-eyebrow text-gold-primary hover:text-gold-light"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy UPI ID'}
                </button>
              </div>
              <Button variant="primary" className="w-full" onClick={() => setStep('proof')}>
                I&rsquo;ve Paid
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5 border border-gold-hairline bg-surface-3 p-8">
              <div>
                <label htmlFor="utr" className="text-caption uppercase tracking-eyebrow text-cream-primary/60">
                  UTR / Transaction ID
                </label>
                <Input
                  id="utr"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="e.g. 402812345678"
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <label htmlFor="payer-name" className="text-caption uppercase tracking-eyebrow text-cream-primary/60">
                  Your Name
                </label>
                <Input
                  id="payer-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <label htmlFor="account-email" className="text-caption uppercase tracking-eyebrow text-cream-primary/60">
                  Your D&rsquo;Style account email
                </label>
                <Input
                  id="account-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="mt-2"
                />
                <p className="mt-1.5 text-caption text-cream-primary/45">
                  Must match the email you signed in with — this is how we know whose access to activate.
                </p>
              </div>
              <Button type="submit" variant="primary" loading={submit.isPending} disabled={!utr.trim() || !name.trim() || !email.trim()}>
                Submit Payment
              </Button>
              <button
                type="button"
                onClick={() => setStep('pay')}
                className="text-caption uppercase tracking-eyebrow text-cream-primary/50 hover:text-cream-primary"
              >
                ← Back
              </button>
            </form>
          )}
        </div>
      </EditorialContainer>
    </div>
  );
}
