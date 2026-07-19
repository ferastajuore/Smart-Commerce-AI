// Reset Password page
// Ref: PRD.md AUTH-5 (password reset and account recovery flows),
// FOLDER_STRUCTURE.md §4 (app/(auth)/reset-password/)
//
// Receives a token via query parameter, validates it,
// and allows the user to set a new password.

"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  resetPassword,
  type ResetPasswordResult,
} from "@/modules/auth/actions/reset-password";

const initialState: ResetPasswordResult | null = null;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [state, formAction, isPending] = useActionState(
    resetPassword,
    initialState,
  );

  if (!token) {
    return (
      <div className="rounded-2xl border border-white/7 bg-surface-container p-8 shadow-lg">
        <h2 className="mb-4 text-center text-xl font-semibold text-on-surface">
          Invalid reset link
        </h2>
        <p className="mb-6 text-center text-sm text-on-surface-variant">
          This password reset link is invalid or missing a token. Please request
          a new one.
        </p>
        <a
          href="/forgot-password"
          className="block w-full rounded-xl bg-primary py-3 text-center text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
        >
          Request new reset link
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/7 bg-surface-container p-8 shadow-lg">
      <h2 className="mb-2 text-center text-xl font-semibold text-on-surface">
        Set new password
      </h2>
      <p className="mb-6 text-center text-sm text-on-surface-variant">
        Enter your new password below.
      </p>

      <form action={formAction} className="space-y-5">
        {/* Hidden token field */}
        <input type="hidden" name="token" value={token} />

        {/* New password field */}
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-on-surface-variant"
          >
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="At least 8 characters"
            minLength={8}
            className="w-full rounded-xl border border-white/7 bg-surface-container-low px-4 py-3 text-on-surface placeholder:text-outline transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Confirm password field */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-on-surface-variant"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Re-enter your password"
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
          {isPending ? "Resetting..." : "Reset password"}
        </button>
      </form>

      {/* Back to login */}
      <p className="mt-6 text-center text-sm text-on-surface-variant">
        <a
          href="/login"
          className="font-medium text-primary hover:text-primary-container transition-colors"
        >
          Back to sign in
        </a>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-white/7 bg-surface-container p-8 shadow-lg">
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
