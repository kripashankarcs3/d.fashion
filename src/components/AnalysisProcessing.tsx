import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const STAGES = [
  'Reading skin undertone…',
  'Identifying colour season…',
  'Building your palette…',
];

const STAGE_DURATION = 1000;

const SWATCHES = ['#F5F0E8', '#D4AF71', '#B8974A', '#8B6B56', '#2C1810'];

interface AnalysisProcessingProps {
  previewUrl?: string;
  uploadProgress: number;
}

export default function AnalysisProcessing({
  previewUrl,
  uploadProgress,
}: AnalysisProcessingProps) {
  const [index, setIndex] = useState(0);
  const uploading = uploadProgress < 100;

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => Math.min(i + 1, STAGES.length - 1));
    }, STAGE_DURATION);
    return () => window.clearInterval(id);
  }, []);

  const progress = uploading
    ? Math.min(uploadProgress, 99)
    : 100;

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-border bg-white p-8 shadow-card">
      {previewUrl ? (
        <div className="relative mb-8 w-28 overflow-hidden rounded-md border border-border">
          <img
            src={previewUrl}
            alt="Your photo, being analysed"
            width={256}
            height={256}
            className="aspect-square w-full object-cover"
          />
          <div className="absolute inset-0 animate-[shimmer_1.5s_infinite] bg-[linear-gradient(90deg,#EDE5D8_25%,#F5F0E8_50%,#EDE5D8_75%)] bg-[length:200%_100%]" />
        </div>
      ) : (
        <div className="mb-8 flex items-end gap-2" aria-hidden="true">
          {SWATCHES.map((colour, i) => (
            <motion.span
              key={colour}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.12, ease: [0, 0, 0.2, 1] }}
              className="h-8 w-8 rounded-sm"
              style={{
                backgroundColor: colour,
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
              }}
            />
          ))}
        </div>
      )}

      <div role="status" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={uploading ? 'uploading' : index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
            className="text-[15px] italic text-espresso-light"
          >
            {uploading ? 'Uploading your photo…' : STAGES[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div
        role="progressbar"
        aria-label="Analysing your photo"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        className="mt-6 h-1 w-full max-w-xs overflow-hidden rounded-full bg-cream-dark"
      >
        {uploading ? (
          <motion.div
            className="h-full bg-[linear-gradient(90deg,#B8974A_25%,#D4AF71_50%,#B8974A_75%)] bg-[length:200%_100%]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        ) : (
          <div className="h-full w-full animate-[shimmer_1.5s_infinite] bg-[linear-gradient(90deg,#B8974A_25%,#D4AF71_50%,#B8974A_75%)] bg-[length:200%_100%]" />
        )}
      </div>
    </div>
  );
}
