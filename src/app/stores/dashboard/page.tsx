// Dashboard page — placeholder
// Ref: PRD.md DASH-1, DASH-2 (Dashboard counters)
//
// Full implementation deferred to Phase 2 (ROADMAP.md).
// This page exists as the landing page for Store Owners after login.

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logout } from "@/modules/auth/actions/logout";

export default async function StoreDashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-white/7 bg-surface-container">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-bold text-primary">Smart Commerce</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-on-surface-variant">
              {session?.user?.email}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-white/7 px-3 py-1.5 text-xs text-on-surface-variant transition-colors hover:bg-surface-container-high"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="mb-2 text-xl font-semibold text-on-surface">
          Dashboard
        </h2>
        <p className="text-sm text-on-surface-variant">
          Welcome back, {session?.user?.email}. Dashboard counters will be
          implemented in a future milestone.
        </p>
      </main>
    </div>
  );
}
