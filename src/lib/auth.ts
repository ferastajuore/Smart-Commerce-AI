// NextAuth configuration placeholder
// Will be implemented in Milestone 3: Authentication & Authorization
// Ref: ARCHITECTURE.md §12, SECURITY.md §4

export const authOptions = {
  providers: [] as never[],
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
  },
};
