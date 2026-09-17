import { useState } from 'react';
import { Redirect } from 'wouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import { AdminNav } from '@/components/AdminNav';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { ROUTES } from '@/config/navigation';
import { formatPrice } from '@/config/pricing';
import {
  approvePayment,
  getEmailAlertStatus,
  listPayments,
  rejectPayment,
  type PaymentRecord,
  type PaymentStatus,
} from '@/services/api';
import { success, error as toastError } from '@/lib/toast';

const TABS: { value: PaymentStatus | 'all'; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'all', label: 'All' },
];

const PAGE_SIZE = 20;

function describe(p: PaymentRecord): string {
  if (p.kind === 'plan') return `Plan — ${p.planId}`;
  return `Top-up — ${p.topupQty ?? 1} try-on${(p.topupQty ?? 1) > 1 ? 's' : ''}`;
}

function RejectAction({ id, onDone }: { id: string; onDone: () => void }) {
  const [reason, setReason] = useState('');
  const mutation = useMutation({
    mutationFn: () => rejectPayment(id, reason.trim() || undefined),
    onSuccess: () => {
      success('Payment rejected');
      onDone();
    },
    onError: (err: any) => toastError(err?.response?.data?.message ?? 'Could not reject the payment.'),
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" size="sm">Reject</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject this payment?</AlertDialogTitle>
          <AlertDialogDescription>
            The member will see this reason and can submit a new request.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)"
          maxLength={300}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? 'Rejecting…' : 'Reject'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ApproveAction({ id, onDone }: { id: string; onDone: () => void }) {
  const mutation = useMutation({
    mutationFn: () => approvePayment(id),
    onSuccess: () => {
      success('Payment approved — access activated');
      onDone();
    },
    onError: (err: any) => toastError(err?.response?.data?.message ?? 'Could not approve the payment.'),
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="primary" size="sm">Approve</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve this payment?</AlertDialogTitle>
          <AlertDialogDescription>
            This immediately activates the member&rsquo;s plan or try-on credit. Confirm you&rsquo;ve
            checked the UTR against your actual UPI transaction.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? 'Approving…' : 'Approve'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Shows whether the "new payment" email alert is actually reaching an
 *  inbox — sending is best-effort and silent by design, so without this a
 *  misconfigured SMTP_APP_PASSWORD looks identical to "nobody has paid yet". */
function EmailAlertStatusCard() {
  const query = useQuery({
    queryKey: ['email-alert-status'],
    queryFn: getEmailAlertStatus,
    staleTime: 30_000,
  });
  const status = query.data?.data;
  if (!status) return null;

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 border border-gold-hairline bg-surface-3 px-4 py-3 text-body-sm">
      <StatusBadge tone={status.configured ? 'success' : 'error'} hideDot>
        {status.configured ? 'Email alert on' : 'Email alert off'}
      </StatusBadge>
      <span className="text-cream-primary/70">
        {status.configured
          ? `Sends to ${status.recipient ?? '—'} from ${status.smtpUser ?? '—'}`
          : 'Set SMTP_USER, SMTP_APP_PASSWORD and NOTIFY_EMAIL to enable it.'}
      </span>
      {status.lastAlertOutcome && (
        <span className={status.lastAlertOutcome.ok ? 'text-cream-primary/50' : 'text-error'}>
          Last attempt ({new Date(status.lastAlertOutcome.at).toLocaleString()}):{' '}
          {status.lastAlertOutcome.ok ? 'sent' : status.lastAlertOutcome.detail}
        </span>
      )}
    </div>
  );
}

export default function AdminPayments() {
  const admin = useIsAdmin();
  const [status, setStatus] = useState<PaymentStatus | 'all'>('pending');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin-payments', status, q, page],
    queryFn: () =>
      listPayments({ status: status === 'all' ? undefined : status, q: q || undefined, page, pageSize: PAGE_SIZE }),
    enabled: admin.data === true,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin-payments'] });

  if (admin.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold-primary" aria-hidden />
      </div>
    );
  }
  if (!admin.data) {
    return <Redirect to={ROUTES.home} />;
  }

  const data = query.data?.data;
  const payments = data?.payments ?? [];
  const counts = data?.counts ?? { pending: 0, verified: 0, rejected: 0 };
  const total = data?.total ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="w-full pt-28 pb-24">
      <EditorialContainer width="editorial">
        <EyebrowLabel rule tone="gold">Admin</EyebrowLabel>
        <EditorialHeading as="h1" size="lg" className="mt-4 text-cream-primary">
          Payment Verification
        </EditorialHeading>
        <AdminNav />
        <EmailAlertStatusCard />

        <div className="mt-6 flex flex-wrap items-center gap-3 text-body-sm text-cream-primary/70">
          <span>Pending: <strong className="text-cream-primary">{counts.pending}</strong></span>
          <span>Verified: <strong className="text-cream-primary">{counts.verified}</strong></span>
          <span>Rejected: <strong className="text-cream-primary">{counts.rejected}</strong></span>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setStatus(tab.value);
                  setPage(1);
                }}
                className={`border px-4 py-2 text-caption uppercase tracking-eyebrow transition-colors ${
                  status === tab.value
                    ? 'border-gold-primary bg-gold-primary/15 text-gold-primary'
                    : 'border-gold-hairline text-cream-primary/60 hover:border-gold-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-primary/40" />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search UTR or email…"
              className="pl-9"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto border border-gold-hairline bg-surface-3">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Member</TableHead>
                <TableHead>Request</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>UTR</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-cream-primary/60">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-gold-primary" aria-hidden />
                  </TableCell>
                </TableRow>
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-cream-primary/60">
                    No payment requests here.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((p) => (
                  <TableRow key={p.id} className="border-border">
                    <TableCell className="text-body-sm text-cream-primary">
                      {p.name && <div className="font-medium">{p.name}</div>}
                      <div className={p.name ? 'text-cream-primary/60' : undefined}>{p.email}</div>
                    </TableCell>
                    <TableCell className="text-body-sm text-cream-primary/80">{describe(p)}</TableCell>
                    <TableCell className="text-body-sm text-cream-primary/80">{formatPrice(p.amount)}</TableCell>
                    <TableCell className="text-body-sm text-cream-primary/80">{p.utr}</TableCell>
                    <TableCell className="text-body-sm text-cream-primary/60">
                      {new Date(p.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={p.status === 'verified' ? 'success' : p.status === 'rejected' ? 'error' : 'neutral'}>
                        {p.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-right">
                      {p.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <ApproveAction id={p.id} onDone={refresh} />
                          <RejectAction id={p.id} onDone={refresh} />
                        </div>
                      ) : (
                        <span className="text-caption text-cream-primary/50">
                          {p.verifiedBy ? `by ${p.verifiedBy}` : '—'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {lastPage > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="text-body-sm text-cream-primary/60">Page {page} of {lastPage}</span>
            <Button variant="secondary" size="sm" disabled={page >= lastPage} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        )}
      </EditorialContainer>
    </div>
  );
}
