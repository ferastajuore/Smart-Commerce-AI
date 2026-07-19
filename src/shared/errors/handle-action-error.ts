// AppError handling utility for Server Actions
// Ref: CODING_STANDARDS.md §6 (error handling in code),
// AGENTS.md §10 (Error Handling Principles: fail loudly,
// never silently ignore business errors, log unexpected failures),
// API.md §9 (standard error codes and response shape),
// ARCHITECTURE.md §5 (AppError is the single shared error class)
//
// This utility converts AppError instances into proper application
// responses instead of generic 500 errors. It is the single error
// handling entry point for all Server Actions.
//
// Rules:
// - AppError instances produce the correct status code and message
// - Unexpected errors are logged and return a generic INTERNAL_ERROR
// - No stack traces or internal details leak to the caller
// - No second error system is introduced — AppError is reused

import { AppError } from "./app-error";

/**
 * Standardized error response returned by Server Actions.
 * Ref: API.md §9 (error response shape)
 */
export interface ActionErrorResponse {
  success: false;
  error: string;
  code: string;
  status: number;
}

/**
 * Handles errors thrown by service-layer functions within Server Actions.
 *
 * Converts AppError instances into structured error responses with the
 * correct HTTP status code and error code. Unexpected errors are logged
 * and returned as generic INTERNAL_ERROR — never leaking implementation
 * details to the caller.
 *
 * Ref: AGENTS.md §10 (log unexpected failures),
 * CODING_STANDARDS.md §6 (no soft failure values)
 *
 * @param error - The caught error from a service-layer call
 * @returns A structured error response for the Server Action to return
 */
export function handleActionError(error: unknown): ActionErrorResponse {
  if (error instanceof AppError) {
    // AppError: expected business-rule failure
    // Return the correct status, code, and message
    return {
      success: false,
      error: error.message,
      code: error.code,
      status: error.status,
    };
  }

  // Unexpected error: log the full details for debugging,
  // but return a generic message to the caller.
  // Ref: AGENTS.md §10 ("log unexpected failures"),
  // never leak stack traces or internal messages
  // Ref: CODING_STANDARDS.md §6 ("log them with full detail
  // and returns a generic INTERNAL_ERROR")
  console.error("[Unexpected Error]", error);

  return {
    success: false,
    error: "An unexpected error occurred. Please try again later.",
    code: "INTERNAL_ERROR",
    status: 500,
  };
}
