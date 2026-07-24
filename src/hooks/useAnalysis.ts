import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { analyzeImage } from '@/services/api';
import { useStyleStore } from '@/store/useStyleStore';

export function useAnalysis() {
  const setAnalysisResult = useStyleStore((s) => s.setAnalysisResult);
  const setReferenceImageUrl = useStyleStore((s) => s.setReferenceImageUrl);
  const addActivityEvent = useStyleStore((s) => s.addActivityEvent);
  const [, navigate] = useLocation();

  return useMutation({
    mutationFn: analyzeImage,
    onSuccess: (response) => {
      const result = response.data;
      setAnalysisResult(result);
      setReferenceImageUrl(result.enhancedImageUrl);
      addActivityEvent({ action: 'upload', label: 'Selfie analyzed', timestamp: new Date().toISOString() });
      navigate('/report');
    },
    onError: (error: any) => {
      const phase = error?.response?.data?.phase ?? 'Analysis';
      const message = error?.response?.data?.message ?? 'Something went wrong.';
      toast.error(`${phase} failed: ${message}`);
    },
  });
}