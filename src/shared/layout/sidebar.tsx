"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * Sidebar — DESIGN_SYSTEM.md §18.2, §34.1–34.2
 * Fixed left navigation. 240px width, Surface-Primary background.
 * Active item: Primary-500 filled pill. Inactive: transparent + text-secondary.
 * -------------------------------------------------------------------------- */

interface SidebarItem {
  label: string;
  icon: ReactNode;
  href: string;
}

interface SidebarProps {
  /** Navigation items */
  items: SidebarItem[];
  /** Logo / brand element */
  logo: ReactNode;
  /** Product name displayed next to logo */
  productName?: string;
  /** Optional kicker text above logo */
  kicker?: string;
  /** User profile block at bottom */
  userBlock?: ReactNode;
  /** Current workspace name */
  workspaceName?: string;
}

function Sidebar({
  items,
  logo,
  productName = "Smart Commerce",
  kicker,
  userBlock,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full w-60 flex flex-col",
        "bg-background border-r border-separator"
      )}
      style={{ zIndex: "var(--z-sticky)" as unknown as number }}
    >
      {/* Top section: Logo + brand — §34.2 */}
      <div className="flex flex-col gap-1 px-4 py-5 border-b border-separator">
        {kicker && (
          <span className="text-[0.625rem] uppercase tracking-wider text-accent font-medium">
            {kicker}
          </span>
        )}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/20 text-accent">
            {logo}
          </div>
          <span className="text-body font-semibold text-foreground truncate">
            {productName}
          </span>
        </div>
      </div>

      {/* Navigation — §34.1 */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            // Check if the current path starts with the item's href
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-body-sm font-medium transition-all",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted hover:bg-surface-tertiary hover:text-foreground"
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User profile block — §34.2 bottom section */}
      {userBlock && (
        <div className="border-t border-separator px-4 py-4">
          {userBlock}
        </div>
      )}
    </aside>
  );
}

export { Sidebar, type SidebarProps, type SidebarItem };
