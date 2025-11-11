/**
 * Session Management Utilities
 * 
 * Handles auto-logout on inactivity and session refresh.
 * Per constitution.md Section III - implements auto-logout on inactivity.
 */

'use client'

import { useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

// Default timeout: 30 minutes of inactivity
const DEFAULT_TIMEOUT_MS = 30 * 60 * 1000

// Events that count as user activity
const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'click',
]

interface SessionManagerOptions {
  /**
   * Timeout in milliseconds before auto-logout
   * @default 1800000 (30 minutes)
   */
  timeoutMs?: number
  
  /**
   * Callback when session is about to expire
   * @param remainingSeconds Seconds until auto-logout
   */
  onWarning?: (remainingSeconds: number) => void
  
  /**
   * Callback when user is logged out due to inactivity
   */
  onLogout?: () => void
  
  /**
   * Warning time before logout in milliseconds
   * @default 120000 (2 minutes)
   */
  warningTimeMs?: number
}

/**
 * Hook to manage session timeout and auto-logout
 * 
 * Usage:
 * ```tsx
 * useSessionManager({
 *   timeoutMs: 30 * 60 * 1000, // 30 minutes
 *   onWarning: (seconds) => showWarningModal(seconds),
 *   onLogout: () => showLogoutMessage(),
 * })
 * ```
 */
export function useSessionManager(options: SessionManagerOptions = {}) {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    onWarning,
    onLogout,
    warningTimeMs = 2 * 60 * 1000, // 2 minutes warning
  } = options

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const warningRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current)
      warningRef.current = null
    }
  }, [])

  // Logout user due to inactivity
  const logout = useCallback(async () => {
    clearTimers()
    await supabase.auth.signOut()
    onLogout?.()
  }, [supabase, clearTimers, onLogout])

  // Reset the inactivity timer
  const resetTimer = useCallback(() => {
    clearTimers()

    // Set warning timer
    if (onWarning && warningTimeMs > 0) {
      const warningTime = timeoutMs - warningTimeMs
      warningRef.current = setTimeout(() => {
        const remainingSeconds = Math.floor(warningTimeMs / 1000)
        onWarning(remainingSeconds)
      }, warningTime)
    }

    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      logout()
    }, timeoutMs)
  }, [timeoutMs, warningTimeMs, onWarning, logout, clearTimers])

  // Check if user is authenticated and setup listeners
  useEffect(() => {
    let mounted = true

    const setupSessionManager = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user || !mounted) {
        return
      }

      // Start the inactivity timer
      resetTimer()

      // Add activity listeners
      ACTIVITY_EVENTS.forEach(event => {
        window.addEventListener(event, resetTimer)
      })
    }

    setupSessionManager()

    // Cleanup
    return () => {
      mounted = false
      clearTimers()
      ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, resetTimer)
      })
    }
  }, [supabase, resetTimer, clearTimers])

  return {
    resetTimer,
  }
}

/**
 * Refresh the user's session
 * 
 * Should be called periodically to keep the session alive.
 * Supabase tokens expire after 1 hour by default.
 */
export async function refreshSession() {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.auth.refreshSession()
    
    if (error) {
      console.error('Error refreshing session:', error)
      return { error: error.message }
    }
    
    return { data, error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to refresh session'
    console.error('Error in refreshSession:', message)
    return { error: message }
  }
}

/**
 * Hook to automatically refresh session before it expires
 * 
 * Supabase access tokens expire after 1 hour by default.
 * This hook refreshes the token every 50 minutes.
 */
export function useSessionRefresh() {
  const supabase = createClient()
  
  useEffect(() => {
    let mounted = true
    let intervalId: NodeJS.Timeout | null = null

    const setupRefresh = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user || !mounted) {
        return
      }

      // Refresh session every 50 minutes (before 1-hour expiry)
      intervalId = setInterval(async () => {
        if (!mounted) return
        
        const { error } = await supabase.auth.refreshSession()
        
        if (error) {
          console.error('Error refreshing session:', error)
        } else {
          console.log('Session refreshed successfully')
        }
      }, 50 * 60 * 1000) // 50 minutes
    }

    setupRefresh()

    return () => {
      mounted = false
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [supabase])
}

/**
 * Get the current session expiration time
 */
export async function getSessionExpiration(): Promise<Date | null> {
  const supabase = createClient()
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return null
    }
    
    // Session expiration is stored in the access token
    return new Date(session.expires_at! * 1000)
  } catch (error) {
    console.error('Error getting session expiration:', error)
    return null
  }
}
