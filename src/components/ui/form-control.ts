import { cva } from 'class-variance-authority';

const fieldControlVariants = cva(
  [
    'flex h-[var(--size-field-height)] w-full items-center gap-2 rounded-none border-0 border-b border-gold-border bg-transparent px-0 pb-2 pt-0',
    'text-[length:var(--text-body)] text-cream-primary placeholder:text-cream-primary/40',
    'transition-[border-color,box-shadow,background-color] duration-[var(--duration-normal)] ease-[var(--ease-editorial)]',
    'enabled:hover:border-gold-border-hover',
    'focus-visible:border-gold-primary focus-visible:outline-none',
    'aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive',
    'data-[success=true]:border-primary-border',
    'disabled:cursor-not-allowed disabled:opacity-40',
    'read-only:cursor-default read-only:opacity-70',
  ].join(' '),
);

export { fieldControlVariants };
