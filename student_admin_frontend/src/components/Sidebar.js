import React from "react";
import { NavLink } from "react-router-dom";

// PUBLIC_INTERFACE
function Sidebar({ user }) {
  // Different menu options per role
  const menu = [
    { label: "Dashboard", to: "/" },
    { label: "Groups", to: "/groups" },
    { label: "Assignments", to: "/assignments" },
    { label: "Messaging", to: "/messaging" },
    { label: "Profile", to: "/profile" },
  ];
  if ((user.role === "admin" || user.role === "teacher")) {
    menu.push({ label: "Users", to: "/users" });
  }

  return (
    <nav className="sidebar" aria-label="Sidebar navigation" style={{
      width: "220px",
      background: "var(--bg-secondary)",
      borderRight: "1px solid var(--border-color)",
      display: "flex", flexDirection: "column", alignItems: "flex-start",
      padding: "2rem 1rem 1rem 1.3rem", minHeight: "100vh"
    }}>
      <div className="sidebar-logo" style={{ fontWeight: 700, fontSize: 23, marginBottom: "2rem", color: "var(--primary-color, #0052cc)" }}>
        StudentHub
      </div>
      <ul style={{ padding: 0, listStyle: "none", width: "100%" }}>
        {menu.map(item => (
            <li key={item.to} style={{ marginBottom: "1.5rem" }}>
              <NavLink to={item.to} style={({ isActive }) => ({
                color: isActive ? "var(--accent-color, #36b37e)" : "var(--text-primary)", 
                textDecoration: "none", 
                fontWeight: 500,
                fontSize: "18px"
              })} aria-current={window.location.pathname === item.to ? "page" : undefined}>{item.label}</NavLink>
            </li>
          ))}
      </ul>
      <div style={{ flex: 1 }} />
      <div style={{ margin: "1rem auto 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
        {user && user.role && <>Logged in as <b>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</b></>}
      </div>
    </nav>
  );
}
export default Sidebar;
