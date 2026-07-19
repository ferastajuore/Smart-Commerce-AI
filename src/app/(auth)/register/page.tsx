// Register page — Store Registration skeleton
// Ref: PRD.md REG-1, FOLDER_STRUCTURE.md §4 (app/(auth)/register/)
//
// Full implementation deferred to Milestone 5: Store Management.
// This page exists so the login page's "Register your store" link
// doesn't 404 during M3.

export default function RegisterPage() {
  return (
    <div className="rounded-2xl border border-white/7 bg-surface-container p-8 shadow-lg">
      <h2 className="mb-2 text-center text-xl font-semibold text-on-surface">
        Register your store
      </h2>
      <p className="mb-6 text-center text-sm text-on-surface-variant">
        Store registration will be available soon.
      </p>
      <a
        href="/login"
        className="block w-full rounded-xl bg-primary py-3 text-center text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
      >
        Back to sign in
      </a>
    </div>
  );
}
