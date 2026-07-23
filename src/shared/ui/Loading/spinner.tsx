import { Spinner as HeroSpinner } from "@heroui/react";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * Spinner — DESIGN_SYSTEM.md §41.2
 * Wraps HeroUI v3 Spinner.
 * -------------------------------------------------------------------------- */

type SpinnerSize = "sm" | "md" | "lg" | "xl";

interface SpinnerProps {
  size?: SpinnerSize;
  color?: "accent" | "success" | "danger" | "warning" | "current";
  className?: string;
  label?: string;
}

function Spinner({
  size = "md",
  color = "accent",
  className,
  label = "Loading",
}: SpinnerProps) {
  return (
    <HeroSpinner
      size={size}
      color={color}
      className={cn(className)}
      aria-label={label}
    />
  );
}

export { Spinner, type SpinnerProps, type SpinnerSize };
