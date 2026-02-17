import { useState } from "react";
import { Link } from "react-router-dom";
import { useRegister } from "@/hooks/useAuth";
import { parseApiError } from "@/lib/errors";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/lib/validators";
import FormField from "@/components/ui/FormField";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import type { FieldErrors } from "@/types";

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

// Password strength: checks all 5 backend rules
const getStrength = (
  pw: string,
): { level: 0 | 1 | 2 | 3 | 4; label: string; color: string } => {
  if (!pw) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[@$!%*?&]/.test(pw)) score++;

  if (score <= 1) return { level: 1, label: "Weak", color: "bg-red-500" };
  if (score === 2) return { level: 2, label: "Fair", color: "bg-amber-500" };
  if (score <= 4) return { level: 3, label: "Good", color: "bg-yellow-400" };
  return { level: 4, label: "Strong", color: "bg-emerald-500" };
};

const Register = () => {
  const { mutate: register, isPending } = useRegister();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(confirmPassword, password);
    if (emailErr) errors.email = emailErr;
    if (passErr) errors.password = passErr;
    if (confirmErr) errors.confirmPassword = confirmErr;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    if (!validate()) return;
    register(
      { email, password, confirmPassword },
      {
        onError: (err) => {
          const { message, fieldErrors: fe } = parseApiError(err);
          setFieldErrors(fe);
          setGlobalError(Object.keys(fe).length === 0 ? message : "");
        },
      },
    );
  };

  const strength = getStrength(password);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Create your account
        </h1>
        <p className="text-muted-foreground text-sm">
          Join Aegis and keep your access secure.
        </p>
      </div>

      <div className="auth-card">
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

          {/* Password */}
          <div className="form-group">
            <label className="field-label" htmlFor="password">
              Password
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
            {password.length > 0 && (
              <div className="mt-2 space-y-1.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i <= strength.level ? strength.color : "bg-border"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground">
                    Use 8+ chars · uppercase · lowercase · number · special
                    (@$!%*?&)
                  </p>
                  {strength.label && (
                    <span
                      className={`text-[11px] font-medium ${
                        strength.level === 4
                          ? "text-emerald-400"
                          : strength.level === 3
                            ? "text-yellow-400"
                            : strength.level === 2
                              ? "text-amber-400"
                              : "text-red-400"
                      }`}
                    >
                      {strength.label}
                    </span>
                  )}
                </div>
              </div>
            )}
            {fieldErrors.password && (
              <p className="field-error" role="alert">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <FormField
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (fieldErrors.confirmPassword)
                setFieldErrors((p) => ({ ...p, confirmPassword: "" }));
            }}
            error={fieldErrors.confirmPassword}
            placeholder="Repeat your password"
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
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:opacity-80 font-medium transition-opacity"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
