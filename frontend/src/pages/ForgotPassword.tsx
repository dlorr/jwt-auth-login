import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPassword } from "@/hooks/useAuth";
import { parseApiError } from "@/lib/errors";
import { validateEmail } from "@/lib/validators";
import FormField from "@/components/ui/FormField";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import type { FieldErrors } from "@/types";

const ForgotPassword = () => {
  const { mutate: sendReset, isPending, isSuccess } = useForgotPassword();

  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    const emailErr = validateEmail(email);
    if (emailErr) errors.email = emailErr;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    if (!validate()) return;

    sendReset(
      { email },
      {
        onError: (err) => {
          const { message, fieldErrors: fe } = parseApiError(err);
          setFieldErrors(fe);
          setGlobalError(Object.keys(fe).length === 0 ? message : "");
        },
      },
    );
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
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
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to login
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Reset your password
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="auth-card">
        {isSuccess ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="size-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                Check your inbox
              </h2>
              <p className="text-sm text-muted-foreground">
                We sent a password reset link to{" "}
                <span className="text-foreground font-medium">{email}</span>.
                <br />
                It may take a few minutes to arrive.
              </p>
            </div>
            <Link
              to="/login"
              className="text-sm text-primary hover:opacity-80 transition-opacity mt-2"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            {globalError && <Alert type="error" message={globalError} />}

            <FormField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email)
                  setFieldErrors((p) => ({ ...p, email: "" }));
              }}
              error={fieldErrors.email}
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
            />

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary flex items-center justify-center gap-2 mt-1"
            >
              {isPending ? (
                <>
                  <Spinner size="sm" />
                  Sending…
                </>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
