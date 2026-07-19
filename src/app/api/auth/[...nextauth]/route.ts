// NextAuth App Router route handler
// Ref: ARCHITECTURE.md §12 (NextAuth for session and credential management),
// FOLDER_STRUCTURE.md §4 (app/api/auth/[...nextauth]/route.ts)
//
// Handles all /api/auth/* requests — signIn, signOut, session, CSRF, etc.
// Without this file, signIn() and signOut() from next-auth/react fail at runtime.

import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
