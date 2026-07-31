import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, CheckCircle2, Lock, UploadCloud } from 'lucide-react';
import { useAnalysis } from '@/hooks/useAnalysis';
import { cn } from '@/lib/utils';
import AnalysisProcessing from '@/components/AnalysisProcessing';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024;
const PREVIOUS_PHOTO_KEY = 'dfashion_previous_photo';

const guidelines = [
  { title: 'Natural light, facing a window', detail: 'Soft daylight reads your undertone accurately.' },
  { title: 'Face clearly visible, looking ahead', detail: 'Avoid side profiles and extreme angles.' },
  { title: 'No filters or heavy makeup', detail: 'Your natural skin needs to be readable.' },
  { title: 'A recent photo, hair away from face', detail: 'Prefer one taken within the last six months.' },
];

function downscaleToDataUrl(file: File, maxDim = 640): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image could not be read'));
    };
    img.src = url;
  });
}

async function dataUrlToFile(dataUrl: string, name: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], name, { type: 'image/jpeg' });
}

function errorMessageFor(err: unknown): string {
  const status = (err as { response?: { status?: number } })?.response?.status;
  const message = (err as { response?: { data?: { message?: string } } })
    ?.response?.data?.message;
  if (status === 400) return 'Please upload a clearer photo in natural light.';
  if (status === 422 || status === 413)
    return 'The file could not be processed. Please try a different photo.';
  return message ?? 'Something went wrong on our end. Please try again in a moment.';
}

