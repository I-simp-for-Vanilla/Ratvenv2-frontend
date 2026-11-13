import { useParams } from 'react-router';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/data/DataTable';
import { COLUMNS, ROWS } from '../mock';
import useFetch from '../hooks/useFetch';

export default function TablePage() {
  const { db, table } = useParams();
  const fetched_data = useFetch(`http://127.0.0.1:8000/databases/${db}/tables/${table}`)
  const table_data = fetched_data?.data?.result
  console.log(table_data)
  return (
    <div className="page-fill">
      <PageHeader icon="table" title={table}
        crumbs={[{ label: 'Données', to: '/data' }, { label: db, to: `/data/${db}` }, { label: table }]}
        meta={<span className="badge">{table_data?.columns?.length} colonnes</span>} />
        {table_data != undefined && <DataTable key={`${db}.${table}`} columns={table_data?.columns} rows={table_data?.rows} />}
    </div>
  );
}
