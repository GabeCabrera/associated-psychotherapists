/**
 * Sidebar Component
 * 
 * Navigation sidebar for dashboard layouts with role-based menu items.
 * Features collapsible mobile menu and active state indicators.
 * Follows constitution.md Section IV design standards.
 * 
 * Features:
 * - Role-based navigation (therapist/client/admin)
 * - Active route highlighting
 * - Collapsible on mobile
 * - Smooth animations with Framer Motion
 * - WCAG 2.1 AA compliant
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  UserCircle2,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle,
  DollarSign,
} from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string | number
}

interface SidebarProps {
  className?: string
}

const therapistNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.THERAPIST.DASHBOARD,
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: 'Clients',
    href: ROUTES.THERAPIST.CLIENTS,
    icon: <UserCircle2 className="h-5 w-5" />,
  },
  {
    label: 'Schedule',
    href: ROUTES.THERAPIST.SCHEDULE,
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    label: 'Messages',
    href: ROUTES.THERAPIST.MESSAGES,
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    label: 'Analytics',
    href: ROUTES.THERAPIST.ANALYTICS,
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: 'Profile',
    href: ROUTES.THERAPIST.PROFILE,
    icon: <Settings className="h-5 w-5" />,
  },
]

const clientNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.CLIENT.DASHBOARD,
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: 'Sessions',
    href: ROUTES.CLIENT.SESSIONS,
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    label: 'Find Therapists',
    href: ROUTES.CLIENT.THERAPISTS,
    icon: <UserCircle2 className="h-5 w-5" />,
  },
  {
    label: 'Messages',
    href: ROUTES.CLIENT.MESSAGES,
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    label: 'Settings',
    href: ROUTES.CLIENT.SETTINGS,
    icon: <Settings className="h-5 w-5" />,
  },
]

const adminNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.ADMIN.DASHBOARD,
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: 'Approvals',
    href: ROUTES.ADMIN.APPROVALS,
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    label: 'Users',
    href: ROUTES.ADMIN.USERS,
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: 'Analytics',
    href: ROUTES.ADMIN.ANALYTICS,
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: 'Billing',
    href: ROUTES.ADMIN.BILLING,
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    label: 'Settings',
    href: ROUTES.ADMIN.SETTINGS,
    icon: <Settings className="h-5 w-5" />,
  },
]

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { profile } = useAuth()
  
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

  // Get navigation items based on user role
  const getNavItems = (): NavItem[] => {
    if (!profile) return []
    
    switch (profile.role) {
      case 'therapist':
        return therapistNavItems
      case 'client':
        return clientNavItems
      case 'admin':
        return adminNavItems
      default:
        return []
    }
  }

  const navItems = getNavItems()

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  if (!profile || navItems.length === 0) {
    return null
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? '80px' : '256px',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 h-screen z-40',
          'bg-white border-r border-[#6B8EAE]/20',
          'hidden lg:flex flex-col',
          className
        )}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-[#6B8EAE]/20">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1A365D] text-white font-bold text-xl">
                AP
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A365D]">Associated Psych</p>
                <p className="text-xs text-[#6B8EAE] capitalize">{profile.role}</p>
              </div>
            </motion.div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'p-2 rounded-lg',
              'hover:bg-[#E6EEF5] transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:ring-offset-2',
              isCollapsed && 'mx-auto'
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-[#6B8EAE]" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-[#6B8EAE]" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1" role="list">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-lg',
                      'text-sm font-medium transition-all duration-200',
                      'hover:bg-[#E6EEF5]',
                      'focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:ring-offset-2',
                      isActive
                        ? 'bg-[#1A365D] text-white hover:bg-[#1A365D]/90'
                        : 'text-[#2D3748]',
                      isCollapsed && 'justify-center'
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className={cn(isActive && 'text-white')}>
                      {item.icon}
                    </span>
                    
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className={cn(
                            'px-2 py-0.5 text-xs font-semibold rounded-full',
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-[#6B8EAE]/20 text-[#1A365D]'
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 border-t border-[#6B8EAE]/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6B8EAE] flex items-center justify-center text-white text-sm font-medium">
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
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#2D3748] truncate">
                  {profile.full_name}
                </p>
                <p className="text-xs text-[#6B8EAE] truncate">
                  {profile.email}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={cn(
              'fixed left-0 top-0 w-64 h-screen z-50',
              'bg-white border-r border-[#6B8EAE]/20',
              'lg:hidden flex flex-col'
            )}
          >
            {/* Header */}
            <div className="h-20 flex items-center justify-between px-4 border-b border-[#6B8EAE]/20">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1A365D] text-white font-bold text-xl">
                  AP
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A365D]">Associated Psych</p>
                  <p className="text-xs text-[#6B8EAE] capitalize">{profile.role}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              <ul className="space-y-1" role="list">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-lg',
                          'text-sm font-medium transition-all duration-200',
                          'hover:bg-[#E6EEF5]',
                          isActive
                            ? 'bg-[#1A365D] text-white hover:bg-[#1A365D]/90'
                            : 'text-[#2D3748]'
                        )}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <span className={cn(isActive && 'text-white')}>
                          {item.icon}
                        </span>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className={cn(
                            'px-2 py-0.5 text-xs font-semibold rounded-full',
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-[#6B8EAE]/20 text-[#1A365D]'
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-[#6B8EAE]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#6B8EAE] flex items-center justify-center text-white text-sm font-medium">
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2D3748] truncate">
                    {profile.full_name}
                  </p>
                  <p className="text-xs text-[#6B8EAE] truncate">
                    {profile.email}
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={cn(
          'fixed bottom-4 left-4 z-30',
          'lg:hidden',
          'p-3 rounded-full',
          'bg-[#1A365D] text-white',
          'shadow-lg hover:shadow-xl',
          'focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:ring-offset-2',
          'transition-all duration-200'
        )}
        aria-label="Toggle menu"
      >
        <LayoutDashboard className="h-6 w-6" />
      </button>
    </>
  )
}
