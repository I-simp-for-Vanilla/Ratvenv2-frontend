import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Field from '../ui/Field';

const TYPES = ['INT', 'BIGINT', 'VARCHAR(255)', 'TEXT', 'DECIMAL(10,2)', 'DATETIME', 'BOOLEAN'];
const INITIAL = { name: '', engine: 'InnoDB', comment: '', colName: 'id', colType: 'INT', primary: true };

/** onSubmit(values) reçoit { name, engine, comment, colName, colType, primary }. */
export default function CreateTableModal({ open, onClose, onSubmit }) {
  const [v, setV] = useState(INITIAL);
  const [error, setError] = useState('');
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(v.name)) return setError('Lettres, chiffres et _ uniquement, sans commencer par un chiffre.');
    setError('');
    onSubmit?.(v);
    setV(INITIAL);
    onClose?.();
  };

  return (
    <Modal open={open} title="Créer une table" onClose={onClose}
      footer={<>
        <Button variant="ghost" onClick={onClose}>Annuler</Button>
        <Button variant="primary" type="submit" form="create-table-form">Créer la table</Button>
      </>}>
      <form id="create-table-form" onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
        <Field label="Nom de la table" value={v.name} onChange={set('name')} error={error} placeholder="ex. clients" autoFocus required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field as="select" label="Moteur" value={v.engine} onChange={set('engine')}><option>InnoDB</option><option>MyISAM</option></Field>
          <Field label="Commentaire" value={v.comment} onChange={set('comment')} placeholder="Facultatif" />
        </div>
        <div className="field-label" style={{ marginBottom: -8 }}>Première colonne</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Nom" value={v.colName} onChange={set('colName')} required />
          <Field as="select" label="Type" value={v.colType} onChange={set('colType')}>{TYPES.map((t) => <option key={t}>{t}</option>)}</Field>
        </div>
        <label className="check"><input type="checkbox" checked={v.primary} onChange={set('primary')} />Clé primaire auto-incrémentée</label>
      </form>
    </Modal>
  );
}
