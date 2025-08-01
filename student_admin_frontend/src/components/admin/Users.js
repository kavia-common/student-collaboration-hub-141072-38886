import React, { useState, useEffect } from "react";
import axios from "axios";

// PUBLIC_INTERFACE
function Users({ user }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = window.localStorage.getItem('token');
      const res = await axios.get("/users", {
        baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data || []);
      setError("");
    } catch (e) { setError("Could not load users."); }
    setLoading(false);
  };

  const handleDelete = async uid => {
    if (!window.confirm("Delete user?")) return;
    try {
      const token = window.localStorage.getItem('token');
      await axios.delete(`/users/${uid}`, {
        baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (e) {
      setError("Could not delete user.");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "30px auto 0 auto" }}>
      <h1 style={{ fontSize: 25, marginBottom: 25 }}>User Directory</h1>
      {error && <div style={{ color: "#f33" }}>{error}</div>}
      {loading ? <div className="centered">Loading users...</div> :
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ background: "#eaeaea", color: "#111" }}>
              <th style={thStyle}>Username</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={tdStyle}>{u.username}</td>
                <td style={tdStyle}>{u.name}</td>
                <td style={tdStyle}>{u.role}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  {u.role !== "admin" && (
                    <button
                      style={{
                        background: "#f33", color: "#fff",
                        border: "none", borderRadius: 6, padding: "5px 15px", fontWeight: 600
                      }}
                      aria-label={`Delete user ${u.username}`}
                      onClick={() => handleDelete(u.id)}
                    >Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
}
const thStyle = { padding: "9px 14px", borderBottom: "2px solid #c2cbe2", textAlign: "left" };
const tdStyle = { padding: "7px 14px", borderBottom: "1px solid #dde3f0" };
export default Users;
