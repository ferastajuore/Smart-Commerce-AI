"use client";

import {
  ToastProvider as HeroToastProvider,
  toast,
} from "@heroui/react";
import { type ReactNode } from "react";

/* --------------------------------------------------------------------------
 * Toast — DESIGN_SYSTEM.md §44
 * Wraps HeroUI v3 Toast system.
 * Provides ToastProvider and useToast hook for consuming components.
 * -------------------------------------------------------------------------- */

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastContextValue {
  addToast: (message: string, variant?: ToastVariant, title?: string) => void;
  removeToast: (id: string) => void;
}

/* --- Toast Provider --- */
function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <HeroToastProvider placement="bottom end" gap={12}>
      {children}
    </HeroToastProvider>
  );
}

/* --- useToast Hook --- */
function useToast(): ToastContextValue {
  const addToast = (message: string, variant: ToastVariant = "info", title?: string) => {
    switch (variant) {
      case "success":
        toast.success(message, { description: title });
        break;
      case "error":
        toast.danger(message, { description: title });
        break;
      case "warning":
        toast.warning(message, { description: title });
        break;
      case "info":
      default:
        toast.info(message, { description: title });
        break;
    }
  };

  const removeToast = (id: string) => {
    toast.close(id);
  };

  return { addToast, removeToast };
}

export { ToastProvider, useToast, type ToastVariant };
