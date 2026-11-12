import { Link } from 'react-router';
import { useLayout } from './LayoutContext';
import useTheme from '../../hooks/useTheme';
import Logo from '../ui/Logo';
import IconButton from '../ui/IconButton';
import SearchBar from '../ui/SearchBar';
import ConnectorMenu from './ConnectorMenu';
import NotificationMenu from './NotificationMenu';

export default function Header() {
  const { navOpen, setNavOpen, chatOpen, setChatOpen } = useLayout();
  const { theme, toggle } = useTheme();
  return (
    <header className="header">
      <div className="header-left">
        <IconButton icon="list" label={navOpen ? 'Masquer le menu' : 'Afficher le menu'} active={navOpen} onClick={() => setNavOpen((v) => !v)} />
        <Link to="/" className="brand"><Logo /><span>Ratven</span></Link>
      </div>
      <SearchBar />
      <div className="header-right">
        <ConnectorMenu />
        <NotificationMenu />
        <IconButton icon={theme === 'dark' ? 'sun' : 'moon-stars'} label={theme === 'dark' ? 'Thème clair' : 'Thème sombre'} onClick={toggle} />
        <IconButton icon="chat-left-text" label={chatOpen ? 'Masquer l’assistant' : 'Afficher l’assistant'} active={chatOpen} onClick={() => setChatOpen((v) => !v)} />
        <Link to="/auth" className="btn-icon" aria-label="Connexion / inscription" title="Connexion / inscription">
          <span className="avatar"><i className="bi bi-person" aria-hidden="true" /></span>
        </Link>
      </div>
    </header>
  );
}
