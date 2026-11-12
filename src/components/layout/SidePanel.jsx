import { useLayout } from './LayoutContext';
import IconButton from '../ui/IconButton';

/** Conteneur commun des seconds sidebars (titre, actions, bouton de masquage). */
export default function SidePanel({ title, actions, children }) {
  const { setSubOpen } = useLayout();
  return (
    <div className="side-inner">
      <div className="panel-head">
        <span>{title}</span>
        <div className="panel-actions">
          {actions}
          <IconButton icon="chevron-bar-left" label="Masquer l’explorateur" onClick={() => setSubOpen(false)} />
        </div>
      </div>
      <div className="panel-body">{children}</div>
    </div>
  );
}
