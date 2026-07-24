import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import UploadFlow from '@/components/UploadFlow';
import AIAnalysis from '@/components/AIAnalysis';
import { ArrowRight, Shield, Zap, RefreshCw } from 'lucide-react';

const guarantees = [
  { icon: Shield, title: 'Private by Default', desc: 'Your photos are processed in memory and never stored on our servers.' },
  { icon: Zap, title: 'Results in Seconds', desc: 'Our vision engine analyzes garments in under 3 seconds per item.' },
  { icon: RefreshCw, title: 'Always Improving', desc: 'Each upload refines your personal style model over time.' },
];

export default function Upload() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="w-full overflow-hidden">
      {/* Page Hero */}
      <section className="pt-40 pb-16 relative">
        <div className="absolute inset-0 -z-10 bg-background">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-r from-primary/10 to-transparent blur-[100px]"
          />
        </div>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/30 text-sm font-accent font-medium mb-6">
              Step 1 of 3 — Digitize Your Wardrobe
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-tight mb-6">
              Upload Your <br />
              <span className="italic text-gradient-gold">Wardrobe</span>
            </h1>
            <p className="text-xl text-muted-foreground font-accent max-w-2xl mx-auto">
              Three simple steps to transform your physical wardrobe into a living, intelligent digital atelier powered by AI.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upload Flow Component */}
      <UploadFlow />

      {/* Guarantees */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guarantees.map((g, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 rounded-2xl flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <g.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg mb-1">{g.title}</h3>
                  <p className="text-sm text-muted-foreground font-accent">{g.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Analysis Section */}
      <AIAnalysis />

      {/* CTA to Dashboard */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Ready to see your digital atelier?</h2>
          <p className="text-muted-foreground font-accent mb-8">Once you've uploaded, your wardrobe is automatically organized and scored.</p>
          <Link href="/dashboard" className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-full font-accent font-medium hover:bg-foreground/90 transition-colors shadow-lg">
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
