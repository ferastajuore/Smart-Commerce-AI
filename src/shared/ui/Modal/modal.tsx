"use client";

import {
  Modal as HeroModal,
  ModalBackdrop,
  ModalContainer,
  ModalDialog,
  ModalHeader as HeroModalHeader,
  ModalBody as HeroModalBody,
  ModalFooter as HeroModalFooter,
  ModalCloseTrigger,
} from "@heroui/react";
import { type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * Modal — DESIGN_SYSTEM.md §45
 * Wraps HeroUI v3 Modal compound component.
 * Focus trapping, backdrop click, Escape key, body scroll prevention
 * are all handled by HeroUI's React Aria primitives.
 * -------------------------------------------------------------------------- */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "full" | "cover";
  children: ReactNode;
  className?: string;
}

function Modal({
  isOpen,
  onClose,
  size = "md",
  children,
  className,
}: ModalProps) {
  return (
    <HeroModal isOpen={isOpen}>
      <ModalBackdrop isDismissable onClick={onClose} />
      <ModalContainer size={size}>
        <ModalDialog>
          <div className={cn("relative", className)}>
            <ModalCloseTrigger
              className="absolute top-6 right-6 p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-tertiary transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </ModalCloseTrigger>
            {children}
          </div>
        </ModalDialog>
      </ModalContainer>
    </HeroModal>
  );
}

/* --- Modal Header --- */
interface ModalHeaderProps {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

function ModalHeader({ icon, children, className }: ModalHeaderProps) {
  return (
    <HeroModalHeader className={cn("flex items-center gap-3", className)}>
      {icon && (
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/20 text-accent">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <h2 className="text-headline font-headline text-foreground">{children}</h2>
      </div>
    </HeroModalHeader>
  );
}

/* --- Modal Body --- */
interface ModalBodyProps {
  className?: string;
  children: ReactNode;
}

function ModalBody({ className, children }: ModalBodyProps) {
  return (
    <HeroModalBody className={cn("px-8 py-4", className)}>
      {children}
    </HeroModalBody>
  );
}

/* --- Modal Footer --- */
interface ModalFooterProps {
  className?: string;
  children: ReactNode;
}

function ModalFooter({ className, children }: ModalFooterProps) {
  return (
    <HeroModalFooter className={cn("px-8 pb-8 pt-4", className)}>
      {children}
    </HeroModalFooter>
  );
}

/* --- Compound Export --- */
const ModalCompound = Object.assign(Modal, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});

export {
  ModalCompound,
  type ModalProps,
  type ModalHeaderProps,
  type ModalBodyProps,
  type ModalFooterProps,
};
