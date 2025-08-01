import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// PUBLIC_INTERFACE
function Groups({ user }) {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const token = window.localStorage.getItem('token');
      const res = await axios.get("/groups", {
        baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroups(res.data || []);
    } catch (e) { }
    setLoading(false);
  };

  const handleCreate = async e => {
    e.preventDefault();
    setError("");
    if (!groupName) return;
    setLoading(true);
    try {
      const token = window.localStorage.getItem('token');
      await axios.post("/groups", { name: groupName }, {
        baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroupName("");
      fetchGroups();
    } catch (e) {
      setError("Could not create group. (Maybe permission denied?)");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: "28px auto 0 auto", width: "100%" }}>
      <h1 style={{ fontSize: 25, marginBottom: 20 }}>Groups / Classrooms</h1>
      {(user.role === "teacher" || user.role === "admin") &&
        <form onSubmit={handleCreate} style={{ display: "flex", gap: 10, marginBottom: 30 }}>
          <input
            style={{
              padding: "9px 12px", fontSize: 17, borderRadius: 6, flex: 1,
              border: "1px solid #e8eaee"
            }}
            type="text"
            aria-label="Group name"
            placeholder="New group name"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            disabled={loading}
          />
          <button
            style={{
              minWidth: 100,
              padding: "10px 0",
              background: "var(--accent-color, #36b37e)",
              color: "#fff",
              fontWeight: 700,
              border: "none",
              borderRadius: 6
            }}
            disabled={loading}
          >Create</button>
        </form>
      }
      {error && <div style={{ color: "#f33" }}>{error}</div>}
      <ul style={{ padding: 0, listStyle: "none" }}>
        {groups.map(g => (
          <li
            key={g.id}
            onClick={() => navigate(`/groups/${g.id}`)}
            style={{
              cursor: "pointer", padding: "14px 0", borderBottom: "1px solid #e6e8ec",
              display: "flex", alignItems: "center", gap: 12
            }}>
            <b>{g.name}</b>
            <span style={{ color: "#888", fontSize: 13, marginLeft: 8 }}>({g.members?.length ?? '?' } members)</span>
          </li>
        ))}
      </ul>
      {groups.length === 0 && <div>No groups found.</div>}
    </div>
  );
}
export default Groups;
