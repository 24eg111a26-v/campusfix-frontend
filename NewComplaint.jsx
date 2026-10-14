import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function NewComplaint() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", category: "", location: "" });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    api("/complaints/categories").then(setCategories).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, v));
      if (image) body.append("image", image);
      await api("/complaints", { method: "POST", body, isForm: true });
      navigate("/my");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Report an issue</h2>
      {error && <p className="error">{error}</p>}
      <input placeholder="Short title (e.g. Projector not working)" required value={form.title} onChange={set("title")} />
      <select required value={form.category} onChange={set("category")}>
        <option value="">Select category</option>
        {categories.map((c) => <option key={c}>{c}</option>)}
      </select>
      <input placeholder="Location (e.g. ECE Block, Lab 204)" required value={form.location} onChange={set("location")} />
      <textarea rows="4" placeholder="Describe the problem" required value={form.description} onChange={set("description")} />
      <label className="muted">Photo (optional, max 3 MB)</label>
      <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setImage(e.target.files[0])} />
      <button className="btn" disabled={busy}>{busy ? "Submitting..." : "Submit complaint"}</button>
    </form>
  );
}
