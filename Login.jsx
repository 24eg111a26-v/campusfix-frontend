import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : "/my");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card form narrow" onSubmit={submit}>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <input type="email" placeholder="College email" required value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" required value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button className="btn">Login</button>
      <p className="muted">New here? <Link to="/register">Create an account</Link></p>
    </form>
  );
}
