/**
 * Auth Index
 * 
 * Central export point for all authentication utilities.
 */

export {
  getAuthUser,
  requireAuth,
  checkRole,
  requireRole,
  isAdmin,
  requireAdmin,
  getUserRole,
  canAccessResource,
  requireResourceAccess,
  getSession,
  signOut,
} from './helpers'

export type { AuthUser, UserRole } from './helpers'
