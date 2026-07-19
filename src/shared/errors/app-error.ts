// Shared application error class
// Ref: CODING_STANDARDS.md §6, API.md §9 (error codes)
//
// Every module throws AppError for expected business-rule failures.
// Unexpected failures propagate to a top-level handler that logs them
// and returns a generic INTERNAL_ERROR (AGENTS.md §10 Error Handling Principles).

export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AppError";
  }
}

// HTTP status code mapping for API.md §9 error codes
export const ErrorStatus = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  AI_CONVERSATION_LIMIT_REACHED: 429,
  CONFLICT: 409,
  INSUFFICIENT_STOCK: 409,
  INTERNAL_ERROR: 500,
} as const;

// Standardized API error response shape
// Ref: API.md §9
export interface ApiErrorResponse {
  error: {
    status: string;
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
