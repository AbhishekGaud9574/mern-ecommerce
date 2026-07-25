import Layout from "./../../components/Layout/Layout";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Email is required");
    }

    if (!password.trim()) {
      return toast.error("Password is required");
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        const authData = {
          user: res.data.user,
          token: res.data.token,
        };

        setAuth(authData);
        localStorage.setItem("auth", JSON.stringify(authData));

        axios.defaults.headers.common["Authorization"] =
          `Bearer ${res.data.token}`;

        toast.success(res.data.message);

        setEmail("");
        setPassword("");

        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout title={"Login"}>
      <div className="register">
        <form onSubmit={handleSubmit}>
          <div className="userinfo">
            <h3>Login</h3>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => navigate("/forgot-password")}
            >
              FORGOT PASSWORD
            </button>
          </div>

          <button type="submit" className="btn btn-dark" disabled={loading}>
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default Login;
