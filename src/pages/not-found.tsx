import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useStyleStore } from '@/store/useStyleStore';

export default function NotFound() {
  const analysisResult = useStyleStore((s) => s.analysisResult);

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center px-5 md:px-8">
      <div className="w-full max-w-xl text-center">
        <p className="text-[length:var(--text-body)] text-espresso-light">
          We couldn&rsquo;t find that page.
        </p>
        <p className="mt-2 text-[length:var(--text-body)] text-espresso-light">
          Perhaps it chose its colours and moved on.
        </p>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0, 0, 0.2, 1] }}
          className="mt-6 font-serif leading-none text-gold-primary text-[96px] md:text-[200px]"
        >
          404
        </motion.h1>

        {analysisResult && (
          <p className="mt-8 text-[length:var(--text-body-sm)] text-espresso-light">
            Your colour report is still here, though.
          </p>
        )}

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/">
            <Button size="lg">Return Home</Button>
          </Link>
          {analysisResult && (
            <Link href="/report">
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
