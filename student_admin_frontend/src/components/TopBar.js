import React from "react";
import { useNavigate } from "react-router-dom";

// PUBLIC_INTERFACE
function TopBar({ user, theme, onToggleTheme, onLogout }) {
  const navigate = useNavigate();

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)",
      minHeight: 60, padding: "0 2rem", width: "100%", boxSizing: "border-box"
    }} className="topbar" aria-label="Top navigation">
      <div />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        {user &&
          <div
            style={{ display: "flex", alignItems: "center", gap: 10 }}
            aria-label="User profile menu"
          >
            <span style={{ fontWeight: 'bold', fontSize: "17px" }}>{user.name || user.username}</span>
            <button className="topbar-btn"
              onClick={() => navigate("/profile")}
              aria-label="Profile"
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "50%",
                width: 34, height: 34, color: "var(--text-primary)", fontWeight: 700
              }}>{user.name?.charAt(0)?.toUpperCase() ?? user.username?.charAt(0)?.toUpperCase() ?? "U"}
            </button>
            <button className="topbar-btn"
              aria-label="Logout"
              style={{ color: "#f33", background: "none", border: "none", fontWeight: 700, fontSize: 16, marginLeft: 4 }}
              onClick={onLogout}
            >Logout</button>
          </div>
        }
      </div>
    </div>
  );
}
export default TopBar;
