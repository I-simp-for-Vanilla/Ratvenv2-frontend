import { useMemo } from 'react';

const KEYWORDS = 'SELECT|FROM|WHERE|AND|OR|NOT|NULL|IS|IN|LIKE|BETWEEN|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|DISTINCT|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|DROP|INDEX|PRIMARY|KEY|DEFAULT|UNION|ALL|COUNT|SUM|AVG|MIN|MAX|CASE|WHEN|THEN|ELSE|END|ASC|DESC|DATABASE|USE|SHOW|DESCRIBE|EXISTS';
const TOKEN = new RegExp(`(--[^\\n]*)|('(?:[^']|'')*')|(\\b\\d+(?:\\.\\d+)?\\b)|\\b(${KEYWORDS})\\b`, 'gi');

function highlight(src) {
  const out = []; let last = 0;
  for (const m of src.matchAll(TOKEN)) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const cls = m[1] ? 'com' : m[2] ? 'str' : m[3] ? 'num' : 'kw';
    out.push(<span key={m.index} className={`tok-${cls}`}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  out.push(src.slice(last) + '\n');
  return out;
}

/** Éditeur contrôlé avec coloration SQL, numéros de ligne et Tab = 2 espaces. */
export default function CodeEditor({ value, onChange, onRun, ...props }) {
  const lines = value.split('\n').length;
  const gutter = useMemo(() => Array.from({ length: lines }, (_, i) => i + 1).join('\n'), [lines]);
  const nodes = useMemo(() => highlight(value), [value]);

  const onKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart: s, selectionEnd: en } = e.target;
      onChange(value.slice(0, s) + '  ' + value.slice(en));
      requestAnimationFrame(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; });
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onRun?.();
    }
  };

  return (
    <div className="code">
      <div className="code-gutter" aria-hidden="true">{gutter}</div>
      <div className="code-area">
        <pre className="code-hl" aria-hidden="true">{nodes}</pre>
        <textarea className="code-input" value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={onKeyDown}
          spellCheck={false} wrap="off" aria-label="Requête SQL" {...props} />
      </div>
    </div>
  );
}
