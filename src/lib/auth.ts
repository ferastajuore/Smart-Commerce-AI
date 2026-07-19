// NextAuth configuration — Auth Module
// Ref: ARCHITECTURE.md §12 (NextAuth for session and credential management),
// SECURITY.md §4.1 (credential storage), §4.2 (session management),
// FOLDER_STRUCTURE.md §6 (lib/auth.ts)
//
// This file configures:
// - Credential-based (email/password) authentication
// - JWT strategy with role + workspaceId encoded in the token
// - Session callbacks that expose role and workspaceId to the client
// - Finite session expiry and inactivity timeout

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { findUserByEmail } from "@/modules/auth/services/find-user-by-email";
import { findWorkspaceByOwnerId } from "@/modules/auth/services/find-workspace-by-owner-id";
import type { UserRole } from "@prisma/client";

// Password hashing work factor — fixed once here per SECURITY.md §4.1
// 12 rounds provides good balance of security vs login latency
export const BCRYPT_WORK_FACTOR = 12;

// Session configuration — SECURITY.md §4.2
// Finite expiry; must be re-authenticated after this duration
const SESSION_MAX_AGE_SECONDS = 24 * 60 * 60; // 24 hours

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          // SECURITY.md §4: never reveal which field is missing
          return null;
        }

        // Find user by email
        const user = await findUserByEmail(credentials.email);
        if (!user) {
          // SECURITY.md §4: return null for invalid credentials
          // (generic failure, no email enumeration)
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );
        if (!isValid) {
          // SECURITY.md §4: generic failure for wrong password
          return null;
        }

        // Resolve workspaceId for STORE_OWNER
        // Ref: SECURITY.md §4.2 (session encodes workspaceId for STORE_OWNER)
        let workspaceId: string | undefined;
        if (user.role === "STORE_OWNER") {
          const workspace = await findWorkspaceByOwnerId(user.id);
          workspaceId = workspace?.id;
        }

        // Return user data to be encoded in JWT
        return {
          id: user.id,
          email: user.email,
          role: user.role as UserRole,
          workspaceId,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    // Called when a user signs in — encode role + workspaceId into JWT
    // Ref: SECURITY.md §4.2 (session encodes exactly one role and workspaceId)
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role as UserRole;
        token.workspaceId = user.workspaceId;
      }
      return token;
    },

    // Called on every session access — expose role + workspaceId to client
    // Ref: SECURITY.md §4.2
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        role: token.role as UserRole,
        workspaceId: token.workspaceId as string | undefined,
      };
      return session;
    },
  },

  // SECURITY.md §4.2: secret is from environment variable, never hardcoded
  secret: process.env.NEXTAUTH_SECRET,
};
