// Login page
// Ref: PRD.md AUTH-1 (email/password authentication),
// FOLDER_STRUCTURE.md §4 (app/(auth)/login/)
//
// DESIGN.md guidance:
// - Dark theme: surface #051424, cards elevated with 7% white border
// - Primary actions: solid Indigo background (#c0c1ff)
// - Inputs: dark-themed, 1px border, focus transitions to Indigo with glow
// - Font: Tajawal (AGENTS.md)
// - Rounded: 16px (2xl) for main containers, 12px (xl) for inputs/buttons

"use client";

import { useActionState } from "react";
import { login, type LoginResult } from "@/modules/auth/actions/login";

const initialState: LoginResult | null = null;

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    login,
    initialState,
  );

  return (
    <div className="rounded-2xl border border-white/7 bg-surface-container p-8 shadow-lg">
      <h2 className="mb-6 text-center text-xl font-semibold text-on-surface">
        Sign in to your account
      </h2>

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

        {/* Password field */}
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-on-surface-variant"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            className="w-full rounded-xl border border-white/7 bg-surface-container-low px-4 py-3 text-on-surface placeholder:text-outline transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Error message */}
        {state && !state.success && (
          <div className="rounded-lg bg-error-container/20 border border-error/30 px-4 py-3 text-sm text-error">
            {state.error}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>

        {/* Links */}
        <div className="flex items-center justify-between text-sm">
          <a
            href="/forgot-password"
            className="text-primary hover:text-primary-container transition-colors"
          >
            Forgot your password?
          </a>
        </div>
      </form>

      {/* Register link */}
      <p className="mt-6 text-center text-sm text-on-surface-variant">
        Don&apos;t have an account?{" "}
        <a
          href="/register"
          className="font-medium text-primary hover:text-primary-container transition-colors"
        >
          Register your store
        </a>
      </p>
    </div>
  );
}
