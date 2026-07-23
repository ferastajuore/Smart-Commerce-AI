/* --------------------------------------------------------------------------
 * Shared UI Component Library — HeroUI v3 Wrappers
 * Design tokens: DESIGN_SYSTEM.md §4–§7
 * Component hierarchy: DESIGN_SYSTEM.md §27.1 (Atomic Design)
 *
 * Atoms: Button, Badge, StatusBadge, Input, Textarea, Checkbox, Radio, Switch
 * Molecules: SearchInput, StatCard, PageHeader
 * Organisms: Card, Modal, EmptyState, Pagination, AIInsightCard
 * Feedback: Toast
 * Loading: Spinner, Skeleton
 * -------------------------------------------------------------------------- */

// Atoms
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from "./Button";
export { Badge, type BadgeProps, type BadgeVariant, type BadgeSize } from "./Badge";
export { StatusBadge, type StatusBadgeProps, type StatusType, type StatusSize } from "./StatusBadge";
export { Input, type InputProps, type InputState } from "./Input/input";
export { Textarea, type TextareaProps } from "./Input/textarea";
export { Checkbox, type CheckboxProps } from "./Input/checkbox";
export { Radio, type RadioProps } from "./Input/radio";
export { Switch, type SwitchProps } from "./Input/switch";
export { SearchInput, type SearchInputProps } from "./Input/search-input";

// Molecules
export { StatCard, type StatCardProps } from "./Card/stat-card";
export { PageHeader, type PageHeaderProps } from "./page-header";

// Organisms — Card (compound)
export {
  Card,
  type CardProps,
  type CardVariant,
  type CardHeaderProps,
  type CardTitleProps,
  type CardDescriptionProps,
  type CardBodyProps,
  type CardFooterProps,
} from "./Card";
export { AIInsightCard, type AIInsightCardProps } from "./Card/ai-insight-card";

// Organisms — Modal (compound)
export {
  Modal,
  type ModalProps,
  type ModalHeaderProps,
  type ModalBodyProps,
  type ModalFooterProps,
} from "./Modal";

// Organisms — EmptyState
export { EmptyState, type EmptyStateProps } from "./EmptyState";

// Organisms — Pagination
export { Pagination, type PaginationProps } from "./Pagination";

// Loading
export { Spinner, type SpinnerProps, type SpinnerSize } from "./Loading/spinner";
export { Skeleton, type SkeletonProps } from "./Loading/skeleton";

// Feedback
export { ToastProvider, useToast, type ToastVariant } from "./toast";
