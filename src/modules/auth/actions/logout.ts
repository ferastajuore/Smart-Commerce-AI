"use server";

// Logout Server Action
// Ref: API.md §9 (logout endpoint)
//
// Signs out the current user by clearing the NextAuth session cookie
// and redirecting to the login page.
//
// This uses server-side cookie clearing instead of signOut from
// next-auth/react, because signOut from next-auth/react makes an
// internal fetch call that doesn't propagate cookie changes correctly
// when called from a Server Action.

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/**
 * Signs out the current user by clearing session cookies and
 * redirecting to the login page.
 * Ref: API.md §9
 */
export async function logout(): Promise<never> {
  const cookieStore = await cookies();

  // Clear NextAuth session cookies (JWT strategy)
  // NextAuth stores session in "next-auth.session-token" (HTTP)
  // or "__Secure-next-auth.session-token" (HTTPS)
  cookieStore.delete("next-auth.session-token");
  cookieStore.delete("__Secure-next-auth.session-token");

  redirect("/login");
}
