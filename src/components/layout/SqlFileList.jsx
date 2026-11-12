import { Link, useParams } from 'react-router';
import SidePanel from './SidePanel';
import IconButton from '../ui/IconButton';
import { SQL_FILES } from '../../mock';

export default function SqlFileList({ files = SQL_FILES, onCreate }) {
  const { file } = useParams();
  return (
    <SidePanel title="Fichiers SQL" actions={<IconButton icon="file-earmark-plus" label="Nouveau fichier" onClick={onCreate} />}>
      {files.map((f) => (
        <div key={f.id} className={`tree-row${file === f.id ? ' active' : ''}`}>
          <Link to={`/sql/${f.id}`} className="tree-link" style={{ paddingLeft: 10 }}><i className="bi bi-filetype-sql" />{f.name}</Link>
        </div>
      ))}
    </SidePanel>
  );
}
