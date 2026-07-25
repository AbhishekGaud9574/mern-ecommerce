import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/auth";
import Spinner from "./Spinner";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const { data } = await axios.get("/api/v1/auth/user-auth", {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        });

        setOk(data?.ok);
      } catch (error) {
        setOk(false);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token) {
      authCheck();
    } else {
      setLoading(false);
    }
  }, [auth?.token]);

  if (loading) return <Spinner />;

  return ok ? <Outlet /> : <Navigate to="/login" replace />;
}
