import { useParams } from 'react-router';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/data/DataTable';
import { COLUMNS, ROWS } from '../mock';

export default function TablePage() {
  const { db, table } = useParams();
  return (
    <div className="page-fill">
      <PageHeader icon="table" title={table}
        crumbs={[{ label: 'Données', to: '/data' }, { label: db, to: `/data/${db}` }, { label: table }]}
        meta={<span className="badge">{COLUMNS.length} colonnes</span>} />
      <DataTable key={`${db}.${table}`} columns={COLUMNS} rows={ROWS} />
    </div>
  );
}
