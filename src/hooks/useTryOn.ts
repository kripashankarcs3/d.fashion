import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tryOnClothes, tryOnMakeup, tryOnHair } from '@/services/api';
import { useStyleStore } from '@/store/useStyleStore';

export function useTryOn() {
  const addActivityEvent = useStyleStore((s) => s.addActivityEvent);
  const referenceImageUrl = useStyleStore((s) => s.referenceImageUrl);

  const clothes = useMutation({
    mutationFn: ({ garmentUrl, garmentName }: { garmentUrl: string; garmentName: string }) =>
      tryOnClothes(referenceImageUrl!, garmentUrl),
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
    mutationFn: (productId: string) => tryOnMakeup(referenceImageUrl!, productId),
    onError: () => toast.error('Makeup try-on failed.'),
  });

  const hair = useMutation({
    mutationFn: (colorHex: string) => tryOnHair(referenceImageUrl!, colorHex),
    onError: () => toast.error('Hair try-on failed.'),
  });

  return { clothes, makeup, hair };
}