import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";

// PUBLIC_INTERFACE
function Register() {
  const [form, setForm] = useState({
    username: "", password: "", name: "", role: "student"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("/auth/register", form, {
        baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000"
      });
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Try a different username.");
    }
    setLoading(false);
  };

  return (
    <div className="centered" style={{ maxWidth: 400, margin: "7% auto 0 auto" }}>
      <h1 style={{ fontSize: 27, marginBottom: 26 }}>Register</h1>
      <form onSubmit={handleSubmit} aria-label="Register">
        <label htmlFor="name" style={{ fontWeight: 500 }}>Name</label>
        <input required id="name" name="name" type="text" value={form.name} onChange={onChange}
          style={inputStyle} aria-required="true" disabled={loading} />
        <label htmlFor="username" style={{ fontWeight: 500 }}>Username</label>
        <input autoFocus required id="username" name="username" value={form.username} onChange={onChange}
          style={inputStyle} aria-required="true" disabled={loading} />
        <label htmlFor="password" style={{ fontWeight: 500 }}>Password</label>
        <input required id="password" name="password" type="password" value={form.password} onChange={onChange}
          style={inputStyle} aria-required="true" disabled={loading} />
        <label htmlFor="role" style={{ fontWeight: 500 }}>Role</label>
        <select id="role" name="role" value={form.role} onChange={onChange} style={inputStyle} disabled={loading} aria-required="true">
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        {error && <div style={{ color: "#f33", marginTop: 8 }}>{error}</div>}
        <button type="submit" style={btnStyle} disabled={loading}>{loading ? "Registering..." : "Register"}</button>
      </form>
      <div style={{ marginTop: 18 }}>
        <NavLink to="/login">Already have an account? Login</NavLink>
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
export default Register;
