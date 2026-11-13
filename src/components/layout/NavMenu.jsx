import { NavLink } from 'react-router';

const ITEMS = [
  { to: '/data', icon: 'database', label: 'Données' },
  { to: '/sql', icon: 'file-earmark-code', label: 'Fichiers SQL' },
  { to: '/terminal', icon: 'terminal', label: 'Terminal' },
  { to: '/doc', icon: 'filetype-md', label: 'Documentation' },
];

export default function NavMenu() {
  return (
    <nav className="side nav" aria-label="Navigation principale">
      <div className="side-inner">
        {ITEMS.map((i) => (
          <NavLink key={i.to} to={i.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <i className={`bi bi-${i.icon}`} aria-hidden="true" /><span>{i.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
