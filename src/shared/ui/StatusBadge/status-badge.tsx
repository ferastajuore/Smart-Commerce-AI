import {
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
} from "lucide-react";
import { Chip as HeroChip } from "@heroui/react";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * StatusBadge — Semantic status display for orders, products, inventory
 * Wraps HeroUI v3 Chip with status icon mapping.
 * Maps domain statuses to DESIGN_SYSTEM.md §5.1 color semantics.
 * -------------------------------------------------------------------------- */

type StatusType = "success" | "warning" | "danger" | "info" | "primary";
type StatusSize = "sm" | "md";

interface StatusBadgeProps {
  status: StatusType;
  size?: StatusSize;
  icon?: React.ReactNode;
  srText?: string;
  className?: string;
  children?: React.ReactNode;
}

function mapColor(status: StatusType): "success" | "warning" | "danger" | "default" | "accent" {
  const colorMap: Record<StatusType, "success" | "warning" | "danger" | "default" | "accent"> = {
    success: "success",
    warning: "warning",
    danger: "danger",
    info: "default",
    primary: "accent",
  };
  return colorMap[status];
}

const defaultIcons: Record<StatusType, React.ReactNode> = {
  success: <CheckCircle size={12} />,
  warning: <Clock size={12} />,
  danger: <AlertCircle size={12} />,
  info: <Info size={12} />,
  primary: <AlertTriangle size={12} />,
};

function StatusBadge({
  status,
  size = "md",
  icon,
  srText,
  className,
  children,
}: StatusBadgeProps) {
  return (
    <HeroChip
      color={mapColor(status)}
      size={size}
      variant="soft"
      className={cn("font-medium", className)}
    >
      {srText && <span className="sr-only">{srText}</span>}
      <span className="shrink-0">{icon ?? defaultIcons[status]}</span>
      {children}
    </HeroChip>
  );
}

export { StatusBadge, type StatusBadgeProps, type StatusType, type StatusSize };
