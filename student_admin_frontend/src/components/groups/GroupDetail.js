import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// PUBLIC_INTERFACE
function GroupDetail({ user }) {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroup();
    // eslint-disable-next-line
  }, [id]);
  const fetchGroup = async () => {
    setLoading(true);
    try {
      const token = window.localStorage.getItem('token');
      const res = await axios.get(`/groups/${id}`, {
        baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroup(res.data);
      setMembers(res.data.members || []);
    } catch (e) {}
    setLoading(false);
  };

  const handleAddMember = async e => {
    e.preventDefault();
    setError("");
    if (!newMember) return;
    try {
      const token = window.localStorage.getItem('token');
      await axios.post(`/groups/${id}/members`, { username: newMember }, {
        baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMember("");
      fetchGroup();
    } catch (e) {
      setError("Could not add member.");
    }
  };

  const handleRemove = async uid => {
    try {
      const token = window.localStorage.getItem('token');
      await axios.delete(`/groups/${id}/members/${uid}`, {
        baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGroup();
    } catch (e) { }
  };

  if (loading) return <div className="centered">Loading group...</div>;
  if (!group) return <div className="centered">Group not found.</div>;

  return (
    <div style={{ maxWidth: 620, margin: "32px auto 0 auto", width: "100%" }}>
      <h1 style={{ fontSize: 25 }}>{group.name}</h1>
      <div style={{ margin: "18px 0" }}>
        <div style={{ fontWeight: 600 }}>Members:</div>
        <ul style={{ padding: 0, listStyle: "none" }}>
          {members.map(m => (
            <li key={m.id} style={{ padding: "5px 0", display: "flex", alignItems: "center", gap: 12 }}>
              <span>{m.name || m.username} <span style={{ color: "#888", fontSize: 13 }}>({m.role})</span></span>
              {(user.role === "teacher" || user.role === "admin") &&
                <button
                  type="button"
                  style={{
                    color: "#f33", background: "#ffeaea", borderRadius: 5, padding: "2px 8px", marginLeft: 12,
                    fontSize: 14, border: "none", cursor: "pointer"
                  }}
                  aria-label={`Remove ${m.username} from group`}
                  onClick={() => handleRemove(m.id)}
                >Remove</button>
              }
            </li>
          ))}
        </ul>
        {(user.role === "teacher" || user.role === "admin") &&
          <form onSubmit={handleAddMember} style={{ marginTop: 18, display: "flex", gap: 7 }}>
            <input
              placeholder="Username to add"
              value={newMember}
              onChange={e => setNewMember(e.target.value)}
              style={{ flex: 1, padding: 8, borderRadius: 5, border: "1px solid #bfc9da" }}
            />
            <button style={{
              padding: "8px 18px", background: "var(--accent-color, #36b37e)", color: "#fff",
              border: "none", borderRadius: 6, fontWeight: 600
            }}>Add</button>
          </form>
        }
        {error && <div style={{ color: "#f33", marginTop: 10 }}>{error}</div>}
      </div>
    </div>
  );
}
export default GroupDetail;
