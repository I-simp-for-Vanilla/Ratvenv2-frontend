export default function StatGrid({ items }) {
  return (
    <div className="stat-grid">
      {items.map((s) => (
        <div key={s.label} className="card stat">
          <div className="stat-label"><i className={`bi bi-${s.icon}`} aria-hidden="true" />{s.label}</div>
          <div className="stat-value">{s.value}</div>
        </div>
      ))}
    </div>
  );
}
