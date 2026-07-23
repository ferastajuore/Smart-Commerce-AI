"use client";

import { useActionState } from "react";
import {
  registerStore,
  type RegisterStoreResult,
} from "@/modules/auth/actions/register-store";

const initialState: RegisterStoreResult | null = null;

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    registerStore,
    initialState,
  );

  return (
    <div className="rounded-2xl border border-border bg-surface p-8 shadow-lg">
      <h2 className="mb-2 text-center text-xl font-semibold text-foreground">
        Register your store
      </h2>
      <p className="mb-6 text-center text-sm text-muted">
        Create your account and start your 14-day free trial.
      </p>

      <form action={formAction} className="space-y-4">
        {/* Business Name */}
        <div>
          <label
            htmlFor="businessName"
            className="mb-1.5 block text-sm font-medium text-muted"
          >
            Business name
          </label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            required
            autoComplete="organization"
            placeholder="Your business name"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-placeholder transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {/* Email */}
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

        {/* Contact Email */}
        <div>
          <label
            htmlFor="contactEmail"
            className="mb-1.5 block text-sm font-medium text-muted"
          >
            Contact email
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            required
            autoComplete="email"
            placeholder="contact@yourbusiness.com"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-placeholder transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {/* Contact Phone */}
        <div>
          <label
            htmlFor="contactPhone"
            className="mb-1.5 block text-sm font-medium text-muted"
          >
            Contact phone
          </label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+218 91 123 4567"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-placeholder transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-muted"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-placeholder transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-muted"
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
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-placeholder transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {/* Error message */}
        {state && !state.success && (
          <div className="rounded-lg bg-danger/20 border border-danger/30 px-4 py-3 text-sm text-danger">
            {state.error}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Creating your store..." : "Create store"}
        </button>
      </form>

      {/* Login link */}
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
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
