import { type ReactNode } from "react";
import { Card as HeroCard } from "@heroui/react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * StatCard — DESIGN_SYSTEM.md §51.1
 * Metric card pattern: icon chip + value + label + caption + optional badge/trend.
 * Uses HeroUI Card underneath.
 * -------------------------------------------------------------------------- */

interface StatCardProps {
  /** Icon displayed in the icon chip */
  icon: ReactNode;
  /** Primary metric value (formatted with toLocaleString) */
  value: string | number;
  /** Label below the value */
  label: string;
  /** Optional caption below the label */
  caption?: string;
  /** Optional trend indicator */
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  /** Optional badge/status in top-right */
  badge?: ReactNode;
  /** Icon chip color theme */
  color?: "primary" | "secondary" | "tertiary" | "neutral";
  /** Additional class names */
  className?: string;
  /** Custom content rendered at the bottom (e.g. sparklines) */
  children?: ReactNode;
}

const chipColorMap: Record<string, string> = {
  primary: "bg-primary-500/20 text-primary-400",
  secondary: "bg-secondary-500/20 text-secondary-400",
  tertiary: "bg-tertiary-500/20 text-tertiary-400",
  neutral: "bg-neutral-500/20 text-neutral-400",
};

function StatCard({
  icon,
  value,
  label,
  caption,
  trend,
  badge,
  color = "primary",
  className,
  children,
}: StatCardProps) {
  return (
    <HeroCard
      className={cn(
        "flex flex-col gap-4 p-6 rounded-xl",
        className
      )}
    >
      {/* Header: icon chip + badge */}
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg",
            chipColorMap[color]
          )}
        >
          {icon}
        </div>
        {badge}
      </div>

      {/* Value — tabular-nums for column alignment (DESIGN_SYSTEM.md §11.1) */}
      <div className="flex items-baseline gap-2">
        <span className="text-display font-headline text-foreground tabular-nums">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-label font-medium",
              trend.direction === "up" ? "text-success" : "text-danger"
            )}
          >
            {trend.direction === "up" ? (
              <ArrowUp size={12} />
            ) : (
              <ArrowDown size={12} />
            )}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      {/* Label — uppercase, tracking-wide */}
      <span className="text-label uppercase tracking-wide text-muted font-medium">
        {label}
      </span>

      {/* Caption */}
      {caption && (
        <span className="text-caption text-muted">{caption}</span>
      )}

      {/* Render children if provided (e.g. sparklines) */}
      {children && <div className="mt-2 w-full">{children}</div>}
    </HeroCard>
  );
}

export { StatCard, type StatCardProps };
