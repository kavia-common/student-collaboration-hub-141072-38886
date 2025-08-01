import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

// PUBLIC_INTERFACE
function Messaging({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = window.localStorage.getItem('token');
      const res = await axios.get("/messages", {
        baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data || []);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 100);
    } catch (e) { }
    setLoading(false);
  };

  const handleSend = async e => {
    e.preventDefault();
    if (!newMsg) return;
    setSending(true);
    try {
      const token = window.localStorage.getItem('token');
      await axios.post("/messages", { to: null, content: newMsg }, {
        baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMsg("");
      fetchMessages();
    } catch (e) {}
    setSending(false);
  };

  if (loading) return <div className="centered">Loading messages...</div>;

  return (
    <div style={{ maxWidth: 700, margin: "24px auto 0 auto", width: "100%" }}>
      <h1 style={{ fontSize: 25 }}>Messaging</h1>
      <section style={{ minHeight: 270, background: "#f4f8fd", borderRadius: 11, padding: 16, margin: "18px 0" }}>
        <ul style={{ padding: 0, listStyle: "none", maxHeight: 290, overflowY: "auto" }}>
          {messages.map(m =>
            <li key={m.id} style={{ marginBottom: 9, background: "#fff", padding: "8px 15px", borderRadius: 8 }}>
              <b style={{ color: m.sender === user.username ? "var(--primary-color, #0052cc)" : "#1a3c4d" }}>
                {m.sender}
              </b>: {m.content}
              <span style={{ float: "right", fontSize: 12, color: "#aaa" }}>{m.timestamp && (new Date(m.timestamp).toLocaleString())}</span>
            </li>
          )}
          <div ref={scrollRef} />
        </ul>
      </section>
      <form onSubmit={handleSend} style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          style={{
            flex: 1, padding: "9px 12px", fontSize: 17, borderRadius: 6,
            border: "1px solid #e8eaee"
          }}
          type="text"
          placeholder="Type a message..."
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          disabled={sending}
          aria-label="Compose message"
        />
        <button
          type="submit"
          style={{
            minWidth: 80,
            padding: "10px 0",
            background: "var(--primary-color, #0052cc)",
            color: "#fff",
            fontWeight: 700,
            border: "none",
            borderRadius: 6
          }}
          disabled={sending}
        >Send</button>
      </form>
    </div>
  );
}
export default Messaging;
