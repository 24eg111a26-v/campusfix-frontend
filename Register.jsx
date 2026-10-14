import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", rollNo: "", email: "", password: "", adminCode: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await register(form);
      navigate(user.role === "admin" ? "/admin" : "/my");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card form narrow" onSubmit={submit}>
      <h2>Create account</h2>
      {error && <p className="error">{error}</p>}
      <input placeholder="Full name" required value={form.name} onChange={set("name")} />
      <input placeholder="Roll number" value={form.rollNo} onChange={set("rollNo")} />
      <input type="email" placeholder="College email" required value={form.email} onChange={set("email")} />
      <input type="password" placeholder="Password (min 6 chars)" required value={form.password} onChange={set("password")} />
      <input placeholder="Admin code (staff only, optional)" value={form.adminCode} onChange={set("adminCode")} />
      <button className="btn">Register</button>
      <p className="muted">Already registered? <Link to="/login">Login</Link></p>
    </form>
  );
}
