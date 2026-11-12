import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Filtre de colonne façon Excel/Snowflake.
 * options : tableau des valeurs distinctes si <= 20, sinon null (filtre texte « contient »).
 * value : null | { values: Set } | { text }.
 */
export default function ColumnFilter({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btn = useRef(null);
  const pop = useRef(null);

  const toggleOpen = () => {
    if (!open) {
      const r = btn.current.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: Math.max(8, Math.min(r.left, window.innerWidth - 264)) });
    }
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;
    const away = (e) => { if (!pop.current?.contains(e.target) && !btn.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    const scroll = (e) => { if (!pop.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', esc);
    window.addEventListener('scroll', scroll, true);
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc); window.removeEventListener('scroll', scroll, true); };
  }, [open]);

  const selected = value?.values ?? new Set(options ?? []);
  const toggleValue = (v) => {
    const next = new Set(selected);
    next.has(v) ? next.delete(v) : next.add(v);
    onChange(next.size === options.length ? null : { values: next });
  };

  return (
    <>
      <button ref={btn} type="button" className={`dt-filter-btn${value ? ' on' : ''}`} aria-label={`Filtrer ${label}`} aria-expanded={open} onClick={toggleOpen}>
        <i className={`bi bi-funnel${value ? '-fill' : ''}`} />
      </button>
      {open && createPortal(
        <div ref={pop} className="popover" style={pos} role="dialog" aria-label={`Filtre ${label}`}>
          {options ? (
            <>
              <div className="popover-actions">
                <button type="button" onClick={() => onChange(null)}>Tout sélectionner</button>
                <button type="button" onClick={() => onChange({ values: new Set() })}>Tout effacer</button>
              </div>
              <div className="popover-list">
                {options.map((o) => (
                  <label key={o} className="check">
                    <input type="checkbox" checked={selected.has(o)} onChange={() => toggleValue(o)} />
                    <span>{o}</span>
                  </label>
                ))}
              </div>
            </>
          ) : (
            <div className="field">
              <label className="field-label">{label} contient</label>
              <input className="input" autoFocus value={value?.text ?? ''} placeholder="Texte à rechercher"
                onChange={(e) => onChange(e.target.value ? { text: e.target.value } : null)} />
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
