import { useMutation } from '@tanstack/react-query';
import { tryOnClothes, tryOnMakeup, tryOnHair } from '@/services/api';
import { useStyleStore } from '@/store/useStyleStore';

export function useTryOn() {
  const addActivityEvent = useStyleStore((s) => s.addActivityEvent);

  const clothes = useMutation({
    mutationFn: ({
      garmentUrl,
      garmentName,
      colourHex,
    }: {
      garmentUrl: string;
      garmentName: string;
      colourHex?: string;
    }) => {
      const url = useStyleStore.getState().referenceImageUrl;
      if (!url) throw new Error('No reference image. Upload a selfie first.');
      return tryOnClothes(url, garmentUrl, colourHex);
    },
    onSuccess: (_, vars) => {
      addActivityEvent({
        action: 'tryon',
        label: `Tried on: ${vars.garmentName}`,
        timestamp: new Date().toISOString(),
      });
    },
  });

  const makeup = useMutation({
    mutationFn: (productId: string) => {
      const url = useStyleStore.getState().referenceImageUrl;
      if (!url) throw new Error('No reference image.');
      return tryOnMakeup(url, productId);
    },
  });

  const hair = useMutation({
    mutationFn: (styleId: string) => {
      const url = useStyleStore.getState().referenceImageUrl;
      if (!url) throw new Error('No reference image.');
      return tryOnHair(url, styleId);
    },
  });

  return { clothes, makeup, hair };
}
