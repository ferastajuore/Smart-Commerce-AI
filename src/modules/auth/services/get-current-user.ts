// getCurrentUser — Auth Module service
// Ref: ARCHITECTURE.md §5 (exposes getCurrentUser),
// SECURITY.md §4.2 (session re-verification against database),
// SECURITY.md §5.1 (service layer independently verifies caller authority)
//
// Extracts and validates the session user from the NextAuth session.
// On sensitive actions, re-verifies the user still exists and has the
// expected role — a Workspace status change (e.g., to SUSPENDED) takes
// effect without waiting for token expiry.

import type { Session } from "next-auth";

import { findUserById } from "./find-user-by-id";
import { findWorkspaceByOwnerId } from "./find-workspace-by-owner-id";
import { AppError } from "@/shared/errors/app-error";
import type { SessionUser } from "@/modules/auth/types";

/**
 * Extracts the authenticated user from the session and optionally
 * re-verifies against the database.
 *
 * @param session - The NextAuth session object
 * @param options.revalidate - If true, re-checks user exists and role hasn't changed
 * @returns The validated SessionUser
 * @throws AppError UNAUTHORIZED if no valid session
 * @throws AppError FORBIDDEN if re-validation fails (user deleted, role changed)
 */
export async function getCurrentUser(
  session: Session | null,
  options?: { revalidate?: boolean },
): Promise<SessionUser> {
  // Layer 1: Check session exists and has valid user data
  if (!session?.user?.id) {
    throw new AppError(401, "UNAUTHORIZED", "Authentication required");
  }

  const { id, email, role, workspaceId } = session.user;

  // Layer 2: Re-verify against database on sensitive actions
  // Ref: SECURITY.md §4.2 (re-verification against the database
  // on sensitive actions rather than trusting the token indefinitely)
  if (options?.revalidate) {
    const user = await findUserById(id);
    if (!user) {
      throw new AppError(
        401,
        "UNAUTHORIZED",
        "User account no longer exists",
      );
    }
    if (user.role !== role) {
      throw new AppError(
        403,
        "FORBIDDEN",
        "User role has changed. Please sign in again.",
      );
    }

    // Re-verify workspace for STORE_OWNER
    // Ref: SECURITY.md §4.2 (re-verification against the database
    // on sensitive actions — workspace must still exist and not be suspended)
    if (role === "STORE_OWNER") {
      const workspace = await findWorkspaceByOwnerId(id);
      if (!workspace) {
        throw new AppError(
          403,
          "FORBIDDEN",
          "Workspace no longer exists",
        );
      }
      if (workspace.status === "SUSPENDED") {
        throw new AppError(
          403,
          "FORBIDDEN",
          "Workspace has been suspended. Please contact support.",
        );
      }
    }
  }

  return {
    id,
    email: email ?? "",
    role,
    workspaceId,
  };
}
