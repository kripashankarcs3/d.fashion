import { Link, useLocation } from 'wouter';
import { ROUTES } from '@/config/navigation';

const TABS = [
  { href: ROUTES.adminPayments, label: 'Payments' },
  { href: ROUTES.adminUsage, label: 'Usage' },
];

/** Small tab strip shared by every /admin/* page, so reviewing payments and
 *  watching usage are one click apart instead of two separate destinations. */
export function AdminNav() {
  const [location] = useLocation();
  return (
    <div className="mt-6 flex gap-2 border-b border-gold-hairline">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`px-4 py-2.5 text-caption uppercase tracking-eyebrow transition-colors ${
            location === tab.href
              ? 'border-b-2 border-gold-primary text-gold-primary'
              : 'text-cream-primary/55 hover:text-cream-primary'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
