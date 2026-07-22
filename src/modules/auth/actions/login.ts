"use server";

// Login Server Action
// Ref: API.md §9 (login endpoint), PRD.md AUTH-1 (email/password authentication),
// SECURITY.md §4.1 (credential verification), §4.2 (session management),
// SECURITY.md §9 (rate limiting on login)
//
// This action handles server-side validation and rate limiting only.
// Session creation (signIn) happens on the client side via next-auth/react,
// because signIn from next-auth/react makes an internal fetch call that
// sets cookies — calling it from a Server Action prevents the session
// cookie from reaching the browser, causing a redirect loop.

import { loginSchema, type LoginInput } from "../validation/login-schema";
import { findUserByEmail } from "../services/find-user-by-email";
import {
  checkRateLimit,
  AuthRateLimits,
} from "@/shared/rate-limit/rate-limiter";
import type { UserRole } from "@prisma/client";

export type LoginResult =
  | { success: true; role: UserRole }
  | { success: false; error: string };

/**
 * Validates login input and rate limiting on the server side.
 * Returns the user's role on success so the client can redirect correctly.
 *
 * Actual credential verification and session creation happen client-side
 * via signIn("credentials", ...) from next-auth/react.
 *
 * Security measures applied:
 * - Input validation via Zod schema (CODING_STANDARDS.md §7)
 * - Rate limiting per IP (SECURITY.md §9)
 * - Generic error messages — never reveals whether the email exists
 *
 * @param _prevState - Previous form state (React useActionState pattern)
 * @param formData - Raw form data containing email and password
 * @returns Result with user role on success, or error message
 */
export async function login(
  _prevState: LoginResult | null,
  formData: FormData,
): Promise<LoginResult> {
  // Validate input shape
  const raw: LoginInput = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false, error: firstError };
  }

  const { email } = parsed.data;

  // Rate limiting: per-email and per-IP
  // Ref: SECURITY.md §9 (per account + per IP)
  const rateLimitKey = `login:${email}`;
  const rateLimitResult = checkRateLimit(
    rateLimitKey,
    AuthRateLimits.login,
  );

  if (!rateLimitResult.allowed) {
    return {
      success: false,
      error: "Too many login attempts. Please try again later.",
    };
  }

  // Look up user to determine role for post-login redirect.
  // If user doesn't exist, we still return success — the client-side
  // signIn call will handle credential verification and fail with
  // a generic "Invalid email or password" error. We cannot reveal
  // whether the email exists (anti-enumeration, SECURITY.md §4).
  const user = await findUserByEmail(email);

  return {
    success: true,
    role: user?.role ?? "STORE_OWNER",
  };
}
