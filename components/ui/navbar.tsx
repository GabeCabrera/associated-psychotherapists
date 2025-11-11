/**
 * Navbar Component
 * 
 * Responsive navigation bar with sticky behavior and shrink-on-scroll animation.
 * Follows constitution.md Section IV design standards.
 * 
 * Features:
 * - Logo and brand name
 * - Navigation links (role-based)
 * - User menu with avatar
 * - Mobile responsive with hamburger menu
 * - Sticky behavior with shrink animation on scroll
 * - WCAG 2.1 AA compliant
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings,
  Calendar,
  MessageSquare,
  BarChart3,
  UserCircle2
} from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { ROUTES, getDashboardRoute } from '@/lib/constants/routes'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface NavLink {
  label: string
  href: string
  icon?: React.ReactNode
  requiresAuth?: boolean
  roles?: Array<'therapist' | 'client' | 'admin'>
}

const publicNavLinks: NavLink[] = [
  { label: 'Find Therapists', href: ROUTES.THERAPISTS },
  { label: 'About', href: ROUTES.ABOUT },
  { label: 'Contact', href: ROUTES.CONTACT },
]

const therapistNavLinks: NavLink[] = [
  { label: 'Dashboard', href: ROUTES.THERAPIST.DASHBOARD, icon: <BarChart3 className="h-4 w-4" /> },
  { label: 'Clients', href: ROUTES.THERAPIST.CLIENTS, icon: <UserCircle2 className="h-4 w-4" /> },
  { label: 'Schedule', href: ROUTES.THERAPIST.SCHEDULE, icon: <Calendar className="h-4 w-4" /> },
  { label: 'Messages', href: ROUTES.THERAPIST.MESSAGES, icon: <MessageSquare className="h-4 w-4" /> },
]

const clientNavLinks: NavLink[] = [
  { label: 'Dashboard', href: ROUTES.CLIENT.DASHBOARD, icon: <BarChart3 className="h-4 w-4" /> },
  { label: 'Sessions', href: ROUTES.CLIENT.SESSIONS, icon: <Calendar className="h-4 w-4" /> },
  { label: 'Therapists', href: ROUTES.CLIENT.THERAPISTS, icon: <UserCircle2 className="h-4 w-4" /> },
  { label: 'Messages', href: ROUTES.CLIENT.MESSAGES, icon: <MessageSquare className="h-4 w-4" /> },
]

const adminNavLinks: NavLink[] = [
  { label: 'Dashboard', href: ROUTES.ADMIN.DASHBOARD, icon: <BarChart3 className="h-4 w-4" /> },
  { label: 'Approvals', href: ROUTES.ADMIN.APPROVALS, icon: <UserCircle2 className="h-4 w-4" /> },
  { label: 'Analytics', href: ROUTES.ADMIN.ANALYTICS, icon: <BarChart3 className="h-4 w-4" /> },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, signOut, isLoading } = useAuth()
  
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false)
  
  const userMenuRef = React.useRef<HTMLDivElement>(null)

  // Handle scroll behavior
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close user menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get navigation links based on user role
  const getNavLinks = (): NavLink[] => {
    if (!user || !profile) return publicNavLinks
    
    switch (profile.role) {
      case 'therapist':
        return therapistNavLinks
      case 'client':
        return clientNavLinks
      case 'admin':
        return adminNavLinks
      default:
        return publicNavLinks
    }
  }

  const navLinks = getNavLinks()

  const handleSignOut = async () => {
    await signOut()
    router.push(ROUTES.HOME)
  }

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ 
        height: isScrolled ? '64px' : '80px',
        backgroundColor: isScrolled ? 'rgba(230, 238, 245, 0.95)' : 'rgba(230, 238, 245, 1)',
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'border-b border-[#6B8EAE]/20',
        'backdrop-blur-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo and Brand */}
          <Link 
            href={ROUTES.HOME}
            className="flex items-center gap-3 group"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1A365D] text-white font-bold text-xl"
            >
              AP
            </motion.div>
            <span className="text-xl font-semibold text-[#1A365D] group-hover:text-[#6B8EAE] transition-colors">
              Associated Psych
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    'hover:bg-[#1A365D]/10',
                    'focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:ring-offset-2',
                    isActive 
                      ? 'text-[#1A365D] bg-[#1A365D]/10' 
                      : 'text-[#2D3748] hover:text-[#1A365D]'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {link.icon}
                    {link.label}
                  </div>
                </Link>
              )
            })}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoading && (
              <>
                {user && profile ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg',
                        'hover:bg-[#1A365D]/10 transition-colors',
                        'focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:ring-offset-2'
                      )}
                      aria-label="User menu"
                      aria-expanded={isUserMenuOpen}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#6B8EAE] flex items-center justify-center text-white text-sm font-medium">
                        {profile.avatar_url ? (
                          <img 
                            src={profile.avatar_url} 
                            alt={profile.full_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          profile.full_name?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <span className="text-sm font-medium text-[#2D3748]">
                        {profile.full_name}
                      </span>
                    </button>

                    {/* User Dropdown Menu */}
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            'absolute right-0 mt-2 w-48',
                            'bg-white rounded-lg shadow-lg',
                            'border border-[#6B8EAE]/20',
                            'py-1'
                          )}
                        >
                          <Link
                            href={profile.role === 'therapist' ? ROUTES.THERAPIST.PROFILE : ROUTES.CLIENT.SETTINGS}
                            className={cn(
                              'flex items-center gap-2 px-4 py-2',
                              'text-sm text-[#2D3748]',
                              'hover:bg-[#E6EEF5] transition-colors'
                            )}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            Profile
                          </Link>
                          <Link
                            href={profile.role === 'therapist' ? ROUTES.THERAPIST.SETTINGS : ROUTES.CLIENT.SETTINGS}
                            className={cn(
                              'flex items-center gap-2 px-4 py-2',
                              'text-sm text-[#2D3748]',
                              'hover:bg-[#E6EEF5] transition-colors'
                            )}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            Settings
                          </Link>
                          <hr className="my-1 border-[#6B8EAE]/20" />
                          <button
                            onClick={handleSignOut}
                            className={cn(
                              'flex items-center gap-2 px-4 py-2 w-full',
                              'text-sm text-red-600',
                              'hover:bg-red-50 transition-colors'
                            )}
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(ROUTES.LOGIN)}
                    >
                      Log In
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => router.push(ROUTES.SIGNUP)}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'md:hidden p-2 rounded-lg',
              'hover:bg-[#1A365D]/10 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:ring-offset-2'
            )}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-[#1A365D]" />
            ) : (
              <Menu className="h-6 w-6 text-[#1A365D]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden border-t border-[#6B8EAE]/20 bg-white"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium',
                      'transition-colors',
                      isActive 
                        ? 'text-[#1A365D] bg-[#1A365D]/10' 
                        : 'text-[#2D3748] hover:bg-[#E6EEF5]'
                    )}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                )
              })}

              {/* Mobile Auth Section */}
              {!isLoading && (
                <div className="pt-4 border-t border-[#6B8EAE]/20 space-y-2">
                  {user && profile ? (
                    <>
                      <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-10 h-10 rounded-full bg-[#6B8EAE] flex items-center justify-center text-white font-medium">
                          {profile.avatar_url ? (
                            <img 
                              src={profile.avatar_url} 
                              alt={profile.full_name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            profile.full_name?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#2D3748]">{profile.full_name}</p>
                          <p className="text-xs text-[#6B8EAE]">{profile.email}</p>
                        </div>
                      </div>
                      <Link
                        href={profile.role === 'therapist' ? ROUTES.THERAPIST.PROFILE : ROUTES.CLIENT.SETTINGS}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-lg text-sm',
                          'text-[#2D3748] hover:bg-[#E6EEF5] transition-colors'
                        )}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <Link
                        href={profile.role === 'therapist' ? ROUTES.THERAPIST.SETTINGS : ROUTES.CLIENT.SETTINGS}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-lg text-sm',
                          'text-[#2D3748] hover:bg-[#E6EEF5] transition-colors'
                        )}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-lg text-sm w-full',
                          'text-red-600 hover:bg-red-50 transition-colors'
                        )}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="md"
                        fullWidth
                        onClick={() => router.push(ROUTES.LOGIN)}
                      >
                        Log In
                      </Button>
                      <Button
                        variant="primary"
                        size="md"
                        fullWidth
                        onClick={() => router.push(ROUTES.SIGNUP)}
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
