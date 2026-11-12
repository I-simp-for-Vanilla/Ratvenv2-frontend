import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import SqlEditorForm from '../components/sql/SqlEditorForm';
import DataTable from '../components/data/DataTable';
import EmptyState from '../components/ui/EmptyState';
import { COLUMNS, CONNECTORS, ROWS, SQL_FILES } from '../mock';

const DEFAULT_SQL = "SELECT *\nFROM clients\nWHERE statut = 'actif'\nLIMIT 100;";

export default function SqlPage() {
  const { file } = useParams();
  const meta = SQL_FILES.find((f) => f.id === file);
  const [sql, setSql] = useState(meta?.content ?? DEFAULT_SQL);
  const [connectorId, setConnectorId] = useState(CONNECTORS[0].id);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  useEffect(() => { setSql(meta?.content ?? DEFAULT_SQL); setResult(null); }, [file]); // eslint-disable-line

  // Démo : remplacez par l'appel à votre API
  const run = () => {
    setRunning(true);
    setTimeout(() => { setResult({ columns: COLUMNS, rows: ROWS.slice(0, 120), ms: 42 }); setRunning(false); }, 600);
  };

  return (
    <div className="page-fill">
      <SqlEditorForm title={meta?.name ?? 'Nouvelle requête'} value={sql} onChange={setSql}
        connectors={CONNECTORS} connectorId={connectorId} onConnectorChange={setConnectorId} running={running} onSubmit={run} />
      <div className="sql-result">
        {result ? (
          <DataTable columns={result.columns} rows={result.rows}
            toolbarExtra={<span className="sql-status"><i className="bi bi-check-circle" style={{ color: 'var(--ok)' }} />Exécutée en {result.ms} ms</span>} />
        ) : (
          <EmptyState icon="play-circle" title="Aucun résultat" text="Exécutez la requête (Ctrl + Entrée) pour afficher ses résultats ici." />
        )}
      </div>
    </div>
  );
}
