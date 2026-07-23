import { type ReactNode } from "react";

/* --------------------------------------------------------------------------
 * AuthLayout — DESIGN_SYSTEM.md §36
 * Two variants: Variant A (centered single card) and Variant B (split-screen).
 * Full-bleed dark background with radial gradient glow blobs.
 * -------------------------------------------------------------------------- */

interface AuthLayoutProps {
  children: ReactNode;
  /** Layout variant */
  variant?: "centered" | "split";
  /** Left marketing content (split variant only) */
  marketingContent?: ReactNode;
}

function AuthLayout({
  children,
  variant = "centered",
  marketingContent,
}: AuthLayoutProps) {
  if (variant === "split") {
    return (
      <div className="min-h-screen flex bg-background-secondary">
        {/* Left: Marketing content — §36.1 Variant B */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden">
          {/* Gradient glow blobs — §36.1 */}
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--accent), transparent)" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--success), transparent)" }}
          />

          <div className="relative z-10 flex flex-col items-center text-center max-w-md">
            {marketingContent}
          </div>
        </div>

        {/* Right: Auth card */}
        <div className="flex-1 flex items-center justify-center p-8">
          {children}
        </div>
      </div>
    );
  }

  // Variant A: Centered single card — §36.1
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-secondary relative overflow-hidden p-8">
      {/* Gradient glow blobs */}
      <div
        className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent), transparent)" }}
      />
      <div
        className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent-hover), transparent)" }}
      />

      <div className="relative z-10 w-full max-w-container-sm">
        {children}
      </div>
    </div>
  );
}

export { AuthLayout, type AuthLayoutProps };
