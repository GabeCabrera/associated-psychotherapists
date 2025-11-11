/**
 * Footer Component
 * 
 * Site-wide footer with navigation links, social media, and copyright.
 * Follows constitution.md Section IV design standards.
 * 
 * Features:
 * - Multi-column layout with navigation sections
 * - Social media links with icons
 * - Copyright notice
 * - Responsive design
 * - WCAG 2.1 AA compliant
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils'

interface FooterLinkSection {
  title: string
  links: Array<{
    label: string
    href: string
    external?: boolean
  }>
}

const footerSections: FooterLinkSection[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Find Therapists', href: ROUTES.THERAPISTS },
      { label: 'About Us', href: ROUTES.ABOUT },
      { label: 'Contact', href: ROUTES.CONTACT },
      { label: 'How It Works', href: '/how-it-works' },
    ],
  },
  {
    title: 'For Therapists',
    links: [
      { label: 'Join Our Network', href: ROUTES.SIGNUP },
      { label: 'Resources', href: '/resources' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Support', href: '/support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'HIPAA Compliance', href: '/hipaa' },
    ],
  },
]

const socialLinks = [
  { 
    name: 'Facebook', 
    href: 'https://facebook.com', 
    icon: <Facebook className="h-5 w-5" />,
    ariaLabel: 'Visit our Facebook page'
  },
  { 
    name: 'Twitter', 
    href: 'https://twitter.com', 
    icon: <Twitter className="h-5 w-5" />,
    ariaLabel: 'Visit our Twitter profile'
  },
  { 
    name: 'LinkedIn', 
    href: 'https://linkedin.com', 
    icon: <Linkedin className="h-5 w-5" />,
    ariaLabel: 'Visit our LinkedIn page'
  },
  { 
    name: 'Instagram', 
    href: 'https://instagram.com', 
    icon: <Instagram className="h-5 w-5" />,
    ariaLabel: 'Visit our Instagram profile'
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1A365D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link 
              href={ROUTES.HOME}
              className="flex items-center gap-3 group mb-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white text-[#1A365D] font-bold text-xl"
              >
                AP
              </motion.div>
              <span className="text-xl font-semibold group-hover:text-[#6B8EAE] transition-colors">
                Associated Psych
              </span>
            </Link>
            
            <p className="text-[#E6EEF5] text-sm mb-6 max-w-sm">
              Connecting individuals with qualified therapists for accessible, 
              professional mental health care. Your journey to wellness starts here.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-[#E6EEF5]">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#6B8EAE]" />
                <a 
                  href="mailto:hello@associatedpsych.com"
                  className="hover:text-white transition-colors"
                >
                  hello@associatedpsych.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#6B8EAE]" />
                <a 
                  href="tel:+1-800-555-0123"
                  className="hover:text-white transition-colors"
                >
                  1-800-555-0123
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#6B8EAE] flex-shrink-0 mt-0.5" />
                <span>
                  123 Wellness Street<br />
                  San Francisco, CA 94103
                </span>
              </div>
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'text-sm text-[#E6EEF5]',
                          'hover:text-white transition-colors',
                          'focus:outline-none focus:underline'
                        )}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className={cn(
                          'text-sm text-[#E6EEF5]',
                          'hover:text-white transition-colors',
                          'focus:outline-none focus:underline'
                        )}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-[#E6EEF5]">
              © {currentYear} Associated Psych. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className={cn(
                    'p-2 rounded-lg',
                    'text-[#E6EEF5] hover:text-white',
                    'hover:bg-white/10 transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1A365D]'
                  )}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={cn(
                'text-sm text-[#E6EEF5] hover:text-white transition-colors',
                'focus:outline-none focus:underline'
              )}
              aria-label="Back to top"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-[#0F1F3D] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-[#6B8EAE] text-center">
            <strong>Disclaimer:</strong> Associated Psych is a platform connecting 
            individuals with licensed therapists. We are not a crisis intervention service. 
            If you are in a crisis or emergency, please call 911 or the National Suicide 
            Prevention Lifeline at 1-800-273-8255.
          </p>
        </div>
      </div>
    </footer>
  )
}

/**
 * Simple Footer
 * 
 * Minimal footer for auth pages and simple layouts
 */
export function SimpleFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#E6EEF5] border-t border-[#6B8EAE]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#6B8EAE]">
            © {currentYear} Associated Psych. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-[#6B8EAE] hover:text-[#1A365D] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-[#6B8EAE] hover:text-[#1A365D] transition-colors"
            >
              Terms
            </Link>
            <Link
              href={ROUTES.CONTACT}
              className="text-sm text-[#6B8EAE] hover:text-[#1A365D] transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
