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
import EyeIcon from "@/components/ui/EyeIcon";
import PasswordStrengthBar from "@/components/ui/PasswordStrengthBar";

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
            <PasswordStrengthBar password={password} />

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
