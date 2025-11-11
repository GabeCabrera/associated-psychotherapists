/**
 * Modal Component
 * 
 * Accessible modal dialog with focus trapping and animations.
 * Follows constitution.md Section IV design standards and WCAG 2.1 AA.
 * 
 * Features:
 * - Focus trap (keeps focus within modal)
 * - ESC key to close
 * - Backdrop click to close
 * - Framer Motion animations
 * - Proper ARIA attributes
 * - Keyboard accessible
 * - Portal rendering (renders outside DOM hierarchy)
 */

'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  className?: string
  overlayClassName?: string
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  overlayClassName,
}: ModalProps) {
  const [mounted, setMounted] = React.useState(false)
  const modalRef = React.useRef<HTMLDivElement>(null)
  const previousActiveElement = React.useRef<HTMLElement | null>(null)

  // Track all focusable elements within modal
  const focusableElements = React.useRef<HTMLElement[]>([])

  // Mount check for portal
  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Handle ESC key
  React.useEffect(() => {
    if (!closeOnEscape || !isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  // Focus trap implementation
  React.useEffect(() => {
    if (!isOpen) return

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement

    // Get all focusable elements
    const getFocusableElements = () => {
      if (!modalRef.current) return []
      
      const selector = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(',')

      return Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(selector)
      ).filter((el) => !el.hasAttribute('disabled'))
    }

    // Update focusable elements
    focusableElements.current = getFocusableElements()

    // Focus first element
    if (focusableElements.current.length > 0) {
      focusableElements.current[0]?.focus()
    }

    // Handle tab key for focus trap
    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const elements = focusableElements.current
      if (elements.length === 0) return

      const firstElement = elements[0]
      const lastElement = elements[elements.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey) {
        // Shift + Tab: going backwards
        if (activeElement === firstElement) {
          lastElement?.focus()
          event.preventDefault()
        }
      } else {
        // Tab: going forwards
        if (activeElement === lastElement) {
          firstElement?.focus()
          event.preventDefault()
        }
      }
    }

    document.addEventListener('keydown', handleTab)

    // Cleanup: restore focus to previous element
    return () => {
      document.removeEventListener('keydown', handleTab)
      previousActiveElement.current?.focus()
    }
  }, [isOpen])

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isOpen])

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose()
    }
  }

  if (!mounted) return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={cn(
              'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
              overlayClassName
            )}
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className={cn(
                'relative w-full',
                'bg-white rounded-xl shadow-xl',
                'max-h-[90vh] overflow-hidden',
                'focus:outline-none',
                sizeClasses[size],
                className
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
              aria-describedby={description ? 'modal-description' : undefined}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-start justify-between p-6 border-b border-[#6B8EAE]/20">
                  <div className="flex-1">
                    {title && (
                      <h2
                        id="modal-title"
                        className="text-xl font-semibold text-[#1A365D]"
                      >
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p
                        id="modal-description"
                        className="mt-1 text-sm text-[#6B8EAE]"
                      >
                        {description}
                      </p>
                    )}
                  </div>
                  
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className={cn(
                        'ml-4 p-2 rounded-lg',
                        'text-[#6B8EAE] hover:text-[#1A365D]',
                        'hover:bg-[#E6EEF5] transition-colors',
                        'focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:ring-offset-2'
                      )}
                      aria-label="Close modal"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}

/**
 * Modal Header Component
 */
export function ModalHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('px-6 py-4 border-b border-[#6B8EAE]/20', className)}>
      {children}
    </div>
  )
}

/**
 * Modal Body Component
 */
export function ModalBody({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}

/**
 * Modal Footer Component
 */
export function ModalFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-[#6B8EAE]/20',
        'flex items-center justify-end gap-3',
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * useModal Hook
 * 
 * Convenient hook for managing modal state
 */
export function useModal(defaultOpen = false) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}
