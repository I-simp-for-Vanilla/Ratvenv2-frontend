import logo from '../assets/logo.png'

export default function Header({ navOpen, onToggleNav }) {
  return (
    <header className="header">
      <button
        className="icon-btn menu-btn"
        onClick={onToggleNav}
        aria-label={navOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={navOpen}
      >
        <i className={`bi ${navOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
      </button>

      <div className="brand">
        <span className="brand-logo">
          <img src={logo} alt="logo" />
        </span>
        <span className="brand-name">Ratven</span>
      </div>

      <div className="header-actions">
        <button className="icon-btn" aria-label="Notifications">
          <i className="bi bi-bell"></i>
        </button>
        <button className="icon-btn" aria-label="Profil">
          <i className="bi bi-person-circle"></i>
        </button>
      </div>
    </header>
  )
}
