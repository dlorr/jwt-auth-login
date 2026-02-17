import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "@/hooks/useAuth";
import { parseApiError } from "@/lib/errors";
import { validateEmail, validateLoginPassword } from "@/lib/validators";
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

const Login = () => {
  const { mutate: login, isPending } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    const emailErr = validateEmail(email);
    const passErr = validateLoginPassword(password);
    if (emailErr) errors.email = emailErr;
    if (passErr) errors.password = passErr;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    if (!validate()) return;
    login(
      { email, password },
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
          Welcome back
        </h1>
        <p className="text-muted-foreground text-sm">
          Sign in to your Aegis account to continue.
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
                placeholder="••••••••"
                autoComplete="current-password"
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
            {fieldErrors.password && (
              <p className="field-error" role="alert">
                {fieldErrors.password}
              </p>
            )}
            <div className="flex justify-end mt-1">
              <Link
                to="/forgot-password"
                className="text-xs text-primary hover:opacity-80 transition-opacity"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn-primary flex items-center justify-center gap-2 mt-1"
          >
            {isPending ? (
              <>
                <Spinner size="sm" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:opacity-80 font-medium transition-opacity"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
