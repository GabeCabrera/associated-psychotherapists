/**
 * Server-Side Auth Helpers
 * 
 * Utilities for authentication and authorization in Server Components and API Routes.
 * Implements zero-trust security model per constitution.md Section III.
 * 
 * Usage in Server Components:
 * ```tsx
 * import { requireAuth, requireRole } from '@/lib/auth/helpers'
 * 
 * export default async function TherapistDashboard() {
 *   const user = await requireRole('therapist')
 *   // ... render dashboard
 * }
 * ```
 * 
 * Usage in API Routes:
 * ```tsx
 * import { getAuthUser, checkRole } from '@/lib/auth/helpers'
 * 
 * export async function GET() {
 *   const user = await getAuthUser()
 *   if (!user) {
 *     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
 *   }
 *   // ... handle request
 * }
 * ```
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
export type UserRole = 'therapist' | 'client' | 'admin'

export interface AuthUser {
  user: User
  profile: Profile
}

/**
 * Get the current authenticated user and their profile
 * Returns null if not authenticated
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createClient()

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return null
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError || !profile) {
      return null
    }

    // Check if user is active and not deleted
    if (!profile.is_active || profile.deleted_at) {
      return null
    }

    return { user, profile }
  } catch (error) {
    console.error('Error in getAuthUser:', error)
    return null
  }
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use in Server Components that require auth
 * 
 * @param redirectPath - Path to redirect to after login (default: current path)
 * @returns The authenticated user and profile
 */
export async function requireAuth(redirectPath?: string): Promise<AuthUser> {
  const authUser = await getAuthUser()

  if (!authUser) {
    const loginUrl = redirectPath 
      ? `/login?redirect=${encodeURIComponent(redirectPath)}`
      : '/login'
    redirect(loginUrl)
  }

  return authUser
}

/**
 * Check if the current user has a specific role
 * 
 * @param role - The required role
 * @returns true if user has the role, false otherwise
 */
export async function checkRole(role: UserRole): Promise<boolean> {
  const authUser = await getAuthUser()

  if (!authUser) {
    return false
  }

  // Admins have access to everything
  if (authUser.profile.role === 'admin') {
    return true
  }

  return authUser.profile.role === role
}

/**
 * Require a specific role - redirects if user doesn't have the role
 * Use in Server Components that require specific roles
 * 
 * @param role - The required role
 * @param redirectPath - Path to redirect to if unauthorized (default: role-specific dashboard)
 * @returns The authenticated user and profile
 */
export async function requireRole(role: UserRole, redirectPath?: string): Promise<AuthUser> {
  const authUser = await requireAuth()

  // Admins have access to everything
  if (authUser.profile.role === 'admin') {
    return authUser
  }

  if (authUser.profile.role !== role) {
    const fallbackPath = redirectPath ?? `/dashboard/${authUser.profile.role}`
    redirect(fallbackPath)
  }

  return authUser
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  return checkRole('admin')
}

/**
 * Require admin role - redirects if not admin
 */
export async function requireAdmin(): Promise<AuthUser> {
  return requireRole('admin')
}

/**
 * Get the current user's role
 * Returns null if not authenticated
 */
export async function getUserRole(): Promise<UserRole | null> {
  const authUser = await getAuthUser()
  return authUser?.profile.role as UserRole | null
}

/**
 * Check if the current user can access a resource
 * 
 * @param resourceUserId - The user ID of the resource owner
 * @returns true if the current user can access the resource
 */
export async function canAccessResource(resourceUserId: string): Promise<boolean> {
  const authUser = await getAuthUser()

  if (!authUser) {
    return false
  }

  // Admins can access everything
  if (authUser.profile.role === 'admin') {
    return true
  }

  // Users can access their own resources
  return authUser.user.id === resourceUserId
}

/**
 * Require resource access - throws error if user cannot access
 * 
 * @param resourceUserId - The user ID of the resource owner
 * @throws Error if user cannot access the resource
 */
export async function requireResourceAccess(resourceUserId: string): Promise<void> {
  const canAccess = await canAccessResource(resourceUserId)

  if (!canAccess) {
    throw new Error('Unauthorized access to resource')
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  const supabase = await createClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error getting session:', error)
      return null
    }
    
    return session
  } catch (error) {
    console.error('Error in getSession:', error)
    return null
  }
}

/**
 * Sign out the current user (server-side)
 */
export async function signOut() {
  const supabase = await createClient()
  
  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}
