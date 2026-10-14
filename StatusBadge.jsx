export default function StatusBadge({ status }) {
  const cls = status.toLowerCase().replace(" ", "-");
  return <span className={`badge ${cls}`}>{status}</span>;
}
