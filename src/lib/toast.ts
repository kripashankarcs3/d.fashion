import { toast as sonnerToast } from 'sonner';

export const success = (message: string) =>
  sonnerToast.success(message, { duration: 4000 });

export const error = (message: string) =>
  sonnerToast.error(message, { duration: 8000 });
