import { Outlet, useLocation } from 'react-router';
import { LayoutProvider, useLayout } from './LayoutContext';
import Header from './Header';
import NavMenu from './NavMenu';
import DataTree from './DataTree';
import SqlFileList from './SqlFileList';
import ChatPanel from './ChatPanel';
import TerminalDock from './TerminalDock';

function ShellInner() {
  const { navOpen, subOpen, setSubOpen, chatOpen, dockOpen, dockH } = useLayout();
  const section = useLocation().pathname.split('/')[1];
  const hasSub = section === 'data' || section === 'sql';
  const hasDock = section !== 'terminal';
  const cls = ['shell', navOpen && 'nav-open', hasSub && subOpen && 'sub-open', chatOpen && 'chat-open'].filter(Boolean).join(' ');

  return (
    <div className={cls} style={{ '--dock-h': hasDock && dockOpen ? `${dockH}px` : '0px' }}>
      <Header />
      <div className="shell-body">
        <NavMenu />
        {hasSub && <aside className="side sub" aria-label="Explorateur">{section === 'data' ? <DataTree /> : <SqlFileList />}</aside>}
        {hasSub && !subOpen && (
          <button type="button" className="edge-toggle" aria-label="Afficher l’explorateur" title="Afficher l’explorateur" onClick={() => setSubOpen(true)}>
            <i className="bi bi-chevron-right" />
          </button>
        )}
        <main className="main"><Outlet /></main>
        <ChatPanel />
      </div>
      {hasDock && <TerminalDock />}
    </div>
  );
}

export default function Shell() {
  return <LayoutProvider><ShellInner /></LayoutProvider>;
}
