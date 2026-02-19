import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useResetPassword } from "@/hooks/useAuth";
import { parseApiError } from "@/lib/errors";
import { validateConfirmPassword, validatePassword } from "@/lib/validators";
import FormField from "@/components/ui/FormField";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import type { FieldErrors } from "@/types";
import EyeIcon from "@/components/ui/EyeIcon";
import PasswordStrengthBar from "@/components/ui/PasswordStrengthBar";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code") ?? "";
  const exp = searchParams.get("exp") ? Number(searchParams.get("exp")) : 0;

  const { mutate: resetPassword, isPending, isSuccess } = useResetPassword();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");

  const isExpired = !exp || Date.now() > exp;
  const isInvalidLink = !code || code.length !== 24;

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(confirmPassword, password);
    if (passErr) errors.password = passErr;
    if (confirmErr) errors.confirmPassword = confirmErr;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    if (!validate()) return;

    resetPassword(
      { password, confirmPassword, verificationCode: code },
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
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Set a new password
        </h1>
        <p className="text-muted-foreground text-sm">
          Choose a strong password to protect your account.
        </p>
      </div>

      <div className="auth-card">
        {isSuccess ? (
          // Success state
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                Password updated!
              </h2>
              <p className="text-sm text-muted-foreground">
                Your password has been changed successfully.
                <br />
                Redirecting you to login…
              </p>
            </div>
            <Link
              to="/login"
              className="text-sm text-primary hover:opacity-80 transition-opacity mt-2"
            >
              Go to login
            </Link>
          </div>
        ) : isInvalidLink || isExpired ? (
          // Invalid link orexpire state
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="size-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
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
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                Reset password failed
              </h2>
              <p className="text-sm text-muted-foreground">
                This password reset link is invalid or expired. Please request a
                new one.
              </p>
            </div>
            <Link
              to="/password/forgot"
              className="btn-primary text-center mt-2"
            >
              Request new link
            </Link>
          </div>
        ) : (
          // Valid link — show form
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            {globalError && <Alert type="error" message={globalError} />}

            <div className="form-group">
              <label className="field-label" htmlFor="password">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password)
                      setFieldErrors((p) => ({ ...p, password: "" }));
                  }}
                  className={`field-input pr-11 ${fieldErrors.password ? "error" : ""}`}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>

              {/* Strength bar — 4 segments matching 5 backend rules */}
              <PasswordStrengthBar password={password} />

              {fieldErrors.password && (
                <p className="field-error" role="alert">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <FormField
              label="Confirm New Password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword)
                  setFieldErrors((p) => ({ ...p, confirmPassword: "" }));
              }}
              error={fieldErrors.confirmPassword}
              placeholder="Repeat your new password"
              autoComplete="new-password"
            />

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary flex items-center justify-center gap-2 mt-1"
            >
              {isPending ? (
                <>
                  <Spinner size="sm" />
                  Updating…
                </>
              ) : (
                "Update password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
