import React from "react";
import Layout from "./../../components/Layout/Layout";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //form function
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (!/^\d{10}$/.test(phone)) {
      return toast.error("Phone number must be 10 digits");
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        phone,
      });

      if (res.data.success) {
        toast.success(res.data.message);

        setName("");
        setEmail("");
        setPassword("");
        setPhone("");

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
    <div>
      <Layout title={"Register"}>
        <div className="register">
          <form onSubmit={handleSubmit}>
            <div className="userinfo">
              <h3>Register</h3>

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-dark" disabled={loading}>
              {loading ? "Registering..." : "REGISTER"}
            </button>
          </form>
        </div>
      </Layout>
    </div>
  );
}

export default Register;
