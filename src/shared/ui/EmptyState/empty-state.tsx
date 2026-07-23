import { type ReactNode } from "react";
import { EmptyState as HeroEmptyState } from "@heroui/react";
import { Package } from "lucide-react";
import { cn } from "@/shared/utils";
import { Button } from "@/shared/ui/Button";

/* --------------------------------------------------------------------------
 * EmptyState — DESIGN_SYSTEM.md §40
 * Wraps HeroUI v3 EmptyState with our consistent structure:
 * icon + title + description + CTA.
 * -------------------------------------------------------------------------- */

interface EmptyStateProps {
  /** Icon displayed in the center */
  icon?: ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description: string;
  /** Optional CTA button label */
  ctaLabel?: string;
  /** CTA button callback */
  onCta?: () => void;
  /** Optional secondary link text */
  secondaryLabel?: string;
  /** Secondary link callback */
  onSecondary?: () => void;
  /** Additional class names */
  className?: string;
}

function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  onCta,
  secondaryLabel,
  onSecondary,
  className,
}: EmptyStateProps) {
  return (
    <HeroEmptyState
      className={cn(
        "px-8 py-16",
        className
      )}
    >
      {/* Icon — DESIGN_SYSTEM.md §40.2 */}
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/15 mb-6 mx-auto">
        <div className="text-muted">
          {icon ?? <Package size={32} />}
        </div>
      </div>

      {/* Title — text-headline */}
      <h3 className="text-headline font-headline text-foreground mb-2 text-center">
        {title}
      </h3>

      {/* Description — text-body-sm, text-secondary */}
      <p className="text-body-sm text-muted max-w-sm mb-6 text-center mx-auto">
        {description}
      </p>

      {/* CTA Button */}
      {ctaLabel && onCta && (
        <div className="flex justify-center">
          <Button variant="primary" size="md" onPress={onCta}>
            {ctaLabel}
          </Button>
        </div>
      )}

      {/* Secondary Link */}
      {secondaryLabel && onSecondary && (
        <div className="flex justify-center">
          <button
            onClick={onSecondary}
            className="mt-3 text-body-sm text-muted hover:text-foreground transition-colors"
          >
            {secondaryLabel}
          </button>
        </div>
      )}
    </HeroEmptyState>
  );
}

export { EmptyState, type EmptyStateProps };
