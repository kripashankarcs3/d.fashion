import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

export default function ReportPreview() {
  return (
    <section className="py-24 bg-secondary/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Insights that Elevate</h2>
          <p className="font-accent text-muted-foreground text-lg max-w-2xl mx-auto">
            Receive weekly, magazine-quality style reports analyzing your wear patterns and suggesting fresh combinations.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-white rounded-t-3xl shadow-2xl p-8 md:p-12 border border-border border-b-0"
        >
          {/* Report Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-border pb-8 mb-8">
            <div>
              <p className="text-primary font-accent font-bold tracking-widest text-sm mb-2">WEEKLY STYLE INTELLIGENCE</p>
              <h3 className="text-5xl font-serif text-foreground">Vol. 42</h3>
              <p className="text-muted-foreground font-accent mt-2">Week of October 12, 2023</p>
            </div>
            <div className="mt-6 md:mt-0 text-right">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full font-accent text-sm font-medium">
                <TrendingUp className="w-4 h-4" /> Style Score +4
              </div>
              <p className="text-4xl font-serif mt-2">87<span className="text-xl text-muted-foreground">/100</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Col */}
            <div>
              <h4 className="text-xl font-serif mb-6 border-b border-border/50 pb-2">Color Harmony</h4>
              
              {/* Fake Donut Chart */}
              <div className="flex items-center gap-8 mb-8">
                <div className="relative w-32 h-32 rounded-full conic-gradient-chart flex items-center justify-center shadow-inner">
                  <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center">
                    <span className="font-serif text-2xl">4</span>
                    <span className="text-[10px] text-muted-foreground font-accent uppercase tracking-widest">Tones</span>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between text-sm font-accent">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#1A1A18]" /> Neutrals</div>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-accent">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#8B4513]" /> Earth</div>
                    <span className="font-medium">30%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-accent">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#C9A84C]" /> Accents</div>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-accent">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#4A5D23]" /> Cool</div>
                    <span className="font-medium">10%</span>
                  </div>
                </div>
              </div>

              <div className="bg-secondary p-6 rounded-2xl">
                <h5 className="font-serif text-lg mb-2 flex items-center gap-2">AI Observation</h5>
                <p className="text-muted-foreground font-accent text-sm leading-relaxed">
                  You've been favoring high-contrast pairings this week. Your incorporation of earth tones has increased by 15%, aligning perfectly with current seasonal transitions.
                </p>
              </div>
            </div>

            {/* Right Col */}
            <div>
              <h4 className="text-xl font-serif mb-6 border-b border-border/50 pb-2">Suggested Addition</h4>
              
              <div className="group cursor-pointer">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary mb-4 relative">
                  <img src="https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&q=80" alt="Suggestion" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                    <ArrowUpRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <h5 className="font-serif text-xl mb-1">Textured Silk Blouse</h5>
                <p className="text-muted-foreground font-accent text-sm mb-3">Fills a gap in your 'Smart Casual' category and pairs with 12 existing bottoms.</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded font-accent tracking-wider">HIGH ROI</span>
                  <span className="px-2 py-1 bg-border text-muted-foreground text-xs font-bold rounded font-accent tracking-wider">VERSATILE</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .conic-gradient-chart {
          background: conic-gradient(
            #1A1A18 0% 45%, 
            #8B4513 45% 75%, 
            #C9A84C 75% 90%, 
            #4A5D23 90% 100%
          );
        }
      `}</style>
    </section>
  );
}
