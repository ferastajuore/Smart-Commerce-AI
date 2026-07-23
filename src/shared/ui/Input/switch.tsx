import { Switch as HeroSwitch } from "@heroui/react";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * Switch — DESIGN_SYSTEM.md §48.4
 * Wraps HeroUI v3 Switch compound component.
 * -------------------------------------------------------------------------- */

interface SwitchProps {
  /** Label text */
  label?: string;
  /** Size */
  size?: "sm" | "md";
  /** Whether the switch is disabled */
  isDisabled?: boolean;
  /** Whether the switch is checked */
  isSelected?: boolean;
  /** Change handler */
  onChange?: (isSelected: boolean) => void;
  /** Additional class names */
  className?: string;
}

function Switch({
  label,
  size = "md",
  isDisabled = false,
  isSelected,
  onChange,
  className,
}: SwitchProps) {
  return (
    <HeroSwitch
      size={size}
      isDisabled={isDisabled}
      isSelected={isSelected}
      onChange={onChange}
      className={cn(className)}
    >
      {label && <span className="text-body-sm text-foreground select-none">{label}</span>}
    </HeroSwitch>
  );
}

Switch.displayName = "Switch";

export { Switch, type SwitchProps };
