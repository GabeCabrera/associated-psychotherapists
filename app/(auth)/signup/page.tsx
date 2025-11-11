/**
 * Signup Page
 * 
 * User registration page with role selection (therapist/client).
 * Follows constitution.md UX flows and design standards.
 * 
 * Features:
 * - Role selection (therapist or client)
 * - Full name, email, and password fields
 * - Password strength validation
 * - Loading states
 * - Error handling with toast notifications
 * - Link to login page
 * - Automatic redirect after successful signup
 */

'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, User, Briefcase } from 'lucide-react'
import { useAuth } from '@/lib/hooks'
import { useToast } from '@/components/ui/toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { validateEmail, validatePassword } from '@/lib/utils/validation'
import { cn } from '@/lib/utils'

type UserRole = 'therapist' | 'client'

export default function SignupPage() {
  const router = useRouter()
  const { signUp, isLoading: authLoading } = useAuth()
  const { addToast } = useToast()

  const [role, setRole] = React.useState<UserRole | null>(null)
  const [fullName, setFullName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  const [fullNameError, setFullNameError] = React.useState('')
  const [emailError, setEmailError] = React.useState('')
  const [passwordError, setPasswordError] = React.useState('')
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('')

  const [isLoading, setIsLoading] = React.useState(false)

  // Handle form validation
  const validateForm = (): boolean => {
    let isValid = true

    // Validate role
    if (!role) {
      addToast({
        type: 'warning',
        title: 'Please select a role',
        description: 'Choose whether you are a therapist or seeking therapy.',
      })
      return false
    }

    // Validate full name
    if (!fullName.trim()) {
      setFullNameError('Full name is required')
      isValid = false
    } else if (fullName.trim().length < 2) {
      setFullNameError('Name must be at least 2 characters')
      isValid = false
    } else {
      setFullNameError('')
    }

    // Validate email
    if (!email) {
      setEmailError('Email is required')
      isValid = false
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      isValid = false
    } else {
      setEmailError('')
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || 'Invalid password')
      isValid = false
    } else {
      setPasswordError('')
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
      isValid = false
    } else {
      setConfirmPasswordError('')
    }

    return isValid
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !role) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await signUp(email, password, fullName, role)

      if (error) {
        addToast({
          type: 'error',
          title: 'Signup failed',
          description: error,
        })
      } else {
        addToast({
          type: 'success',
          title: 'Account created!',
          description: 'Welcome to Associated Psych. Redirecting...',
        })

        // Redirect will be handled by useAuth hook based on role
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'An error occurred',
        description: 'Please try again later.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E6EEF5] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        <Card variant="glass">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl">Create Your Account</CardTitle>
            <CardDescription>
              Join Associated Psych - connecting therapists and clients
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="mb-3 block text-sm font-medium text-[#2D3748]">
                  I am a... <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    onClick={() => setRole('client')}
                    className={cn(
                      'flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all',
                      'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#6B8EAE] focus:ring-offset-2',
                      role === 'client'
                        ? 'border-[#6B8EAE] bg-[#6B8EAE]/10'
                        : 'border-gray-300 bg-white'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <User className="h-8 w-8 text-[#1A365D]" />
                    <div className="text-center">
                      <p className="font-semibold text-[#1A365D]">Client</p>
                      <p className="text-xs text-gray-600">Seeking therapy</p>
                    </div>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => setRole('therapist')}
                    className={cn(
                      'flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all',
                      'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#6B8EAE] focus:ring-offset-2',
                      role === 'therapist'
                        ? 'border-[#6B8EAE] bg-[#6B8EAE]/10'
                        : 'border-gray-300 bg-white'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Briefcase className="h-8 w-8 text-[#1A365D]" />
                    <div className="text-center">
                      <p className="font-semibold text-[#1A365D]">Therapist</p>
                      <p className="text-xs text-gray-600">Provide therapy</p>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={fullNameError}
                  required
                  autoComplete="name"
                  disabled={isLoading || authLoading}
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  required
                  autoComplete="email"
                  disabled={isLoading || authLoading}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={passwordError}
                  helperText="Minimum 8 characters with uppercase, lowercase, and number"
                  required
                  autoComplete="new-password"
                  disabled={isLoading || authLoading}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={confirmPasswordError}
                  required
                  autoComplete="new-password"
                  disabled={isLoading || authLoading}
                />
              </div>

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading || authLoading}
                rightIcon={<ArrowRight className="h-5 w-5" />}
                disabled={!role}
              >
                Create Account
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <Link href="/login" className="w-full">
              <Button variant="outline" fullWidth>
                Sign In
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Additional info */}
        <p className="mt-8 text-center text-sm text-gray-600">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-[#6B8EAE] hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-[#6B8EAE] hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </motion.div>
    </div>
  )
}
