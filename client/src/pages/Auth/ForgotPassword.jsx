import React from "react";
import Layout from "../../components/Layout/Layout";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // const [answer, setAnswer] = useState("")

  const navigate = useNavigate();

  //form function
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/v1/auth/forgot-password", {
        email,
        newPassword,
      });

      if (res.data.success) {
        toast.success(res.data.message);

        setEmail("");
        setNewPassword("");

        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout title="Reset Password">
      <div className="register">
        <form onSubmit={handleSubmit}>
          <div className="userinfo">
            <h3>Reset Password</h3>
            {/* <label>email</label> */}
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-dark" disabled={loading}>
            {loading ? "Resetting..." : "RESET"}
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default ForgotPassword;
