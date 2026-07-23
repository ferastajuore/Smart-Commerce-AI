import { Radio as HeroRadio } from "@heroui/react";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * Radio — DESIGN_SYSTEM.md §48.4
 * Wraps HeroUI v3 Radio compound component.
 * Note: HeroUI Radio is controlled by RadioGroup — selection state
 * is managed at the group level, not the individual Radio.
 * -------------------------------------------------------------------------- */

interface RadioProps {
  label?: string;
  error?: string;
  isDisabled?: boolean;
  value: string;
  className?: string;
}

function Radio({
  label,
  error,
  isDisabled = false,
  value,
  className,
}: RadioProps) {
  return (
    <div className="flex flex-col gap-1">
      <HeroRadio
        isDisabled={isDisabled}
        value={value}
        className={cn(className)}
      >
        {label && <span className="text-body-sm text-foreground select-none">{label}</span>}
      </HeroRadio>

      {error && (
        <p className="text-caption text-danger flex items-center gap-1">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

Radio.displayName = "Radio";

export { Radio, type RadioProps };
