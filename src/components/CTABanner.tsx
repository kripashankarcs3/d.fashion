import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTABanner() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[#1A1209]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-soft-light" />
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-r from-primary/20 to-transparent blur-[100px]"
      />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-8" />
          <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight mb-6">
            Your wardrobe has <br />
            <span className="italic text-gradient-gold">never looked better.</span>
          </h2>
          <p className="text-xl text-white/60 font-accent mb-12 max-w-2xl mx-auto">
            Join thousands of people who've discovered their style identity through DeeStyle. Start free, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload" className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full font-accent font-medium text-lg hover:bg-primary/90 transition-colors shadow-xl shadow-primary/20">
              <Sparkles className="w-5 h-5" /> Upload Your Wardrobe
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center gap-3 border border-white/20 text-white px-8 py-4 rounded-full font-accent font-medium text-lg hover:bg-white/10 transition-colors">
              View Pricing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
