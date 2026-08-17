import { useMutation } from '@tanstack/react-query';
import { tryOnClothes, tryOnMakeup, tryOnHair, saveTryOnToCloud } from '@/services/api';
import { useStyleStore } from '@/store/useStyleStore';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Mirrors a try-on result to the member's account so it survives this device.
 * Best-effort: the local history already holds it for this session.
 */
function archiveToAccount(entry: {
  resultImage: string;
  label: string;
  tryonKind: 'clothes' | 'makeup' | 'hair';
  colourHex?: string;
  source?: string;
}) {
  if (!useAuthStore.getState().token || !entry.resultImage) return;
  void saveTryOnToCloud(entry).catch(() => {});
}

export function useTryOn() {
  const addActivityEvent = useStyleStore((s) => s.addActivityEvent);
  const addTryOnHistory = useStyleStore((s) => s.addTryOnHistory);

  const clothes = useMutation({
    mutationFn: ({
      garmentUrl,
      garmentName,
      garmentImg,
      colourHex,
      personImageUrl,
    }: {
      garmentUrl: string;
      garmentName: string;
      garmentImg: string;
      colourHex?: string;
      personImageUrl?: string;
    }) => {
      const url = personImageUrl || useStyleStore.getState().referenceImageUrl;
      if (!url) throw new Error('No reference image. Upload a selfie first.');
      return tryOnClothes(url, garmentUrl, colourHex);
    },
    onSuccess: (data, vars) => {
      addActivityEvent({
        action: 'tryon',
        label: `Tried on: ${vars.garmentName}`,
        timestamp: new Date().toISOString(),
      });
      addTryOnHistory({
        resultUrl: data.data.resultUrl,
        garmentName: vars.garmentName,
        garmentImg: vars.garmentImg,
        kind: 'outfit',
        colourHex: vars.colourHex,
        timestamp: new Date().toISOString(),
      });
      archiveToAccount({
        resultImage: data.data.resultUrl,
        label: vars.garmentName,
        tryonKind: 'clothes',
        colourHex: vars.colourHex,
        source: data.data.source,
      });
    },
  });

  const makeup = useMutation({
    mutationFn: ({
      productId,
      productName,
      productThumb,
    }: {
      productId: string;
      productName: string;
      productThumb: string;
    }) => {
      const url = useStyleStore.getState().referenceImageUrl;
      if (!url) throw new Error('No reference image.');
      return tryOnMakeup(url, productId);
    },
    onSuccess: (data, vars) => {
      addTryOnHistory({
        resultUrl: data.data.resultUrl,
        garmentName: vars.productName,
        garmentImg: vars.productThumb,
        kind: 'look',
        timestamp: new Date().toISOString(),
      });
      // A fallback result is the untouched selfie, not a look worth keeping.
      if (data.data.source === 'youcam') {
        archiveToAccount({
          resultImage: data.data.resultUrl,
          label: vars.productName,
          tryonKind: 'makeup',
          source: data.data.source,
        });
      }
    },
  });

  const hair = useMutation({
    mutationFn: ({
      styleId,
      styleName,
      styleThumb,
    }: {
      styleId: string;
      styleName: string;
      styleThumb: string;
    }) => {
      const url = useStyleStore.getState().referenceImageUrl;
      if (!url) throw new Error('No reference image.');
      return tryOnHair(url, styleId);
    },
    onSuccess: (data, vars) => {
      addTryOnHistory({
        resultUrl: data.data.resultUrl,
        garmentName: vars.styleName,
        garmentImg: vars.styleThumb,
        kind: 'hair',
        timestamp: new Date().toISOString(),
      });
      if (data.data.source === 'youcam') {
        archiveToAccount({
          resultImage: data.data.resultUrl,
          label: vars.styleName,
          tryonKind: 'hair',
          source: data.data.source,
        });
      }
    },
  });

  return { clothes, makeup, hair };
}
