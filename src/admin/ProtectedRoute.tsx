import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = () => {
  const { authenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary text-sm uppercase tracking-widest">Carregando...</div>
      </div>
    );
  }
  if (!authenticated) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
