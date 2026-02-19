import { Link, useParams } from "react-router-dom";
import { useVerifyEmail } from "@/hooks/useAuth";
import Spinner from "@/components/ui/Spinner";
import { parseApiError } from "@/lib/errors";

const VerifyEmail = () => {
  const { code } = useParams<{ code: string }>();
  const { isLoading, isSuccess, isError, error } = useVerifyEmail(code);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Email Verification
        </h1>
        <p className="text-muted-foreground text-sm">
          Verifying your email address…
        </p>
      </div>

      <div className="auth-card">
        <div className="flex flex-col items-center gap-5 py-6 text-center">
          {isLoading && (
            <>
              <Spinner size="lg" />
              <p className="text-muted-foreground text-sm">
                Verifying your email, please wait…
              </p>
            </>
          )}

          {isSuccess && (
            <>
              <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  Email verified!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your email address has been successfully verified.
                </p>
              </div>
              <Link
                to="/profile"
                className="btn-primary text-center"
                style={{ width: "auto", padding: "0.75rem 2rem" }}
              >
                Go to profile
              </Link>
            </>
          )}

          {isError && (
            <>
              <div className="size-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  Verification failed
                </h2>
                <p className="text-sm text-muted-foreground">
                  {parseApiError(error).message}
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Link to="/profile" className="btn-primary text-center">
                  Go to profile
                </Link>
                <p className="text-xs text-muted-foreground">
                  You can request a new verification email from your profile.
                </p>
              </div>
            </>
          )}

          {!code && (
            <>
              <div className="size-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                No verification code found. Please use the link from your email.
              </p>
              <Link
                to="/profile"
                className="text-sm text-primary hover:opacity-80 transition-opacity"
              >
                Back to profile
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
