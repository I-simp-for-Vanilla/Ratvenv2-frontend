import { useRef } from 'react';
import CodeEditor from './CodeEditor';
import Button from '../ui/Button';

/** Formulaire SQL : onSubmit(sql, connectorId) à brancher sur votre API. */
export default function SqlEditorForm({ title = 'Nouvelle requête', value, onChange, connectors, connectorId, onConnectorChange, running, onSubmit }) {
  const formRef = useRef(null);
  const submit = (e) => { e?.preventDefault(); onSubmit?.(value, connectorId); };
  return (
    <form ref={formRef} className="card sql-form" onSubmit={submit}>
      <div className="sql-bar">
        <i className="bi bi-filetype-sql" style={{ color: 'var(--violet-hi)' }} aria-hidden="true" />
        <b style={{ fontWeight: 500 }}>{title}</b>
        <span className="spacer" />
        <select className="select" aria-label="Connecteur" value={connectorId} onChange={(e) => onConnectorChange(Number(e.target.value))}>
          {connectors.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.host}</option>)}
        </select>
        <Button variant="primary" type="submit" icon={running ? 'hourglass-split' : 'play-fill'} disabled={running || !value.trim()}>Exécuter</Button>
      </div>
      <CodeEditor value={value} onChange={onChange} onRun={() => formRef.current?.requestSubmit()} />
    </form>
  );
}
