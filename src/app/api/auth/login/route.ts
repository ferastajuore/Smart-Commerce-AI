// Custom credential login endpoint
// Ref: ARCHITECTURE.md §12 (NextAuth for session management),
// SECURITY.md §4 (credential verification, session management),
// FOLDER_STRUCTURE.md §4 (app/api/auth/)
//
// NextAuth v4's built-in CredentialsProvider cannot parse the form-encoded
// request body in Next.js 16+ (Web ReadableStream incompatibility), causing
// the authorize callback to always receive empty credentials.
// This endpoint handles credential authentication directly, creates a JWT
// matching NextAuth's expected format, and sets the session cookie.
// getServerSession(authOptions) continues to work because it reads the
// same cookie and decodes the same JWT structure.

import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import bcrypt from "bcryptjs";

import { findUserByEmail } from "@/modules/auth/services/find-user-by-email";
import { findWorkspaceByOwnerId } from "@/modules/auth/services/find-workspace-by-owner-id";
import type { UserRole } from "@prisma/client";

// Must match SESSION_MAX_AGE_SECONDS in lib/auth.ts
const SESSION_MAX_AGE_SECONDS = 24 * 60 * 60; // 24 hours

/**
 * Authenticates a user with email/password credentials and sets a
 * NextAuth-compatible session cookie.
 *
 * Security measures:
 * - Generic error messages — never reveals whether email exists (SECURITY.md §4)
 * - bcrypt password verification (SECURITY.md §4.1)
 * - HTTP-only cookie, SameSite=Lax (SECURITY.md §4.2)
 *
 * @returns 200 with success on valid credentials, 400/401/500 on failure
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as {
      email?: string;
      password?: string;
    };

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      // SECURITY.md §4: generic error, no email enumeration
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Verify password with bcrypt
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      // SECURITY.md §4: generic error for wrong password
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Resolve workspaceId for STORE_OWNER
    // Ref: SECURITY.md §4.2 (session encodes workspaceId for STORE_OWNER)
    let workspaceId: string | undefined;
    if (user.role === "STORE_OWNER") {
      const workspace = await findWorkspaceByOwnerId(user.id);
      workspaceId = workspace?.id;
    }

    // Create JWT matching the structure from lib/auth.ts jwt callback
    // This ensures getServerSession(authOptions) can decode and expose
    // the correct session data via the session callback.
    const token = await encode({
      token: {
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
        workspaceId,
        sub: user.id,
      },
      secret: process.env.NEXTAUTH_SECRET!,
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    const response = NextResponse.json({ success: true });

    // Set session cookie — same name as NextAuth v4
    // Ref: SECURITY.md §4.2 (HTTP-only, SameSite=Lax)
    // NEXTAUTH_URL is http://localhost:3000, so no __Secure prefix
    response.cookies.set("next-auth.session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("[Login API] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
