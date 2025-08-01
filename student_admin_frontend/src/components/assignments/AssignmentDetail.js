import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// PUBLIC_INTERFACE
function AssignmentDetail({ user }) {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => { fetchDetail(); }, [id]);
  const fetchDetail = async () => {
    setLoading(true);
    setError(""); setSuccess("");
    try {
      const token = window.localStorage.getItem('token');
      const res = await axios.get(`/assignments/${id}`, {
        baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignment(res.data);
      setSubmission(res.data.submission || "");
      setGrade(res.data.grade || "");
    } catch (e) { setError("Could not fetch assignment."); }
    setLoading(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(""); setSuccess("");
    try {
      const token = window.localStorage.getItem('token');
      await axios.post(`/assignments/${id}/submit`, { content: submission }, {
        baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Assignment submitted!");
    } catch (e) { setError("Could not submit assignment."); }
    setSubmitting(false);
  };

  const handleGrade = async e => {
    e.preventDefault();
    setGrading(true);
    setError(""); setSuccess("");
    try {
      const token = window.localStorage.getItem('token');
      await axios.post(`/assignments/${id}/grade`, { grade }, {
        baseURL: process.env.REACT_APP_API_BASEURL || "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Assignment graded!");
    } catch (e) { setError("Could not submit grade."); }
    setGrading(false);
  };

  if (loading) return <div className="centered">Loading...</div>;
  if (!assignment) return <div className="centered">Assignment not found.</div>;

  return (
    <div style={{ maxWidth: 670, margin: "30px auto 0 auto" }}>
      <h1 style={{ fontSize: 25 }}>{assignment.title}</h1>
      <div style={{ margin: "10px 0 25px", color: "#555" }}>{assignment.description}</div>
      <div>Due: {assignment.dueDate ? (new Date(assignment.dueDate).toLocaleString()) : "No due date"}</div>
      <hr />
      {user.role === "student" &&
        <form onSubmit={handleSubmit} style={{ margin: "25px 0" }}>
          <label htmlFor="submission" style={{ fontWeight: 600 }}>Your Submission</label>
          <textarea
            id="submission"
            style={{ width: "100%", minHeight: 90, padding: 10, borderRadius: 4 }}
            value={submission}
            onChange={e => setSubmission(e.target.value)}
            placeholder="Paste or type your solution here..."
            disabled={submitting}
          />
          <button style={btnStyle} disabled={submitting}>{submitting ? "Submitting..." : "Submit"}</button>
        </form>
      }
      {(user.role === "teacher" || user.role === "admin") &&
        <form onSubmit={handleGrade} style={{ margin: "25px 0" }}>
          <label htmlFor="grade" style={{ fontWeight: 600 }}>Assign Grade (e.g. A, 95, Pass):</label>
          <input
            id="grade"
            style={{
              border: "1px solid #bbc", padding: "8px", borderRadius: 4,
              marginLeft: 6, fontSize: 17
            }}
            value={grade}
            onChange={e => setGrade(e.target.value)}
            disabled={grading}
          />
          <button style={btnStyle} disabled={grading || !grade}>{grading ? "Grading..." : "Submit grade"}</button>
        </form>
      }
      {success && <div style={{ color: "#17BB1E" }}>{success}</div>}
      {error && <div style={{ color: "#f33" }}>{error}</div>}
    </div>
  );
}
const btnStyle = {
  marginTop: 11,
  background: "var(--accent-color, #36b37e)",
  color: "#fff",
  fontWeight: 600,
  border: "none",
  borderRadius: 6,
  padding: "9px 24px",
  minWidth: 110,
  marginLeft: 10,
  fontSize: 16
};
export default AssignmentDetail;
