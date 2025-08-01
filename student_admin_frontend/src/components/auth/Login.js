import React, { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import axios from "axios";

// PUBLIC_INTERFACE
function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/auth/login", form, {
        baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000"
      });
      onLogin(res.data.user, res.data.token);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="centered" style={{ maxWidth: 370, margin: "7% auto 0 auto" }} aria-label="Login form">
      <h1 style={{ fontSize: 28, marginBottom: 28 }}>Login</h1>
      <form onSubmit={handleSubmit} aria-label="Login">
        <label htmlFor="username" style={{ fontWeight: 500 }}>Username</label>
        <input autoFocus required id="username" name="username" type="text" value={form.username} onChange={onChange}
          style={inputStyle} aria-required="true" disabled={loading} />
        <label htmlFor="password" style={{ fontWeight: 500 }}>Password</label>
        <input required id="password" name="password" type="password" value={form.password} onChange={onChange}
          style={inputStyle} aria-required="true" disabled={loading} />
        {error && <div style={{ color: "#f33", marginTop: 8 }}>{error}</div>}
        <button type="submit" style={btnStyle} disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>
      <div style={{ marginTop: 22 }}>
        <NavLink to="/register">Don't have an account? Register</NavLink>
      </div>
    </div>
  );
}
const inputStyle = {
  width: "100%",
  fontSize: 17,
  margin: "8px 0px 14px 0",
  padding: "9px 12px",
  border: "1px solid #d5d5d5",
  borderRadius: 6,
  background: "var(--bg-secondary)",
  color: "var(--text-primary)"
};
const btnStyle = {
  marginTop: 20,
  width: "100%",
  padding: "10px 0",
  fontWeight: 700,
  fontSize: 18,
  color: "#fff",
  border: "none",
  borderRadius: 6,
  background: "var(--primary-color, #0052cc)",
  cursor: "pointer"
};
export default Login;
