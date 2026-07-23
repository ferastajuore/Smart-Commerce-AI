"use client";

import { type ReactNode } from "react";
import { Button as HeroButton } from "@heroui/react";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * Button — DESIGN_SYSTEM.md §47
 * Wraps HeroUI v3 Button with our DESIGN_SYSTEM.md API.
 * -------------------------------------------------------------------------- */

type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isDisabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
  onPress?: () => void;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

function mapVariant(variant: ButtonVariant): "primary" | "secondary" | "danger" | "ghost" | "outline" {
  const variantMap: Record<ButtonVariant, "primary" | "secondary" | "danger" | "ghost" | "outline"> = {
    primary: "primary",
    secondary: "secondary",
    destructive: "danger",
    ghost: "ghost",
    outline: "outline",
  };
  return variantMap[variant];
}

function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  isDisabled = false,
  fullWidth = false,
  className,
  children,
  onPress,
  onClick,
}: ButtonProps) {
  const disabled = isDisabled || isLoading;
  const hasIconOnly = !children && (leftIcon || rightIcon);

  return (
    <HeroButton
      variant={mapVariant(variant)}
      size={size}
      isDisabled={disabled}
      isIconOnly={hasIconOnly ? true : undefined}
      fullWidth={fullWidth}
      onPress={onPress ?? onClick}
      className={cn(className)}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />
          {children && <span>Loading...</span>}
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </HeroButton>
  );
}

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
