import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import ReportPreview from '@/components/ReportPreview';
import { EmptyAnalysisState } from '@/components/EmptyAnalysisState';
import { useStyleStore } from '@/store/useStyleStore';
import { TrendingUp, Calendar, Download, ArrowRight, BarChart2, PieChart, Zap } from 'lucide-react';

const SKIN_CONCERN_LABELS: Record<string, string> = {
  acne: 'Acne',
  darkSpots: 'Dark Spots',
  wrinkles: 'Wrinkles',
  pores: 'Pores',
  oiliness: 'Oiliness',
  dryness: 'Dryness',
  redness: 'Redness',
  eyeBags: 'Eye Bags',
  darkCircles: 'Dark Circles',
  uneven: 'Uneven Tone',
  sensitivity: 'Sensitivity',
  texture: 'Texture',
  firmness: 'Firmness',
  radiance: 'Radiance',
};

const insightTypes = [
  { icon: BarChart2, title: 'Wear Frequency', desc: 'See which items you reach for most — and which are collecting dust.' },
  { icon: PieChart, title: 'Color Balance', desc: 'Your wardrobe\'s color distribution mapped against seasonal trends.' },
  { icon: Zap, title: 'Gap Analysis', desc: 'AI identifies what single purchase would unlock the most outfit combinations.' },
  { icon: TrendingUp, title: 'Style Trajectory', desc: 'How your personal style is evolving week over week.' },
];

