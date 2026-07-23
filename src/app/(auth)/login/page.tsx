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

  const [isSigningIn, setIsSigningIn] = useState(false);

  const [savedCredentials, setSavedCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const isSubmitting = isPending || isSigningIn;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    const password = String(new FormData(form).get("password") ?? "");
    setSavedCredentials({ email, password });
    setIsSigningIn(true);
  }

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
    <div className="rounded-2xl border border-border bg-surface p-8 shadow-lg">
      <h2 className="mb-6 text-center text-xl font-semibold text-foreground">
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
            disabled={isSubmitting}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-placeholder transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Password field */}
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
            autoComplete="current-password"
            placeholder="Enter your password"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-placeholder transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Server-side validation errors */}
        {state && !state.success && state.error && (
          <div
            role="alert"
            className="rounded-lg border border-danger/30 bg-danger/20 px-4 py-3 text-sm text-danger"
          >
            {state.error}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
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
            className="text-accent hover:text-accent-hover transition-colors"
          >
            Forgot your password?
          </a>
        </div>
      </form>

      {/* Register link */}
      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <a
          href="/register"
          className="font-medium text-accent hover:text-accent-hover transition-colors"
        >
          Register your store
        </a>
      </p>
    </div>
  );
}
