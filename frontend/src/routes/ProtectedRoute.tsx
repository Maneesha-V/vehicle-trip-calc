import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const ProtectedRoute = () => {
  const { accessToken, initialized } = useAppSelector((s) => s.auth);

  if (!initialized) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;