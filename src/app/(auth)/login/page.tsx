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
//
// DESIGN_SYSTEM.md §3.3: Feedback Over Silence — buttons show loading states,
// forms show validation errors inline, state changes animate.
//
// Login flow:
// 1. Credentials captured in state via onSubmit before form submission
// 2. Server action (login.ts) validates input, rate-limits, and looks up user
// 3. On success, client calls POST /api/auth/login with saved credentials
//    to create the session cookie
//    (custom endpoint needed because NextAuth v4 CredentialsProvider body parsing
//     is incompatible with Next.js 16 Web ReadableStream)
// 4. On success, toast + redirect to role-appropriate dashboard
//
// NOTE: React 19 useActionState resets form inputs after the server action
// completes. We must capture credentials in component state before submission
// so they survive the reset and are available for the session-cookie endpoint.

"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { login, type LoginResult } from "@/modules/auth/actions/login";
import { useToast } from "@/shared/ui/toast";

const initialState: LoginResult | null = null;

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(login, initialState);

  // isSigningIn tracks the fetch call to POST /api/auth/login (session cookie creation).
  // Set to true in handleSubmit (event handler) so it covers both the server
  // action phase and the fetch phase. Reset to false only on fetch failure.
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Credentials must be captured in state before the form action runs,
  // because React 19 useActionState resets form inputs after the action
  // completes. Without this, the useEffect below would read empty strings
  // from the reset form, causing POST /api/auth/login to fail with 400.
  const [savedCredentials, setSavedCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const isSubmitting = isPending || isSigningIn;

  // Intercept form submission to capture credentials in state and start
  // the loading state. This runs in the event handler (not the effect),
  // so it avoids the lint rule against synchronous setState in effects.
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    const password = String(new FormData(form).get("password") ?? "");
    setSavedCredentials({ email, password });
    setIsSigningIn(true);
  }

  // After server action validates credentials, call the custom login endpoint
  // to create the session cookie, then redirect to the correct dashboard by role.
  useEffect(() => {
    if (!state?.success || !state.role || !savedCredentials) return;

    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: savedCredentials.email,
        password: savedCredentials.password,
      }),
    })
      .then(async (res) => {
        if (res.ok) {
          addToast("Signed in successfully. Redirecting...", "success");
          if (state.role === "STORE_OWNER") {
            router.push("/stores/dashboard");
          } else if (state.role === "PLATFORM_ADMIN") {
            router.push("/admin");
          }
        } else {
          addToast(
            "Invalid email or password. Please try again.",
            "error",
          );
          setIsSigningIn(false);
        }
      })
      .catch(() => {
        addToast(
          "An unexpected error occurred. Please try again.",
          "error",
        );
        setIsSigningIn(false);
      });
  }, [state, router, savedCredentials, addToast]);

  return (
    <div className="rounded-2xl border border-white/7 bg-surface-container p-8 shadow-lg">
      <h2 className="mb-6 text-center text-xl font-semibold text-on-surface">
        Sign in to your account
      </h2>

      <form
        ref={formRef}
        action={formAction}
        onSubmit={handleSubmit}
        className="space-y-5"
      >
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
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/7 bg-surface-container-low px-4 py-3 text-on-surface placeholder:text-outline transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
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
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/7 bg-surface-container-low px-4 py-3 text-on-surface placeholder:text-outline transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Server-side validation errors (e.g. rate limited) */}
        {state && !state.success && state.error && (
          <div
            role="alert"
            className="rounded-lg border border-tertiary-700/30 bg-tertiary-900/20 px-4 py-3 text-sm text-tertiary-400"
          >
            {state.error}
          </div>
        )}

        {/* Submit button with loading spinner */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign in</span>
          )}
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
