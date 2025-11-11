/**
 * Validation Utilities
 * 
 * Common validation functions for form inputs and data.
 * All validation logic should be defined here for consistency.
 */

import { VALIDATION } from '@/lib/constants/config'

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }

  if (email.length > VALIDATION.MAX_EMAIL_LENGTH) {
    return { isValid: false, error: 'Email is too long' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' }
  }

  return { isValid: true }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }

  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`,
    }
  }

  if (password.length > VALIDATION.MAX_PASSWORD_LENGTH) {
    return { isValid: false, error: 'Password is too long' }
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter',
    }
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter',
    }
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number',
    }
  }

  return { isValid: true }
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' }
  }

  if (!VALIDATION.PHONE_REGEX.test(phone)) {
    return { isValid: false, error: 'Invalid phone number format' }
  }

  return { isValid: true }
}

/**
 * Validate required field
 */
export function validateRequired(value: string | null | undefined, fieldName: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required` }
  }

  return { isValid: true }
}

/**
 * Validate string length
 */
export function validateLength(
  value: string,
  fieldName: string,
  min?: number,
  max?: number
): ValidationResult {
  if (min !== undefined && value.length < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min} characters`,
    }
  }

  if (max !== undefined && value.length > max) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${max} characters`,
    }
  }

  return { isValid: true }
}

/**
 * Validate bio/description
 */
export function validateBio(bio: string): ValidationResult {
  const requiredCheck = validateRequired(bio, 'Bio')
  if (!requiredCheck.isValid) {
    return requiredCheck
  }

  return validateLength(bio, 'Bio', VALIDATION.MIN_BIO_LENGTH, VALIDATION.MAX_BIO_LENGTH)
}

/**
 * Validate name
 */
export function validateName(name: string, fieldName: string = 'Name'): ValidationResult {
  const requiredCheck = validateRequired(name, fieldName)
  if (!requiredCheck.isValid) {
    return requiredCheck
  }

  return validateLength(name, fieldName, 2, VALIDATION.MAX_NAME_LENGTH)
}

/**
 * Validate US state code
 */
export function validateState(state: string): ValidationResult {
  if (!state) {
    return { isValid: false, error: 'State is required' }
  }

  if (!VALIDATION.US_STATES.includes(state as never)) {
    return { isValid: false, error: 'Invalid state code' }
  }

  return { isValid: true }
}

/**
 * Validate license number
 */
export function validateLicenseNumber(licenseNumber: string): ValidationResult {
  const requiredCheck = validateRequired(licenseNumber, 'License number')
  if (!requiredCheck.isValid) {
    return requiredCheck
  }

  // Basic validation - alphanumeric with hyphens
  if (!/^[A-Z0-9-]+$/i.test(licenseNumber)) {
    return {
      isValid: false,
      error: 'License number can only contain letters, numbers, and hyphens',
    }
  }

  return { isValid: true }
}

/**
 * Validate URL
 */
export function validateUrl(url: string, fieldName: string = 'URL'): ValidationResult {
  if (!url) {
    return { isValid: true } // URL is optional
  }

  try {
    new URL(url)
    return { isValid: true }
  } catch {
    return { isValid: false, error: `${fieldName} must be a valid URL` }
  }
}

/**
 * Validate number range
 */
export function validateNumberRange(
  value: number,
  fieldName: string,
  min?: number,
  max?: number
): ValidationResult {
  if (min !== undefined && value < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min}`,
    }
  }

  if (max !== undefined && value > max) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${max}`,
    }
  }

  return { isValid: true }
}

/**
 * Validate rate/price
 */
export function validateRate(rate: number): ValidationResult {
  return validateNumberRange(rate, 'Rate', 0, 10000)
}

/**
 * Validate years of experience
 */
export function validateYearsExperience(years: number): ValidationResult {
  return validateNumberRange(years, 'Years of experience', 0, 70)
}

/**
 * Validate age (for date of birth)
 */
export function validateAge(dateOfBirth: Date | string): ValidationResult {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth
  const today = new Date()
  const age = today.getFullYear() - dob.getFullYear()

  if (age < 18) {
    return {
      isValid: false,
      error: 'You must be at least 18 years old',
    }
  }

  if (age > 120) {
    return {
      isValid: false,
      error: 'Invalid date of birth',
    }
  }

  return { isValid: true }
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSize: number): ValidationResult {
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1)
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    }
  }

  return { isValid: true }
}

/**
 * Validate file type
 */
export function validateFileType(file: File, acceptedTypes: string[]): ValidationResult {
  if (!acceptedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not accepted`,
    }
  }

  return { isValid: true }
}

/**
 * Validate array is not empty
 */
export function validateArrayNotEmpty<T>(
  array: T[],
  fieldName: string
): ValidationResult {
  if (!array || array.length === 0) {
    return {
      isValid: false,
      error: `At least one ${fieldName} must be selected`,
    }
  }

  return { isValid: true }
}

/**
 * Validate timezone
 */
export function validateTimezone(timezone: string): ValidationResult {
  if (!timezone) {
    return { isValid: false, error: 'Timezone is required' }
  }

  // Try to format a date with the timezone
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone })
    return { isValid: true }
  } catch {
    return { isValid: false, error: 'Invalid timezone' }
  }
}

/**
 * Batch validation helper
 * Returns all errors from multiple validations
 */
export function validateMultiple(
  validations: Array<{ field: string; result: ValidationResult }>
): Record<string, string> {
  const errors: Record<string, string> = {}

  validations.forEach(({ field, result }) => {
    if (!result.isValid && result.error) {
      errors[field] = result.error
    }
  })

  return errors
}

/**
 * Check if validation errors object is empty
 */
export function hasErrors(errors: Record<string, string | string[]>): boolean {
  return Object.keys(errors).length > 0
}

/**
 * Get first error message from errors object
 */
export function getFirstError(errors: Record<string, string | string[]>): string | undefined {
  const firstKey = Object.keys(errors)[0]
  if (!firstKey) return undefined

  const error = errors[firstKey]
  return Array.isArray(error) ? error[0] : error
}
