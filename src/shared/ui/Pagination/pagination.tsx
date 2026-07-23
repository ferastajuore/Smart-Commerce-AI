"use client";

import {
  Pagination as HeroPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationSummary,
} from "@heroui/react";
import { cn } from "@/shared/utils";

/* --------------------------------------------------------------------------
 * Pagination — DESIGN_SYSTEM.md §49
 * Wraps HeroUI v3 Pagination compound component.
 * Shows "Showing X of Y", page numbers, and prev/next buttons.
 * -------------------------------------------------------------------------- */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  size = "md",
  className,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  function getPageNumbers(): (number | "...")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }

  const pages = getPageNumbers();

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <PaginationSummary>
        Showing {startItem.toLocaleString("en-US")}–{endItem.toLocaleString("en-US")} of{" "}
        {totalItems.toLocaleString("en-US")}
      </PaginationSummary>

      <HeroPagination size={size}>
        <PaginationPrevious onPress={() => onPageChange(currentPage - 1)} isDisabled={currentPage === 1}>
          Previous
        </PaginationPrevious>
        <PaginationContent>
          {pages.map((page, idx) =>
            page === "..." ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onPress={() => onPageChange(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
        </PaginationContent>
        <PaginationNext onPress={() => onPageChange(currentPage + 1)} isDisabled={currentPage === totalPages}>
          Next
        </PaginationNext>
      </HeroPagination>
    </div>
  );
}

export { Pagination, type PaginationProps };
