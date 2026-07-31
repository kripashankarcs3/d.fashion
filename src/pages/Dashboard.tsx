import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { success, error } from '@/lib/toast';
import { ArrowRight, MessageSquare, Shirt, Sparkles, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ColorSwatch } from '@/components/ui/color-swatch';
import { EmptyAnalysisState } from '@/components/EmptyAnalysisState';
import { useStyleStore, type AnalysisResult } from '@/store/useStyleStore';
import { useAuthStore } from '@/store/useAuthStore';
import { fetchReports } from '@/services/api';
import { getSeasonInfo } from '@/lib/colour-data';

const ACTION_LABEL: Record<string, string> = {
  upload: 'Colour analysis',
  tryon: 'Virtual try-on',
  chat: 'Stylist conversation',
  report: 'Report viewed',
};

async function copyHex(hex: string) {
  try {
    await navigator.clipboard.writeText(hex);
    success(`Hex copied: ${hex}`);
  } catch {
    error('Could not copy the hex value');
  }
}

function PaletteRow({ colours }: { colours: { name: string; hex: string }[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {colours.map((colour) => (
        <button
          key={colour.hex + colour.name}
          type="button"
          onClick={() => void copyHex(colour.hex)}
          aria-label={`Copy ${colour.name} hex`}
          title={`${colour.name} · ${colour.hex}`}
          className="h-7 w-7 rounded-sm shadow-[var(--shadow-swatch)] transition-transform duration-200 ease-out hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-primary"
          style={{ backgroundColor: colour.hex }}
        />
      ))}
    </div>
  );
}

function compareSummary(current: AnalysisResult, previous: AnalysisResult) {
  const currentSeason = getSeasonInfo(
    current.colourSeason,
    current.colorProfile.undertone,
  );
  const previousSeason = getSeasonInfo(
    previous.colourSeason,
    previous.colorProfile.undertone,
  );
  if (previousSeason.season === currentSeason.season) {
    return `Your season stayed ${currentSeason.season}. Your palette is consistent with your last analysis.`;
  }
  return `Your season shifted from ${previousSeason.season} to ${currentSeason.season}. Update your wardrobe staples to your current palette.`;
}

export default function Dashboard() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const analysisResult = useStyleStore((s) => s.analysisResult);
  const analysisHistory = useStyleStore((s) => s.analysisHistory);
  const savedReports = useStyleStore((s) => s.savedReports);
  const wardrobeItems = useStyleStore((s) => s.wardrobeItems);
  const activityLog = useStyleStore((s) => s.activityLog);
  const isAuthed = Boolean(useAuthStore((s) => s.token));
  const [cloudReports, setCloudReports] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    if (!isAuthed) return;
    let cancelled = false;
    fetchReports()
      .then((res) => {
        if (cancelled) return;
        const reports = res.data.history
          .map((item) => item.report)
          .filter((report): report is AnalysisResult => Boolean(report));
        setCloudReports(reports);
      })
      .catch(() => {
        // Cloud history is best-effort; local reports still render.
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthed]);

  const allSavedReports = [
    ...cloudReports,
    ...savedReports,
  ].filter(
    (report, index, all) =>
      all.findIndex((other) => other.analyzedAt === report.analyzedAt) === index,
  );

  const seasonInfo = analysisResult
    ? getSeasonInfo(analysisResult.colourSeason, analysisResult.colorProfile.undertone)
    : null;

  const history = activityLog.slice(0, 8);

  return (
    <div className="w-full pt-28 pb-24">
      <div className="mx-auto w-full max-w-[var(--container-content)] px-5 md:px-8">
        {!analysisResult || !seasonInfo ? (
          <>
            <Card variant="report" className="p-8">
              <EmptyAnalysisState
                title="Your colour identity is waiting"
                description="Upload your first photo to begin. Your season, palette, and saved looks will live here."
              />
            </Card>

            <QuickActions />
          </>
        ) : (
          <>
            {/* Header */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
                Your Colour Identity
              </p>
              <h1 className="mt-3 font-serif text-[length:var(--text-h2)] text-espresso">
                {seasonInfo.season}
              </h1>
              <p className="mt-3 text-[length:var(--text-body-sm)] text-espresso-light">
                Analysed {format(new Date(analysisResult.analyzedAt), 'MMMM yyyy')} ·{' '}
                {analysisResult.colorProfile.undertone} undertone
              </p>
            </div>

            {/* Full colour palette */}
            <section className="mt-12">
              <SectionHeading title="Your Colour Palette" />
              <Card variant="report" className="mt-6 p-8">
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                  {seasonInfo.palette.map((colour) => (
                    <ColorSwatch key={colour.hex + colour.name} {...colour} />
                  ))}
                </div>
              </Card>
            </section>

            {/* Saved items */}
            <section className="mt-16">
              <div className="flex items-end justify-between gap-4">
                <SectionHeading title="Saved Looks" />
                <Link
                  href="/try-on"
                  className="inline-flex min-h-11 items-center gap-2 text-nav text-espresso-light transition-colors duration-200 ease-out hover:text-espresso hover:underline"
                >
                  Try on new looks
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              {wardrobeItems.length === 0 ? (
                <Card variant="report" className="mt-6 p-8">
                  <p className="font-serif text-[length:var(--text-h5)] text-espresso">
                    No saved looks yet.
                  </p>
                  <p className="mt-2 max-w-md text-[length:var(--text-body-sm)] text-espresso-light">
                    When you try on an outfit, save it here to build your
                    personal wardrobe archive.
                  </p>
                  <Link href="/try-on" className="mt-6 inline-block">
                    <Button variant="secondary" size="lg">
                      Explore Virtual Try-On
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {wardrobeItems.map((item) => (
                    <Card
                      key={item.id}
                      variant="report"
                      className="overflow-hidden p-0"
                    >
                      {item.imageUrl && (
                        <div className="aspect-[4/5] w-full overflow-hidden border-b border-border">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            width={480}
                            height={600}
                            loading="lazy"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="p-8 pt-6">
                        <p className="font-serif text-[length:var(--text-h5)] text-espresso">
                          {item.name}
                        </p>
                        <p className="mt-1 text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-espresso-muted">
                          {item.category}
                        </p>
                        {item.palette.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.palette.map((hex) => (
                              <span
                                key={hex}
                                aria-hidden="true"
                                className="h-6 w-6 rounded-sm shadow-[var(--shadow-swatch)]"
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Saved reports */}
            {allSavedReports.length > 0 && (
              <section className="mt-16">
                <SectionHeading title="Saved Reports" />
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {allSavedReports.map((report) => {
                    const reportSeason = getSeasonInfo(
                      report.colourSeason,
                      report.colorProfile.undertone,
                    );
                    return (
                      <Card key={report.analyzedAt} variant="report" className="p-8">
                        <p className="text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
                          Saved report
                        </p>
                        <h3 className="mt-2 font-serif text-[length:var(--text-h5)] text-espresso">
                          {reportSeason.season}
                        </h3>
                        <p className="mt-1 text-[length:var(--text-caption)] text-espresso-muted">
                          Analysed {format(new Date(report.analyzedAt), 'MMMM yyyy')}
                        </p>
                        <PaletteRow colours={reportSeason.palette} />
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Compare with previous */}
            {analysisHistory.length > 0 &&
              analysisHistory[analysisHistory.length - 1] && (
                <section className="mt-16">
                  <SectionHeading title="Compare with Previous" />
                  <Card variant="report" className="mt-6 p-8">
                    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                      {(() => {
                        const previous =
                          analysisHistory[analysisHistory.length - 1];
                        const previousSeason = getSeasonInfo(
                          previous.colourSeason,
                          previous.colorProfile.undertone,
                        );
                        return (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
                              Previous analysis
                            </p>
                            <h3 className="mt-2 font-serif text-[length:var(--text-h4)] text-espresso">
                              {previousSeason.season}
                            </h3>
                            <p className="mt-1 text-[length:var(--text-caption)] text-espresso-muted">
                              Analysed{' '}
                              {format(new Date(previous.analyzedAt), 'MMMM yyyy')}
                            </p>
                            <PaletteRow colours={previousSeason.palette} />
                          </div>
                        );
                      })()}
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
                          Current analysis
                        </p>
                        <h3 className="mt-2 font-serif text-[length:var(--text-h4)] text-espresso">
                          {seasonInfo.season}
                        </h3>
                        <p className="mt-1 text-[length:var(--text-caption)] text-espresso-muted">
                          Analysed{' '}
                          {format(new Date(analysisResult.analyzedAt), 'MMMM yyyy')}
                        </p>
                        <PaletteRow colours={seasonInfo.palette} />
                      </div>
                    </div>
                    <div className="mt-8 border-t border-border pt-6">
                      <p className="max-w-2xl text-[length:var(--text-body-sm)] text-espresso-light">
                        {compareSummary(
                          analysisResult,
                          analysisHistory[analysisHistory.length - 1],
                        )}
                      </p>
                    </div>
                  </Card>
                </section>
              )}

            {/* Analysis history */}
            <section className="mt-16">
              <SectionHeading title="Analysis History" />
              <Card variant="report" className="mt-6 p-8">
                {history.length === 0 ? (
                  <p className="text-[length:var(--text-body-sm)] text-espresso-light">
                    Your analysis history will appear here after your next
                    analysis.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {history.map((event) => (
                      <li
                        key={event.id}
                        className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-cream-dark text-gold-primary"
                        >
                          {event.action === 'upload' ? (
                            <Sparkles className="h-4 w-4" />
                          ) : event.action === 'tryon' ? (
                            <Shirt className="h-4 w-4" />
                          ) : event.action === 'chat' ? (
                            <MessageSquare className="h-4 w-4" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[length:var(--text-body-sm)] font-medium text-espresso">
                            {event.label}
                          </p>
                          <p className="text-[length:var(--text-caption)] text-espresso-muted">
                            {ACTION_LABEL[event.action] ?? 'Activity'}
                          </p>
                        </div>
                        <time
                          className="shrink-0 text-[length:var(--text-caption)] tabular-nums text-espresso-muted"
                          dateTime={event.timestamp}
                        >
                          {format(new Date(event.timestamp), 'MMM yyyy')}
                        </time>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </section>

            <QuickActions />
          </>
        )}
      </div>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="font-serif text-[length:var(--text-h3)] text-espresso">
      {title}
    </h2>
  );
}

function QuickActions() {
  const actions = [
    { href: '/upload', title: 'New Analysis', description: 'Upload another selfie', icon: Upload },
    { href: '/try-on', title: 'Virtual Try-On', description: 'See colours on you', icon: Shirt },
    { href: '/chat', title: 'AI Stylist', description: 'Get personalised advice', icon: MessageSquare },
    { href: '/report', title: 'Full Report', description: 'Revisit your analysis', icon: Sparkles },
  ];

  return (
    <section className="mt-16">
      <SectionHeading title="Quick Actions" />
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card
              variant="report"
              interactive
              className="group flex h-full flex-col p-8"
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-md bg-cream-dark text-gold-primary transition-colors duration-200 ease-out group-hover:bg-gold-primary group-hover:text-espresso"
              >
                <action.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-6 font-serif text-[length:var(--text-h5)] text-espresso">
                {action.title}
              </h3>
              <p className="mt-1 text-[length:var(--text-body-sm)] text-espresso-light">
                {action.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-nav text-gold-primary">
                Open
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
