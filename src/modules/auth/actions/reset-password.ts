"use server";

// Reset Password Server Action
// Ref: PRD.md AUTH-5 (password reset and account recovery flows),
// SECURITY.md §4.1 (password hashing)
//
// Validates the reset token, hashes the new password,
// updates the user record, and marks the token as used.
//
// Architecture: Actions → Services → Data → Prisma
// This action does NOT access Prisma directly — all database
// operations go through the service and data layers.

import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "../validation/password-reset-schema";
import { resetUserPassword } from "../services/reset-user-password";
import { handleActionError } from "@/shared/errors/handle-action-error";

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

  try {
    // Delegate to the service layer — no Prisma access here
    await resetUserPassword(token, password);

    return {
      success: true,
      message:
        "Password reset successfully. You can now sign in with your new password.",
    };
  } catch (error) {
    // Ref: CODING_STANDARDS.md §6 (handle AppError with correct response)
    const { error: message } = handleActionError(error);
    return { success: false, message };
  }
}
