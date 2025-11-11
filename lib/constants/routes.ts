/**
 * Application Routes
 * 
 * Centralized route definitions for consistent navigation across the app.
 * All route paths should be defined here to avoid magic strings.
 */

/**
 * Public routes (no authentication required)
 */
export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  THERAPISTS: '/therapists',
  THERAPIST_DETAIL: (id: string) => `/therapists/${id}`,
} as const

/**
 * Auth routes
 */
export const AUTH_ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
} as const

/**
 * Therapist dashboard routes
 */
export const THERAPIST_ROUTES = {
  DASHBOARD: '/therapist',
  PROFILE: '/therapist/profile',
  SCHEDULE: '/therapist/schedule',
  CLIENTS: '/therapist/clients',
  CLIENT_DETAIL: (id: string) => `/therapist/clients/${id}`,
  SESSIONS: '/therapist/sessions',
  ANALYTICS: '/therapist/analytics',
  MESSAGES: '/therapist/messages',
  SETTINGS: '/therapist/settings',
} as const

/**
 * Client dashboard routes
 */
export const CLIENT_ROUTES = {
  DASHBOARD: '/client',
  SESSIONS: '/client/sessions',
  SESSION_DETAIL: (id: string) => `/client/sessions/${id}`,
  THERAPISTS: '/client/therapists',
  THERAPIST_DETAIL: (id: string) => `/client/therapists/${id}`,
  MESSAGES: '/client/messages',
  SETTINGS: '/client/settings',
} as const

/**
 * Admin dashboard routes
 */
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin',
  APPROVALS: '/admin/approvals',
  ANALYTICS: '/admin/analytics',
  BILLING: '/admin/billing',
  USERS: '/admin/users',
  SETTINGS: '/admin/settings',
} as const

/**
 * API routes
 */
export const API_ROUTES = {
  // Auth
  AUTH_SIGNUP: '/api/auth/signup',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_RESET_PASSWORD: '/api/auth/reset-password',
  AUTH_ME: '/api/auth/me',

  // Therapists
  THERAPISTS_LIST: '/api/therapists',
  THERAPIST_DETAIL: (id: string) => `/api/therapists/${id}`,
  THERAPIST_AVAILABILITY: (id: string) => `/api/therapists/${id}/availability`,
  THERAPIST_PROFILE: '/api/therapists/profile',

  // Clients
  CLIENTS_LIST: '/api/clients',
  CLIENT_DETAIL: (id: string) => `/api/clients/${id}`,
  CLIENT_PROFILE: '/api/clients/profile',

  // Sessions
  SESSIONS_LIST: '/api/sessions',
  SESSION_DETAIL: (id: string) => `/api/sessions/${id}`,
  SESSION_CANCEL: (id: string) => `/api/sessions/${id}/cancel`,
  SESSION_RESCHEDULE: (id: string) => `/api/sessions/${id}/reschedule`,

  // Messages
  MESSAGES_LIST: '/api/messages',
  MESSAGE_DETAIL: (id: string) => `/api/messages/${id}`,
  CONVERSATION_MESSAGES: (conversationId: string) => `/api/messages/${conversationId}`,

  // Payments
  PAYMENTS_CREATE_INTENT: '/api/payments/create-intent',
  PAYMENTS_CONFIRM: '/api/payments/confirm',
  PAYMENTS_HISTORY: '/api/payments/history',
  PAYMENTS_WEBHOOK: '/api/payments/webhook',

  // Admin
  ADMIN_APPROVALS: '/api/admin/approvals',
  ADMIN_APPROVE_THERAPIST: (id: string) => `/api/admin/approvals/${id}/approve`,
  ADMIN_REJECT_THERAPIST: (id: string) => `/api/admin/approvals/${id}/reject`,
  ADMIN_ANALYTICS: '/api/admin/analytics',
} as const

/**
 * All routes combined
 */
export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...AUTH_ROUTES,
  THERAPIST: THERAPIST_ROUTES,
  CLIENT: CLIENT_ROUTES,
  ADMIN: ADMIN_ROUTES,
  API: API_ROUTES,
} as const

/**
 * Protected route patterns (for middleware)
 */
export const PROTECTED_ROUTES = [
  '/therapist',
  '/client',
  '/admin',
] as const

/**
 * Helper function to check if a route requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
}

/**
 * Helper function to get dashboard route based on user role
 */
export function getDashboardRoute(role: 'therapist' | 'client' | 'admin'): string {
  switch (role) {
    case 'therapist':
      return THERAPIST_ROUTES.DASHBOARD
    case 'client':
      return CLIENT_ROUTES.DASHBOARD
    case 'admin':
      return ADMIN_ROUTES.DASHBOARD
    default:
      return PUBLIC_ROUTES.HOME
  }
}

/**
 * Helper function to check if user has access to route based on role
 */
export function canAccessRoute(pathname: string, role: 'therapist' | 'client' | 'admin'): boolean {
  if (pathname.startsWith('/therapist')) {
    return role === 'therapist' || role === 'admin'
  }
  
  if (pathname.startsWith('/client')) {
    return role === 'client' || role === 'admin'
  }
  
  if (pathname.startsWith('/admin')) {
    return role === 'admin'
  }
  
  return true
}
