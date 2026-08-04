import { Link } from 'wouter';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStyleStore } from '@/store/useStyleStore';
import { getSeasonInfo } from '@/lib/colour-data';
import { ROUTES } from '@/config/navigation';

export function ResumeAnalysisBanner() {
  const analysisResult = useStyleStore((s) => s.analysisResult);

  if (!analysisResult) return null;

  const seasonInfo = getSeasonInfo(
    analysisResult.colourSeason,
    analysisResult.colorProfile.undertone,
  );

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-lg border border-gold-primary/40 bg-surface-3 p-6 shadow-card sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-surface-4 text-gold-primary"
            >
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[length:var(--text-body-sm)] font-medium text-cream-primary">
                Welcome back — your {seasonInfo.season} analysis is saved.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {seasonInfo.palette.slice(0, 4).map((colour) => (
                  <span
                    key={colour.hex}
                    aria-hidden="true"
                    className="h-6 w-6 rounded-sm border border-gold-hairline"
                    style={{ backgroundColor: colour.hex }}
                  />
                ))}
              </div>
              <p className="mt-2 text-[length:var(--text-caption)] text-cream-primary/55">
                {seasonInfo.palette.length} colours in your palette
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Link href={ROUTES.report} className="shrink-0">
              <Button size="lg">
                View report
                <ArrowRight aria-hidden="true" />
              </Button>
            </Link>
            <Link href={ROUTES.dashboard} className="shrink-0">
              <Button variant="secondary" size="lg">
                Go to dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
