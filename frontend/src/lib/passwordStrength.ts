// Password strength: checks all 5 backend rules
export const getPasswordStrength = (
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
