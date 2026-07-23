"use client";

import { Search } from "lucide-react";
import { cn } from "@/shared/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

/* --------------------------------------------------------------------------
 * SearchInput — Pill-shaped search input per DESIGN_SYSTEM.md §34.4
 * Uses native search input with HeroUI-styled classes since HeroUI
 * SearchField compound component has limited prop exposure.
 * -------------------------------------------------------------------------- */

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  onClear?: () => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, value, ...props }, ref) => {
    const hasValue = value !== undefined && value !== "";

    return (
      <div className={cn("relative flex items-center", className)}>
        <Search
          size={16}
          className="absolute left-3 text-muted pointer-events-none"
        />

        <input
          ref={ref}
          type="search"
          value={value}
          placeholder="Search..."
          className={cn(
            "w-full h-10 pl-10 pr-10 text-body rounded-full",
            "bg-surface border border-border",
            "text-foreground placeholder:text-placeholder",
            "transition-all duration-fast",
            "focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          {...props}
        />

        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 text-muted hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput, type SearchInputProps };
