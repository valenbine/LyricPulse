export type ApiErrorPayload = {
  code: string
  message: string
  details?: unknown
}

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function createErrorPayload(error: ApiError): ApiErrorPayload {
  return {
    code: error.code,
    message: error.message,
    ...(error.details === undefined ? {} : { details: error.details })
  }
}
