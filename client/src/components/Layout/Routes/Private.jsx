import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/auth";
import Spinner from "./Spinner";

export default function PrivateRoute() {
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Wait until AuthContext loads
      const storedAuth = localStorage.getItem("auth");

      if (!storedAuth) {
        setLoading(false);
        return;
      }

      try {
        const { token } = JSON.parse(storedAuth);

        const { data } = await axios.get("/api/v1/auth/user-auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOk(data.ok);
      } catch (err) {
        setOk(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <Spinner />;

  return ok ? <Outlet /> : <Navigate to="/login" replace />;
}
