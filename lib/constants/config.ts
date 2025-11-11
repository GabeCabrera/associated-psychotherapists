/**
 * Application Configuration Constants
 * 
 * Centralized configuration values for the Associated Psych Platform.
 * All magic numbers and configuration strings should be defined here.
 */

/**
 * Brand colors from constitution.md Section IV.1
 */
export const COLORS = {
  BACKGROUND: '#E6EEF5',
  PRIMARY: '#1A365D',
  ACCENT: '#6B8EAE',
  WHITE_SPACE: '#F7FAFC',
  TEXT: '#2D3748',
} as const

/**
 * Typography settings from constitution.md
 */
export const TYPOGRAPHY = {
  HEADING: 'Inter',
  BODY: 'Lato',
  BUTTON: 'Nunito Sans',
} as const

/**
 * Motion settings from constitution.md
 */
export const MOTION = {
  DURATION_FAST: 200,
  DURATION_NORMAL: 300,
  EASING: 'ease-in-out',
} as const

/**
 * Session configuration
 */
export const SESSION = {
  DEFAULT_DURATION: 50, // minutes
  MIN_DURATION: 30,
  MAX_DURATION: 120,
  CANCELLATION_HOURS: 24, // hours before session that cancellation is allowed
  REMINDER_HOURS: [24, 1], // hours before session to send reminders
  SESSION_TYPES: ['video', 'phone', 'in-person'] as const,
} as const

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 20,
  MAX_PER_PAGE: 100,
  MIN_PER_PAGE: 1,
} as const

/**
 * File upload limits
 */
export const FILE_UPLOAD = {
  MAX_AVATAR_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ACCEPTED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
} as const

/**
 * Validation constraints
 */
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_BIO_LENGTH: 50,
  MAX_BIO_LENGTH: 2000,
  MAX_NAME_LENGTH: 255,
  MAX_EMAIL_LENGTH: 255,
  PHONE_REGEX: /^\+?1?\d{10,14}$/,
  US_STATES: [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  ] as const,
} as const

/**
 * Common specializations for therapists
 */
export const SPECIALIZATIONS = [
  'Anxiety',
  'Depression',
  'Trauma and PTSD',
  'Relationship Issues',
  'Family Conflict',
  'Grief and Loss',
  'Stress Management',
  'Life Transitions',
  'Self-Esteem',
  'Anger Management',
  'Addiction',
  'Eating Disorders',
  'LGBTQ+ Issues',
  'Career Counseling',
  'Sleep Disorders',
  'Chronic Pain',
  'Parenting',
  'Child and Adolescent',
  'Couples Therapy',
  'Group Therapy',
] as const

/**
 * Communication preferences
 */
export const COMMUNICATION_PREFERENCES = [
  { value: 'video', label: 'Video Call' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'chat', label: 'Text Chat' },
  { value: 'in-person', label: 'In-Person' },
] as const

/**
 * Session statuses
 */
export const SESSION_STATUSES = [
  { value: 'scheduled', label: 'Scheduled', color: 'blue' },
  { value: 'confirmed', label: 'Confirmed', color: 'green' },
  { value: 'completed', label: 'Completed', color: 'gray' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
  { value: 'no-show', label: 'No Show', color: 'orange' },
] as const

/**
 * Payment statuses
 */
export const PAYMENT_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'paid', label: 'Paid', color: 'green' },
  { value: 'refunded', label: 'Refunded', color: 'gray' },
  { value: 'failed', label: 'Failed', color: 'red' },
] as const

/**
 * Verification statuses
 */
export const VERIFICATION_STATUSES = [
  { value: 'pending', label: 'Pending Review', color: 'yellow' },
  { value: 'verified', label: 'Verified', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
] as const

/**
 * Time zones (common US zones)
 */
export const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
] as const

/**
 * Rate limits
 */
export const RATE_LIMITS = {
  // Requests per minute
  AUTH_LOGIN: 5,
  AUTH_SIGNUP: 3,
  API_GENERAL: 100,
  MESSAGE_SEND: 30,
} as const

/**
 * Auto-logout settings
 */
export const AUTH = {
  SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hour in milliseconds
  REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  PASSWORD_RESET_EXPIRY: 60 * 60 * 1000, // 1 hour in milliseconds
} as const

/**
 * Notification settings
 */
export const NOTIFICATIONS = {
  TOAST_DURATION: 5000, // milliseconds
  SESSION_REMINDER_HOURS: [24, 1], // hours before session
} as const

/**
 * Search and filtering
 */
export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_MS: 300,
  MAX_RESULTS: 50,
} as const

/**
 * Availability settings
 */
export const AVAILABILITY = {
  DAYS_OF_WEEK: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ] as const,
  SLOT_DURATION: 50, // minutes
  MIN_BOOKING_ADVANCE: 2, // hours
  MAX_BOOKING_ADVANCE: 90, // days
} as const

/**
 * Insurance providers (common ones)
 */
export const INSURANCE_PROVIDERS = [
  'Aetna',
  'Blue Cross Blue Shield',
  'Cigna',
  'UnitedHealthcare',
  'Humana',
  'Kaiser Permanente',
  'Medicare',
  'Medicaid',
  'Anthem',
  'Oscar Health',
  'Out of Pocket',
  'Other',
] as const

/**
 * Gender options
 */
export const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Non-binary',
  'Prefer not to say',
  'Other',
] as const

/**
 * Pronoun options
 */
export const PRONOUN_OPTIONS = [
  'he/him',
  'she/her',
  'they/them',
  'ze/zir',
  'prefer not to say',
  'other',
] as const

/**
 * Experience years options
 */
export const EXPERIENCE_YEARS = [
  { value: 1, label: '1-2 years' },
  { value: 3, label: '3-5 years' },
  { value: 6, label: '6-10 years' },
  { value: 11, label: '11-15 years' },
  { value: 16, label: '16-20 years' },
  { value: 21, label: '20+ years' },
] as const

/**
 * Feature flags (for gradual rollouts)
 */
export const FEATURES = {
  ENABLE_MESSAGING: true,
  ENABLE_VIDEO_CALLS: false, // To be implemented later
  ENABLE_GROUP_THERAPY: false, // Future feature
  ENABLE_INSURANCE_BILLING: false, // Future feature
  ENABLE_AI_MATCHING: false, // Future feature
} as const

/**
 * Environment-specific config
 */
export const ENV = {
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_TEST: process.env.NODE_ENV === 'test',
} as const

/**
 * External links
 */
export const EXTERNAL_LINKS = {
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  SUPPORT_EMAIL: 'support@associatedpsych.com',
  HIPAA_NOTICE: '/hipaa-notice',
} as const
