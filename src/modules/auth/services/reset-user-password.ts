// Reset user password — Auth Module service
// Ref: ARCHITECTURE.md §5 (Auth Module owns identity),
// SECURITY.md §4.1 (password hashing with fixed work factor),
// PRD.md AUTH-5 (password reset and account recovery flows)
//
// Orchestrates the password reset flow:
// 1. Validates the reset token
// 2. Hashes the new password
// 3. Updates the user's password in the database
// 4. Marks the token as used (single-use enforcement)
//
// Actions → Services → Data → Prisma

import bcrypt from "bcryptjs";

import { BCRYPT_WORK_FACTOR } from "@/lib/auth";
import { updateUserPassword } from "../data/update-user-password";
import {
  validateResetToken,
  markTokenUsed,
} from "../actions/reset-token-store";
import { AppError } from "@/shared/errors/app-error";

export type ResetUserPasswordResult = {
  success: true;
};

/**
 * Resets a user's password using a valid reset token.
 *
 * Validates the token, hashes the new password, updates the database,
 * and marks the token as used — all through the service/data layers.
 * No Prisma access from the calling action.
 *
 * @param token - The reset token from the password reset email
 * @param password - The new password (already validated by Zod in the action)
 * @returns { success: true } on success
 * @throws AppError NOT_FOUND if the token is invalid, expired, or already used
 */
export async function resetUserPassword(
  token: string,
  password: string,
): Promise<ResetUserPasswordResult> {
  // Validate the reset token
  const tokenData = validateResetToken(token);
  if (!tokenData) {
    // SECURITY.md §5.2: generic message to prevent token enumeration
    throw new AppError(
      404,
      "NOT_FOUND",
      "Invalid or expired reset token. Please request a new one.",
    );
  }

  // Hash the new password
  // Ref: SECURITY.md §4.1 (bcrypt with fixed work factor)
  const passwordHash = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

  // Update the user's password — through the data layer
  await updateUserPassword(tokenData.userId, passwordHash);

  // Mark the token as used (single-use enforcement)
  // Ref: SECURITY.md §4.1 (tokens are single-use and time-limited)
  markTokenUsed(token);

  return { success: true };
}
