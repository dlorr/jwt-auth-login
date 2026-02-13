import { Navigate, Outlet } from "react-router-dom";
import { LoaderOne } from "../components/ui/Loader";
import useAuth from "../hooks/useAuth";

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth();

  return isLoading ? (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <LoaderOne />
    </div>
  ) : user ? (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Outlet />
    </div>
  ) : (
    <Navigate
      to="/login"
      replace
      state={{
        redirectUrl: window.location.pathname,
      }}
    />
  );
}
