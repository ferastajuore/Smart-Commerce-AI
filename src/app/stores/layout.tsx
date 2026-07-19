// Stores layout — enforces STORE_OWNER session
// Ref: ARCHITECTURE.md §5 (Auth Module enforces role separation),
// SECURITY.md §4.3 (app/stores/layout.tsx verifies session role),
// SECURITY.md §5.1 (two-layer enforcement — routing + service),
// PRD.md AUTH-3, AUTH-4 (Store Owner session is valid only for /stores/*),
// FOLDER_STRUCTURE.md §4 (stores/layout.tsx enforces STORE_OWNER session)
//
// This is the routing-layer defense. It blocks a mismatched session
// before any page or Server Action runs — consistent with Security
// by Default (AGENTS.md §10).

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import type { ReactNode } from "react";

interface StoresLayoutProps {
  children: ReactNode;
}

export default async function StoresLayout({
  children,
}: StoresLayoutProps) {
  const session = await getServerSession(authOptions);

  // No session — redirect to login
  if (!session?.user) {
    redirect("/login");
  }

  // Wrong role — redirect to admin area
  // SECURITY.md §4.3: STORE_OWNER session cannot render under /admin/*
  // Symmetrically, a PLATFORM_ADMIN session cannot render under /stores/*
  if (session.user.role !== "STORE_OWNER") {
    redirect("/admin");
  }

  // No workspaceId — Store Owner without a workspace cannot operate
  if (!session.user.workspaceId) {
    redirect("/login");
  }

  return <>{children}</>;
}
