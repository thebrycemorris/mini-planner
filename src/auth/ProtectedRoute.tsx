import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <div className="page"><div className="card">Loading…</div></div>;
  if (!user) return <Navigate to="/auth" replace state={{ from: loc.pathname }} />;

  return <>{children}</>;
}
