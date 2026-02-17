import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useAuth";
import Logo from "@/components/ui/Logo";
import Spinner from "@/components/ui/Spinner";

/**
 * AuthLayout — original grid/glow design, left-form right-decorative split.
 * Left: form (Outlet).  Right: branding panel (hidden on mobile).
 * Redirects authenticated users to /profile.
 */
const AuthLayout = () => {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user) return <Navigate to="/profile" replace />;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* ── Left: form panel ─────────────────────────────── */}
      <div className="flex flex-1 flex-col min-h-screen lg:min-h-0">
        {/* Mobile-only logo header */}
        <header className="flex items-center px-6 py-5 lg:hidden border-b border-border">
          <Logo size="md" />
        </header>

        <main className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-md page-enter">
            <Outlet />
          </div>
        </main>

        <footer className="text-center pb-6 px-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Aegis. All rights reserved.
          </p>
        </footer>
      </div>

      {/* ── Right: decorative panel (desktop only) ───────── */}
      <div className="relative hidden lg:flex lg:w-[48%] xl:w-[50%] flex-col overflow-hidden border-l border-border">
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--border) / 0.5) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--border) / 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Primary glow top-right */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 560,
            height: 560,
            background: "hsl(var(--primary))",
            borderRadius: "50%",
            filter: "blur(90px)",
            opacity: 0.13,
            top: -140,
            right: -80,
          }}
        />

        {/* Secondary glow bottom-left */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 400,
            height: 400,
            background: "hsl(var(--secondary))",
            borderRadius: "50%",
            filter: "blur(80px)",
            opacity: 0.1,
            bottom: -80,
            left: -60,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <Logo size="lg" />

          <div className="max-w-sm">
            <p
              className="text-xs font-semibold tracking-[0.25em] uppercase mb-4"
              style={{
                color: "hsl(var(--primary))",
                fontFamily: "var(--font-display)",
              }}
            >
              Secure by design
            </p>
            <h2
              className="text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-5"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.03em",
              }}
            >
              Your identity,
              <br />
              locked in a{" "}
              <span
                className="relative inline-block"
                style={{ color: "hsl(var(--primary))" }}
              >
                Aegis.
                <span
                  className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)",
                  }}
                />
              </span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              JWT-powered auth with rotating refresh tokens, per-device
              sessions, and email verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {["Session control", "Email verified", "Token rotation"].map(
              (label) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: "hsl(var(--primary))" }}
                  />
                  {label}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
