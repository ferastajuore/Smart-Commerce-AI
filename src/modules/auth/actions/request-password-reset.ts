"use server";

// Request Password Reset Server Action
// Ref: PRD.md AUTH-5 (password reset and account recovery flows),
// SECURITY.md §9 (rate limiting on requestPasswordReset),
// API.md §9 (requestPasswordReset endpoint)
//
// Security measures:
// - Never reveals whether the email exists (anti-enumeration)
// - Rate limited per email and per IP
// - Generates a single-use, time-limited reset token

import { headers } from "next/headers";

import {
  requestPasswordResetSchema,
  type RequestPasswordResetInput,
} from "../validation/password-reset-schema";
import { findUserByEmail } from "../services/find-user-by-email";
import {
  checkRateLimit,
  AuthRateLimits,
} from "@/shared/rate-limit/rate-limiter";
import { createResetToken } from "./reset-token-store";

export type RequestPasswordResetResult = {
  success: boolean;
  message: string;
};

/**
 * Initiates a password reset flow.
 *
 * Always returns success to prevent email enumeration.
 * The actual email sending is not implemented in MVP — the token
 * is stored in-memory for the reset-password action to consume.
 *
 * @param _prevState - Previous form state (React useActionState pattern)
 * @param formData - Raw form data containing email
 */
export async function requestPasswordReset(
  _prevState: RequestPasswordResetResult | null,
  formData: FormData,
): Promise<RequestPasswordResetResult> {
  const raw: RequestPasswordResetInput = {
    email: String(formData.get("email") ?? ""),
  };

  const parsed = requestPasswordResetSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false, message: firstError };
  }

  const { email } = parsed.data;

  // Rate limiting
  // Ref: SECURITY.md §9 (per account + per IP)
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";
  const rateLimitKey = `passwordReset:${ip}:${email}`;
  const rateLimitResult = checkRateLimit(
    rateLimitKey,
    AuthRateLimits.passwordReset,
  );

  if (!rateLimitResult.allowed) {
    return {
      success: false,
      message: "Too many requests. Please try again later.",
    };
  }

  // Look up user — but always return the same message
  // SECURITY.md §4: never reveal whether email exists
  const user = await findUserByEmail(email);

  if (user) {
    // Generate a cryptographically secure reset token
    const token = createResetToken(user.id);

    // In production, send email with token.
    // For MVP, the token is available for testing/development.
    console.log(`[DEV] Password reset token for ${email}: ${token}`);
  }

  // Always return the same message regardless of whether user exists
  return {
    success: true,
    message:
      "If an account exists with that email, a password reset link has been sent.",
  };
}
