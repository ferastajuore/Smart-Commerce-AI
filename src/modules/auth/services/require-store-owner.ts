// requireStoreOwner — Auth Module service
// Ref: ARCHITECTURE.md §5 (exposes requireStoreOwner),
// SECURITY.md §4.3 (role separation enforcement),
// SECURITY.md §5.1 (service layer independently verifies caller authority),
// PRD.md AUTH-3 (Store Owner can only access /stores/*)
//
// Verifies the session belongs to a STORE_OWNER with a valid workspaceId.
// This is the service-layer backstop — it runs independently of the
// routing-layer check in app/stores/layout.tsx (SECURITY.md §5.1).

import type { Session } from "next-auth";

import { getCurrentUser } from "./get-current-user";
import { AppError } from "@/shared/errors/app-error";
import type { SessionUser } from "@/modules/auth/types";

/**
 * Requires an authenticated Store Owner session.
 *
 * @param session - The NextAuth session object
 * @param options.revalidate - If true, re-checks user against database
 * @returns A validated SessionUser guaranteed to have workspaceId
 * @throws AppError UNAUTHORIZED if not authenticated
 * @throws AppError FORBIDDEN if not a Store Owner or missing workspaceId
 */
export async function requireStoreOwner(
  session: Session | null,
  options?: { revalidate?: boolean },
): Promise<SessionUser> {
  const user = await getCurrentUser(session, options);

  if (user.role !== "STORE_OWNER") {
    throw new AppError(
      403,
      "FORBIDDEN",
      "Store Owner access required",
    );
  }

  if (!user.workspaceId) {
    throw new AppError(
      403,
      "FORBIDDEN",
      "No workspace associated with this account",
    );
  }

  return user;
}
