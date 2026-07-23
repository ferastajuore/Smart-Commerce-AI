import { Card as HeroCard } from "@heroui/react";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * Card — DESIGN_SYSTEM.md §32
 * Wraps HeroUI v3 Card compound component with custom variants.
 * Supports variants: default, elevated, ai-insight, alert, success.
 * -------------------------------------------------------------------------- */

type CardVariant = "default" | "elevated" | "ai-insight" | "alert" | "success";

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children?: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: "",
  elevated: "bg-surface-tertiary",
  "ai-insight":
    "border border-primary-700/50 bg-gradient-to-br from-primary-900/50 to-surface-secondary",
  alert:
    "border border-tertiary-700/50 bg-tertiary-900/30",
  success:
    "border border-secondary-700/50 bg-secondary-900/30",
};

function Card({ variant = "default", className, children }: CardProps) {
  return (
    <HeroCard
      className={cn(variantStyles[variant], className)}
    >
      {children}
    </HeroCard>
  );
}

/* --- Card Header --- */
type CardHeaderProps = {
  className?: string;
  children?: React.ReactNode;
};

function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <HeroCard.Header className={cn("px-6 py-4", className)}>
      {children}
    </HeroCard.Header>
  );
}

/* --- Card Title --- */
type CardTitleProps = {
  className?: string;
  children?: React.ReactNode;
};

function CardTitle({ className, children }: CardTitleProps) {
  return (
    <HeroCard.Title className={cn("text-headline font-headline", className)}>
      {children}
    </HeroCard.Title>
  );
}

/* --- Card Description --- */
type CardDescriptionProps = {
  className?: string;
  children?: React.ReactNode;
};

function CardDescription({ className, children }: CardDescriptionProps) {
  return (
    <HeroCard.Description className={cn("text-body-sm text-muted", className)}>
      {children}
    </HeroCard.Description>
  );
}

/* --- Card Body --- */
type CardBodyProps = {
  className?: string;
  children?: React.ReactNode;
};

function CardBody({ className, children }: CardBodyProps) {
  return (
    <HeroCard.Content className={cn("px-6 py-4", className)}>
      {children}
    </HeroCard.Content>
  );
}

/* --- Card Footer --- */
type CardFooterProps = {
  className?: string;
  children?: React.ReactNode;
};

function CardFooter({ className, children }: CardFooterProps) {
  return (
    <HeroCard.Footer className={cn("px-6 py-4 border-t border-separator", className)}>
      {children}
    </HeroCard.Footer>
  );
}

/* --- Compound Export --- */
const CardCompound = Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
});

export {
  CardCompound as Card,
  type CardProps,
  type CardVariant,
  type CardHeaderProps,
  type CardTitleProps,
  type CardDescriptionProps,
  type CardBodyProps,
  type CardFooterProps,
};
