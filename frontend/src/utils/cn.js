import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Dùng để kết hợp Tailwind classes + CSS Modules
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
