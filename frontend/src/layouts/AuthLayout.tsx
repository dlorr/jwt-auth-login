import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="bg-background text-foreground overflow-x-hidden">
        <Outlet />
      </div>

      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-background" />
      </div>
    </div>
  );
}
