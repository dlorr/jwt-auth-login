// ── Regex — mirrors backend constants/regex.ts ─────────────────────────────
const AT_LEAST_ONE_NUMBER = /[0-9]+/;
const AT_LEAST_ONE_LETTER = /[a-zA-Z]+/;
const AT_LEAST_ONE_LOWERCASE = /[a-z]+/;
const AT_LEAST_ONE_UPPERCASE = /[A-Z]+/;
const AT_LEAST_ONE_SPECIAL_CHAR = /[@$!%*?&]+/;

// ── Individual field validators ─────────────────────────────────────────────

export const validateEmail = (value: string): string | undefined => {
  if (!value.trim()) return "Email is required.";
  if (value.length < 6) return "Email must be at least 6 characters.";
  if (value.length > 100) return "Email cannot exceed 100 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Invalid email address.";
};

export const validatePassword = (value: string): string | undefined => {
  if (!value) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (value.length > 100) return "Password cannot exceed 100 characters.";
  if (!AT_LEAST_ONE_NUMBER.test(value))
    return "At least one number is required.";
  if (!AT_LEAST_ONE_LETTER.test(value))
    return "At least one letter is required.";
  if (!AT_LEAST_ONE_LOWERCASE.test(value))
    return "At least one lowercase letter is required.";
  if (!AT_LEAST_ONE_UPPERCASE.test(value))
    return "At least one uppercase letter is required.";
  if (!AT_LEAST_ONE_SPECIAL_CHAR.test(value))
    return "At least one special character is required.";
};

// Login uses a looser password rule (no complexity, just length)
export const validateLoginPassword = (value: string): string | undefined => {
  if (!value) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (value.length > 100) return "Password cannot exceed 100 characters.";
};

export const validateConfirmPassword = (
  value: string,
  password: string,
): string | undefined => {
  if (!value) return "Please confirm your password.";
  if (value.length < 8)
    return "Confirm password must be at least 8 characters.";
  if (value.length > 100)
    return "Confirm password cannot exceed 100 characters.";
  if (value !== password) return "Passwords do not match.";
};

// ── Legacy grouped export (used by pages that import { validators }) ─────────
// Keep backward-compatible so existing pages still work without edits.
export const validators = {
  email: validateEmail,
  password: validatePassword,
  loginPassword: validateLoginPassword,
  confirmPassword: validateConfirmPassword,
};
