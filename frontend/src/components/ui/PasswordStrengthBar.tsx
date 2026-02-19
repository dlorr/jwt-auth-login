import { getPasswordStrength } from "@/lib/passwordStrength";

const PasswordStrengthBar = ({ password }: { password: string }) => {
  const strength = getPasswordStrength(password);

  return (
    password.length > 0 && (
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
            Use 8+ chars · uppercase · lowercase · number · special (@$!%*?&)
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
    )
  );
};

export default PasswordStrengthBar;
