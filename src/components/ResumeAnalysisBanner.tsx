import { Link } from 'wouter';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStyleStore } from '@/store/useStyleStore';
import { getSeasonInfo } from '@/lib/colour-data';

export function ResumeAnalysisBanner() {
  const analysisResult = useStyleStore((s) => s.analysisResult);

  if (!analysisResult) return null;

  const season = getSeasonInfo(
    analysisResult.colourSeason,
    analysisResult.colorProfile.undertone,
  ).season;

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-lg border border-gold-primary bg-white p-6 shadow-card sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-cream-dark text-gold-primary"
            >
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[length:var(--text-body-sm)] font-medium text-espresso">
                Welcome back — your {season} analysis is saved.
              </p>
              <p className="mt-1 text-[length:var(--text-caption)] text-espresso-muted">
                Pick up where you left off: your palette, report, and saved looks
                are waiting.
              </p>
            </div>
          </div>
          <Link href="/report" className="shrink-0">
            <Button size="lg">
              Resume My Analysis
              <ArrowRight aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
