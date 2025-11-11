/**
 * Password Reset Request Page
 * 
 * User requests password reset via email.
 * Follows constitution.md UX flows and design standards.
 * 
 * Features:
 * - Email validation
 * - Loading states
 * - Success/error handling with toast
 * - Link back to login
 */

'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/lib/hooks'
import { useToast } from '@/components/ui/toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { validateEmail } from '@/lib/utils/validation'

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const { addToast } = useToast()

  const [email, setEmail] = React.useState('')
  const [emailError, setEmailError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  // Handle form validation
  const validateForm = (): boolean => {
    if (!email) {
      setEmailError('Email is required')
      return false
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    
    setEmailError('')
    return true
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await resetPassword(email)

      if (error) {
        addToast({
          type: 'error',
          title: 'Reset failed',
          description: error,
        })
      } else {
        setIsSuccess(true)
        addToast({
          type: 'success',
          title: 'Email sent!',
          description: 'Check your inbox for password reset instructions.',
        })
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

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#E6EEF5] px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card variant="glass">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>
                We've sent password reset instructions to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-center text-gray-600">
                Click the link in the email to reset your password. If you don't see the
                email, check your spam folder.
              </p>
            </CardContent>

            <CardFooter>
              <Link href="/login" className="w-full">
                <Button variant="primary" fullWidth>
                  Back to Login
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    )
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
            <CardTitle className="text-3xl">Reset Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password
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
                disabled={isLoading}
              />

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Send Reset Link
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <Link href="/login" className="w-full">
              <Button
                variant="ghost"
                fullWidth
                leftIcon={<ArrowLeft className="h-5 w-5" />}
              >
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
