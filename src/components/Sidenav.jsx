import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Accueil', icon: 'bi-house-door', end: true },
  { to: '/icones', label: 'Icônes', icon: 'bi-grid-3x3-gap' },
  { to: '/tables', label: 'Table', icon: 'bi-database-fill' },
]

export default function Sidenav({ open, onNavigate }) {
  return (
    <nav className={`sidenav ${open ? 'is-open' : ''}`} aria-label="Navigation principale">
      <ul>
        {links.map(({ to, label, icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${icon}`}></i>
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sidenav-footer">
        <i className="bi bi-moon-stars"></i>
        <span>Mode sombre</span>
      </div>
    </nav>
  )
}
