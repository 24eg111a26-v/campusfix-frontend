import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, API_URL } from "../api.js";
import StatusBadge from "../components/StatusBadge.jsx";

export default function MyComplaints() {
  const [list, setList] = useState(null);
  const [error, setError] = useState("");

  const load = () =>
    api("/complaints/mine").then(setList).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Delete this complaint?")) return;
    try {
      await api(`/complaints/${id}`, { method: "DELETE" });
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!list) return <p className="center">Loading...</p>;

  return (
    <>
      <div className="row between">
        <h2>My complaints</h2>
        <Link className="btn small" to="/new">+ Report issue</Link>
      </div>
      {list.length === 0 && <p className="muted">No complaints yet. Report your first issue!</p>}
      <div className="grid">
        {list.map((c) => (
          <div className="card" key={c.id}>
            <div className="row between">
              <strong>{c.title}</strong>
              <StatusBadge status={c.status} />
            </div>
            <p className="muted">{c.category} · {c.location}</p>
            <p>{c.description}</p>
            {c.image && <img className="thumb" src={`${API_URL}${c.image}`} alt="complaint" />}
            {c.assignedTo && <p className="muted">Assigned to: {c.assignedTo}</p>}
            {c.adminNote && <p className="note">Admin note: {c.adminNote}</p>}
            <div className="row between">
              <small className="muted">{new Date(c.createdAt).toLocaleDateString()}</small>
              {c.status === "Pending" && (
                <button className="btn small danger" onClick={() => remove(c.id)}>Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
