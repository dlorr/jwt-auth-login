import { Route, Routes, useNavigate } from "react-router-dom";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import AuthLayout from "./layouts/AuthLayout";
import Register from "./pages/Register";
import { useEffect } from "react";
import { setNavigate } from "./lib/navigation";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}
