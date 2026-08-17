import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { analyzeImage, saveReportToCloud } from '@/services/api';
import { useStyleStore } from '@/store/useStyleStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ROUTES } from '@/config/navigation';

export function useAnalysis() {
  const recordAnalysis = useStyleStore((s) => s.recordAnalysis);
  const setReferenceImageUrl = useStyleStore((s) => s.setReferenceImageUrl);
  const addActivityEvent = useStyleStore((s) => s.addActivityEvent);
  const [, navigate] = useLocation();
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: (file: File) =>
      analyzeImage(file, (percent) => setUploadProgress(percent)),
    onMutate: () => setUploadProgress(0),
    onSuccess: (response) => {
      setUploadProgress(100);
      const result = response.data.data;
      recordAnalysis(result);
      setReferenceImageUrl(result.enhancedImageUrl);
      addActivityEvent({
        action: 'upload',
        label: 'Selfie analysed',
        timestamp: new Date().toISOString(),
      });
      // Archive it against the account so the photo and its report show up on
      // the dashboard from any device. Best-effort: the local store already
      // has the result either way.
      if (useAuthStore.getState().token) {
        void saveReportToCloud(result, result.enhancedImageUrl).catch(() => {});
      }
      navigate(ROUTES.report);
    },
  });

  return { ...mutation, uploadProgress };
}
