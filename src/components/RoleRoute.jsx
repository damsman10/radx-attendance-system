import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ children, allowedRoles }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile || !allowedRoles.includes(profile.role)) {
    if (profile?.role === "lecturer") {
      return <Navigate to="/lecturer-dashboard" replace />;
    }

    if (profile?.role === "student") {
      return <Navigate to="/student-dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}