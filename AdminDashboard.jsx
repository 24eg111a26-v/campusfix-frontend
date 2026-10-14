import { useEffect, useState } from "react";
import { api, API_URL } from "../api.js";
import StatusBadge from "../components/StatusBadge.jsx";

const STATUSES = ["Pending", "In Progress", "Resolved"];

export default function AdminDashboard() {
  const [list, setList] = useState(null);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ status: "", category: "" });
  const [error, setError] = useState("");

  const load = () => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
    ).toString();
    api(`/complaints${qs ? `?${qs}` : ""}`).then(setList).catch((e) => setError(e.message));
    api("/complaints/stats").then(setStats).catch(() => {});
  };

  useEffect(() => { api("/complaints/categories").then(setCategories).catch(() => {}); }, []);
  useEffect(load, [filters]);

  const update = async (id, patch) => {
    try {
      await api(`/complaints/${id}`, { method: "PATCH", body: patch });
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <h2>Admin dashboard</h2>
      {stats && (
        <div className="stats">
          {["Total", ...STATUSES].map((s) => (
            <div className="card stat" key={s}>
              <h3>{stats[s]}</h3>
              <span className="muted">{s}</span>
            </div>
          ))}
        </div>
      )}

      <div className="row filters">
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {!list ? <p className="center">Loading...</p> : list.length === 0 ? (
        <p className="muted">No complaints found.</p>
      ) : (
        <div className="grid">
          {list.map((c) => (
            <AdminCard key={c.id} c={c} onSave={update} />
          ))}
        </div>
      )}
    </>
  );
}

function AdminCard({ c, onSave }) {
  const [assignedTo, setAssignedTo] = useState(c.assignedTo || "");
  const [adminNote, setAdminNote] = useState(c.adminNote || "");

  return (
    <div className="card">
      <div className="row between">
        <strong>{c.title}</strong>
        <StatusBadge status={c.status} />
      </div>
      <p className="muted">{c.category} · {c.location}</p>
      <p>{c.description}</p>
      {c.image && <img className="thumb" src={`${API_URL}${c.image}`} alt="complaint" />}
      <small className="muted">
        By {c.createdBy?.name} ({c.createdBy?.rollNo || c.createdBy?.email}) · {new Date(c.createdAt).toLocaleDateString()}
      </small>
      <hr />
      <select value={c.status} onChange={(e) => onSave(c.id, { status: e.target.value })}>
        {STATUSES.map((s) => <option key={s}>{s}</option>)}
      </select>
      <input placeholder="Assign to (staff name)" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
      <input placeholder="Note for student" value={adminNote} onChange={(e) => setAdminNote(e.target.value)} />
      <button className="btn small" onClick={() => onSave(c.id, { assignedTo, adminNote })}>Save</button>
    </div>
  );
}
