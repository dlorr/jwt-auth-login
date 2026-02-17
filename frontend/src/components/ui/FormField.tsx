import { type InputHTMLAttributes, forwardRef } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, id, className = "", ...props }, ref) => {
    const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="form-group">
        <label htmlFor={fieldId} className="field-label">
          {label}
        </label>
        <input
          ref={ref}
          id={fieldId}
          className={`field-input ${error ? "error" : ""} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${fieldId}-error`} className="field-error" role="alert">
            <span aria-hidden="true">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
                <path
                  d="M6 3.5V6.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                />
                <circle cx="6" cy="8.5" r="0.5" fill="currentColor" />
              </svg>
            </span>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-muted-foreground mt-1">{hint}</p>
        )}
      </div>
    );
  },
);

FormField.displayName = "FormField";

export default FormField;
