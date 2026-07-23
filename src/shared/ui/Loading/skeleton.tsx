import { Skeleton as HeroSkeleton } from "@heroui/react";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * Skeleton — DESIGN_SYSTEM.md §41.1
 * Wraps HeroUI v3 Skeleton.
 * -------------------------------------------------------------------------- */

interface SkeletonProps {
  /** Width — accepts Tailwind classes or arbitrary values */
  width?: string;
  /** Height — accepts Tailwind classes or arbitrary values */
  height?: string;
  /** Shape: rectangle (default), circle, or rounded */
  shape?: "rect" | "circle" | "rounded";
  /** Additional class names */
  className?: string;
}

const shapeStyles: Record<string, string> = {
  rect: "",
  circle: "rounded-full",
  rounded: "rounded-md",
};

function Skeleton({
  width,
  height,
  shape = "rect",
  className,
}: SkeletonProps) {
  return (
    <HeroSkeleton
      className={cn(shapeStyles[shape], className)}
      style={{
        width,
        height,
      }}
    />
  );
}

Skeleton.displayName = "Skeleton";

export { Skeleton, type SkeletonProps };
