// NextAuth middleware
// Ref: SECURITY.md §4.3 (role separation enforcement at routing layer),
// SECURITY.md §5.1 (two-layer enforcement — routing + service),
// FOLDER_STRUCTURE.md §4 (app/stores/layout.tsx and app/admin/layout.tsx
// each independently verify session role)
//
// This middleware handles:
// - Session token refresh
// - Basic route protection for /stores/* and /admin/*
// - Redirect to /login for unauthenticated routes

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // No token — the withAuth wrapper already handles redirect to /login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.role as string;

    // Route protection: /stores/* requires STORE_OWNER
    // Ref: PRD.md AUTH-3, SECURITY.md §4.3
    if (pathname.startsWith("/stores")) {
      if (role !== "STORE_OWNER") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    // Route protection: /admin/* requires PLATFORM_ADMIN
    // Ref: PRD.md AUTH-3, SECURITY.md §4.3
    if (pathname.startsWith("/admin")) {
      if (role !== "PLATFORM_ADMIN") {
        return NextResponse.redirect(new URL("/stores/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only protect routes that need authentication
      // Public routes (login, register, etc.) are excluded
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  // Protect store and admin routes
  // Auth routes are public (login, register, api/auth/*)
  matcher: ["/stores/:path*", "/admin/:path*"],
};
