import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import DashboardPreview from '@/components/DashboardPreview';
import { Search, Bell, Filter, Plus, Layers, TrendingUp, Shirt, Star, ArrowRight, BarChart2 } from 'lucide-react';

const stats = [
  { label: 'Total Items', value: '142', icon: Layers, change: '+12 this week' },
  { label: 'Style Score', value: '87', icon: Star, change: '+4 from last week' },
  { label: 'Outfits Created', value: '34', icon: Shirt, change: '6 new combinations' },
  { label: 'Trend Match', value: '91%', icon: TrendingUp, change: 'Top 5% of users' },
];

const recentActivity = [
  { action: 'Added', item: 'Beige Linen Blazer', time: '2h ago', color: '#C9A84C' },
  { action: 'Tried On', item: 'Silk Midi Dress', time: '5h ago', color: '#8B7355' },
  { action: 'Styled', item: 'Outfit #34 — Parisian Evening', time: '1d ago', color: '#2F4F4F' },
  { action: 'Report', item: 'Weekly Style Intelligence Vol. 42', time: '2d ago', color: '#4A5D23' },
];

export default function Dashboard() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

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
              <h1 className="text-4xl md:text-5xl font-serif text-foreground">Welcome back, <span className="italic text-gradient-gold">Emma</span></h1>
              <p className="text-muted-foreground font-accent mt-2">Your wardrobe is performing exceptionally this week.</p>
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
        </div>
      </section>

      {/* Main Dashboard Preview */}
      <DashboardPreview />

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
              <div className="space-y-4">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                    <div className="w-10 h-10 rounded-full flex-shrink-0 border border-border" style={{ backgroundColor: item.color + '30' }}>
                      <div className="w-full h-full rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        <span className="text-muted-foreground font-accent">{item.action}: </span>{item.item}
                      </p>
                      <p className="text-xs text-muted-foreground font-accent">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
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
