import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Wand2 } from 'lucide-react';
import { Link } from 'wouter';

// Letter-by-letter animated brand name
const BrandName = () => {
  const letters = ['D', 'e', 'e', 'S', 't', 'y', 'l', 'e'];
  return (
    <span className="inline-flex items-baseline gap-[0.02em]">
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 24, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.05 * i,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block font-serif tracking-wide"
          style={{ transformOrigin: 'bottom center' }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
};

// Animated shimmer underline
const ShimmerUnderline = () => (
  <motion.div
    initial={{ scaleX: 0, opacity: 0 }}
    animate={{ scaleX: 1, opacity: 1 }}
    transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
    style={{ originX: 0 }}
    className="mt-1 h-[3px] w-full rounded-full bg-gradient-to-r from-primary via-amber-300 to-primary bg-[length:200%_100%]"
  />
);

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20 pb-20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 bg-background overflow-hidden">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-r from-primary/10 to-transparent blur-[100px]"
        />
        <motion.div 
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-l from-orange-200/20 via-primary/10 to-transparent blur-[100px]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center text-center relative z-10">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border-primary/30"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-accent font-medium tracking-wide">Meet your AI Style Companion</span>
        </motion.div>

        {/* Brand Name — big, animated, letter-by-letter */}
        <div className="mb-4 perspective-[800px]">
          <div className="relative inline-block">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-[clamp(4rem,14vw,9rem)] leading-none text-gradient-gold"
            >
              <BrandName />
            </motion.div>
            <ShimmerUnderline />
          </div>
        </div>

        {/* Tagline headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif text-foreground leading-[1.1] tracking-tight mb-6"
        >
          Dress Like <br className="hidden md:block" />
          <span className="italic text-gradient-gold">You Mean It</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl text-xl md:text-2xl text-muted-foreground font-accent mb-12"
        >
          An intersection of haute couture and artificial intelligence. 
          Upload your wardrobe, discover personalized styling, and curate your aesthetic.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto"
        >
          <Link href="/upload" className="w-full sm:w-auto group relative overflow-hidden rounded-full bg-primary px-8 py-4 text-primary-foreground font-accent tracking-wide transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
            <Wand2 className="w-5 h-5" />
            <span>Upload Your Wardrobe</span>
          </Link>
          
          <button className="w-full sm:w-auto group px-8 py-4 rounded-full glass-panel font-accent tracking-wide flex items-center justify-center gap-3 hover:bg-white/50 transition-colors">
            <span>Watch Demo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Floating Mockup Card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 relative w-full max-w-4xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 h-[150%] pointer-events-none" />
          <div className="glass-panel rounded-3xl p-4 md:p-6 shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-700 ease-out">
            <div className="rounded-2xl overflow-hidden bg-white/50 border border-primary/10 relative aspect-[16/9] flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
              <div className="relative z-10 glass-panel p-6 rounded-2xl flex items-center gap-6 shadow-xl backdrop-blur-md">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-serif text-2xl text-foreground mb-1">Look 04: The Parisian</h3>
                  <p className="font-accent text-muted-foreground text-sm flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                    94% Style Match · Evening Wear
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
