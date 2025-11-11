/**
 * useAuth Hook
 * 
 * Client-side authentication state management and operations.
 * Provides user state, profile data, and auth methods.
 * 
 * Usage:
 * const { user, profile, signIn, signOut, signUp, isLoading } = useAuth()
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthState {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  error: string | null
}

interface UseAuthReturn extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string, role: 'therapist' | 'client') => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>
  refreshSession: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    error: null,
  })
  
  const router = useRouter()
  const supabase = createClient()

  // Fetch user profile
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in fetchProfile:', error)
      return null
    }
  }, [supabase])

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const profile = await fetchProfile(user.id)
          setState({ user, profile, isLoading: false, error: null })
        } else {
          setState({ user: null, profile: null, isLoading: false, error: null })
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        setState({ user: null, profile: null, isLoading: false, error: 'Failed to initialize authentication' })
      }
    }

    initAuth()
  }, [supabase, fetchProfile])

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null
      
      if (user) {
        const profile = await fetchProfile(user.id)
        setState({ user, profile, isLoading: false, error: null })
        
        // Redirect based on role after sign in
        if (event === 'SIGNED_IN' && profile?.role) {
          router.push(`/dashboard/${profile.role}`)
        }
      } else {
        setState({ user: null, profile: null, isLoading: false, error: null })
        
        // Redirect to login after sign out
        if (event === 'SIGNED_OUT') {
          router.push('/login')
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router, fetchProfile])

  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setState(prev => ({ ...prev, isLoading: false, error: error.message }))
        return { error: error.message }
      }

      // State will be updated by onAuthStateChange listener
      return { error: null }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during sign in'
      setState(prev => ({ ...prev, isLoading: false, error: message }))
      return { error: message }
    }
  }, [supabase])

  // Sign up with email, password, and role
  const signUp = useCallback(async (
    email: string,
    password: string,
    fullName: string,
    role: 'therapist' | 'client'
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      })

      if (authError) {
        setState(prev => ({ ...prev, isLoading: false, error: authError.message }))
        return { error: authError.message }
      }

      if (!authData.user) {
        setState(prev => ({ ...prev, isLoading: false, error: 'Failed to create user account' }))
        return { error: 'Failed to create user account' }
      }

      // Create profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          role,
        })

      if (profileError) {
        // If profile creation fails, we should ideally delete the auth user
        // For now, just return the error
        console.error('Error creating profile:', profileError)
        setState(prev => ({ ...prev, isLoading: false, error: 'Failed to create user profile' }))
        return { error: 'Failed to create user profile' }
      }

      // State will be updated by onAuthStateChange listener
      return { error: null }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during sign up'
      setState(prev => ({ ...prev, isLoading: false, error: message }))
      return { error: message }
    }
  }, [supabase])

  // Sign out
  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      await supabase.auth.signOut()
      // State will be updated by onAuthStateChange listener
    } catch (error) {
      console.error('Error signing out:', error)
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [supabase])

  // Request password reset
  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      return { error: message }
    }
  }, [supabase])

  // Update password
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      return { error: message }
    }
  }, [supabase])

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('Error refreshing session:', error)
      }
      
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setState({ user: session.user, profile, isLoading: false, error: null })
      }
    } catch (error) {
      console.error('Error in refreshSession:', error)
    }
  }, [supabase, fetchProfile])

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
  }
}

export default useAuth
