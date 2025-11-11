/**
 * Utils Index
 * 
 * Central export point for all utility functions.
 * Allows for cleaner imports: import { formatCurrency, formatDate } from '@/lib/utils'
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with proper precedence
 * Combines clsx and tailwind-merge for optimal class handling
 * 
 * @param inputs - Class names to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Export all formatting utilities
export * from './formatting'

// Export all date utilities
export * from './date'

// Export all validation utilities
export * from './validation'

// Re-export commonly used utilities with shorter names if needed
export { formatCurrency, formatPhoneNumber, truncateText } from './formatting'
export { formatDate, formatTime, formatDateTime, getRelativeTime } from './date'
export { validateEmail, validatePassword, validatePhone } from './validation'
