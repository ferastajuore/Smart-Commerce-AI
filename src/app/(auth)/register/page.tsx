// Register page — Store Registration
// Ref: PRD.md REG-1 (new user registers a Store by providing business details
// and creating an owner account), FOLDER_STRUCTURE.md §4 (app/(auth)/register/)
//
// DESIGN.md guidance:
// - Dark theme: surface #051424, cards elevated with 7% white border
// - Primary actions: solid Indigo background (#c0c1ff)
// - Inputs: dark-themed, 1px border, focus transitions to Indigo with glow
// - Font: Tajawal (AGENTS.md)
// - Rounded: 16px (2xl) for main containers, 12px (xl) for inputs/buttons
//
// Phone verification (PRD.md REG-2) is DEFERRED to a future milestone.
// Facebook Page connection (PRD.md REG-3) is enforced at the business-rule
// level in the server action, not in this UI — connection mechanics are
// implemented in Milestone 9.

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
    <div className="rounded-2xl border border-white/7 bg-surface-container p-8 shadow-lg">
      <h2 className="mb-2 text-center text-xl font-semibold text-on-surface">
        Register your store
      </h2>
      <p className="mb-6 text-center text-sm text-on-surface-variant">
        Create your account and start your 14-day free trial.
      </p>

      <form action={formAction} className="space-y-4">
        {/* Business Name */}
        <div>
          <label
            htmlFor="businessName"
            className="mb-1.5 block text-sm font-medium text-on-surface-variant"
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
            className="w-full rounded-xl border border-white/7 bg-surface-container-low px-4 py-3 text-on-surface placeholder:text-outline transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Email */}
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

        {/* Contact Email */}
        <div>
          <label
            htmlFor="contactEmail"
            className="mb-1.5 block text-sm font-medium text-on-surface-variant"
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
            className="w-full rounded-xl border border-white/7 bg-surface-container-low px-4 py-3 text-on-surface placeholder:text-outline transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Contact Phone */}
        <div>
          <label
            htmlFor="contactPhone"
            className="mb-1.5 block text-sm font-medium text-on-surface-variant"
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
            className="w-full rounded-xl border border-white/7 bg-surface-container-low px-4 py-3 text-on-surface placeholder:text-outline transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Password */}
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
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className="w-full rounded-xl border border-white/7 bg-surface-container-low px-4 py-3 text-on-surface placeholder:text-outline transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Confirm Password */}
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
          {isPending ? "Creating your store..." : "Create store"}
        </button>
      </form>

      {/* Login link */}
      <p className="mt-6 text-center text-sm text-on-surface-variant">
        Already have an account?{" "}
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
