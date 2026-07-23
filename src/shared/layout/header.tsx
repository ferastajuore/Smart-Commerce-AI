"use client";

import { type ReactNode } from "react";
import { Bell, HelpCircle, Menu } from "lucide-react";
import { cn } from "@/shared/utils";
import { useSidebar } from "./sidebar-context";

/* --------------------------------------------------------------------------
 * Header — DESIGN_SYSTEM.md §18.3, §34.4
 * Fixed top header. 64px height, from sidebar edge to viewport right.
 * Left: search/breadcrumbs. Right: notifications, help, user menu.
 * -------------------------------------------------------------------------- */

interface HeaderProps {
  /** Left content — typically search input or breadcrumbs */
  left?: ReactNode;
  /** Right content — typically notification bell, help, user menu */
  right?: ReactNode;
  /** Show notification bell with unread dot */
  hasUnreadNotifications?: boolean;
  /** Additional class names */
  className?: string;
}

function Header({ left, right, hasUnreadNotifications, className }: HeaderProps) {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <header
      className={cn(
        "fixed top-0 end-0 h-16 flex items-center justify-between gap-4 transition-all duration-300 ease-in-out z-40 px-8",
        "bg-background border-b border-separator",
        isCollapsed ? "start-0" : "start-60",
        className
      )}
      style={{ zIndex: "var(--z-sticky)" as unknown as number }}
    >
      {/* Left: search / breadcrumbs + Toggle Button */}
      <div className="flex-1 flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-muted hover:bg-surface-tertiary hover:text-foreground transition-colors shrink-0"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
        <div className="flex-1">{left}</div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {right ?? (
          <>
            {/* Notification bell — §44.4 */}
            <button
              className="relative p-2 rounded-lg text-muted hover:bg-surface-tertiary hover:text-foreground transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {hasUnreadNotifications && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger" />
              )}
            </button>

            {/* Help */}
            <button
              className="p-2 rounded-lg text-muted hover:bg-surface-tertiary hover:text-foreground transition-colors"
              aria-label="Help"
            >
              <HelpCircle size={20} />
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export { Header, type HeaderProps };
