interface AlertProps {
  type: "error" | "success";
  message: string;
  className?: string;
}

const icons = {
  error: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 mt-0.5"
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 4.5V8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  ),
  success: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 mt-0.5"
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 8L7 10L11 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const Alert = ({ type, message, className = "" }: AlertProps) => {
  return (
    <div className={`alert-${type} ${className}`} role="alert">
      {icons[type]}
      <span>{message}</span>
    </div>
  );
};

export default Alert;
