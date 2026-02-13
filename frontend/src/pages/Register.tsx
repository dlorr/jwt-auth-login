export default function Register() {
  return (
    <div className="flex flex-col gap-4 p-6 md:p-10 min-h-screen">
      {/* Logo/Brand */}
      <div className="flex justify-center gap-2 md:justify-start">
        <a href="/" className="flex items-center gap-2 font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <span className="text-sm font-bold">A</span>
          </div>
          Auth App
        </a>
      </div>

      {/* Form container - centered */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          <form className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-2xl font-bold">Create an account</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your information to get started
              </p>
            </div>

            {/* Email field */}
            <div className="auth-field">
              <label htmlFor="email" className="auth-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="auth-input"
              />
            </div>

            {/* Password field */}
            <div className="auth-field">
              <label htmlFor="password" className="auth-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="auth-input"
              />
            </div>

            {/* Confirm Password field */}
            <div className="auth-field">
              <label htmlFor="confirmPassword" className="auth-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                className="auth-input"
              />
            </div>

            {/* Submit button */}
            <button type="submit" className="auth-button">
              Create account
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
