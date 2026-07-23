import { TextArea as HeroTextArea } from "@heroui/react";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * Textarea — DESIGN_SYSTEM.md §30.3, §48.4
 * Wraps HeroUI v3 TextArea with error/helper text.
 * -------------------------------------------------------------------------- */

interface TextareaProps {
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  name?: string;
  id?: string;
  rows?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

function Textarea({
  error,
  helperText,
  fullWidth = true,
  disabled = false,
  readOnly = false,
  placeholder,
  value,
  defaultValue,
  name,
  id,
  rows = 3,
  onChange,
  onBlur,
  className,
}: TextareaProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
      <HeroTextArea
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        name={name}
        id={id}
        rows={rows}
        onChange={onChange}
        onBlur={onBlur}
        className={cn(
          "min-h-[80px] resize-y",
          error && "border-danger",
          className
        )}
      />

      {error && (
        <p className="text-caption text-danger flex items-center gap-1">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-caption text-muted">{helperText}</p>
      )}
    </div>
  );
}

Textarea.displayName = "Textarea";

export { Textarea, type TextareaProps };
