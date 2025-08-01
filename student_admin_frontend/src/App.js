import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import './App.css';
import axios from 'axios';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Assignments from './components/assignments/Assignments';
import AssignmentDetail from './components/assignments/AssignmentDetail';
import Groups from './components/groups/Groups';
import GroupDetail from './components/groups/GroupDetail';
import Messaging from './components/messaging/Messaging';
import Profile from './components/profile/Profile';
import Users from './components/admin/Users';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null); // Tracks authenticated user
  const [loading, setLoading] = useState(true);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Try to load the user profile with stored token
  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) {
      setLoading(true);
      axios.get('/auth/me', {
        baseURL: process.env.REACT_APP_API_BASEURL || 'http://localhost:5000',
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
    } else {
      setLoading(false);
      setUser(null);
    }
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // When logging in/out, refresh user state
  const handleLogin = (userData, token) => {
    setUser(userData);
    window.localStorage.setItem('token', token);
  };
  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('token');
  };

  // Wrapper for protected pages
  function RequireAuth({ children }) {
    let location = useLocation();
    if (!user && !loading) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  }

  // Render only a spinner until auth state is determined
  if (loading) {
    return (
      <div className="App">
        <div className="centered">
          <div className="spinner" />
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        {user && <Sidebar user={user} />}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <TopBar user={user} theme={theme} onToggleTheme={toggleTheme} onLogout={handleLogout} />
          <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'stretch' }}>
            <Routes>
              <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
              <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
              <Route path="/" element={<RequireAuth><Dashboard user={user} /></RequireAuth>} />
              <Route path="/assignments" element={<RequireAuth><Assignments user={user} /></RequireAuth>} />
              <Route path="/assignments/:id" element={<RequireAuth><AssignmentDetail user={user} /></RequireAuth>} />
              <Route path="/groups" element={<RequireAuth><Groups user={user} /></RequireAuth>} />
              <Route path="/groups/:id" element={<RequireAuth><GroupDetail user={user} /></RequireAuth>} />
              <Route path="/messaging" element={<RequireAuth><Messaging user={user} /></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><Profile user={user} setUser={setUser} /></RequireAuth>} />
              <Route path="/users" element={<RequireAuth>{(user?.role === "admin" || user?.role === "teacher") ? <Users user={user} /> : <Navigate to="/" />}</RequireAuth>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
