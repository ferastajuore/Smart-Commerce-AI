import { type ReactNode } from "react";
import { Badge as HeroBadge } from "@heroui/react";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * Badge — DESIGN_SYSTEM.md §46
 * Wraps HeroUI v3 Badge with our DESIGN_SYSTEM.md semantic colors.
 * Never used as a button (DESIGN_SYSTEM.md §46.4).
 * -------------------------------------------------------------------------- */

type BadgeVariant = "success" | "warning" | "danger" | "neutral" | "primary";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/** Map our DESIGN_SYSTEM.md variants to HeroUI color variants */
function mapColor(variant: BadgeVariant): "success" | "warning" | "danger" | "default" | "accent" {
  const colorMap: Record<BadgeVariant, "success" | "warning" | "danger" | "default" | "accent"> = {
    success: "success",
    warning: "warning",
    danger: "danger",
    neutral: "default",
    primary: "accent",
  };
  return colorMap[variant];
}

function Badge({
  variant = "neutral",
  size = "md",
  icon,
  className,
  children,
}: BadgeProps) {
  return (
    <HeroBadge
      color={mapColor(variant)}
      size={size}
      variant="soft"
      className={cn(className)}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </HeroBadge>
  );
}

export { Badge, type BadgeProps, type BadgeVariant, type BadgeSize };
