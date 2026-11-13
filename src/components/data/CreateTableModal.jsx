import { useState } from 'react';
import { useParams } from 'react-router';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Field from '../ui/Field';
import IconButton from '../ui/IconButton';
import useFetch from '../../hooks/useFetch';

const TYPES = ['INT', 'BIGINT', 'VARCHAR(255)', 'TEXT', 'DECIMAL(10,2)', 'DATETIME', 'BOOLEAN'];
const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/;

let uid = 0;
const newColumn = (patch = {}) => ({ id: ++uid, name: '', type: 'VARCHAR(255)', primary: false, nullable: true, ...patch });
const initial = () => ({
  name: '', engine: 'InnoDB', comment: '',
  columns: [newColumn({ name: 'id', type: 'INT', primary: true, nullable: false })],
});

/**
 * onSubmit(values) reçoit :
 * { name, engine, comment, columns: [{ name, type, primary, nullable }] }
 */
export default function CreateTableModal({ open, onClose, onSubmit }) {
  const { db } = useParams();
  console.log(db)
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState({ table: '', columns: {} });
  const [focusId, setFocusId] = useState(null);

  const { execute: createTable, loading: creating, error: createError } =
  useFetch(`http://127.0.0.1:8000/databases/${db}/tables`, { method: 'POST' })

  const handleCreate = async (values) => {
    const { error } = await createTable({ body: values }) // JSON + Content-Type automatiques
  }

  const setField = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));
  const setColumn = (id, patch) =>
    setV((s) => ({ ...s, columns: s.columns.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));

  const addColumn = () => {
    const col = newColumn();
    setV((s) => ({ ...s, columns: [...s.columns, col] }));
    setFocusId(col.id);
  };
  const removeColumn = (id) => setV((s) => ({ ...s, columns: s.columns.filter((c) => c.id !== id) }));

  const handleClose = () => { setV(initial()); setErrors({ table: '', columns: {} }); onClose?.(); };

  const submit = (e) => {
    e.preventDefault();
    const next = { table: '', columns: {} };
    if (!IDENT.test(v.name)) next.table = 'Lettres, chiffres et _ uniquement, sans commencer par un chiffre.';

    const seen = new Set();
    for (const c of v.columns) {
      const key = c.name.toLowerCase();
      if (!IDENT.test(c.name)) next.columns[c.id] = 'Nom invalide (lettres, chiffres et _).';
      else if (seen.has(key)) next.columns[c.id] = 'Ce nom est déjà utilisé.';
      seen.add(key);
    }
    if (v.columns.length === 0) next.table = next.table || 'Ajoutez au moins une colonne.';

    setErrors(next);
    if (next.table || Object.keys(next.columns).length) return;

    onSubmit?.({
      name: v.name, engine: v.engine, comment: v.comment,
      columns: v.columns.map(({ name, type, primary, nullable }) => ({ name, type, primary, nullable: primary ? false : nullable })),
    });
    handleCreate({
      name: v.name, engine: v.engine, comment: v.comment,
      columns: v.columns.map(({ name, type, primary, nullable }) => ({ name, type, primary, nullable: primary ? false : nullable })),
    })
    handleClose();
  };

  return (
    <Modal open={open} title="Créer une table" onClose={handleClose} width={640}
      footer={<>
        <Button variant="ghost" onClick={handleClose}>Annuler</Button>
        <Button variant="primary" type="submit" form="create-table-form">Créer la table</Button>
      </>}>
      <form id="create-table-form" onSubmit={submit} noValidate style={{ display: 'grid', gap: 16 }}>
        <Field label="Nom de la table" value={v.name} onChange={setField('name')} error={errors.table} placeholder="ex. clients" autoFocus />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field as="select" label="Moteur" value={v.engine} onChange={setField('engine')}><option>InnoDB</option><option>MyISAM</option></Field>
          <Field label="Commentaire" value={v.comment} onChange={setField('comment')} placeholder="Facultatif" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="field-label">Colonnes ({v.columns.length})</span>
          <Button variant="ghost" icon="plus-lg" onClick={addColumn}>Ajouter une colonne</Button>
        </div>

        <div style={{ display: 'grid', gap: 10, maxHeight: 280, overflow: 'auto', paddingRight: 4 }}>
          {v.columns.map((c, i) => (
            <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1fr 150px auto auto auto', gap: 10, alignItems: 'start' }}>
              <Field aria-label={`Nom de la colonne ${i + 1}`} placeholder="Nom" value={c.name} autoFocus={c.id === focusId}
                onChange={(e) => setColumn(c.id, { name: e.target.value })} error={errors.columns[c.id]} />
              <Field as="select" aria-label={`Type de la colonne ${i + 1}`} value={c.type} onChange={(e) => setColumn(c.id, { type: e.target.value })}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </Field>
              <label className="check" style={{ height: 36 }} title="Clé primaire">
                <input type="checkbox" checked={c.primary} onChange={(e) => setColumn(c.id, { primary: e.target.checked })} />PK
              </label>
              <label className="check" style={{ height: 36 }} title="Autoriser NULL">
                <input type="checkbox" checked={c.nullable && !c.primary} disabled={c.primary} onChange={(e) => setColumn(c.id, { nullable: e.target.checked })} />Null
              </label>
              <IconButton icon="trash" label={`Supprimer la colonne ${i + 1}`} onClick={() => removeColumn(c.id)} />
            </div>
          ))}
        </div>
      </form>
    </Modal>
  );
}