import React, { useState } from "react";
import axios from "axios";

// PUBLIC_INTERFACE
function Profile({ user, setUser }) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    username: user.username,
    role: user.role,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [err, setErr] = useState("");

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async e => {
    e.preventDefault();
    setLoading(true); setSuccess(""); setErr("");
    try {
      const token = window.localStorage.getItem('token');
      const res = await axios.patch("/users/me/profile", form, {
        baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Profile updated");
      setUser({ ...user, ...form });
    } catch (e) { setErr("Could not update profile."); }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 420, margin: "45px auto 0 auto" }}>
      <h1 style={{ fontSize: 24, marginBottom: 18 }}>Your Profile</h1>
      <form onSubmit={handleUpdate} aria-label="Update Profile">
        <label htmlFor="name" style={{ fontWeight: 500 }}>Name</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={onChange}
          style={inputStyle}
          disabled={loading}
        />
        <label htmlFor="email" style={{ fontWeight: 500 }}>Email</label>
        <input
          id="email"
          name="email"
          value={form.email}
          onChange={onChange}
          style={inputStyle}
          disabled={loading}
        />
        <label htmlFor="username" style={{ fontWeight: 500 }}>Username</label>
        <input
          id="username"
          name="username"
          value={form.username}
          readOnly
          style={{ ...inputStyle, background: "#f4f4f4" }}
          aria-readonly="true"
          tabIndex={-1}
        />
        <label htmlFor="role" style={{ fontWeight: 500 }}>Role</label>
        <input
          id="role"
          name="role"
          value={form.role}
          readOnly
          style={{ ...inputStyle, background: "#f4f4f4" }}
          aria-readonly="true"
          tabIndex={-1}
        />
        <button
          style={{
            width: "100%",
            padding: "10px 0",
            fontWeight: 700,
            fontSize: 18,
            color: "#fff",
            border: "none",
            borderRadius: 6,
            background: "var(--primary-color, #0052cc)",
            cursor: "pointer",
            marginTop: 17
          }}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
      {success && <div style={{ color: "#2ab54a", marginTop: 12 }}>{success}</div>}
      {err && <div style={{ color: "#f33", marginTop: 12 }}>{err}</div>}
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
export default Profile;
