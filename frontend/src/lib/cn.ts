/**
 * CN utility for ShadCN/UI components
 * Merges Tailwind classes with proper precedence
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
