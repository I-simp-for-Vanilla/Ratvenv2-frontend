import { useState } from 'react';
import { Link, useParams } from 'react-router';
import PageHeader from '../components/ui/PageHeader';
import StatGrid from '../components/ui/StatGrid';
import Button from '../components/ui/Button';
import IconButton from '../components/ui/IconButton';
import EmptyState from '../components/ui/EmptyState';
import ConfirmModal from '../components/ui/ConfirmModal';
import Dropdown, { MenuItem, MenuSeparator } from '../components/ui/Dropdown';
import CreateTableModal from '../components/data/CreateTableModal';
import { DATABASES } from '../mock';
import useFetch from '../hooks/useFetch';

export default function DatabasePage() {
  const { db } = useParams();
  const databases = useFetch("http://127.0.0.1:8000/databases/")
  const info = databases?.data?.result?.find((d) => d.name === db);
  const [creating, setCreating] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const { execute: request } = useFetch(null, { method: 'DELETE' })

  if (!info) return <EmptyState icon="database-x" title="Base introuvable" text={`Aucune base nommée « ${db} » sur ce connecteur.`} />;

  const rows = info.tables.reduce((s, t) => s + t.rows, 0);
  return (
    <div className="page">
      <PageHeader icon="database" title={info.name} crumbs={[{ label: 'Données', to: '/data' }, { label: info.name }]}
        meta={<><span className="badge">{info.engine}</span><span className="badge mono">{info.host}</span></>} />
      <StatGrid items={[
        { icon: 'table', label: 'Tables', value: info.tables.length },
        { icon: 'list-ol', label: 'Lignes', value: rows.toLocaleString('fr-FR') },
        { icon: 'hdd', label: 'Taille', value: info.size },
        { icon: 'translate', label: 'Encodage', value: info.charset },
        { icon: 'calendar3', label: 'Créée le', value: info.created },
      ]} />

      <div className="section-head">
        <h2>Tables</h2>
        <Button variant="primary" icon="plus-lg" onClick={() => setCreating(true)}>Créer une table</Button>
      </div>
      <div className="card">
        {info.tables.length === 0 ? (
          <EmptyState icon="table" title="Aucune table" text="Créez la première table de cette base." />
        ) : (
          <table className="list-table">
            <thead><tr><th>Nom</th><th>Colonnes</th><th>Lignes</th><th>Taille</th><th>Modifiée le</th><th className="actions" /></tr></thead>
            <tbody>
              {info.tables.map((t) => (
                <tr key={t.name}>
                  <td><Link className="list-link" to={`/data/${info.name}/${t.name}`}><i className="bi bi-table" />{t.name}</Link></td>
                  <td>{t.columns}</td>
                  <td>{t.rows.toLocaleString('fr-FR')}</td>
                  <td>{t.size}</td>
                  <td className="muted">{t.updated}</td>
                  <td className="actions">
                    <Dropdown trigger={({ open, toggle }) => <IconButton icon="three-dots" label={`Options de ${t.name}`} aria-expanded={open} onClick={toggle} />}>
                      {(close) => (
                        <>
                          <MenuItem icon="box-arrow-up-right" onClick={close}>Ouvrir</MenuItem>
                          <MenuItem icon="pencil" onClick={close}>Renommer</MenuItem>
                          <MenuSeparator />
                          <MenuItem icon="trash" danger onClick={() => { setToDelete(t); close(); }}>Supprimer</MenuItem>
                        </>
                      )}
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CreateTableModal open={creating} onClose={() => setCreating(false)} onSubmit={(values) => console.log('Créer la table', values)} />
      <ConfirmModal open={!!toDelete} title="Supprimer la table" confirmLabel="Supprimer la table"
        text={`La table « ${toDelete?.name} » et ses ${toDelete?.rows.toLocaleString('fr-FR')} lignes seront supprimées définitivement.`}
        onClose={() => setToDelete(null)} onConfirm={() => { console.log('Supprimer', toDelete); request({ url: `http://127.0.0.1:8000/databases/ratven/tables/${toDelete.name}` }); setToDelete(null); }} />
    </div>
  );
}
