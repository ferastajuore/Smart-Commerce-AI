import { type ReactNode } from "react";
import { Card as HeroCard } from "@heroui/react";
import { Sparkles } from "lucide-react";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * AIInsightCard — DESIGN_SYSTEM.md §33.1, §51.5
 * Brand-defining component for AI-generated recommendations.
 * Uses HeroUI Card underneath with special gradient background.
 * -------------------------------------------------------------------------- */

interface AIInsightCardProps {
  /** Title text (e.g., "AI Insight", "Restock Recommendation") */
  title?: string;
  /** Description text */
  description?: string;
  /** Confidence score 0-100 */
  confidence?: number;
  /** Key-value metric pairs */
  metrics?: Array<{ label: string; value: string }>;
  /** CTA button element */
  cta?: ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Additional class names */
  className?: string;
  /** Custom content */
  children?: ReactNode;
}

function getConfidenceColor(score: number): string {
  if (score >= 90) return "text-success";
  if (score >= 70) return "text-accent";
  return "text-danger";
}

function getConfidenceBg(score: number): string {
  if (score >= 90) return "bg-success";
  if (score >= 70) return "bg-accent";
  return "bg-danger";
}

function AIInsightCard({
  title = "AI Insight",
  description,
  confidence,
  metrics,
  cta,
  isLoading = false,
  className,
  children,
}: AIInsightCardProps) {
  return (
    <HeroCard
      className={cn(
        "relative rounded-xl border overflow-hidden",
        "border-primary-700/50 bg-gradient-to-br from-primary-900/50 to-surface-secondary",
        className
      )}
    >
      {/* Loading shimmer overlay */}
      {isLoading && (
        <div className="absolute inset-0 animate-shimmer z-10" />
      )}

      <div className={cn("px-6 py-4 flex flex-col gap-4", isLoading && "opacity-50")}>
        {/* Header: Sparkles icon + title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-500/20">
            <Sparkles size={20} className="text-primary-400 animate-pulse-soft" />
          </div>
          <h3 className="text-title-lg font-headline text-primary-400">{title}</h3>
        </div>

        {/* Description */}
        {description && (
          <p className="text-body-sm text-muted">{description}</p>
        )}

        {/* Confidence bar — DESIGN_SYSTEM.md §33.4 */}
        {confidence !== undefined && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-surface-tertiary overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", getConfidenceBg(confidence))}
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className={cn("text-label font-medium tabular-nums", getConfidenceColor(confidence))}>
              {confidence}%
            </span>
          </div>
        )}

        {/* Metrics */}
        {metrics && metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="flex flex-col">
                <span className="text-label text-muted">{metric.label}</span>
                <span className="text-body font-medium text-foreground tabular-nums">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Custom content */}
        {children}

        {/* CTA */}
        {cta && <div>{cta}</div>}
      </div>
    </HeroCard>
  );
}

export { AIInsightCard, type AIInsightCardProps };
