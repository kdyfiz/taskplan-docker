import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, format: string = 'PPP'): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Simple date formatting - you can enhance this with date-fns or similar
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
