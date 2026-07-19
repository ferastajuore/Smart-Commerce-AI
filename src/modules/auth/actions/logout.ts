"use server";

// Logout Server Action
// Ref: API.md §9 (logout endpoint)

import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

/**
 * Signs out the current user and redirects to the login page.
 * Ref: API.md §9
 */
export async function logout(): Promise<void> {
  await signOut({ redirect: false });
  redirect("/login");
}
