// Admin layout — enforces PLATFORM_ADMIN session
// Ref: ARCHITECTURE.md §5 (Auth Module enforces role separation),
// SECURITY.md §4.3 (app/admin/layout.tsx verifies session role),
// SECURITY.md §5.1 (two-layer enforcement — routing + service),
// PRD.md AUTH-3, AUTH-4 (Admin session is valid only for /admin/*),
// FOLDER_STRUCTURE.md §4 (admin/layout.tsx enforces PLATFORM_ADMIN session)
//
// This is the routing-layer defense. It blocks a mismatched session
// before any page or Server Action runs — consistent with Security
// by Default (AGENTS.md §10).

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const session = await getServerSession(authOptions);

  // No session — redirect to login
  if (!session?.user) {
    redirect("/login");
  }

  // Wrong role — redirect to stores area
  // SECURITY.md §4.3: PLATFORM_ADMIN session cannot render under /stores/*
  // Symmetrically, a STORE_OWNER session cannot render under /admin/*
  if (session.user.role !== "PLATFORM_ADMIN") {
    redirect("/stores/dashboard");
  }

  return <>{children}</>;
}
