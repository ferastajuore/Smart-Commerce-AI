// Password reset token management
// Ref: SECURITY.md §4.1 (tokens are single-use and time-limited),
// PRD.md AUTH-5 (password reset and account recovery flows)
//
// In-memory token store for MVP (single-VPS).
// Each token: { userId, expiresAt, used }
// NOT a Server Action — pure utility functions.

import crypto from "crypto";

interface ResetTokenEntry {
  userId: string;
  expiresAt: number;
  used: boolean;
}

const resetTokens = new Map<string, ResetTokenEntry>();

const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

/**
 * Creates a new password reset token for a user.
 * Returns the raw token string (to be sent via email in production).
 */
export function createResetToken(userId: string): string {
  const token = crypto.randomBytes(32).toString("hex");

  resetTokens.set(token, {
    userId,
    expiresAt: Date.now() + TOKEN_EXPIRY_MS,
    used: false,
  });

  return token;
}

/**
 * Validates and retrieves a reset token.
 * Returns the userId if valid, null if invalid/expired/used.
 */
export function validateResetToken(
  token: string,
): { userId: string } | null {
  const entry = resetTokens.get(token);
  if (!entry) return null;
  if (entry.used) return null;
  if (Date.now() > entry.expiresAt) {
    resetTokens.delete(token);
    return null;
  }
  return { userId: entry.userId };
}

/**
 * Marks a reset token as used (single-use enforcement).
 */
export function markTokenUsed(token: string): void {
  const entry = resetTokens.get(token);
  if (entry) {
    entry.used = true;
  }
}
