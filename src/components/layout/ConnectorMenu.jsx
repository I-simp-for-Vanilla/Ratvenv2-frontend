import { useState } from 'react';
import Dropdown, { MenuItem, MenuSeparator, MenuTitle } from '../ui/Dropdown';
import { CONNECTORS } from '../../mock';

/** Props : connectors, activeId, onSelect(c), onAdd() — valeurs fictives par défaut. */
export default function ConnectorMenu({ connectors = CONNECTORS, activeId: controlled, onSelect, onAdd }) {
  const [local, setLocal] = useState(connectors[0]?.id);
  const activeId = controlled ?? local;
  const active = connectors.find((c) => c.id === activeId);
  return (
    <Dropdown width={300} trigger={({ open, toggle }) => (
      <button type="button" className="conn-trigger" aria-expanded={open} onClick={toggle}>
        <span className={`status-dot${active?.ok ? ' ok' : ''}`} />
        <span>{active?.name ?? 'Aucun connecteur'}</span>
        <i className="bi bi-chevron-down" style={{ fontSize: 11 }} aria-hidden="true" />
      </button>
    )}>
      {(close) => (
        <>
          <MenuTitle>Connecteurs de base de données</MenuTitle>
          {connectors.map((c) => (
            <MenuItem key={c.id} active={c.id === activeId} onClick={() => { setLocal(c.id); onSelect?.(c); close(); }}>
              <span className="conn-item" style={{ flex: 1 }}>
                <span className={`status-dot${c.ok ? ' ok' : ''}`} />
                <span>{c.name}<small>{c.host}</small></span>
                {c.id === activeId && <i className="bi bi-check2" />}
              </span>
            </MenuItem>
          ))}
          <MenuSeparator />
          <MenuItem icon="plus-lg" onClick={() => { onAdd?.(); close(); }}>Ajouter un connecteur</MenuItem>
          <MenuItem icon="gear" onClick={close}>Gérer les connecteurs</MenuItem>
        </>
      )}
    </Dropdown>
  );
}
