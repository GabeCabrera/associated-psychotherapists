/**
 * Date Utilities
 * 
 * Common date formatting and manipulation functions.
 * Uses native JavaScript Date API for simplicity.
 */

/**
 * Format a date to a readable string
 * @example formatDate(new Date('2025-11-10')) => "November 10, 2025"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * Format a date to short format
 * @example formatDateShort(new Date('2025-11-10')) => "Nov 10, 2025"
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

/**
 * Format a time to 12-hour format
 * @example formatTime(new Date('2025-11-10T14:30:00')) => "2:30 PM"
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d)
}

/**
 * Format a date and time
 * @example formatDateTime(new Date('2025-11-10T14:30:00')) => "November 10, 2025 at 2:30 PM"
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return `${formatDate(d)} at ${formatTime(d)}`
}

/**
 * Format a date and time to short format
 * @example formatDateTimeShort(new Date('2025-11-10T14:30:00')) => "Nov 10, 2025, 2:30 PM"
 */
export function formatDateTimeShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d)
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = d.getTime() - now.getTime()
  const diffSeconds = Math.floor(Math.abs(diffMs) / 1000)
  const isPast = diffMs < 0

  if (diffSeconds < 60) {
    return isPast ? 'just now' : 'in a moment'
  }

  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) {
    const word = diffMinutes === 1 ? 'minute' : 'minutes'
    return isPast ? `${diffMinutes} ${word} ago` : `in ${diffMinutes} ${word}`
  }

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) {
    const word = diffHours === 1 ? 'hour' : 'hours'
    return isPast ? `${diffHours} ${word} ago` : `in ${diffHours} ${word}`
  }

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) {
    const word = diffDays === 1 ? 'day' : 'days'
    return isPast ? `${diffDays} ${word} ago` : `in ${diffDays} ${word}`
  }

  const diffWeeks = Math.floor(diffDays / 7)
  if (diffWeeks < 4) {
    const word = diffWeeks === 1 ? 'week' : 'weeks'
    return isPast ? `${diffWeeks} ${word} ago` : `in ${diffWeeks} ${word}`
  }

  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) {
    const word = diffMonths === 1 ? 'month' : 'months'
    return isPast ? `${diffMonths} ${word} ago` : `in ${diffMonths} ${word}`
  }

  const diffYears = Math.floor(diffDays / 365)
  const word = diffYears === 1 ? 'year' : 'years'
  return isPast ? `${diffYears} ${word} ago` : `in ${diffYears} ${word}`
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  return d < new Date()
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  return d > new Date()
}

/**
 * Add days to a date
 */
export function addDays(date: Date | string, days: number): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

/**
 * Add hours to a date
 */
export function addHours(date: Date | string, hours: number): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date)
  d.setHours(d.getHours() + hours)
  return d
}

/**
 * Add minutes to a date
 */
export function addMinutes(date: Date | string, minutes: number): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date)
  d.setMinutes(d.getMinutes() + minutes)
  return d
}

/**
 * Get the start of day for a date
 */
export function startOfDay(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get the end of day for a date
 */
export function endOfDay(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * Convert date to ISO string for database storage
 */
export function toISOString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString()
}

/**
 * Parse ISO string from database to Date
 */
export function fromISOString(isoString: string): Date {
  return new Date(isoString)
}

/**
 * Get day of week name
 * @example getDayOfWeek(new Date('2025-11-10')) => "Monday"
 */
export function getDayOfWeek(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(d)
}

/**
 * Get short day of week name
 * @example getDayOfWeekShort(new Date('2025-11-10')) => "Mon"
 */
export function getDayOfWeekShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d)
}

/**
 * Get month name
 * @example getMonthName(new Date('2025-11-10')) => "November"
 */
export function getMonthName(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(d)
}

/**
 * Format a date range
 * @example formatDateRange(new Date('2025-11-10'), new Date('2025-11-12')) => "November 10 - 12, 2025"
 */
export function formatDateRange(startDate: Date | string, endDate: Date | string): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate

  // Same day
  if (
    start.getDate() === end.getDate() &&
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return formatDate(start)
  }

  // Same month and year
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    const monthYear = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(start)
    return `${monthYear} ${start.getDate()} - ${end.getDate()}`
  }

  // Different months or years
  return `${formatDate(start)} - ${formatDate(end)}`
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: Date | string): number {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  
  return age
}

/**
 * Get time zone abbreviation
 * @example getTimezone() => "EST" or "PST"
 */
export function getTimezone(): string {
  const date = new Date()
  const timeZoneString = date.toLocaleTimeString('en-US', { timeZoneName: 'short' })
  return timeZoneString.split(' ')[2] || 'UTC'
}

/**
 * Convert date to specific timezone
 */
export function toTimezone(date: Date | string, timezone: string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: timezone,
  }).format(d)
}
