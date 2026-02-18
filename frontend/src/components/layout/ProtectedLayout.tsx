import { useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser, useLogout } from "@/hooks/useAuth";
import Logo from "@/components/ui/Logo";
import Spinner from "@/components/ui/Spinner";

const navItems = [
  {
    to: "/profile",
    label: "Profile",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    to: "/settings",
    label: "Settings",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
];

const LogoutIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ProtectedLayout = () => {
  const { data: user, isLoading } = useUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Top nav bar ── */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Logo size="sm" />

          {/* Desktop nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-border/40"
                  }`}
                >
                  <span className={isActive ? "text-primary" : ""}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop right section */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-foreground leading-none truncate max-w-40">
                {user.email}
              </span>
              <span
                className={`text-xs mt-0.5 ${user.verified ? "text-emerald-400" : "text-amber-400"}`}
              >
                {user.verified ? "Verified" : "Unverified"}
              </span>
            </div>

            <div
              className="size-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-semibold text-sm shrink-0"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {user.email[0].toUpperCase()}
            </div>

            <button
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 disabled:opacity-50 shrink-0"
              title="Logout"
            >
              {isLoggingOut ? <Spinner size="sm" /> : <LogoutIcon />}
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile: avatar + hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <div
              className="size-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-semibold text-xs shrink-0"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {user.email[0].toUpperCase()}
            </div>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-border/40 transition-all"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <div className="px-4 py-3 space-y-1">
              {/* User info */}
              <div className="px-3 py-2 mb-2">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.email}
                </p>
                <p
                  className={`text-xs mt-0.5 ${user.verified ? "text-emerald-400" : "text-amber-400"}`}
                >
                  {user.verified ? "Verified" : "Unverified"}
                </p>
              </div>

              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-border/40"
                    }`}
                  >
                    <span className={isActive ? "text-primary" : ""}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}

              {/* Logout */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-border/40 transition-all duration-150 disabled:opacity-50"
              >
                {isLoggingOut ? <Spinner size="sm" /> : <LogoutIcon />}
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Page content ── */}
      <main className="flex-1 py-8 sm:py-10">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ProtectedLayout;
