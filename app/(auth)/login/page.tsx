/**
 * Login Page
 * 
 * User authentication page with email/password login.
 * Follows constitution.md UX flows and design standards.
 * 
 * Features:
 * - Email and password validation
 * - Loading states
 * - Error handling
 * - Remember me option
 * - Link to signup and password reset
 * - Automatic redirect after successful login
 */

'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '@/lib/hooks'
import { useToast } from '@/components/ui/toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { validateEmail } from '@/lib/utils/validation'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || null
  const { signIn, isLoading: authLoading } = useAuth()
  const { addToast } = useToast()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [emailError, setEmailError] = React.useState('')
  const [passwordError, setPasswordError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  // Handle form validation
  const validateForm = (): boolean => {
    let isValid = true

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
    if (!password) {
      setPasswordError('Password is required')
      isValid = false
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      isValid = false
    } else {
      setPasswordError('')
    }

    return isValid
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        addToast({
          type: 'error',
          title: 'Login failed',
          description: error,
        })
      } else {
        addToast({
          type: 'success',
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        })

        // Redirect will be handled by useAuth hook
        // Or manually redirect to specified path
        if (redirectPath) {
          router.push(redirectPath)
        }
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
        className="w-full max-w-md"
      >
        <Card variant="glass">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your Associated Psych account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                required
                autoComplete="current-password"
                disabled={isLoading || authLoading}
              />

              <div className="flex items-center justify-between text-sm">
                <Link
                  href="/reset-password"
                  className="text-[#6B8EAE] hover:text-[#1A365D] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading || authLoading}
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Sign In
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
                  Don't have an account?
                </span>
              </div>
            </div>

            <Link href="/signup" className="w-full">
              <Button variant="outline" fullWidth>
                Create Account
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Additional info */}
        <p className="mt-8 text-center text-sm text-gray-600">
          By signing in, you agree to our{' '}
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
