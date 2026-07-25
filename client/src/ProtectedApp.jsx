import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/auth";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";

function PrivateRoute() {
  const [auth] = useAuth();
  const shown = useRef(false);

  useEffect(() => {
    if (!auth?.token && !shown.current) {
      toast.error("Login required. Please sign in to continue.");
      shown.current = true;
    }
  }, [auth]);

  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
