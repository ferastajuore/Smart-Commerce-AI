// Find workspace by owner ID — Auth Module service wrapper
// Ref: ARCHITECTURE.md §5 (Auth Module resolves workspaceId once per request),
// SECURITY.md §4.2 (session encodes workspaceId for STORE_OWNER)
//
// This service wraps the data layer call for use by lib/auth.ts
// (NextAuth authorize callback) and other infrastructure code
// that cannot directly import from the data layer.

import { findWorkspaceByOwnerId as findWorkspaceByOwnerIdData } from "../data/find-workspace-by-owner-id";
import type { Workspace } from "@prisma/client";

export async function findWorkspaceByOwnerId(
  ownerId: string,
): Promise<Workspace | null> {
  return findWorkspaceByOwnerIdData(ownerId);
}
