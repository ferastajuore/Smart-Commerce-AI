import { type ReactNode } from "react";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * PageHeader — DESIGN_SYSTEM.md §18.5
 * Standard page title area: title + subtitle + optional actions.
 * -------------------------------------------------------------------------- */

interface PageHeaderProps {
  /** Page title — text-display, font-headline */
  title: string;
  /** Optional subtitle — text-body-sm, text-secondary */
  subtitle?: string;
  /** Optional action buttons (right-aligned) */
  actions?: ReactNode;
  /** Optional breadcrumbs above the title */
  breadcrumbs?: ReactNode;
  /** Additional class names for the container */
  className?: string;
}

function PageHeader({ title, subtitle, actions, breadcrumbs, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-6 pb-6", className)}>
      {/* Breadcrumbs — DESIGN_SYSTEM.md §34.3 */}
      {breadcrumbs}

      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-display font-headline text-foreground tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-body-sm text-muted">{subtitle}</p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

export { PageHeader, type PageHeaderProps };