function CameraCapture({
  onCapture,
  onCancel,
  onFallback,
}: {
  onCapture: (file: File) => void;
  onCancel: () => void;
  onFallback: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera API unavailable');
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setReady(true);
      } catch {
        if (!cancelled) {
          setError('Camera unavailable. Please allow camera access, or use your system camera instead.');
        }
      }
    }
    void start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || !ready) return;
    setCapturing(true);
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setCapturing(false);
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        onCapture(new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' }));
      }
      setCapturing(false);
    }, 'image/jpeg', 0.92);
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Take a photo</DialogTitle>
          <DialogDescription>
            Face the camera in natural light, with your face fully visible.
          </DialogDescription>
        </DialogHeader>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-border bg-espresso">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
          {!ready && !error && (
            <div className="absolute inset-0 flex items-center justify-center text-cream-primary/70">
              Starting camera…
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="text-[length:var(--text-body-sm)] text-error">
            {error}
          </p>
        )}

        <div className="flex items-center justify-center gap-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          {error ? (
            <Button type="button" onClick={onFallback}>
              Use system camera
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleCapture}
              disabled={!ready}
              loading={capturing}
            >
              Capture
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function UploadFlow() {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousPhoto, setPreviousPhoto] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const { mutate, isPending, isError, error: mutationError, reset, uploadProgress } = useAnalysis();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREVIOUS_PHOTO_KEY);
      if (stored) setPreviousPhoto(stored);
    } catch {
      // localStorage unavailable — previous photo is simply not offered.
    }
  }, []);

  const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;

  const handleFile = useCallback(
    (file: File) => {
      reset();
      if (!ACCEPTED.includes(file.type)) {
        setError('Please upload a JPG, PNG, or WebP image');
        setSelectedFile(null);
        return;
      }
      if (file.size > MAX_SIZE) {
        setError('Your photo must be under 10MB');
        setSelectedFile(null);
        return;
      }
      setError(null);
      setSelectedFile(file);
      try {
        void downscaleToDataUrl(file).then((dataUrl) => {
          localStorage.setItem(PREVIOUS_PHOTO_KEY, dataUrl);
          setPreviousPhoto(dataUrl);
        });
      } catch {
        // Storage of the previous photo is best-effort only.
      }
    },
    [reset],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleStartAnalysis = () => {
    if (!selectedFile) return;
    setError(null);
    mutate(selectedFile);
  };

  const handleUsePrevious = async () => {
    if (!previousPhoto) return;
    try {
      const file = await dataUrlToFile(previousPhoto, 'previous-photo.jpg');
      handleFile(file);
    } catch {
      setError('Your previous photo could not be loaded.');
    }
  };

  const displayedError = isError
    ? errorMessageFor(mutationError)
    : error;

  return (
    <div className="mx-auto w-full max-w-[600px]">
      {/* Privacy copy — appears above the zone */}
      <p className="mb-6 flex items-center justify-center gap-2 text-center text-caption text-espresso-muted">
        <Lock className="h-3.5 w-3.5 text-gold-primary" aria-hidden="true" />
        Your photo is processed securely. We never store your image after analysis.
      </p>

      <div
        role="region"
        aria-label="Photo upload area"
        className="relative"
        aria-describedby={displayedError ? 'upload-error' : 'upload-instructions'}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleFileChange}
        />

        <AnimatePresence mode="wait">
          {isPending ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
            >
              <AnalysisProcessing
                previewUrl={previewUrl ?? undefined}
                uploadProgress={uploadProgress}
              />
            </motion.div>
          ) : selectedFile ? (
            <motion.div
              key="selected"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              className="rounded-lg border border-border bg-white p-8 shadow-card text-center"
            >
              <div className="relative mx-auto w-40 overflow-hidden rounded-md border border-border">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview of your selected photo"
                    width={320}
                    height={320}
                    className="aspect-square w-full object-cover"
                  />
                )}
              </div>
              <p className="mt-4 truncate text-caption text-espresso-muted">
                {selectedFile.name}
              </p>

              <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  className="inline-flex min-h-11 min-w-[var(--size-cta-min-width)] items-center justify-center rounded-md bg-primary px-10 py-3.5 text-nav font-semibold tracking-button text-primary-foreground transition-all duration-200 ease-out hover:scale-[1.01] hover:bg-gold-light hover:shadow-cta-hover active:scale-[0.98] active:bg-gold-dark"
                >
                  Analyse My Colours
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setSelectedFile(null);
                  }}
                  className="inline-flex min-h-11 items-center justify-center text-nav text-espresso-light transition-colors duration-200 ease-out hover:text-espresso hover:underline"
                >
                  Change Photo
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
            >
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                aria-busy={isPending}
                className={cn(
                  'flex min-h-[300px] w-full flex-col items-center justify-center rounded-lg border border-dashed px-8 text-center',
                  'transition-all duration-200 ease-out',
                  dragOver
                    ? 'scale-[1.02] border-gold-primary bg-cream-dark'
                    : displayedError
                      ? 'border-error bg-cream-primary'
                      : 'border-gold-primary/50 bg-cream-primary hover:border-gold-primary hover:bg-cream-dark',
                )}
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark">
                  <UploadCloud className="h-7 w-7 text-gold-primary" aria-hidden="true" />
                </span>
                <span
                  id="upload-instructions"
                  className="mt-6 text-[17px] font-light text-espresso-light"
                >
                  Drag your photo here
                </span>
                <span className="mt-2 text-caption text-espresso-muted">
                  or click to browse — JPG, PNG, WebP up to 10MB
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {displayedError && (
          <p
            id="upload-error"
            role="alert"
            className="mt-3 text-body-sm text-error"
          >
            {displayedError}
          </p>
        )}
      </div>

      {/* Camera + previous photo */}
      {!isPending && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <button
            type="button"
            onClick={() => setCameraOpen(true)}
            className="inline-flex min-h-11 items-center gap-2 text-nav text-espresso-light transition-colors duration-200 ease-out hover:text-espresso hover:underline"
          >
            <Camera className="h-4 w-4 text-gold-primary" aria-hidden="true" />
            Use Camera
          </button>
          {previousPhoto && !selectedFile && (
            <button
              type="button"
              onClick={handleUsePrevious}
              className="inline-flex min-h-11 items-center gap-2 text-nav text-espresso-light transition-colors duration-200 ease-out hover:text-espresso hover:underline"
            >
              <CheckCircle2 className="h-4 w-4 text-gold-primary" aria-hidden="true" />
              Use your previous photo
            </button>
          )}
        </div>
      )}

      {cameraOpen && (
        <CameraCapture
          onCapture={(file) => {
            setCameraOpen(false);
            handleFile(file);
          }}
          onCancel={() => setCameraOpen(false)}
          onFallback={() => {
            setCameraOpen(false);
            cameraRef.current?.click();
          }}
        />
      )}

      {/* Guidelines accordion */}
      {!isPending && (
        <Accordion type="single" collapsible className="mt-10 w-full">
          <AccordionItem value="guidelines" className="border-b border-border">
            <AccordionTrigger className="text-body-sm font-medium text-espresso">
              What makes a good photo?
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-4 pt-1">
                {guidelines.map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-primary"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-body-sm font-medium text-espresso">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-caption text-espresso-muted">
                        {item.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
