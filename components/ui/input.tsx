/**
 * Input Component
 * 
 * Reusable form input with accessibility and validation.
 * Follows constitution.md Section IV design standards.
 * 
 * Features:
 * - WCAG 2.1 AA compliant
 * - Keyboard navigation
 * - Error states and messages
 * - Multiple variants and sizes
 * - Proper ARIA labels
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'outline' | 'filled'
  inputSize?: 'sm' | 'md' | 'lg'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      variant = 'default',
      inputSize = 'md',
      id,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || React.useId()
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    const sizeClasses = {
      sm: 'h-9 px-3 py-1 text-sm',
      md: 'h-11 px-4 py-2 text-base',
      lg: 'h-13 px-5 py-3 text-lg',
    }

    const variantClasses = {
      default: 'border border-gray-300 bg-white',
      outline: 'border-2 border-[#6B8EAE] bg-transparent',
      filled: 'border-0 bg-[#F7FAFC]',
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-[#2D3748]"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-red-500" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        
        <input
          id={inputId}
          type={type}
          className={cn(
            'flex w-full rounded-xl transition-all duration-200 ease-in-out',
            'text-[#2D3748] placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-[#6B8EAE] focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            sizeClasses[inputSize],
            variantClasses[variant],
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          {...props}
        />

        {error && (
          <p
            id={errorId}
            className="mt-2 text-sm text-red-600"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={helperId}
            className="mt-2 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
