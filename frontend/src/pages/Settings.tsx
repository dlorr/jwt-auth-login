import { useSessions, useDeleteSession } from "@/hooks/useSessions";
import { parseUserAgent, formatDate } from "@/lib/utils";
import Spinner from "@/components/ui/Spinner";

const Settings = () => {
  const { data: sessions, isLoading, isError, dataUpdatedAt } = useSessions();
  const {
    mutate: deleteSession,
    isPending: isDeleting,
    variables: deletingId,
  } = useDeleteSession();

  return (
    <div className="w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="section-heading">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your active sessions and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Sessions list */}
        <div className="lg:col-span-3 settings-card">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <h2
                className="text-base font-semibold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Active Sessions
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Devices currently logged into your account. Last updated:{" "}
                {new Date(dataUpdatedAt).toLocaleTimeString()}.
              </p>
            </div>
            {sessions && sessions.length > 0 && (
              <span className="badge-primary shrink-0">
                {sessions.length} active
              </span>
            )}
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          )}
          {isError && (
            <p className="text-center text-sm text-muted-foreground py-8">
              Failed to load sessions.
            </p>
          )}
          {sessions && sessions.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No active sessions found.
            </p>
          )}

          {sessions && sessions.length > 0 && (
            <div className="flex flex-col gap-3">
              {sessions.map((session) => {
                const isDeletingThis = isDeleting && deletingId === session._id;
                return (
                  <div
                    key={session._id}
                    className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border transition-all duration-200 ${
                      session.isCurrent
                        ? "border-primary/30 bg-primary/5"
                        : "border-border bg-background/50"
                    }`}
                  >
                    <div
                      className={`shrink-0 size-9 sm:size-10 rounded-xl flex items-center justify-center ${
                        session.isCurrent
                          ? "bg-primary/15 text-primary"
                          : "bg-border/60 text-muted-foreground"
                      }`}
                    >
                      <DeviceIcon userAgent={session.userAgent} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-foreground truncate">
                          {parseUserAgent(session.userAgent)}
                        </p>
                        {session.isCurrent && (
                          <span className="badge-primary text-[10px] shrink-0">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Started {formatDate(session.createdAt)}
                      </p>
                    </div>

                    {!session.isCurrent && (
                      <button
                        onClick={() => deleteSession(session._id)}
                        disabled={isDeletingThis}
                        className="btn-danger shrink-0"
                        aria-label="Revoke session"
                      >
                        {isDeletingThis ? <Spinner size="sm" /> : "Revoke"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Side tips */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <TipCard
            icon={
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            }
            title="Security tip"
            body="If you see a session you don't recognize, revoke it immediately and consider resetting your password."
          />
          <TipCard
            icon={
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
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            }
            title="Session tokens"
            body="Sessions expire after 30 days. Revoking a session logs that device out immediately."
          />
        </div>
      </div>
    </div>
  );
};

const TipCard = ({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) => (
  <div className="settings-card">
    <div className="flex items-start gap-3">
      <div className="text-primary mt-0.5 shrink-0">{icon}</div>
      <div>
        <p
          className="text-sm font-semibold text-foreground mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
      </div>
    </div>
  </div>
);

const DeviceIcon = ({ userAgent }: { userAgent?: string }) => {
  const isMobile = userAgent && /iPhone|Android|Mobile/.test(userAgent);
  return isMobile ? (
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
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ) : (
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
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
};

export default Settings;
