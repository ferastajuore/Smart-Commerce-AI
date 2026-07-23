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
    <div className="rounded-2xl border border-border bg-surface p-8 shadow-lg">
      <h2 className="mb-2 text-center text-xl font-semibold text-foreground">
        Reset your password
      </h2>
      <p className="mb-6 text-center text-sm text-muted">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>

      <form action={formAction} className="space-y-5">
        {/* Email field */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-muted"
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
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-placeholder transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {/* Success/error message */}
        {state && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              state.success
                ? "bg-accent/20 border border-accent/30 text-accent"
                : "bg-danger/20 border border-danger/30 text-danger"
            }`}
          >
            {state.message}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Sending..." : "Send reset link"}
        </button>
      </form>

      {/* Back to login */}
      <p className="mt-6 text-center text-sm text-muted">
        Remember your password?{" "}
        <a
          href="/login"
          className="font-medium text-accent hover:text-accent-hover transition-colors"
        >
          Sign in
        </a>
      </p>
    </div>
  );
}
