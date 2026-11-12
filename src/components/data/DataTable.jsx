import { useEffect, useMemo, useState } from 'react';
import ColumnFilter from './ColumnFilter';

const isNum = (t) => /int|decimal|float|double|numeric/i.test(t);
const str = (v) => (v == null ? 'NULL' : String(v));
const IDX_W = 56;

/**
 * columns : [{ key, label, type, width? }]   rows : objets indexés par key.
 * Pagination, recherche globale, tri, filtres par colonne et colonnes redimensionnables (tout en local).
 */
export default function DataTable({ columns, rows, pageSizes = [25, 50, 100], initialPageSize = 25, toolbarExtra }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(null);
  const [filters, setFilters] = useState({});
  const [widths, setWidths] = useState(() => Object.fromEntries(columns.map((c) => [c.key, c.width ?? 180])));
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(initialPageSize);

  // Valeurs distinctes (seulement si <= 20) pour le filtre façon Excel
  const options = useMemo(() => Object.fromEntries(columns.map((c) => {
    const set = new Set();
    for (const r of rows) { set.add(str(r[c.key])); if (set.size > 20) return [c.key, null]; }
    return [c.key, [...set].sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }))];
  })), [columns, rows]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = rows.filter((r) => {
      if (q && !columns.some((c) => str(r[c.key]).toLowerCase().includes(q))) return false;
      return Object.entries(filters).every(([k, f]) => (f.values ? f.values.has(str(r[k])) : str(r[k]).toLowerCase().includes(f.text.toLowerCase())));
    });
    if (sort) {
      const num = isNum(columns.find((c) => c.key === sort.key).type);
      const d = sort.dir === 'asc' ? 1 : -1;
      out = [...out].sort((a, b) => {
        const x = a[sort.key], y = b[sort.key];
        if (x == null || y == null) return (x == null) - (y == null);
        return (num ? x - y : String(x).localeCompare(String(y), 'fr', { numeric: true })) * d;
      });
    }
    return out;
  }, [rows, columns, query, filters, sort]);

  useEffect(() => setPage(0), [query, filters, sort, size, rows]);

  const pages = Math.max(1, Math.ceil(visible.length / size));
  const start = page * size;
  const slice = visible.slice(start, start + size);
  const hasFilters = Object.keys(filters).length > 0;

  const cycleSort = (key) => setSort((s) => (!s || s.key !== key ? { key, dir: 'asc' } : s.dir === 'asc' ? { key, dir: 'desc' } : null));

  const startResize = (e, key) => {
    e.preventDefault(); e.stopPropagation();
    const x0 = e.clientX, w0 = widths[key];
    document.body.classList.add('is-resizing');
    const move = (ev) => setWidths((w) => ({ ...w, [key]: Math.max(80, w0 + ev.clientX - x0) }));
    const up = () => {
      document.body.classList.remove('is-resizing');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const totalW = IDX_W + columns.reduce((s, c) => s + (widths[c.key] ?? 180), 0);

  return (
    <div className="dt">
      <div className="dt-toolbar">
        <div className="input-wrap">
          <i className="bi bi-search" aria-hidden="true" />
          <input className="input" type="text" placeholder="Rechercher dans la table…" aria-label="Rechercher dans la table" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {hasFilters && <button type="button" className="btn btn-ghost" onClick={() => setFilters({})}><i className="bi bi-funnel" />Réinitialiser les filtres</button>}
        {toolbarExtra}
        <span className="dt-count">{visible.length.toLocaleString('fr-FR')} ligne{visible.length > 1 ? 's' : ''}{visible.length !== rows.length && ` sur ${rows.length.toLocaleString('fr-FR')}`}</span>
      </div>

      <div className="dt-scroll">
        <table className="dt-table" style={{ width: totalW }}>
          <colgroup>
            <col style={{ width: IDX_W }} />
            {columns.map((c) => <col key={c.key} style={{ width: widths[c.key] }} />)}
          </colgroup>
          <thead>
            <tr>
              <th className="idx" scope="col"><div className="dt-th" style={{ justifyContent: 'flex-end' }}>#</div></th>
              {columns.map((c) => (
                <th key={c.key} scope="col" aria-sort={sort?.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <div className="dt-th">
                    <button type="button" className="dt-label" onClick={() => cycleSort(c.key)} title="Trier">
                      <b>{c.label}</b>
                      <span className="dt-type">{c.type}</span>
                    </button>
                    {sort?.key === c.key && <i className={`bi bi-arrow-${sort.dir === 'asc' ? 'up' : 'down'} dt-sort`} aria-hidden="true" />}
                    <ColumnFilter label={c.label} options={options[c.key]} value={filters[c.key]}
                      onChange={(v) => setFilters((f) => { const n = { ...f }; v ? (n[c.key] = v) : delete n[c.key]; return n; })} />
                    <span className="dt-resizer" role="separator" aria-orientation="vertical" aria-label={`Redimensionner ${c.label}`}
                      onPointerDown={(e) => startResize(e, c.key)}
                      onDoubleClick={() => setWidths((w) => ({ ...w, [c.key]: c.width ?? 180 }))} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((r, i) => (
              <tr key={start + i}>
                <td className="idx">{start + i + 1}</td>
                {columns.map((c) => {
                  const v = r[c.key];
                  return <td key={c.key} className={isNum(c.type) ? 'num' : undefined} title={v == null ? 'NULL' : String(v)}>{v == null ? <span className="dt-null">NULL</span> : String(v)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {slice.length === 0 && <div className="dt-empty">Aucune ligne ne correspond à la recherche ou aux filtres.</div>}
      </div>

      <div className="dt-foot">
        <span>{visible.length === 0 ? '0' : `${start + 1}–${Math.min(start + size, visible.length)}`} sur {visible.length.toLocaleString('fr-FR')}</span>
        <div className="dt-pager">
          <label className="muted" style={{ marginRight: 8 }}>Lignes par page{' '}
            <select className="select" value={size} onChange={(e) => setSize(Number(e.target.value))}>{pageSizes.map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          <button type="button" className="btn-icon" aria-label="Première page" disabled={page === 0} onClick={() => setPage(0)}><i className="bi bi-chevron-bar-left" /></button>
          <button type="button" className="btn-icon" aria-label="Page précédente" disabled={page === 0} onClick={() => setPage((p) => p - 1)}><i className="bi bi-chevron-left" /></button>
          <span style={{ padding: '0 8px' }}>Page {page + 1} / {pages}</span>
          <button type="button" className="btn-icon" aria-label="Page suivante" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}><i className="bi bi-chevron-right" /></button>
          <button type="button" className="btn-icon" aria-label="Dernière page" disabled={page >= pages - 1} onClick={() => setPage(pages - 1)}><i className="bi bi-chevron-bar-right" /></button>
        </div>
      </div>
    </div>
  );
}
