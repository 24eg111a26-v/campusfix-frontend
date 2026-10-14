import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyComplaints from "./pages/MyComplaints.jsx";
import NewComplaint from "./pages/NewComplaint.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function Protected({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function Home() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "admin" ? "/admin" : "/my"} replace />;
}

function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <Link to="/" className="brand">🛠️ Campus Fix</Link>
      <div className="nav-links">
        {user?.role === "student" && (
          <>
            <Link to="/my">My Complaints</Link>
            <Link to="/new">Report Issue</Link>
          </>
        )}
        {user?.role === "admin" && <Link to="/admin">Dashboard</Link>}
        {user ? (
          <button className="btn small ghost" onClick={logout}>
            Logout ({user.name.split(" ")[0]})
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my" element={<Protected role="student"><MyComplaints /></Protected>} />
          <Route path="/new" element={<Protected role="student"><NewComplaint /></Protected>} />
          <Route path="/admin" element={<Protected role="admin"><AdminDashboard /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
