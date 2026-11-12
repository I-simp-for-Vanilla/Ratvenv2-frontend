export default function EmptyState({ icon = 'inbox', title, text, action }) {
  return (
    <div className="empty">
      <i className={`bi bi-${icon}`} aria-hidden="true" />
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}
