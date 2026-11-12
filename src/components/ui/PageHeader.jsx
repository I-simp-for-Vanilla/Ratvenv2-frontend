import { Link } from 'react-router';

/** crumbs : [{ label, to? }] */
export default function PageHeader({ icon, title, crumbs = [], meta, actions }) {
  return (
    <header>
      {crumbs.length > 0 && (
        <nav className="crumbs" aria-label="Fil d’Ariane">
          {crumbs.map((c, i) => (
            <span key={i} style={{ display: 'contents' }}>
              {i > 0 && <i className="bi bi-chevron-right" style={{ fontSize: 10 }} aria-hidden="true" />}
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
            </span>
          ))}
        </nav>
      )}
      <div className="page-head">
        <div>
          <h1 className="page-title">{icon && <i className={`bi bi-${icon}`} aria-hidden="true" />}{title}</h1>
          {meta && <div className="page-meta">{meta}</div>}
        </div>
        {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
      </div>
    </header>
  );
}
