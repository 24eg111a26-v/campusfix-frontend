export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Small fetch wrapper: adds the JWT, handles JSON or FormData, throws on errors.
export async function api(path, { method = "GET", body, isForm = false } = {}) {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !isForm) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}
