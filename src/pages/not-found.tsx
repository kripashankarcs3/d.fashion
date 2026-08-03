import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useStyleStore } from '@/store/useStyleStore';
import { ROUTES } from '@/config/navigation';

export default function NotFound() {
  const analysisResult = useStyleStore((s) => s.analysisResult);

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center px-5 py-16 md:px-8">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[8px] border border-gold-hairline bg-surface-3/80 p-8 text-center shadow-[var(--shadow-card)] sm:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(216,176,103,0.16),transparent_55%)]"
        />
        <p className="text-[length:var(--text-body)] text-cream-primary/80">
          We couldn&rsquo;t find that page.
        </p>
        <p className="mt-2 text-[length:var(--text-body)] text-cream-primary/80">
          Perhaps it chose its colours and moved on.
        </p>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.45, ease: [0, 0, 0.2, 1] }}
          className="mt-6 font-serif leading-none text-gold-primary text-[96px] md:text-[200px]"
        >
          404
        </motion.h1>

        {analysisResult && (
          <p className="mt-6 text-[length:var(--text-body-sm)] text-cream-primary/80">
            Your colour report is still here, though.
          </p>
        )}

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href={ROUTES.home}>
            <Button size="lg">Return Home</Button>
          </Link>
          {analysisResult && (
            <Link href={ROUTES.report}>
              <Button variant="secondary" size="lg">
                View Your Report
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