export default function Report() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const analysisResult = useStyleStore((s) => s.analysisResult);

  return (
    <div className="w-full overflow-hidden">
      {/* Hero */}
      <section className="pt-40 pb-16 bg-background relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-primary/8 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/30 text-sm font-accent font-medium mb-6">
              <Calendar className="w-4 h-4 text-primary" /> Style Analysis Report
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-tight mb-6">
              Insights That <br /><span className="italic text-gradient-gold">Elevate.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-accent max-w-2xl">
              {analysisResult
                ? `Analyzed on ${new Date(analysisResult.analyzedAt).toLocaleDateString()}`
                : 'Upload your selfie to unlock your personalized skin & color analysis report.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* What's inside */}
      <section className="py-16 bg-secondary/20 border-y border-border">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-serif mb-8">What's Inside Every Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {insightTypes.map((insight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 rounded-2xl"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <insight.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif text-lg mb-2">{insight.title}</h3>
                <p className="text-sm text-muted-foreground font-accent leading-relaxed">{insight.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {!analysisResult ? (
        <section className="py-20 bg-background">
          <div className="max-w-6xl mx-auto px-6">
            <div className="glass-panel p-12 rounded-3xl">
              <EmptyAnalysisState
                title="No report yet"
                description="Complete your style analysis to view your report."
              />
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Latest Report — Skin Concerns */}
          <section className="py-16 bg-background">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-serif mb-6">Skin Analysis</h2>
              <div className="glass-panel p-8 rounded-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(SKIN_CONCERN_LABELS).map(([key, label]) => {
                    const value = (analysisResult.skinConcerns as any)[key] ?? 0;
                    const percent = Math.round(value * 100);
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-sm font-accent mb-1">
                          <span className="text-foreground">{label}</span>
                          <span className="text-muted-foreground">{percent}%</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-700"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Color Profile */}
          <section className="py-16 bg-secondary/20 border-y border-border">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-serif mb-6">Color Profile</h2>
              <div className="glass-panel p-8 rounded-3xl">
                <div className="flex flex-wrap gap-8 items-center">
                  {/* Skin Tone Swatch */}
                  <div className="text-center">
                    <div
                      className="w-16 h-16 rounded-full border-2 border-border mx-auto mb-2"
                      style={{ backgroundColor: analysisResult.colorProfile.skinToneHex }}
                    />
                    <p className="text-xs font-accent text-muted-foreground">Skin</p>
                    <p className="text-sm font-accent font-medium">{analysisResult.colorProfile.skinToneHex}</p>
                  </div>

                  {/* Undertone */}
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-border mx-auto mb-2 flex items-center justify-center">
                      <span className="font-serif text-lg capitalize">{analysisResult.colorProfile.undertone[0]}</span>
                    </div>
                    <p className="text-xs font-accent text-muted-foreground">Undertone</p>
                    <p className="text-sm font-accent font-medium capitalize">{analysisResult.colorProfile.undertone}</p>
                  </div>

                  {/* Eye Color */}
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-border mx-auto mb-2 flex items-center justify-center bg-secondary">
                      <span className="text-xs font-accent">👁</span>
                    </div>
                    <p className="text-xs font-accent text-muted-foreground">Eyes</p>
                    <p className="text-sm font-accent font-medium capitalize">{analysisResult.colorProfile.eyeColor}</p>
                  </div>

                  {/* Hair Color */}
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-border mx-auto mb-2 flex items-center justify-center bg-secondary">
                      <span className="text-xs font-accent">💇</span>
                    </div>
                    <p className="text-xs font-accent text-muted-foreground">Hair</p>
                    <p className="text-sm font-accent font-medium capitalize">{analysisResult.colorProfile.hairColor}</p>
                  </div>

                  {/* Lip Color */}
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-border mx-auto mb-2 flex items-center justify-center bg-secondary">
                      <span className="text-xs font-accent">💋</span>
                    </div>
                    <p className="text-xs font-accent text-muted-foreground">Lips</p>
                    <p className="text-sm font-accent font-medium capitalize">{analysisResult.colorProfile.lipColor}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Outfit Palette + Makeup Shades */}
          <section className="py-16 bg-background">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Outfit Palette */}
                <div className="glass-panel p-8 rounded-3xl">
                  <h3 className="font-serif text-2xl mb-4">Recommended Palette</h3>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {analysisResult.recommendations.outfitPalette.map((hex, i) => (
                      <div key={i} className="text-center">
                        <div
                          className="w-12 h-12 rounded-full border-2 border-border shadow-sm"
                          style={{ backgroundColor: hex }}
                        />
                        <p className="text-xs font-accent text-muted-foreground mt-1">{hex}</p>
                      </div>
                    ))}
                  </div>
                  {analysisResult.recommendations.avoidColors.length > 0 && (
                    <>
                      <h4 className="font-serif text-lg mb-2 text-red-600">Avoid Colors</h4>
                      <div className="flex flex-wrap gap-3">
                        {analysisResult.recommendations.avoidColors.map((hex, i) => (
                          <div key={i} className="text-center">
                            <div
                              className="w-10 h-10 rounded-full border-2 border-border opacity-60"
                              style={{ backgroundColor: hex }}
                            />
                            <p className="text-xs font-accent text-muted-foreground mt-1">{hex}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Makeup Shades */}
                <div className="glass-panel p-8 rounded-3xl">
                  <h3 className="font-serif text-2xl mb-4">Makeup Shades</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full border-2 border-border"
                        style={{ backgroundColor: analysisResult.recommendations.makeupShades.foundation }}
                      />
                      <div>
                        <p className="text-sm font-accent font-medium">Foundation</p>
                        <p className="text-xs font-accent text-muted-foreground">{analysisResult.recommendations.makeupShades.foundation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full border-2 border-border"
                        style={{ backgroundColor: analysisResult.recommendations.makeupShades.blush }}
                      />
                      <div>
                        <p className="text-sm font-accent font-medium">Blush</p>
                        <p className="text-xs font-accent text-muted-foreground">{analysisResult.recommendations.makeupShades.blush}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full border-2 border-border"
                        style={{ backgroundColor: analysisResult.recommendations.makeupShades.lip }}
                      />
                      <div>
                        <p className="text-sm font-accent font-medium">Lip</p>
                        <p className="text-xs font-accent text-muted-foreground">{analysisResult.recommendations.makeupShades.lip}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Hair Color Options */}
          <section className="py-16 bg-secondary/20 border-y border-border">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-serif mb-6">Recommended Hair Colors</h2>
              <div className="glass-panel p-8 rounded-3xl">
                <div className="flex flex-wrap gap-6">
                  {analysisResult.recommendations.hairColorOptions.map((hex, i) => (
                    <div key={i} className="text-center">
                      <div
                        className="w-14 h-14 rounded-full border-2 border-border shadow-sm"
                        style={{ backgroundColor: hex }}
                      />
                      <p className="text-xs font-accent text-muted-foreground mt-1">{hex}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Skincare Routine */}
          <section className="py-16 bg-background">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-serif mb-6">Recommended Skincare Routine</h2>
              <div className="glass-panel p-8 rounded-3xl">
                <div className="space-y-4">
                  {analysisResult.recommendations.skincareRoutine.map((step) => (
                    <div key={step.step} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-accent font-bold text-primary">{step.step}</span>
                      </div>
                      <div>
                        <p className="font-accent font-medium text-foreground">{step.product}</p>
                        <p className="text-sm text-muted-foreground font-accent">{step.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Style Insight */}
          <section className="py-16 bg-secondary/30 border-t border-border">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-serif mb-4">Style Insight</h2>
              <p className="text-lg text-muted-foreground font-accent leading-relaxed italic">
                &ldquo;{analysisResult.recommendations.styleInsight}&rdquo;
              </p>
            </div>
          </section>

          {/* ReportPreview */}
          <ReportPreview />

          {/* Report History — replaced with static text */}
          <section className="py-20 bg-background">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-serif mb-4">Report History</h2>
              <p className="text-muted-foreground font-accent">Report history will appear here after multiple analyses.</p>
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section className="py-20 bg-secondary/30 border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Get Your First Report</h2>
          <p className="text-muted-foreground font-accent mb-8">Upload your wardrobe today. Your first Style Intelligence report drops this Monday.</p>
          <Link href="/upload" className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-full font-accent font-medium hover:bg-foreground/90 transition-colors shadow-lg">
            Start Uploading <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}