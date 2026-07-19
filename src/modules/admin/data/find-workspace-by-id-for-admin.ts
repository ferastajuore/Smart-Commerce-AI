// Find workspace by ID for admin — Admin Module data path
// EXCEPTION: Cross-tenant query — permitted ONLY in modules/admin/data/.
// Ref: ARCHITECTURE.md §7 (Admin Module is the sole exception to tenant scoping),
// SECURITY.md §5.3 (Admin boundary enforcement),
// FOLDER_STRUCTURE.md §5.1 (admin/data/ is the documented exception),
// PRD.md ADM-1 (Admin can view Store details),
// PRD.md ADM-5 (Admin CANNOT read Product, Inventory, or Order contents)
//
// This function uses findUnique (not findFirst with tenantWhere) because
// it operates cross-tenant by design. The workspaceId is NOT mandatory here —
// this is the documented exception to the tenant-scoping convention.
//
// SECURITY NOTE: This function MUST NOT be extended to query tenant-owned
// entities (Product, Inventory, Order). Any such change requires explicit
// security review per SECURITY.md §5.3.

import { prisma } from "@/lib/prisma";
import type { Workspace } from "@prisma/client";

/**
 * Finds a single Workspace by its ID — Admin cross-tenant lookup.
 *
 * Unlike Store-facing data functions, this does NOT use tenantWhere()
 * because the Admin Module is the documented exception to tenant scoping
 * (ARCHITECTURE.md §7, SECURITY.md §5.3).
 *
 * @param id - The Workspace UUID to look up
 * @returns The Workspace if found, null otherwise
 */
export async function findWorkspaceByIdForAdmin(
  id: string,
): Promise<Workspace | null> {
  return prisma.workspace.findUnique({
    where: { id },
  });
}
