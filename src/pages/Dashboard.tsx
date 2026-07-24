import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { formatDistanceToNow } from 'date-fns';
import DashboardPreview from '@/components/DashboardPreview';
import { EmptyAnalysisState } from '@/components/EmptyAnalysisState';
import { useStyleStore } from '@/store/useStyleStore';
import { Layers, Star, Shirt, TrendingUp, Plus, BarChart2, ArrowRight, Search, Bell, Filter } from 'lucide-react';

export default function Dashboard() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const wardrobeItems = useStyleStore((s) => s.wardrobeItems);
  const activityLog = useStyleStore((s) => s.activityLog);
  const analysisResult = useStyleStore((s) => s.analysisResult);
  const userPreferences = useStyleStore((s) => s.userPreferences);

  const totalItems = wardrobeItems.length;
  const styleScore = analysisResult ? 87 : 0;

  const stats = [
    { label: 'Total Items', value: String(totalItems), icon: Layers, change: `${totalItems} items in wardrobe` },
    { label: 'Style Score', value: String(styleScore), icon: Star, change: analysisResult ? 'Analysis complete' : 'Upload to get score' },
    { label: 'Outfits Created', value: '0', icon: Shirt, change: 'Coming soon' },
    { label: 'Trend Match', value: analysisResult ? 'Available' : '--', icon: TrendingUp, change: 'Based on your analysis' },
  ];

  const recentItems = activityLog.slice(0, 10);

  return (
    <div className="w-full overflow-hidden">
      {/* Page Header */}
      <section className="pt-36 pb-10 bg-background border-b border-border relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-primary font-accent text-sm font-bold tracking-widest mb-2">YOUR DIGITAL ATELIER</p>
              <h1 className="text-4xl md:text-5xl font-serif text-foreground">
                Welcome back,{' '}
                <span className="italic text-gradient-gold">
                  {userPreferences.displayName || 'Your Wardrobe'}
                </span>
              </h1>
              <p className="text-muted-foreground font-accent mt-2">
                {totalItems > 0
                  ? 'Your wardrobe is performing exceptionally this week.'
                  : 'Upload your first item to get started.'}
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
              <Link href="/upload" className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full font-accent text-sm font-medium hover:bg-foreground/90 transition-colors">
                <Plus className="w-4 h-4" /> Add Items
              </Link>
              <Link href="/report" className="flex items-center gap-2 glass-panel px-5 py-2.5 rounded-full font-accent text-sm font-medium hover:bg-white/60 transition-colors">
                <BarChart2 className="w-4 h-4" /> View Report
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-8 bg-secondary/20 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-panel p-5 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-accent">{stat.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-serif text-foreground mb-1">{stat.value}</div>
                <div className="text-xs text-primary font-accent font-medium">{stat.change}</div>
              </motion.div>
            ))}
          </div>

          {/* Color profile swatch when analysis exists */}
          {analysisResult && (
            <div className="mt-4 flex items-center gap-4 glass-panel p-4 rounded-2xl">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-accent">Skin Tone</span>
              <div
                className="w-10 h-10 rounded-full border-2 border-border"
                style={{ backgroundColor: analysisResult.colorProfile.skinToneHex }}
              />
              <span className="font-accent text-sm text-muted-foreground">{analysisResult.colorProfile.skinToneHex}</span>
              <span className="text-xs font-accent text-muted-foreground">|</span>
              <span className="text-xs font-accent capitalize text-muted-foreground">{analysisResult.colorProfile.undertone} undertone</span>
              <span className="text-xs font-accent text-muted-foreground">|</span>
              <span className="text-xs font-accent text-muted-foreground">Eyes: {analysisResult.colorProfile.eyeColor}</span>
            </div>
          )}
        </div>
      </section>

      {/* Empty state when no wardrobe items */}
      {wardrobeItems.length === 0 && (
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="glass-panel p-12 rounded-3xl">
              <EmptyAnalysisState
                title="Your wardrobe is empty"
                description="Upload your clothing items to build your digital atelier and unlock personalized style insights."
              />
            </div>
          </div>
        </section>
      )}

      {/* Main Dashboard Preview */}
      {wardrobeItems.length > 0 && <DashboardPreview />}

      {/* Recent Activity + Quick Actions */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-8 rounded-3xl"
            >
              <h3 className="font-serif text-2xl mb-6">Recent Activity</h3>
              {recentItems.length === 0 ? (
                <p className="text-muted-foreground font-accent text-sm">No activity yet. Upload a selfie or explore the app to get started.</p>
              ) : (
                <div className="space-y-4">
                  {recentItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                      <div className="w-10 h-10 rounded-full flex-shrink-0 border border-border" style={{ backgroundColor: (item.color ?? '#C9A84C') + '30' }}>
                        <div className="w-full h-full rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color ?? '#C9A84C' }} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          <span className="text-muted-foreground font-accent capitalize">{item.action}: </span>{item.label}
                        </p>
                        <p className="text-xs text-muted-foreground font-accent">
                          {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h3 className="font-serif text-2xl mb-6">Quick Actions</h3>
              {[
                { href: '/tryon', title: 'Virtual Try-On', desc: 'Try outfits before buying', icon: '👗' },
                { href: '/chat', title: 'Ask AI Stylist', desc: 'Get personalized advice', icon: '✨' },
                { href: '/report', title: 'Weekly Report', desc: 'View your style analytics', icon: '📊' },
                { href: '/upload', title: 'Add New Items', desc: 'Expand your wardrobe', icon: '➕' },
              ].map((action, i) => (
                <Link key={i} href={action.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="glass-panel p-5 rounded-2xl flex items-center gap-4 cursor-pointer hover:border-primary/40 transition-colors group"
                  >
                    <div className="text-2xl w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-lg">{action.title}</h4>
                      <p className="text-sm text-muted-foreground font-accent">{action.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </motion.div>
                </Link>
              ))}
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}