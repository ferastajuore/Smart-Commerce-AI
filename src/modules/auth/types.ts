// Auth module types
// Ref: ARCHITECTURE.md §5 (Auth Module owns identity for both roles),
// SECURITY.md §4.2 (session encodes role + workspaceId)
// DATABASE.md §4.1 (User), §7 (UserRole)

import type { UserRole } from "@prisma/client";

/**
 * The session user shape exposed to all modules via getCurrentUser().
 * For STORE_OWNER: includes the associated workspaceId.
 * For PLATFORM_ADMIN: workspaceId is undefined (admins don't operate inside a Store).
 * Ref: SECURITY.md §4.2, ARCHITECTURE.md §5
 */
export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  workspaceId?: string;
}

/**
 * JWT token payload stored in the session cookie.
 * Ref: SECURITY.md §4.2 (session encodes exactly one role and workspaceId)
 */
export interface JwtPayload {
  sub: string; // user ID
  email: string;
  role: UserRole;
  workspaceId?: string;
}

/**
 * NextAuth module augmentation to include role and workspaceId in session.
 * Ref: SECURITY.md §4.2
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: UserRole;
      workspaceId?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    role: UserRole;
    workspaceId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: UserRole;
    workspaceId?: string;
  }
}
