import { useMemo, useState } from 'react'
import '../Table.css'

const SORT_ICON = {
  none: 'bi-chevron-expand',
  asc: 'bi-caret-up-fill',
  desc: 'bi-caret-down-fill',
}

const isNull = (v) => v === null || v === undefined

/** Devine le type SQL d'une colonne à partir de ses valeurs non nulles. */
function inferType(rows, key) {
  const values = rows.map((r) => r[key]).filter((v) => !isNull(v))
  if (values.length && values.every((v) => typeof v === 'number')) return 'number'
  if (values.length && values.every((v) => typeof v === 'boolean')) return 'boolean'
  return 'text'
}

function compare(a, b, type) {
  if (type === 'number') return a - b
  if (type === 'boolean') return Number(a) - Number(b)
  return String(a).localeCompare(String(b), 'fr', { numeric: true, sensitivity: 'base' })
}

function formatCell(value, type) {
  if (isNull(value)) return <span className="dt-null">NULL</span>
  if (type === 'boolean') {
    return <span className={`dt-badge ${value ? 'ok' : 'ko'}`}>{String(value)}</span>
  }
  if (value instanceof Date) return value.toLocaleString('fr-FR')
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

/** Ex. : [1, '…', 4, 5, 6, '…', 20] */
function pageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const wanted = [1, total, current - 1, current, current + 1]
  const pages = [...new Set(wanted)].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out = []
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push(`gap-${p}`)
    out.push(p)
  })
  return out
}

/**
 * Props
 * - rows     : tableau d'objets (une ligne SQL = un objet)
 * - columns  : optionnel. ['id', 'email'] ou [{ key, label, type }]
 *              (si absent, déduit des clés de la première ligne)
 * - title    : nom de la table affiché dans la barre d'outils
 * - pageSize : nombre de lignes par page (10 par défaut)
 */
export default function DataTable({ title = 'table', columns, rows = [], pageSize = 10 }) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState({ key: null, dir: 'asc' })
  const [page, setPage] = useState(1)

  const cols = useMemo(() => {
    const raw = columns ?? (rows[0] ? Object.keys(rows[0]) : [])
    return raw.map((c) => {
      const col = typeof c === 'string' ? { key: c } : c
      return { label: col.key, ...col, type: col.type ?? inferType(rows, col.key) }
    })
  }, [columns, rows])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) =>
      cols.some((c) => {
        const v = row[c.key]
        return !isNull(v) && String(v).toLowerCase().includes(q)
      })
    )
  }, [rows, cols, query])

  const sorted = useMemo(() => {
    if (!sort.key) return filtered
    const col = cols.find((c) => c.key === sort.key)
    const factor = sort.dir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const va = a[sort.key]
      const vb = b[sort.key]
      if (isNull(va) && isNull(vb)) return 0
      if (isNull(va)) return 1 // les NULL toujours en bas
      if (isNull(vb)) return -1
      return factor * compare(va, vb, col.type)
    })
  }, [filtered, cols, sort])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const current = Math.min(page, pageCount)
  const start = (current - 1) * pageSize
  const visible = sorted.slice(start, start + pageSize)

  // asc → desc → pas de tri
  const toggleSort = (key) => {
    setSort((s) => {
      if (s.key !== key) return { key, dir: 'asc' }
      if (s.dir === 'asc') return { key, dir: 'desc' }
      return { key: null, dir: 'asc' }
    })
    setPage(1)
  }

  const onSearch = (e) => {
    setQuery(e.target.value)
    setPage(1)
  }

  const count = sorted.length
  const summary =
    count === 0
      ? '0 ligne'
      : `${start + 1}–${start + visible.length} sur ${count} ligne${count > 1 ? 's' : ''}` +
        (count !== rows.length ? ` (filtrées, ${rows.length} au total)` : '')

  return (
    <div className="datatable">
      <div className="dt-toolbar">
        <h2 className="dt-title">
          <i className="bi bi-table"></i> {title}
        </h2>
        <label className="dt-search">
          <i className="bi bi-search"></i>
          <input
            type="search"
            placeholder="Rechercher…"
            aria-label={`Rechercher dans ${title}`}
            value={query}
            onChange={onSearch}
          />
        </label>
      </div>

      <div className="dt-scroll">
        <table className="dt-table">
          <thead>
            <tr>
              {cols.map((c) => {
                const isSorted = sort.key === c.key
                const dir = isSorted ? sort.dir : 'none'
                return (
                  <th
                    key={c.key}
                    className={`sortable ${isSorted ? 'sorted' : ''} ${c.type === 'number' ? 'num' : ''}`}
                    onClick={() => toggleSort(c.key)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        toggleSort(c.key)
                      }
                    }}
                    tabIndex={0}
                    aria-sort={
                      dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none'
                    }
                  >
                    {c.label}
                    <i className={`bi ${SORT_ICON[dir]}`}></i>
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={cols.length || 1}>
                  <div className="dt-empty">
                    <i className="bi bi-inbox"></i>
                    {rows.length === 0 ? 'La table est vide.' : 'Aucune ligne ne correspond à la recherche.'}
                  </div>
                </td>
              </tr>
            ) : (
              visible.map((row, i) => (
                <tr key={start + i}>
                  {cols.map((c) => (
                    <td key={c.key} className={c.type === 'number' ? 'num' : ''}>
                      {formatCell(row[c.key], c.type)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="dt-footer">
        <span>{summary}</span>
        <div className="dt-pagination">
          <button
            onClick={() => setPage(current - 1)}
            disabled={current === 1}
            aria-label="Page précédente"
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          {pageList(current, pageCount).map((p) =>
            typeof p === 'string' ? (
              <span key={p} className="dt-ellipsis">…</span>
            ) : (
              <button
                key={p}
                className={p === current ? 'active' : ''}
                onClick={() => setPage(p)}
                aria-current={p === current ? 'page' : undefined}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => setPage(current + 1)}
            disabled={current === pageCount}
            aria-label="Page suivante"
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  )
}
