"use server";

// Reset Password Server Action
// Ref: PRD.md AUTH-5 (password reset and account recovery flows),
// SECURITY.md §4.1 (password hashing)
//
// Validates the reset token, hashes the new password,
// updates the user record, and marks the token as used.

import bcrypt from "bcryptjs";

import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "../validation/password-reset-schema";
import { BCRYPT_WORK_FACTOR } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateResetToken, markTokenUsed } from "./reset-token-store";

export type ResetPasswordResult = {
  success: boolean;
  message: string;
};

/**
 * Resets a user's password using a valid reset token.
 *
 * @param _prevState - Previous form state (React useActionState pattern)
 * @param formData - Raw form data containing token, password, confirmPassword
 */
export async function resetPassword(
  _prevState: ResetPasswordResult | null,
  formData: FormData,
): Promise<ResetPasswordResult> {
  const raw: ResetPasswordInput = {
    token: String(formData.get("token") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };

  const parsed = resetPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false, message: firstError };
  }

  const { token, password } = parsed.data;

  // Validate the reset token
  const tokenData = validateResetToken(token);
  if (!tokenData) {
    return {
      success: false,
      message: "Invalid or expired reset token. Please request a new one.",
    };
  }

  // Hash the new password
  // Ref: SECURITY.md §4.1 (bcrypt with fixed work factor)
  const passwordHash = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

  // Update the user's password
  await prisma.user.update({
    where: { id: tokenData.userId },
    data: { passwordHash },
  });

  // Mark the token as used (single-use)
  markTokenUsed(token);

  return {
    success: true,
    message:
      "Password reset successfully. You can now sign in with your new password.",
  };
}
