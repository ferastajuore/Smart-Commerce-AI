// Toast notification component
// Ref: DESIGN_SYSTEM.md §5.3 (Feedback Semantics — toast styles),
// DESIGN_SYSTEM.md §23.2 (HeroUI Toast/Snackbar customization),
// DESIGN_SYSTEM.md §25.3 (Fade In animation pattern),
// FOLDER_STRUCTURE.md §6 (shared/ui — reusable, business-logic-free UI components)
//
// A lightweight toast notification system for transient user feedback.
// Does not depend on any module-specific business logic — pure UI.

"use client";

import { useEffect, useState, useCallback, createContext, useContext } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

// --- Types ---

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  addToast: (message: string, variant?: ToastVariant) => void;
  removeToast: (id: string) => void;
}

// --- Context ---

const ToastContext = createContext<ToastContextValue | null>(null);

// --- Variant styles (DESIGN_SYSTEM.md §5.3) ---

const variantStyles: Record<
  ToastVariant,
  { container: string; icon: string; iconPath: React.ReactNode }
> = {
  success: {
    // Success Toast: Secondary-900 bg, Secondary-700 border, Secondary-400 icon
    container:
      "bg-secondary-900 border-secondary-700 text-neutral-200",
    icon: "text-secondary-400",
    iconPath: <CheckCircle className="h-5 w-5" />,
  },
  error: {
    // Error Toast: Tertiary-900 bg, Tertiary-700 border, Tertiary-400 icon
    container:
      "bg-tertiary-900 border-tertiary-700 text-neutral-200",
    icon: "text-tertiary-400",
    iconPath: <AlertCircle className="h-5 w-5" />,
  },
  warning: {
    // Warning Toast: #451A03 bg, #92400E border, Amber icon
    container:
      "bg-[#451A03] border-[#92400E] text-neutral-200",
    icon: "text-amber-500",
    iconPath: <AlertCircle className="h-5 w-5" />,
  },
  info: {
    // Info Toast: Primary-900 bg, Primary-700 border, Primary-400 icon
    container:
      "bg-primary-900 border-primary-700 text-neutral-200",
    icon: "text-primary-400",
    iconPath: <Info className="h-5 w-5" />,
  },
};

// --- Toast Item ---

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const styles = variantStyles[toast.variant];

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm animate-in slide-in-from-right-full fade-in duration-300 ${styles.container}`}
    >
      <span className={`shrink-0 ${styles.icon}`}>{styles.iconPath}</span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded-lg p-1 text-neutral-400 transition-colors hover:text-neutral-200"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// --- Toast Container ---

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed right-4 top-4 z-toast flex flex-col gap-3 sm:right-6 sm:top-6"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// --- Provider ---

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setToasts((prev) => [...prev, { id, message, variant }]);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

// --- Hook ---

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
