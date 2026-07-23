import { type ReactNode } from "react";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * PageContainer — DESIGN_SYSTEM.md §18.4, §20
 * Content area wrapper with container widths and responsive padding.
 * -------------------------------------------------------------------------- */

type ContainerWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

interface PageContainerProps {
  children: ReactNode;
  /** Max width constraint */
  width?: ContainerWidth;
  /** Center the container */
  centered?: boolean;
  /** Additional class names */
  className?: string;
}

const widthMap: Record<ContainerWidth, string> = {
  sm: "max-w-container-sm",
  md: "max-w-container-md",
  lg: "max-w-container-lg",
  xl: "max-w-container-xl",
  "2xl": "max-w-container-2xl",
  full: "w-full",
};

function PageContainer({
  children,
  width = "full",
  centered = false,
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        widthMap[width],
        centered && "mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

export { PageContainer, type PageContainerProps, type ContainerWidth };
