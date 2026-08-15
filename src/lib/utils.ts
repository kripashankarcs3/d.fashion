import { extendTailwindMerge } from 'tailwind-merge';

import { clsx, type ClassValue } from 'clsx';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['campaign', 'editorial-xl', 'editorial-lg', 'editorial-md', 'editorial-sm'] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isAxiosError(error: unknown): error is {
  isAxiosError: true;
  response?: { data?: unknown; status?: number };
} {
  return typeof error === 'object' && error !== null && (error as { isAxiosError?: boolean }).isAxiosError === true;
}

export function srcsetFromUrl(url: string, widths: number[]): string | undefined {
  // Only CDN URLs carrying a `w=` param can be resized. Local assets are a single
  // file, so emitting descriptors for them would just lie about their width.
  if (!/w=\d+/.test(url)) return undefined;
  return widths.map((w) => `${url.replace(/w=\d+/, `w=${w}`)} ${w}w`).join(', ');
}

