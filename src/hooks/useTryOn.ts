import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tryOnClothes, tryOnMakeup, tryOnHair } from '@/services/api';
import { useStyleStore } from '@/store/useStyleStore';

export function useTryOn() {
  const addActivityEvent = useStyleStore((s) => s.addActivityEvent);

  const clothes = useMutation({
    mutationFn: ({ garmentUrl, garmentName }: { garmentUrl: string; garmentName: string }) => {
      const url = useStyleStore.getState().referenceImageUrl;
      if (!url) throw new Error("No reference image. Upload a selfie first.");
      return tryOnClothes(url, garmentUrl);
    },
    onSuccess: (_, vars) => {
      addActivityEvent({
        action: 'tryon',
        label: `Tried on: ${vars.garmentName}`,
        timestamp: new Date().toISOString(),
      });
    },
    onError: () => toast.error('Try-on failed. Please try again.'),
  });

  const makeup = useMutation({
    mutationFn: (productId: string) => {
      const url = useStyleStore.getState().referenceImageUrl;
      if (!url) throw new Error("No reference image.");
      return tryOnMakeup(url, productId);
    },
    onError: () => toast.error('Makeup try-on failed.'),
  });

  const hair = useMutation({
    mutationFn: (styleId: string) => {
      const url = useStyleStore.getState().referenceImageUrl;
      if (!url) throw new Error("No reference image.");
      return tryOnHair(url, styleId);
    },
    onError: () => toast.error('Hair try-on failed.'),
  });

  return { clothes, makeup, hair };
}