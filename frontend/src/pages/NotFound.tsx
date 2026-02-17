import { Link } from "react-router-dom";
import Logo from "@/components/ui/Logo";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Glow */}
      <div
        className="auth-glow"
        style={{
          width: 500,
          height: 500,
          background: "hsl(var(--primary))",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="relative z-10 text-center">
        <div className="mb-6">
          <Logo size="md" />
        </div>

        <div className="mb-8">
          <p
            className="text-8xl font-bold text-primary/20 leading-none select-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            404
          </p>
          <h1 className="text-2xl font-bold text-foreground mt-2 mb-2">
            Page not found
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="btn-primary"
            style={{ width: "auto", padding: "0.75rem 1.5rem" }}
          >
            Go home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-ghost"
            style={{ width: "auto", padding: "0.75rem 1.5rem" }}
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
