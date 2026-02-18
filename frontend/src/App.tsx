import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import VerifyEmailLayout from "./components/layout/VerifyEmailLayout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public auth pages — redirects to /profile when already logged in */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset" element={<ResetPassword />} />
      </Route>

      {/* Email verify — always accessible regardless of auth state */}
      <Route path="/email/verify/:code" element={<VerifyEmailLayout />} />

      {/* Protected pages — redirects to /login if not authenticated */}
      <Route element={<ProtectedLayout />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
