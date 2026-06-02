/**
 * @file src/lib/api-response.ts
 * @description Utility helpers untuk membuat response API yang konsisten.
 *              Semua API routes menggunakan helper ini agar format response seragam.
 */

/** Standard API success response shape */
export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
}

/** Standard API error response shape */
export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

/**
 * Create a standardized JSON success response.
 *
 * @param data - The response payload
 * @param status - HTTP status code (default 200)
 * @param meta - Optional pagination metadata
 * @returns A `Response` object with JSON body
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  meta?: ApiSuccessResponse['meta']
): Response {
  const body: ApiSuccessResponse<T> = { success: true, data }
  if (meta) body.meta = meta

  return Response.json(body, { status })
}

/**
 * Create a standardized JSON error response.
 *
 * @param code - Machine-readable error code (e.g. 'NOT_FOUND', 'VALIDATION_ERROR')
 * @param message - Human-readable error message
 * @param status - HTTP status code (default 400)
 * @param details - Optional extra error details (e.g. field-level validation errors)
 * @returns A `Response` object with JSON body
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: unknown
): Response {
  const body: ApiErrorResponse = {
    success: false,
    error: { code, message },
  }
  if (details) body.error.details = details

  return Response.json(body, { status })
}

/**
 * Wraps an async route handler with try/catch error handling.
 * Catches unexpected errors and returns a 500 response.
 *
 * @param handler - The async route handler function
 * @returns A wrapped handler that catches errors
 */
export function withErrorHandler(
  handler: (request: Request, context?: any) => Promise<Response>
) {
  return async (request: Request, context?: any): Promise<Response> => {
    try {
      return await handler(request, context)
    } catch (error) {
      console.error('[API Error]', error)

      const message =
        error instanceof Error ? error.message : 'An unexpected error occurred'

      return errorResponse('INTERNAL_SERVER_ERROR', message, 500)
    }
  }
}
