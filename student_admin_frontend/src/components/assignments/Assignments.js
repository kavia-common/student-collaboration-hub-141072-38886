import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// PUBLIC_INTERFACE
function Assignments({ user }) {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [due, setDue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
    // eslint-disable-next-line
  }, []);
  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const token = window.localStorage.getItem('token');
      const res = await axios.get("/assignments", {
        baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(res.data || []);
    } catch (e) { }
    setLoading(false);
  };

  const handleCreate = async e => {
    e.preventDefault();
    setError("");
    if (!title) return;
    setLoading(true);
    try {
      const token = window.localStorage.getItem('token');
      await axios.post("/assignments", { title, description: desc, dueDate: due }, {
        baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitle(""); setDesc(""); setDue("");
      fetchAssignments();
    } catch (e) {
      setError("Could not create assignment.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: "28px auto 0 auto", width: "100%" }}>
      <h1 style={{ fontSize: 25, marginBottom: 20 }}>Assignments</h1>
      {(user.role === "teacher" || user.role === "admin") &&
        <form onSubmit={handleCreate} style={{ display: "flex", gap: 10, marginBottom: 30, flexWrap: "wrap" }}>
          <input
            style={inputStyle}
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            disabled={loading}
          />
          <input
            style={inputStyle}
            placeholder="Description"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            disabled={loading}
          />
          <input
            style={inputStyle}
            type="datetime-local"
            placeholder="Due date"
            value={due}
            onChange={e => setDue(e.target.value)}
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
        {assignments.map(a => (
          <li
            key={a.id}
            onClick={() => navigate(`/assignments/${a.id}`)}
            style={{
              cursor: "pointer", padding: "14px 0", borderBottom: "1px solid #e6e8ec"
            }}>
            <b>{a.title}</b> <span style={{ color: "#888", fontSize: 14 }}>{a.description}</span>
            <span style={{ float: "right" }}>{a.dueDate ? (new Date(a.dueDate).toLocaleString()) : 'No due'}</span>
          </li>
        ))}
      </ul>
      {assignments.length === 0 && <div>No assignments found.</div>}
    </div>
  );
}
const inputStyle = {
  flex: 1,
  minWidth: 120,
  padding: "9px 12px", fontSize: 17, borderRadius: 6,
  border: "1px solid #e8eaee"
};
export default Assignments;
