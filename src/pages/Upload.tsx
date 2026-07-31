import { useEffect } from 'react';
import UploadFlow from '@/components/UploadFlow';

export default function Upload() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <section className="w-full pt-30 pb-24">
      <div className="mx-auto w-full max-w-[var(--container-narrow)] px-5 md:px-8">
        <h1 className="text-center font-serif text-h2 text-espresso">
          Upload your photo to begin.
        </h1>
        <p className="mt-6 text-center text-body text-espresso-light">
          Secure. Private. Deleted after analysis.
        </p>

        <UploadFlow />
      </div>
    </section>
  );
}
