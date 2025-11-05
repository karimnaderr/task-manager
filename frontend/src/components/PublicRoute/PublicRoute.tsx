import { Navigate } from "react-router-dom";

type PublicRouteProps = {
  children: React.ReactNode;
};

const PublicRoute = ({ children }: PublicRouteProps) => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;

