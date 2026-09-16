import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getPaymentScreenshotBlob } from '@/services/api';

/**
 * Payment screenshots live behind auth (never a public URL), so they can't be
 * loaded with a plain <img src>. Fetches the blob only while mounted (i.e.
 * only while the preview dialog is open) and revokes the object URL on
 * unmount — same lifecycle UploadFlow.tsx uses for its local preview.
 */
export function PaymentScreenshotPreview({ paymentId }: { paymentId: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;
    getPaymentScreenshotBlob(paymentId)
      .then((blobUrl) => {
        if (cancelled) {
          URL.revokeObjectURL(blobUrl);
          return;
        }
        objectUrl = blobUrl;
        setUrl(blobUrl);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [paymentId]);

  if (failed) {
    return <p className="text-body-sm text-cream-primary/60">Could not load the screenshot.</p>;
  }
  if (!url) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold-primary" aria-hidden />
      </div>
    );
  }
  return <img src={url} alt="Payment screenshot" className="max-h-[70vh] w-full object-contain" />;
}
