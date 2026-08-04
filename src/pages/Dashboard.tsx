// ORIENT. The member's hub: status at a glance, what changed, the archive,
// and the launcher. Summarises; never explains. Every summary links out.
import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { success, error } from '@/lib/toast';
import { ArrowRight, MessageSquare, Shirt, Sparkles, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColorSwatch } from '@/components/ui/color-swatch';
import { EmptyAnalysisState } from '@/components/EmptyAnalysisState';
import { ROUTES } from '@/config/navigation';
import EditorialContainer from '@/components/editorial/EditorialContainer';
import EditorialHeading from '@/components/editorial/EditorialHeading';
import EyebrowLabel from '@/components/editorial/EyebrowLabel';
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
      <EditorialContainer width="content">
        {!analysisResult || !seasonInfo ? (
          <>
            <div className="border border-gold-hairline bg-surface-3 p-8">
              <EmptyAnalysisState
                title="Your colour identity is waiting"
                description="Upload your first photo to begin. Your season, palette, and saved looks will live here."
              />
            </div>

            <QuickActions emptyState />
          </>
        ) : (
          <>
            {/* Header — hairline divider, no card */}
            <motion.header
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="border-b border-gold-hairline pb-10"
            >
              <EyebrowLabel tone="gold">Your Colour Identity</EyebrowLabel>
              <EditorialHeading as="h1" size="lg" className="mt-4">
                {seasonInfo.season}
              </EditorialHeading>
              <p className="mt-2 eyebrow text-cream-primary/55">
                Analysed {format(new Date(analysisResult.analyzedAt), 'MMMM yyyy')} ·{' '}
                {analysisResult.colorProfile.undertone} undertone
              </p>
              <Link
                href={ROUTES.report}
                className="mt-4 inline-flex items-center gap-1.5 text-nav text-gold-primary transition-colors duration-200 ease-out hover:text-gold-light"
              >
                View full report
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.header>

            {/* Current palette strip */}
            <div className="mt-10 flex flex-wrap items-center gap-3 border-b border-gold-hairline pb-6">
              <span className="eyebrow text-cream-primary/55">Current palette</span>
              <motion.div className="flex flex-wrap gap-2">
                {seasonInfo.palette.slice(0, 6).map((colour, idx) => (
                  <motion.span
                    key={colour.hex}
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.3 + idx * 0.05,
                    }}
                    className="h-8 w-8 rounded-sm border border-gold-hairline"
                    style={{ backgroundColor: colour.hex }}
                  />
                ))}
              </motion.div>
              <Link
                href={ROUTES.report}
                className="ml-auto inline-flex items-center gap-1 text-nav text-cream-primary/55 transition-colors duration-200 ease-out hover:text-cream-primary"
              >
                See all {seasonInfo.palette.length} colours
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <QuickActions />

            {/* Compare with previous */}
            {analysisHistory.length > 0 &&
              analysisHistory[analysisHistory.length - 1] && (
                <section className="mt-16">
                  <SectionHeading label="Progress" title="Compare with Previous" />
                  <div className="mt-6 border border-gold-hairline bg-surface-3 p-8">
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
                            <h3 className="mt-2 font-serif text-[length:var(--text-h4)] text-cream-primary">
                              {previousSeason.season}
                            </h3>
                            <p className="mt-1 text-[length:var(--text-caption)] text-cream-primary/55">
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
                        <h3 className="mt-2 font-serif text-[length:var(--text-h4)] text-cream-primary">
                          {seasonInfo.season}
                        </h3>
                        <p className="mt-1 text-[length:var(--text-caption)] text-cream-primary/55">
                          Analysed{' '}
                          {format(new Date(analysisResult.analyzedAt), 'MMMM yyyy')}
                        </p>
                        <PaletteRow colours={seasonInfo.palette} />
                      </div>
                    </div>
                    <div className="mt-8 border-t border-gold-hairline pt-6">
                      <p className="max-w-2xl text-[length:var(--text-body-sm)] text-cream-primary/80">
                        {compareSummary(
                          analysisResult,
                          analysisHistory[analysisHistory.length - 1],
                        )}
                      </p>
                    </div>
                  </div>
                </section>
              )}

            {/* Saved items */}
            <section className="mt-16">
              <div className="flex items-end justify-between gap-4">
                <SectionHeading label="Wardrobe" title="Saved Looks" />
                <Link
                  href={ROUTES.tryOn}
                  className="inline-flex min-h-11 items-center gap-2 text-nav text-cream-primary/80 transition-colors duration-200 ease-out hover:text-cream-primary hover:underline"
                >
                  Try on new looks
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              {wardrobeItems.length === 0 ? (
                <div className="mt-6 border border-gold-hairline bg-surface-3 p-8">
                  <p className="font-serif text-[length:var(--text-h5)] text-cream-primary">
                    No saved looks yet.
                  </p>
                  <p className="mt-2 max-w-md text-[length:var(--text-body-sm)] text-cream-primary/80">
                    When you try on an outfit, save it here to build your
                    personal wardrobe archive.
                  </p>
                  <Link href={ROUTES.tryOn} className="mt-6 inline-block">
                    <Button variant="secondary" size="lg">
                      Explore Virtual Try-On
                    </Button>
                  </Link>
                </div>
              ) : (
                <motion.div
                  className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1 } },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.05 }}
                >
                  {wardrobeItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="group overflow-hidden border border-gold-hairline bg-surface-3"
                      variants={{
                        hidden: { opacity: 0, y: 24 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                        },
                      }}
                    >
                      {item.imageUrl && (
                        <div className="aspect-[4/5] w-full overflow-hidden border-b border-gold-hairline">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            width={480}
                            height={600}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:scale-[1.03]"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <p className="font-serif text-[length:var(--text-h5)] text-cream-primary">
                          {item.name}
                        </p>
                        <p className="mt-1 text-[length:var(--text-caption)] uppercase tracking-[var(--tracking-label)] text-cream-primary/55">
                          {item.category}
                        </p>
                        {item.palette.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.palette.map((hex) => (
                              <span
                                key={hex}
                                aria-hidden="true"
                                className="h-6 w-6 rounded-sm border border-gold-hairline"
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </section>

            {/* Saved reports */}
            {allSavedReports.length > 0 && (
              <section className="mt-16">
                <SectionHeading label="Saved" title="Saved Reports" />
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {allSavedReports.map((report) => {
                    const reportSeason = getSeasonInfo(
                      report.colourSeason,
                      report.colorProfile.undertone,
                    );
                    return (
                      <div
                        key={report.analyzedAt}
                        className="border border-gold-hairline bg-surface-3 p-6"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[var(--tracking-label)] text-gold-primary">
                          Saved report
                        </p>
                        <h3 className="mt-2 font-serif text-[length:var(--text-h5)] text-cream-primary">
                          {reportSeason.season}
                        </h3>
                        <p className="mt-1 text-[length:var(--text-caption)] text-cream-primary/55">
                          Analysed {format(new Date(report.analyzedAt), 'MMMM yyyy')}
                        </p>
                        <PaletteRow colours={reportSeason.palette} />
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Analysis history */}
            <section className="mt-16">
              <SectionHeading label="Activity" title="Analysis History" />
              <div className="mt-6 border border-gold-hairline bg-surface-3 p-8">
                {history.length === 0 ? (
                  <p className="text-[length:var(--text-body-sm)] text-cream-primary/80">
                    Your analysis history will appear here after your next
                    analysis.
                  </p>
                ) : (
                  <ul className="divide-y divide-gold-hairline">
                    {history.map((event) => (
                      <li
                        key={event.id}
                        className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-surface-4 text-gold-primary"
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
                          <p className="truncate text-[length:var(--text-body-sm)] font-medium text-cream-primary">
                            {event.label}
                          </p>
                          <p className="text-[length:var(--text-caption)] text-cream-primary/55">
                            {ACTION_LABEL[event.action] ?? 'Activity'}
                          </p>
                        </div>
                        <time
                          className="shrink-0 text-[length:var(--text-caption)] tabular-nums text-cream-primary/55"
                          dateTime={event.timestamp}
                        >
                          {format(new Date(event.timestamp), 'MMM yyyy')}
                        </time>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </>
        )}
      </EditorialContainer>
    </div>
  );
}

function SectionHeading({ label, title }: { label?: string; title: string }) {
  return (
    <div>
      {label && <EyebrowLabel tone="gold">{label}</EyebrowLabel>}
      <EditorialHeading as="h2" size="sm" className={label ? 'mt-3' : ''}>
        {title}
      </EditorialHeading>
    </div>
  );
}

function QuickActions({ emptyState = false }: { emptyState?: boolean }) {
  const allActions = [
    { href: ROUTES.upload, title: 'New Analysis', description: 'Upload another selfie', icon: Upload },
    { href: ROUTES.tryOn, title: 'Virtual Try-On', description: 'See colours on you', icon: Shirt },
    { href: ROUTES.chat, title: 'AI Stylist', description: 'Get personalised advice', icon: MessageSquare },
    { href: ROUTES.report, title: 'Full Report', description: 'Revisit your analysis', icon: Sparkles },
  ];
  const actions = emptyState
    ? allActions.filter((a) => a.href === ROUTES.upload)
    : allActions;

  return (
    <section className="mt-16">
      <SectionHeading label="Quick Actions" title="Jump In" />
      <motion.div
        className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {actions.map((action) => (
          <motion.div
            key={action.href}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            whileHover={{ y: -4, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
            style={{ willChange: 'transform' }}
          >
            <Link
              href={action.href}
              className="group flex h-full flex-col border border-gold-hairline bg-surface-3 p-6 transition-colors duration-300 hover:border-gold-primary/40"
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-sm bg-surface-4 text-gold-primary transition-colors duration-200 ease-out group-hover:bg-gold-primary group-hover:text-surface-0"
              >
                <action.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-6 font-serif text-[length:var(--text-h5)] text-cream-primary">
                {action.title}
              </h3>
              <p className="mt-1 text-[length:var(--text-body-sm)] text-cream-primary/80">
                {action.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-nav text-gold-primary">
                Open
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
