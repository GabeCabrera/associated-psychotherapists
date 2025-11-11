/**
 * Toast Notification System
 * 
 * Global toast notifications for success, error, warning, and info messages.
 * Follows constitution.md Section IV design standards.
 * 
 * Features:
 * - Multiple toast types (success, error, warning, info)
 * - Auto-dismiss with configurable duration
 * - Framer Motion animations
 * - Accessible with ARIA attributes
 * - Stack multiple toasts
 * - Manual dismiss
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    
    setToasts((prev) => [...prev, newToast])

    // Auto dismiss after duration
    const duration = toast.duration || 5000
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[]
  removeToast: (id: string) => void
}) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end justify-end gap-4 p-4 sm:p-6"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: () => void
}) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const styles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
      description: 'text-green-700',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      title: 'text-red-900',
      description: 'text-red-700',
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      description: 'text-yellow-700',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      description: 'text-blue-700',
    },
  }

  const Icon = icons[toast.type]
  const style = styles[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className="pointer-events-auto w-full max-w-sm"
      role="alert"
    >
      <div
        className={cn(
          'flex items-start gap-3 rounded-xl border-2 p-4 shadow-lg',
          style.bg
        )}
      >
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', style.icon)} />
        
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-semibold', style.title)}>
            {toast.title}
          </p>
          {toast.description && (
            <p className={cn('mt-1 text-sm', style.description)}>
              {toast.description}
            </p>
          )}
        </div>

        <button
          onClick={onDismiss}
          className={cn(
            'flex-shrink-0 rounded-lg p-1 transition-colors',
            'hover:bg-black/10 focus:outline-none focus:ring-2',
            'focus:ring-offset-2',
            style.icon
          )}
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}

// Helper functions for common toast types
export function toast(options: Omit<Toast, 'id'>) {
  // This will be implemented via the useToast hook
  // These are just type-safe helper functions
  return options
}

toast.success = (title: string, description?: string, duration?: number) => ({
  type: 'success' as const,
  title,
  description,
  duration,
})

toast.error = (title: string, description?: string, duration?: number) => ({
  type: 'error' as const,
  title,
  description,
  duration,
})

toast.warning = (title: string, description?: string, duration?: number) => ({
  type: 'warning' as const,
  title,
  description,
  duration,
})

toast.info = (title: string, description?: string, duration?: number) => ({
  type: 'info' as const,
  title,
  description,
  duration,
})
