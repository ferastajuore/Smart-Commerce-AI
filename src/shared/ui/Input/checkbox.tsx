import { Checkbox as HeroCheckbox } from "@heroui/react";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * Checkbox — DESIGN_SYSTEM.md §48.4
 * Wraps HeroUI v3 Checkbox compound component.
 * -------------------------------------------------------------------------- */

interface CheckboxProps {
  label?: string;
  error?: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  onChange?: (isSelected: boolean) => void;
  name?: string;
  value?: string;
  className?: string;
}

function Checkbox({
  label,
  error,
  isDisabled = false,
  isSelected,
  onChange,
  name,
  value,
  className,
}: CheckboxProps) {
  return (
    <div className="flex flex-col gap-1">
      <HeroCheckbox
        isDisabled={isDisabled}
        isSelected={isSelected}
        onChange={onChange}
        name={name}
        value={value}
        className={cn(className)}
      >
        {label && <span className="text-body-sm text-foreground select-none">{label}</span>}
      </HeroCheckbox>

      {error && (
        <p className="text-caption text-danger flex items-center gap-1">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

Checkbox.displayName = "Checkbox";

export { Checkbox, type CheckboxProps };
