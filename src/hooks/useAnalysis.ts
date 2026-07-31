import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { analyzeImage } from '@/services/api';
import { useStyleStore } from '@/store/useStyleStore';

export function useAnalysis() {
  const setAnalysisResult = useStyleStore((s) => s.setAnalysisResult);
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
      setAnalysisResult(result);
      setReferenceImageUrl(result.enhancedImageUrl);
      addActivityEvent({
        action: 'upload',
        label: 'Selfie analysed',
        timestamp: new Date().toISOString(),
      });
      navigate('/report');
    },
  });

  return { ...mutation, uploadProgress };
}
