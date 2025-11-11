/**
 * Next.js Middleware
 * 
 * Handles authentication and role-based route protection.
 * Implements zero-trust security model per constitution.md Section III.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 */

import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { Database } from '@/lib/types/database.types'

// Route protection configuration
const PROTECTED_ROUTES = {
  // Routes requiring any authentication
  authenticated: ['/dashboard'],
  
  // Role-specific routes
  therapist: ['/dashboard/therapist'],
  client: ['/dashboard/client'],
  admin: ['/dashboard/admin'],
  
  // Auth routes (redirect if already logged in)
  auth: ['/login', '/signup', '/reset-password'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Get user session
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get user profile with role if authenticated
  let userRole: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active, deleted_at')
      .eq('id', user.id)
      .maybeSingle<{
        role: string
        is_active: boolean
        deleted_at: string | null
      }>()
    
    // Check if user is active and not deleted
    if (profile && profile.is_active && !profile.deleted_at) {
      userRole = profile.role
    } else if (profile) {
      // User is deactivated or deleted - sign them out
      await supabase.auth.signOut()
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('error', 'account_deactivated')
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Handle auth routes - redirect if already logged in
  const isAuthRoute = PROTECTED_ROUTES.auth.some(route => pathname.startsWith(route))
  if (isAuthRoute && user && userRole) {
    const redirectUrl = request.nextUrl.clone()
    // Redirect to role-specific dashboard
    redirectUrl.pathname = `/dashboard/${userRole}`
    return NextResponse.redirect(redirectUrl)
  }

  // Check if route requires authentication
  const requiresAuth = PROTECTED_ROUTES.authenticated.some(route => pathname.startsWith(route))
  
  if (requiresAuth && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Check role-specific route access
  if (user && userRole) {
    // Check therapist routes
    if (PROTECTED_ROUTES.therapist.some(route => pathname.startsWith(route))) {
      if (userRole !== 'therapist' && userRole !== 'admin') {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = `/dashboard/${userRole}`
        return NextResponse.redirect(redirectUrl)
      }
    }
    
    // Check client routes
    if (PROTECTED_ROUTES.client.some(route => pathname.startsWith(route))) {
      if (userRole !== 'client' && userRole !== 'admin') {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = `/dashboard/${userRole}`
        return NextResponse.redirect(redirectUrl)
      }
    }
    
    // Check admin routes
    if (PROTECTED_ROUTES.admin.some(route => pathname.startsWith(route))) {
      if (userRole !== 'admin') {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = `/dashboard/${userRole}`
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
