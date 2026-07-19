// Find all workspaces for admin — Admin Module data path
// EXCEPTION: Cross-tenant query — permitted ONLY in modules/admin/data/.
// Ref: ARCHITECTURE.md §7 (Admin Module is the sole exception to tenant scoping),
// SECURITY.md §5.3 (Admin boundary enforcement),
// FOLDER_STRUCTURE.md §5.1 (admin/data/ is the documented exception),
// PRD.md ADM-1 (Admin can view all Stores),
// PRD.md ADM-5 (Admin CANNOT read Product, Inventory, or Order contents)
//
// This file is structurally distinct from any Store-facing data function.
// It does NOT use tenantWhere() — it intentionally queries across all Workspaces.
// This cross-tenant capability is restricted to Workspace-level metadata ONLY.

import { prisma } from "@/lib/prisma";
import type { Workspace } from "@prisma/client";

/**
 * Returns all Workspaces across all tenants — Admin-only, cross-tenant query.
 *
 * SECURITY CONSTRAINT (PRD.md ADM-5): This function returns Workspace-level
 * metadata only. It must NEVER be extended to query Product, Inventory, or
 * Order tables. Any such extension requires explicit security review.
 *
 * Any pull request modifying this function requires review attention per
 * SECURITY.md §5.3.
 *
 * @returns All Workspaces, ordered by creation date (newest first)
 */
export async function findAllWorkspaces(): Promise<Workspace[]> {
  return prisma.workspace.findMany({
    orderBy: { createdAt: "desc" },
  });
}
