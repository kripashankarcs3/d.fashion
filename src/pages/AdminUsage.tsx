import { useState } from 'react';
import { Redirect } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
import { AdminNav } from '@/components/AdminNav';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { ROUTES } from '@/config/navigation';
import { listTryOnUsageAdmin, type TryOnPlan } from '@/services/api';

const TABS: { value: TryOnPlan | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'starter', label: 'Starter' },
  { value: 'essentials', label: 'Essentials' },
  { value: 'atelier', label: 'Atelier' },
];

const PAGE_SIZE = 25;

const planTone = (plan: TryOnPlan): 'neutral' | 'gold' | 'success' =>
  plan === 'atelier' ? 'success' : plan === 'essentials' ? 'gold' : 'neutral';

export default function AdminUsage() {
  const admin = useIsAdmin();
  const [plan, setPlan] = useState<TryOnPlan | 'all'>('all');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ['admin-usage', plan, q, page],
    queryFn: () =>
      listTryOnUsageAdmin({ plan: plan === 'all' ? undefined : plan, q: q || undefined, page, pageSize: PAGE_SIZE }),
    enabled: admin.data === true,
  });

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
  const accounts = data?.accounts ?? [];
  const planCounts = data?.planCounts ?? { starter: 0, essentials: 0, atelier: 0 };
  const total = data?.total ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="w-full pt-28 pb-24">
      <EditorialContainer width="editorial">
        <EyebrowLabel rule tone="gold">Admin</EyebrowLabel>
        <EditorialHeading as="h1" size="lg" className="mt-4 text-cream-primary">
          Try-On Usage
        </EditorialHeading>
        <AdminNav />

        <div className="mt-6 flex flex-wrap items-center gap-3 text-body-sm text-cream-primary/70">
          <span>Starter: <strong className="text-cream-primary">{planCounts.starter}</strong></span>
          <span>Essentials: <strong className="text-cream-primary">{planCounts.essentials}</strong></span>
          <span>Atelier: <strong className="text-cream-primary">{planCounts.atelier}</strong></span>
          <span>Total accounts: <strong className="text-cream-primary">{total}</strong></span>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setPlan(tab.value);
                  setPage(1);
                }}
                className={`border px-4 py-2 text-caption uppercase tracking-eyebrow transition-colors ${
                  plan === tab.value
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
              placeholder="Search email…"
              className="pl-9"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto border border-gold-hairline bg-surface-3">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Used / Limit</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Last activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-cream-primary/60">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-gold-primary" aria-hidden />
                  </TableCell>
                </TableRow>
              ) : accounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-cream-primary/60">
                    No accounts here.
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((a) => (
                  <TableRow key={a.email} className="border-border">
                    <TableCell className="text-body-sm text-cream-primary">{a.email}</TableCell>
                    <TableCell>
                      <StatusBadge tone={planTone(a.plan)} hideDot>
                        {a.plan}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-body-sm text-cream-primary/80 tabular-nums">
                      {a.unlimited ? 'Unlimited' : `${a.used} / ${a.limit}`}
                    </TableCell>
                    <TableCell className="text-body-sm tabular-nums">
                      {a.unlimited ? (
                        <span className="text-gold-primary">Unlimited</span>
                      ) : (
                        <span className={a.used >= (a.limit ?? 0) ? 'text-gold-primary' : 'text-cream-primary/80'}>
                          {Math.max(0, (a.limit ?? 0) - a.used)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-body-sm text-cream-primary/60">
                      {a.updatedAt ? new Date(a.updatedAt).toLocaleString() : '—'}
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
