/**
 * API Client Wrapper
 * 
 * Provides a consistent interface for making API requests with error handling,
 * standardized response format, and TypeScript types.
 * 
 * All API responses follow the standard format defined in clarifications.md Section 5.
 */

/**
 * Standard API response types
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
  meta?: {
    page?: number
    perPage?: number
    total?: number
    totalPages?: number
    hasNext?: boolean
    hasPrev?: boolean
  }
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, string[]>
  }
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

/**
 * API Error class for better error handling
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, string[]>,
    public status?: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Request options interface
 */
interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

/**
 * Build URL with query parameters
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(endpoint, window.location.origin)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })
  }
  
  return url.toString()
}

/**
 * Base API request function with error handling
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options
  
  const url = buildUrl(endpoint, params)
  
  // Default headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  }
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })
    
    // Parse response JSON
    const data: ApiResponse<T> = await response.json()
    
    // Check if response is successful
    if (!response.ok || !data.success) {
      const errorData = data as ApiErrorResponse
      throw new ApiError(
        errorData.error.code,
        errorData.error.message,
        errorData.error.details,
        response.status
      )
    }
    
    // Return the data payload
    const successData = data as ApiSuccessResponse<T>
    return successData.data
  } catch (error) {
    // Re-throw ApiError as is
    if (error instanceof ApiError) {
      throw error
    }
    
    // Handle network errors
    if (error instanceof TypeError) {
      throw new ApiError(
        'NETWORK_ERROR',
        'Unable to connect to the server. Please check your internet connection.',
        undefined,
        0
      )
    }
    
    // Handle unexpected errors
    throw new ApiError(
      'UNKNOWN_ERROR',
      'An unexpected error occurred. Please try again.',
      undefined,
      500
    )
  }
}

/**
 * API client methods
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean>) =>
    request<T>(endpoint, { method: 'GET', params }),

  /**
   * POST request
   */
  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),
}

/**
 * Helper function to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

/**
 * Helper function to get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Helper function to get field-specific errors for forms
 */
export function getFieldErrors(error: unknown): Record<string, string[]> | undefined {
  if (isApiError(error)) {
    return error.details
  }
  return undefined
}

/**
 * Server-side API helper for Next.js API routes
 * Creates standardized success and error responses
 */
export const apiResponse = {
  /**
   * Success response
   */
  success: <T>(
    data: T,
    meta?: {
      page?: number
      perPage?: number
      total?: number
      totalPages?: number
      hasNext?: boolean
      hasPrev?: boolean
    }
  ): ApiSuccessResponse<T> => ({
    success: true,
    data,
    ...(meta && { meta }),
  }),

  /**
   * Error response
   */
  error: (
    code: string,
    message: string,
    details?: Record<string, string[]>
  ): ApiErrorResponse => ({
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  }),

  /**
   * Validation error response
   */
  validationError: (
    message: string,
    details: Record<string, string[]>
  ): ApiErrorResponse => ({
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message,
      details,
    },
  }),

  /**
   * Unauthorized error
   */
  unauthorized: (message: string = 'You must be logged in to perform this action'): ApiErrorResponse => ({
    success: false,
    error: {
      code: 'UNAUTHORIZED',
      message,
    },
  }),

  /**
   * Forbidden error
   */
  forbidden: (message: string = 'You do not have permission to perform this action'): ApiErrorResponse => ({
    success: false,
    error: {
      code: 'FORBIDDEN',
      message,
    },
  }),

  /**
   * Not found error
   */
  notFound: (message: string = 'The requested resource was not found'): ApiErrorResponse => ({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message,
    },
  }),

  /**
   * Internal server error
   */
  serverError: (message: string = 'An internal server error occurred'): ApiErrorResponse => ({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message,
    },
  }),
}

/**
 * Pagination helper
 */
export interface PaginationParams {
  page?: number
  perPage?: number
  sortBy?: string
  order?: 'asc' | 'desc'
}

export function getPaginationParams(searchParams: URLSearchParams): Required<PaginationParams> {
  return {
    page: parseInt(searchParams.get('page') || '1', 10),
    perPage: parseInt(searchParams.get('perPage') || '20', 10),
    sortBy: searchParams.get('sortBy') || 'created_at',
    order: (searchParams.get('order') || 'desc') as 'asc' | 'desc',
  }
}

export function calculatePaginationMeta(
  page: number,
  perPage: number,
  total: number
) {
  const totalPages = Math.ceil(total / perPage)
  return {
    page,
    perPage,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}
