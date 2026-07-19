// requireAdmin — Auth Module service
// Ref: ARCHITECTURE.md §5 (exposes requireAdmin),
// SECURITY.md §4.3 (role separation enforcement),
// SECURITY.md §5.1 (service layer independently verifies caller authority),
// PRD.md AUTH-3 (Platform Administrator can only access /admin/*)
//
// Verifies the session belongs to a PLATFORM_ADMIN.
// This is the service-layer backstop — it runs independently of the
// routing-layer check in app/admin/layout.tsx (SECURITY.md §5.1).

import type { Session } from "next-auth";

import { getCurrentUser } from "./get-current-user";
import { AppError } from "@/shared/errors/app-error";
import type { SessionUser } from "@/modules/auth/types";

/**
 * Requires an authenticated Platform Administrator session.
 *
 * @param session - The NextAuth session object
 * @param options.revalidate - If true, re-checks user against database
 * @returns A validated SessionUser with PLATFORM_ADMIN role
 * @throws AppError UNAUTHORIZED if not authenticated
 * @throws AppError FORBIDDEN if not a Platform Administrator
 */
export async function requireAdmin(
  session: Session | null,
  options?: { revalidate?: boolean },
): Promise<SessionUser> {
  const user = await getCurrentUser(session, options);

  if (user.role !== "PLATFORM_ADMIN") {
    throw new AppError(
      403,
      "FORBIDDEN",
      "Platform Administrator access required",
    );
  }

  return user;
}
