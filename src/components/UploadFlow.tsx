import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';

export default function UploadFlow() {
  const [step, setStep] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleNext = () => {
    if (step === 1) {
      setIsSimulating(true);
      setTimeout(() => {
        setIsSimulating(false);
        setStep(2);
      }, 2000);
    } else if (step === 2) {
      setStep(3);
    } else {
      setStep(1);
    }
  };

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Digitize Your Wardrobe</h2>
          <p className="font-accent text-muted-foreground text-lg">Three steps to your personal digital atelier.</p>
        </div>

        <div className="glass-panel rounded-3xl p-6 md:p-12 shadow-xl border-primary/20">
          
          {/* Progress Indicators */}
          <div className="flex items-center justify-between mb-12 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-secondary -z-10 -translate-y-1/2" />
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-accent font-medium text-sm transition-colors duration-500 ${
                  step >= s ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}
              >
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
            ))}
          </div>

          <div className="min-h-[400px] flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full max-w-2xl"
                >
                  <div 
                    onClick={handleNext}
                    className="border-2 border-dashed border-primary/40 rounded-3xl p-16 text-center cursor-pointer hover:bg-primary/5 hover:border-primary transition-all duration-300 group"
                  >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                      {isSimulating ? (
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      ) : (
                        <UploadCloud className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <h3 className="font-serif text-2xl text-foreground mb-2">Drop Your Photos</h3>
                    <p className="font-accent text-muted-foreground">Or click to browse your files. JPEG, PNG, HEIC up to 10MB.</p>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full max-w-md text-center"
                >
                  <div className="relative w-48 h-64 mx-auto bg-secondary rounded-2xl overflow-hidden mb-8 shadow-inner border border-primary/10">
                    <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80" alt="Jacket" className="w-full h-full object-cover opacity-50" />
                    <motion.div 
                      className="absolute left-0 right-0 h-1 bg-primary/80 shadow-[0_0_15px_rgba(201,168,76,0.8)] z-10"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <h3 className="font-serif text-2xl text-foreground mb-4">AI Analyzes Your Style</h3>
                  <div className="space-y-4 text-left font-accent">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" /> Extracting silhouette...
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" /> Mapping color palette...
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" /> Tagging occasion...
                    </div>
                  </div>
                  <button onClick={handleNext} className="mt-8 px-6 py-2 rounded-full border border-border text-foreground hover:bg-secondary transition-colors font-accent text-sm">
                    Skip Analysis
                  </button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-3xl glass-panel bg-white p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-8 items-center"
                >
                  <div className="w-full md:w-1/2 aspect-[3/4] rounded-xl overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80" alt="Analyzed Jacket" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full md:w-1/2 text-left">
                    <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold tracking-wider mb-4 font-accent">VERIFIED MATCH</div>
                    <h3 className="font-serif text-3xl text-foreground mb-2">Vintage Leather Blazer</h3>
                    <p className="text-muted-foreground font-accent mb-6">Added to "Outerwear" category</p>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 font-accent">Detected Palette</h4>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#3d2f2b] shadow-sm border border-border" />
                          <div className="w-8 h-8 rounded-full bg-[#8b7355] shadow-sm border border-border" />
                          <div className="w-8 h-8 rounded-full bg-[#e6e2d8] shadow-sm border border-border" />
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 font-accent">Style Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {['Autumn', 'Smart Casual', 'Vintage', 'Layering'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-secondary rounded-md text-xs font-medium font-accent text-foreground">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button onClick={handleNext} className="mt-8 w-full bg-primary text-primary-foreground py-3 rounded-xl font-accent font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                      View in Dashboard <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
