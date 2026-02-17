interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "size-4",
  md: "size-5",
  lg: "size-8",
};

const Spinner = ({ size = "md", className = "" }: SpinnerProps) => {
  return (
    <div
      className={`spinner ${sizeMap[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;
