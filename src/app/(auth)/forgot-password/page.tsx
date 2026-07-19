// Forgot Password page
// Ref: PRD.md AUTH-5 (password reset and account recovery flows),
// FOLDER_STRUCTURE.md §4 (app/(auth)/forgot-password/)
//
// SECURITY.md §4: Never reveals whether the email exists.
// Always returns the same success message regardless.

"use client";

import { useActionState } from "react";
import {
  requestPasswordReset,
  type RequestPasswordResetResult,
} from "@/modules/auth/actions/request-password-reset";

const initialState: RequestPasswordResetResult | null = null;

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  return (
    <div className="rounded-2xl border border-white/7 bg-surface-container p-8 shadow-lg">
      <h2 className="mb-2 text-center text-xl font-semibold text-on-surface">
        Reset your password
      </h2>
      <p className="mb-6 text-center text-sm text-on-surface-variant">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>

      <form action={formAction} className="space-y-5">
        {/* Email field */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-on-surface-variant"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/7 bg-surface-container-low px-4 py-3 text-on-surface placeholder:text-outline transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Success/error message */}
        {state && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              state.success
                ? "bg-primary-container/20 border border-primary/30 text-primary"
                : "bg-error-container/20 border border-error/30 text-error"
            }`}
          >
            {state.message}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Sending..." : "Send reset link"}
        </button>
      </form>

      {/* Back to login */}
      <p className="mt-6 text-center text-sm text-on-surface-variant">
        Remember your password?{" "}
        <a
          href="/login"
          className="font-medium text-primary hover:text-primary-container transition-colors"
        >
          Sign in
        </a>
      </p>
    </div>
  );
}
