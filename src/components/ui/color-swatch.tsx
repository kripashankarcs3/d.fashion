'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface ColorSwatchItem {
  name: string;
  hex: string;
  recommendation?: string;
}

export interface ColorSwatchProps extends ColorSwatchItem {
  className?: string;
  tabIndex?: number;
  selected?: boolean;
  disabled?: boolean;
  selectable?: boolean;
  onCopy?: (color: ColorSwatchItem) => void;
  onSelect?: (color: ColorSwatchItem) => void;
}

function buildAnnouncement(color: ColorSwatchItem): string {
  const base = `${color.name}, hex ${color.hex}`;
  return color.recommendation
    ? `${base}, recommended for: ${color.recommendation}`
    : base;
}

async function copyHex(hex: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(hex);
    return;
  } catch {
    // Fallback for browsers without the async Clipboard API.
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = hex;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  } catch {
    // Clipboard unavailable — selection still works.
  }
}

const ColorSwatch = React.forwardRef<HTMLButtonElement, ColorSwatchProps>(
  (
    {
      className,
      tabIndex,
      name,
      hex,
      recommendation,
      selected = false,
      disabled = false,
      selectable = false,
      onCopy,
      onSelect,
    },
    ref,
  ) => {
    const [copied, setCopied] = React.useState(false);

    const handleClick = React.useCallback(async () => {
      if (disabled) return;
      if (selectable) onSelect?.({ name, hex, recommendation });
      await copyHex(hex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      onCopy?.({ name, hex, recommendation });
    }, [disabled, selectable, onSelect, onCopy, name, hex, recommendation]);

    return (
      <>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              ref={ref}
              type="button"
              tabIndex={tabIndex}
              role={selectable ? 'radio' : undefined}
              aria-checked={selectable ? selected : undefined}
              aria-label={buildAnnouncement({ name, hex, recommendation })}
              aria-disabled={disabled || undefined}
              disabled={disabled}
              data-selected={selected || undefined}
              onClick={handleClick}
              className={cn(
                'group inline-flex flex-col items-start gap-1.5 rounded-md',
                'disabled:cursor-not-allowed disabled:opacity-40',
                'transition-colors duration-[var(--duration-fast)] ease-out',
                className,
              )}
            >
              <span
                aria-hidden="true"
                data-selected={selected || undefined}
                className={cn(
                  'block h-20 w-20 rounded-md',
                  'shadow-[var(--shadow-swatch)]',
                  'transition-[transform,box-shadow] duration-[var(--duration-fast)] ease-out',
                  'group-hover:scale-[1.03] group-hover:shadow-[var(--shadow-swatch-hover)]',
                  'group-focus-visible:scale-[1.03] group-focus-visible:shadow-[var(--shadow-swatch-hover)]',
                  selected &&
                    'ring-2 ring-gold-primary ring-offset-2 ring-offset-white',
                )}
                style={{ backgroundColor: hex }}
              />
              <span className="text-[length:var(--text-caption)] text-espresso-muted">
                {name}
              </span>
              <span className="text-[length:var(--text-micro)] tabular-nums text-espresso-muted/70">
                {hex}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent
            className="flex flex-col gap-0.5 text-[length:var(--text-label)]"
            side="top"
          >
            <span className="font-medium text-espresso">{name}</span>
            <span className="text-espresso-muted">{hex}</span>
            {recommendation && (
              <span className="text-espresso-muted">{recommendation}</span>
            )}
          </TooltipContent>
        </Tooltip>
        <span aria-live="polite" className="sr-only">
          {copied ? `Copied ${hex}` : ''}
        </span>
      </>
    );
  },
);
ColorSwatch.displayName = 'ColorSwatch';

export { ColorSwatch };
