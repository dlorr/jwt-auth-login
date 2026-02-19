import { useUser, useResendVerification } from "@/hooks/useAuth";
import { formatDate } from "@/lib/utils";
import { parseApiError } from "@/lib/errors";
import { useState } from "react";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";

const Profile = () => {
  const { data: user } = useUser();
  const { mutate: resendVerification, isPending: isResending } =
    useResendVerification();
  const [resendMsg, setResendMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleResend = () => {
    setResendMsg(null);
    resendVerification(undefined, {
      onSuccess: (data) =>
        setResendMsg({
          type: "success",
          text: data.message || "Verification email sent. Check your inbox.",
        }),
      onError: (err) => {
        const { message } = parseApiError(err);
        setResendMsg({ type: "error", text: message });
      },
    });
  };

  if (!user) return null;

  return (
    <div className="w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="section-heading">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your account information and verification status.
        </p>
      </div>

      {/* Unverified banner */}
      {!user.verified && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="shrink-0 size-9 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400 mt-0.5">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-400 mb-0.5">
                  Email not verified
                </p>
                <p className="text-xs text-amber-400/70">
                  Verify your email to unlock all features.
                </p>
                {resendMsg && (
                  <div className="mt-3">
                    <Alert type={resendMsg.type} message={resendMsg.text} />
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleResend}
              disabled={isResending}
              className="flex items-center gap-1.5 text-xs font-medium text-amber-400 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-colors px-3 py-2 rounded-lg disabled:opacity-50 self-start shrink-0"
            >
              {isResending ? (
                <>
                  <Spinner size="sm" />
                  Sending…
                </>
              ) : (
                <>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  Resend email
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Cards — stack on mobile, side-by-side on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Avatar card */}
        <div className="lg:col-span-2 settings-card flex flex-row lg:flex-col items-center gap-4 lg:gap-4 lg:text-center py-5 sm:py-8">
          <div
            className="size-14 sm:size-20 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary text-2xl sm:text-3xl font-bold shrink-0"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {user.email[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1 lg:flex-none">
            <p
              className="font-semibold text-foreground text-base sm:text-lg leading-none mb-1 truncate"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {user.email.split("@")[0]}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {user.email}
            </p>
            <div className="mt-2">
              {user.verified ? (
                <span className="badge-success">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Verified
                </span>
              ) : (
                <span className="badge-warning">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Unverified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Details card */}
        <div className="lg:col-span-3 settings-card">
          <h2
            className="text-sm font-semibold text-foreground mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Account Details
          </h2>
          <div className="flex flex-col divide-y divide-border">
            <InfoRow label="Account ID" value={user._id} mono />
            <InfoRow label="Email address" value={user.email} />
            <InfoRow label="Member since" value={formatDate(user.createdAt)} />
            <InfoRow label="Last updated" value={formatDate(user.updatedAt)} />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 py-3">
    <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground shrink-0">
      {label}
    </span>
    <span
      className={`text-sm text-foreground sm:text-right break-all sm:break-normal sm:truncate ${mono ? "font-mono text-xs bg-border/40 px-2 py-1 rounded self-start sm:self-auto" : ""}`}
    >
      {value}
    </span>
  </div>
);

export default Profile;
