import React, { useEffect, useState } from "react";
import axios from "axios";

// PUBLIC_INTERFACE
function Dashboard({ user }) {
  const [assignments, setAssignments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const token = window.localStorage.getItem('token');
        const [assignmentsResp, groupsResp] = await Promise.all([
          axios.get("/assignments", {
            baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000",
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("/groups", {
            baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000",
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);
        setAssignments(assignmentsResp.data || []);
        setGroups(groupsResp.data || []);
      } catch (e) { }
      setLoading(false);
    }
    fetchAll();
  }, []);

  if (loading) return <div className="centered">Loading...</div>;
  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ margin: "35px 0 14px 0", fontSize: 27 }}>Welcome, {user.name || user.username}</h1>
      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 21, marginBottom: 8 }}>Your Assignments</h2>
        {assignments.length === 0 ? <div>No assignments.</div>
          : (
            <ul style={{ padding: 0, listStyle: "none" }}>
              {assignments.map(a =>
                <li key={a.id} style={listItemStyle}>
                  <b>{a.title || a.name}</b> &mdash; Due: {a.dueDate ? (new Date(a.dueDate).toLocaleString()) : "TBD"}
                </li>
              )}
            </ul>
          )}
      </section>
      <section>
        <h2 style={{ fontSize: 21, marginBottom: 8 }}>Your Groups</h2>
        {groups.length === 0 ? <div>No group memberships.</div>
          : (
            <ul style={{ padding: 0, listStyle: "none" }}>
              {groups.map(g =>
                <li key={g.id} style={listItemStyle}>
                  <b>{g.name}</b> — members: {g.members?.length ?? 'n/a'}
                </li>
              )}
            </ul>
          )}
      </section>
    </div>
  );
}
const listItemStyle = { padding: "10px 0", borderBottom: "1px solid #e6e8ec" };
export default Dashboard;
