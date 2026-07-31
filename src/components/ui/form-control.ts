import { cva } from 'class-variance-authority';

const fieldControlVariants = cva(
  [
    'flex h-[var(--size-field-height)] w-full items-center gap-2 rounded-md border border-input bg-white px-4',
    'text-[length:var(--text-body)] text-espresso placeholder:text-placeholder',
    'transition-[border-color,box-shadow,background-color] duration-[var(--duration-fast)] ease-out',
    'enabled:hover:border-input-hover',
    'focus-visible:border-gold-primary focus-visible:outline-none focus-visible:shadow-[var(--shadow-input-focus)]',
    'aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:shadow-[var(--shadow-error-focus)]',
    'data-[success=true]:border-primary-border',
    'disabled:cursor-not-allowed disabled:opacity-40',
    'read-only:cursor-default read-only:bg-muted/40',
  ].join(' '),
);

export { fieldControlVariants };
