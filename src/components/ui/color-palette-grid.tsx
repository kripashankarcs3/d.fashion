'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  ColorSwatch,
  type ColorSwatchItem,
} from '@/components/ui/color-swatch';

export interface ColorPaletteGridProps {
  colors: ColorSwatchItem[];
  className?: string;
  selectable?: boolean;
  selectedId?: string | null;
  onSelect?: (color: ColorSwatchItem) => void;
  onCopy?: (color: ColorSwatchItem) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

const colorKey = (color: ColorSwatchItem, index: number) =>
  color.name + color.hex || `${index}`;

const ColorPaletteGrid = React.forwardRef<
  HTMLDivElement,
  ColorPaletteGridProps
>(
  (
    {
      colors,
      className,
      selectable = false,
      selectedId,
      onSelect,
      onCopy,
      disabled = false,
      ariaLabel = 'Colour palette',
    },
    ref,
  ) => {
    const buttonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

    const moveFocus = React.useCallback(
      (fromIndex: number, delta: number) => {
        const next = (fromIndex + delta + colors.length) % colors.length;
        if (selectable) {
          onSelect?.(colors[next]);
        }
        buttonRefs.current[next]?.focus();
      },
      [colors, selectable, onSelect],
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!selectable || colors.length === 0) return;
        const currentTarget = event.target as HTMLElement;
        const currentIndex = buttonRefs.current.indexOf(
          currentTarget as HTMLButtonElement,
        );
        if (currentIndex < 0) return;

        switch (event.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            event.preventDefault();
            moveFocus(currentIndex, 1);
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            event.preventDefault();
            moveFocus(currentIndex, -1);
            break;
          case 'Home':
            event.preventDefault();
            moveFocus(currentIndex, -currentIndex);
            break;
          case 'End':
            event.preventDefault();
            moveFocus(currentIndex, colors.length - 1 - currentIndex);
            break;
          default:
            break;
        }
      },
      [colors.length, moveFocus, selectable],
    );

    return (
      <div
        ref={ref}
        role={selectable ? 'radiogroup' : 'group'}
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6', className)}
      >
        {colors.map((color, index) => {
          const key = colorKey(color, index);
          const isSelected = selectedId === key;
          return (
            <ColorSwatch
              key={key}
              ref={(node) => {
                buttonRefs.current[index] = node;
              }}
              {...color}
              selectable={selectable}
              selected={selectable ? isSelected : false}
              disabled={disabled}
              tabIndex={selectable ? (isSelected ? 0 : -1) : 0}
              onSelect={selectable && onSelect ? onSelect : undefined}
              onCopy={onCopy}
            />
          );
        })}
      </div>
    );
  },
);
ColorPaletteGrid.displayName = 'ColorPaletteGrid';

export { ColorPaletteGrid, colorKey };
