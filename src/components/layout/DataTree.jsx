import { useState } from 'react';
import { Link, useParams } from 'react-router';
import SidePanel from './SidePanel';
import IconButton from '../ui/IconButton';
import { DATABASES } from '../../mock';
import useFetch from '../../hooks/useFetch'

function DbNode({ db, active, activeTable }) {
  const [open, setOpen] = useState(active);
  return (
    <div>
      <div className={`tree-row${active && !activeTable ? ' active' : ''}`}>
        <button type="button" className="tree-toggle" aria-expanded={open} aria-label={`Déplier ${db.name}`} onClick={() => setOpen((o) => !o)}>
          <i className="bi bi-chevron-right" />
        </button>
        <Link to={`/data/${db.name}`} className="tree-link"><i className="bi bi-database" />{db.name}</Link>
      </div>
      {open && (
        <div className="tree-children">
          {db?.tables?.map((t) => (
            <div key={t.name} className={`tree-row tree-leaf${activeTable === t.name ? ' active' : ''}`}>
              <Link to={`/data/${db.name}/${t.name}`} className="tree-link"><i className="bi bi-table" />{t.name}</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DataTree() {
  const { db, table } = useParams();
  const databases = useFetch("http://127.0.0.1:8000/databases/")
  return (
    <SidePanel title="Bases de données" actions={<IconButton icon="arrow-clockwise" label="Actualiser" />}>
      {databases?.data?.result?.map((d) => <DbNode key={d.name} db={d} active={d.name === db} activeTable={d.name === db ? table : undefined} />)}
    </SidePanel>
  );
}
