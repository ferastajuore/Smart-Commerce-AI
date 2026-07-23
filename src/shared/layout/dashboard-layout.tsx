"use client";

import { type ReactNode } from "react";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * DashboardLayout — DESIGN_SYSTEM.md §18.1
 * Standard authenticated layout: Sidebar (240px) + Header (64px) + Content.
 * Used by /stores/* and /admin/* routes.
 * Now supports collapse state via SidebarProvider.
 * -------------------------------------------------------------------------- */

interface DashboardLayoutProps {
  /** Sidebar component */
  sidebar: ReactNode;
  /** Header component */
  header: ReactNode;
  /** Page content */
  children: ReactNode;
}

function DashboardLayoutContent({ sidebar, header, children }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Sidebar — fixed, full height */}
      {sidebar}

      {/* Header — fixed top, offset by sidebar */}
      {header}

      {/* Content area — offset by sidebar width and header height */}
      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-300 ease-in-out",
          isCollapsed ? "ps-0" : "ps-60"
        )}
      >
        <div className="px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent {...props} />
    </SidebarProvider>
  );
}

export { DashboardLayout, type DashboardLayoutProps };
