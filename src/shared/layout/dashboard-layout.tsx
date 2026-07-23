"use client";

import { type ReactNode } from "react";

/* --------------------------------------------------------------------------
 * DashboardLayout — DESIGN_SYSTEM.md §18.1
 * Standard authenticated layout: Sidebar (240px) + Header (64px) + Content.
 * Used by /stores/* and /admin/* routes.
 * -------------------------------------------------------------------------- */

interface DashboardLayoutProps {
  /** Sidebar component */
  sidebar: ReactNode;
  /** Header component */
  header: ReactNode;
  /** Page content */
  children: ReactNode;
}

function DashboardLayout({ sidebar, header, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Sidebar — fixed, full height */}
      {sidebar}

      {/* Header — fixed top, offset by sidebar */}
      {header}

      {/* Content area — offset by sidebar width and header height */}
      <main
        className="pl-60 pt-16 min-h-screen"
      >
        <div className="px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export { DashboardLayout, type DashboardLayoutProps };
