import { motion } from 'framer-motion';
import { Activity, Droplet, Sun, Moon } from 'lucide-react';

export default function AIAnalysis() {
  return (
    <section className="py-32 bg-[#1A1209] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Animation side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
            <div className="relative glass-panel bg-black/40 border-primary/20 rounded-3xl p-4 overflow-hidden">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-900">
                <img 
                  src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80" 
                  alt="Fashion dress" 
                  className="w-full h-full object-cover opacity-80"
                />
                
                {/* Scanning overlay */}
                <motion.div 
                  className="absolute inset-0 border-y-2 border-primary/50 bg-gradient-to-b from-transparent via-primary/20 to-transparent h-32"
                  animate={{ y: [-150, 600] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />

                {/* Tracking dots */}
                <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_#C9A84C]">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
                </div>
                <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_#C9A84C]">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 glass-panel bg-black/60 rounded-xl p-4 backdrop-blur-md flex items-center justify-between border-white/10">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-primary" />
                    <span className="font-accent text-sm tracking-widest text-primary/80">ANALYZING FIBERS</span>
                  </div>
                  <span className="font-mono text-xs text-white/50">MATCH: 98%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Info side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest mb-6 font-accent">
              <SparkleIcon /> PROPRIETARY VISION AI
            </div>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              We see the details <br />
              <span className="italic text-primary/80">you didn't know existed.</span>
            </h2>
            <p className="text-lg text-white/60 font-accent mb-12 max-w-lg">
              Our neural engine doesn't just categorize. It understands fabric drape, seasonal appropriateness, color harmony, and silhouette balance to build your complete style profile.
            </p>

            <div className="space-y-6">
              <div className="glass-panel bg-white/5 border-white/10 rounded-2xl p-6 flex items-start gap-4 hover:bg-white/10 transition-colors">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Droplet className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-serif text-xl mb-1">Micro-Color Detection</h4>
                  <p className="text-white/50 text-sm font-accent">Identifies subtle undertones to match with your skin's natural palette.</p>
                </div>
              </div>
              
              <div className="glass-panel bg-white/5 border-white/10 rounded-2xl p-6 flex items-start gap-4 hover:bg-white/10 transition-colors">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Sun className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-serif text-xl mb-1">Occasion Intelligence</h4>
                  <p className="text-white/50 text-sm font-accent">Automatically tags items for appropriate settings, from beachside to boardroom.</p>
                </div>
              </div>

              <div className="glass-panel bg-white/5 border-white/10 rounded-2xl p-6 flex items-start gap-4 hover:bg-white/10 transition-colors">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Moon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-serif text-xl mb-1">Fit & Drape Analysis</h4>
                  <p className="text-white/50 text-sm font-accent">Predicts how garments will hang on your specific body type.</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function SparkleIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
    </svg>
  );
}
