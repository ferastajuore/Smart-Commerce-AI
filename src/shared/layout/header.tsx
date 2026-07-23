"use client";

import { type ReactNode } from "react";
import { Bell, HelpCircle } from "lucide-react";
import { cn } from "@/shared/utils";

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
  return (
    <header
      className={cn(
        "fixed top-0 right-0 h-16 flex items-center justify-between gap-4",
        "bg-background border-b border-separator",
        "pl-60 pr-8", // Offset by sidebar width (240px) + padding
        className
      )}
      style={{ zIndex: "var(--z-sticky)" as unknown as number }}
    >
      {/* Left: search / breadcrumbs */}
      <div className="flex-1 flex items-center gap-4">{left}</div>

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
