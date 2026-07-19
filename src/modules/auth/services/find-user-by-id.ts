// Find user by ID — Auth Module service wrapper
// Ref: ARCHITECTURE.md §5 (Auth Module owns identity),
// SECURITY.md §4.2 (session re-verification against database)
//
// This service wraps the data layer call for use by lib/auth.ts
// (NextAuth authorize callback) and other infrastructure code
// that cannot directly import from the data layer.

import { findUserById as findUserByIdData } from "../data/find-user-by-id";
import type { User } from "@prisma/client";

export async function findUserById(id: string): Promise<User | null> {
  return findUserByIdData(id);
}
