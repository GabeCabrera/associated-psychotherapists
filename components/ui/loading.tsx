/**
 * Loading Components
 * 
 * Skeleton loaders and loading spinners for various UI elements.
 * Follows constitution.md Section IV design standards with calm animations.
 * 
 * Features:
 * - Skeleton loaders for cards, lists, forms
 * - Spinner component for loading states
 * - Smooth pulse animations (200-300ms ease-in-out)
 * - Accessible with proper ARIA labels
 */

'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Base Skeleton Component
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-[#E6EEF5]',
        className
      )}
      {...props}
    />
  )
}

/**
 * Spinner Component
 * 
 * Animated loading spinner for buttons and loading states
 */
export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  label?: string
}

const spinnerSizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
}

export function Spinner({ size = 'md', className, label = 'Loading' }: SpinnerProps) {
  return (
    <motion.div
      role="status"
      aria-label={label}
      className={cn('inline-flex items-center justify-center', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Loader2
        className={cn(
          'animate-spin text-[#6B8EAE]',
          spinnerSizes[size]
        )}
      />
      <span className="sr-only">{label}</span>
    </motion.div>
  )
}

/**
 * Full Page Spinner
 */
export function PageSpinner({ label = 'Loading page' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F7FAFC]">
      <div className="text-center">
        <Spinner size="xl" label={label} />
        <p className="mt-4 text-sm text-[#6B8EAE]">{label}...</p>
      </div>
    </div>
  )
}

/**
 * Card Skeleton
 * 
 * Skeleton loader for card components
 */
export interface CardSkeletonProps {
  hasImage?: boolean
  hasAvatar?: boolean
  lines?: number
  className?: string
}

export function CardSkeleton({
  hasImage = false,
  hasAvatar = false,
  lines = 3,
  className,
}: CardSkeletonProps) {
  return (
    <div
      className={cn(
        'p-6 rounded-xl border border-[#6B8EAE]/20 bg-white',
        className
      )}
    >
      {/* Image */}
      {hasImage && <Skeleton className="w-full h-48 mb-4" />}

      {/* Header with optional avatar */}
      <div className="flex items-start gap-4 mb-4">
        {hasAvatar && <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      {/* Content lines */}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              'h-4',
              i === lines - 1 ? 'w-2/3' : 'w-full'
            )}
          />
        ))}
      </div>

      {/* Footer actions */}
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

/**
 * List Skeleton
 * 
 * Skeleton loader for list items
 */
export interface ListSkeletonProps {
  items?: number
  hasAvatar?: boolean
  className?: string
}

export function ListSkeleton({
  items = 5,
  hasAvatar = true,
  className,
}: ListSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-lg border border-[#6B8EAE]/20 bg-white"
        >
          {hasAvatar && (
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20 flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}

/**
 * Table Skeleton
 * 
 * Skeleton loader for table rows
 */
export interface TableSkeletonProps {
  rows?: number
  columns?: number
  className?: string
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {/* Header */}
      <div className="flex gap-4 p-4 bg-[#E6EEF5] rounded-t-lg">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 flex-1" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex gap-4 p-4 border-b border-[#6B8EAE]/20"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-4 flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * Form Skeleton
 * 
 * Skeleton loader for form fields
 */
export interface FormSkeletonProps {
  fields?: number
  hasSubmitButton?: boolean
  className?: string
}

export function FormSkeleton({
  fields = 4,
  hasSubmitButton = true,
  className,
}: FormSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-11 w-full" /> {/* Input */}
        </div>
      ))}

      {hasSubmitButton && (
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-11 w-32" />
          <Skeleton className="h-11 w-24" />
        </div>
      )}
    </div>
  )
}

/**
 * Profile Skeleton
 * 
 * Skeleton loader for profile pages
 */
export function ProfileSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-start gap-6">
        <Skeleton className="w-24 h-24 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48" />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    </div>
  )
}

/**
 * Dashboard Skeleton
 * 
 * Skeleton loader for dashboard pages
 */
export function DashboardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-6 rounded-xl border border-[#6B8EAE]/20 bg-white">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-[#6B8EAE]/20 bg-white">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="p-6 rounded-xl border border-[#6B8EAE]/20 bg-white">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6 rounded-xl border border-[#6B8EAE]/20 bg-white">
        <Skeleton className="h-6 w-40 mb-4" />
        <ListSkeleton items={4} />
      </div>
    </div>
  )
}

/**
 * LoadingOverlay Component
 * 
 * Semi-transparent overlay with spinner for loading states
 */
export interface LoadingOverlayProps {
  isLoading: boolean
  label?: string
  children?: React.ReactNode
}

export function LoadingOverlay({
  isLoading,
  label = 'Loading',
  children,
}: LoadingOverlayProps) {
  if (!isLoading) return <>{children}</>

  return (
    <div className="relative">
      {children}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10"
      >
        <div className="text-center">
          <Spinner size="lg" label={label} />
          <p className="mt-2 text-sm text-[#6B8EAE]">{label}...</p>
        </div>
      </motion.div>
    </div>
  )
}
