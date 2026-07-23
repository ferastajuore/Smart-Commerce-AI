import { useState, type ReactNode } from "react";
import { Input as HeroInput } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * Input — DESIGN_SYSTEM.md §48
 * Wraps HeroUI v3 Input with leading/trailing icons, error/success states,
 * password toggle, and helper text.
 * -------------------------------------------------------------------------- */

type InputState = "default" | "error" | "success" | "readonly";

interface InputProps {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  error?: string;
  success?: string;
  helperText?: string;
  fullWidth?: boolean;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  name?: string;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
}

function Input({
  leadingIcon,
  trailingIcon,
  error,
  success,
  helperText,
  fullWidth = true,
  type,
  disabled = false,
  readOnly = false,
  placeholder,
  value,
  defaultValue,
  name,
  id,
  onChange,
  onBlur,
  className,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const resolvedType = isPassword && showPassword ? "text" : type;

  return (
    <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
      <div className="relative flex items-center">
        {leadingIcon && (
          <span className="absolute left-3 text-muted pointer-events-none">
            {leadingIcon}
          </span>
        )}

        <HeroInput
          type={resolvedType}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          name={name}
          id={id}
          onChange={onChange}
          onBlur={onBlur}
          className={cn(
            leadingIcon && "pl-10",
            (trailingIcon || isPassword) && "pr-10",
            error && "border-danger",
            success && "border-success",
            className
          )}
        />

        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-muted hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : trailingIcon ? (
          <span className="absolute right-3 text-muted pointer-events-none">
            {trailingIcon}
          </span>
        ) : null}
      </div>

      {error && (
        <p id={`${id}-error`} className="text-caption text-danger flex items-center gap-1">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}

      {success && (
        <p id={`${id}-success`} className="text-caption text-success flex items-center gap-1">
          <span aria-hidden="true">✓</span>
          {success}
        </p>
      )}

      {helperText && !error && !success && (
        <p id={`${id}-helper`} className="text-caption text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}

Input.displayName = "Input";

export { Input, type InputProps, type InputState };
