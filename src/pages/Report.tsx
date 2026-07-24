import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import ReportPreview from '@/components/ReportPreview';
import { TrendingUp, Calendar, Download, ArrowRight, BarChart2, PieChart, Zap } from 'lucide-react';

const pastReports = [
  { vol: 41, week: 'Oct 5, 2023', score: 83, change: '+2', highlight: 'Monochrome week — strong identity.' },
  { vol: 40, week: 'Sep 28, 2023', score: 81, change: '+5', highlight: 'Introduced earth tones successfully.' },
  { vol: 39, week: 'Sep 21, 2023', score: 76, change: '-1', highlight: 'Over-relied on neutrals.' },
  { vol: 38, week: 'Sep 14, 2023', score: 77, change: '+3', highlight: 'Great layering combinations.' },
];

const insightTypes = [
  { icon: BarChart2, title: 'Wear Frequency', desc: 'See which items you reach for most — and which are collecting dust.' },
  { icon: PieChart, title: 'Color Balance', desc: 'Your wardrobe\'s color distribution mapped against seasonal trends.' },
  { icon: Zap, title: 'Gap Analysis', desc: 'AI identifies what single purchase would unlock the most outfit combinations.' },
  { icon: TrendingUp, title: 'Style Trajectory', desc: 'How your personal style is evolving week over week.' },
];

export default function Report() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

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
              <Calendar className="w-4 h-4 text-primary" /> Weekly Style Intelligence
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-tight mb-6">
              Insights That <br /><span className="italic text-gradient-gold">Elevate.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-accent max-w-2xl">
              Magazine-quality style reports, delivered every Monday. Understand your wear patterns, discover your strengths, and get AI-curated style upgrades.
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

      {/* Latest Report */}
      <div className="py-4 bg-background">
        <div className="max-w-6xl mx-auto px-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-serif">Latest Report</h2>
              <p className="text-muted-foreground font-accent text-sm mt-1">Vol. 42 — Week of October 12, 2023</p>
            </div>
            <button className="flex items-center gap-2 glass-panel px-5 py-2.5 rounded-full font-accent text-sm font-medium hover:border-primary/40 transition-colors">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>
      </div>
      <ReportPreview />

      {/* Report History */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-serif mb-8">Report History</h2>
          <div className="space-y-4">
            {pastReports.map((report, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-panel p-5 rounded-2xl flex items-center gap-4 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="font-serif text-lg text-primary font-bold leading-none">{report.vol}</span>
                  <span className="text-[9px] text-muted-foreground font-accent uppercase tracking-wider">Vol.</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-lg truncate">Style Intelligence — {report.week}</p>
                  <p className="text-sm text-muted-foreground font-accent truncate">{report.highlight}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-serif text-2xl">{report.score}</div>
                  <div className={`text-xs font-accent font-bold ${report.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{report.change}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upgrade CTA */}
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
