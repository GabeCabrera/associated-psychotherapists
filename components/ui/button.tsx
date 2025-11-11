/**
 * Button Component
 * 
 * Reusable button with variants, sizes, and animations.
 * Follows constitution.md Section IV design standards.
 * 
 * Features:
 * - Multiple variants (primary, secondary, outline, ghost, danger)
 * - Size options (sm, md, lg)
 * - Loading states
 * - Icon support
 * - Framer Motion animations
 * - WCAG 2.1 AA compliant
 */

'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      type = 'button',
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary:
        'bg-[#1A365D] text-white hover:bg-[#2D4A7C] focus:ring-[#1A365D]',
      secondary:
        'bg-[#6B8EAE] text-white hover:bg-[#5A7A9D] focus:ring-[#6B8EAE]',
      outline:
        'border-2 border-[#6B8EAE] text-[#1A365D] hover:bg-[#6B8EAE]/10 focus:ring-[#6B8EAE]',
      ghost:
        'text-[#1A365D] hover:bg-[#E6EEF5] focus:ring-[#6B8EAE]',
      danger:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    }

    const sizeClasses = {
      sm: 'h-9 px-3 py-1 text-sm',
      md: 'h-11 px-6 py-2 text-base',
      lg: 'h-13 px-8 py-3 text-lg',
    }

    const iconSizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    }

    const isDisabled = disabled || isLoading

    const MotionButton = motion.button

    return (
      <MotionButton
        ref={ref}
        type={type}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'rounded-xl font-medium',
          'transition-all duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'shadow-sm hover:shadow-md',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        {...(props as any)}
      >
        {isLoading ? (
          <>
            <Loader2
              className={cn('animate-spin', iconSizeClasses[size])}
              aria-hidden="true"
            />
            <span className="sr-only">Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span className={cn('inline-flex', iconSizeClasses[size])}>
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className={cn('inline-flex', iconSizeClasses[size])}>
                {rightIcon}
              </span>
            )}
          </>
        )}
      </MotionButton>
    )
  }
)

Button.displayName = 'Button'

export { Button }
