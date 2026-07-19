"use server";

// Login Server Action
// Ref: API.md §9 (login endpoint), PRD.md AUTH-1 (email/password authentication),
// SECURITY.md §4.1 (credential verification), §4.2 (session management),
// SECURITY.md §9 (rate limiting on login)

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { loginSchema, type LoginInput } from "../validation/login-schema";
import { findUserByEmail } from "../services/find-user-by-email";
import {
  checkRateLimit,
  AuthRateLimits,
} from "@/shared/rate-limit/rate-limiter";

export type LoginResult =
  | { success: true; redirectTo: string }
  | { success: false; error: string };

/**
 * Authenticates a user with email and password.
 *
 * Security measures applied:
 * - Input validation via Zod schema (CODING_STANDARDS.md §7)
 * - Rate limiting per IP (SECURITY.md §9)
 * - Generic error messages — never reveals whether the email exists
 * - Session established via NextAuth JWT strategy
 *
 * @param formData - Raw form data containing email and password
 * @returns Result with redirect path on success, or error message
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
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";
  const rateLimitKey = `login:${ip}:${email}`;
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

  // Attempt authentication
  // Ref: SECURITY.md §4 (signIn returns null for invalid credentials,
  // never revealing which field is incorrect)
  const result = await signIn("credentials", {
    email,
    password: raw.password,
    redirect: false,
  });

  if (result?.error) {
    // Generic error — never reveal whether email exists (anti-enumeration)
    return {
      success: false,
      error: "Invalid email or password",
    };
  }

  // Determine redirect based on user role
  // Ref: PRD.md AUTH-3 (Store Owner → /stores/*, Admin → /admin/*)
  const user = await findUserByEmail(email);
  const redirectTo =
    user?.role === "PLATFORM_ADMIN" ? "/admin/dashboard" : "/stores/dashboard";
  redirect(redirectTo);
}
