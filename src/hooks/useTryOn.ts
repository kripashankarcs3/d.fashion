import { useMutation } from '@tanstack/react-query';
import { error } from '@/lib/toast';
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
    onError: () => error('Try-on is temporarily unavailable. Please try again shortly.'),
  });

  const makeup = useMutation({
    mutationFn: (productId: string) => {
      const url = useStyleStore.getState().referenceImageUrl;
      if (!url) throw new Error("No reference image.");
      return tryOnMakeup(url, productId);
    },
    onError: () => error('Makeup try-on is temporarily unavailable. Please try again shortly.'),
  });

  const hair = useMutation({
    mutationFn: (styleId: string) => {
      const url = useStyleStore.getState().referenceImageUrl;
      if (!url) throw new Error("No reference image.");
      return tryOnHair(url, styleId);
    },
    onError: () => error('Hair try-on is temporarily unavailable. Please try again shortly.'),
  });

  return { clothes, makeup, hair };
}