import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { useAnalysis } from '@/hooks/useAnalysis';

const PHASES = ['enhancing', 'analyzing', 'generating'] as const;
type AnalysisPhase = typeof PHASES[number] | null;

const PHASE_LABELS: Record<NonNullable<AnalysisPhase>, string> = {
  enhancing: 'Enhancing image quality…',
  analyzing: 'Analyzing skin & color…',
  generating: 'Generating recommendations…',
};

export default function UploadFlow() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { mutate, isPending } = useAnalysis();
  const [analysisPhase, setAnalysisPhase] = useState<AnalysisPhase>(null);

  useEffect(() => {
    if (!isPending) {
      setAnalysisPhase(null);
      return;
    }
    const interval = setInterval(() => {
      setAnalysisPhase((prev) => {
        if (!prev) return 'enhancing';
        const idx = PHASES.indexOf(prev);
        return idx < PHASES.length - 1 ? PHASES[idx + 1] : prev;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [isPending]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDropZoneClick = () => {
    inputRef.current?.click();
  };

  const handleStartAnalysis = () => {
    if (selectedFile) {
      setAnalysisPhase('enhancing');
      mutate(selectedFile);
    }
  };

  const currentStep = analysisPhase ? PHASES.indexOf(analysisPhase) + 1 : selectedFile ? 1 : 1;

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
                  currentStep >= s ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}
              >
                {currentStep > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
            ))}
          </div>

          {/* Analysis phase labels */}
          <div className="flex items-center justify-between mb-8 text-xs font-accent">
            {PHASES.map((phase, idx) => (
              <span
                key={phase}
                className={`transition-colors duration-300 ${
                  currentStep > idx + 1
                    ? 'text-green-600'
                    : currentStep === idx + 1
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground'
                }`}
              >
                {idx + 1}. {PHASE_LABELS[phase]}
              </span>
            ))}
          </div>

          <div className="min-h-[400px] flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              {!isPending && !selectedFile && (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full max-w-2xl"
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/heic"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div
                    onClick={handleDropZoneClick}
                    className="border-2 border-dashed border-primary/40 rounded-3xl p-16 text-center cursor-pointer hover:bg-primary/5 hover:border-primary transition-all duration-300 group"
                  >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                      <UploadCloud className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-2xl text-foreground mb-2">Drop Your Photos</h3>
                    <p className="font-accent text-muted-foreground">Or click to browse your files. JPEG, PNG, HEIC up to 10MB.</p>
                  </div>
                </motion.div>
              )}

              {!isPending && selectedFile && (
                <motion.div
                  key="file-selected"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full max-w-md text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-serif text-2xl text-foreground mb-2">File Selected</h3>
                  <p className="font-accent text-muted-foreground mb-6 truncate max-w-full">{selectedFile.name}</p>
                  <button
                    onClick={handleStartAnalysis}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-accent font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    Start Analysis <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="mt-4 px-6 py-2 rounded-full border border-border text-muted-foreground hover:bg-secondary transition-colors font-accent text-sm"
                  >
                    Choose different file
                  </button>
                </motion.div>
              )}

              {isPending && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full max-w-md text-center"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <h3 className="font-serif text-2xl text-foreground mb-2">
                    {analysisPhase ? PHASE_LABELS[analysisPhase] : 'Processing…'}
                  </h3>
                  <p className="font-accent text-muted-foreground">Please wait while we analyze your image.</p>
                  <button
                    disabled
                    className="mt-8 w-full bg-primary/50 text-primary-foreground py-3 rounded-xl font-accent font-medium flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing…
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}