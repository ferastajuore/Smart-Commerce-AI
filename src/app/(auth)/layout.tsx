// Auth layout — shared layout for login, register, forgot-password, reset-password
// Ref: FOLDER_STRUCTURE.md §4 (app/(auth)/ route group)
//
// Provides a centered, dark-themed layout consistent with DESIGN.md
// for all authentication-related pages.

import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-accent">Smart Commerce</h1>
          <p className="mt-1 text-sm text-muted">
            AI-Powered Commerce Platform
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
