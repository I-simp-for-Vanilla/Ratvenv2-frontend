import { useEffect, useRef, useState } from 'react';

/** Props : prompt, onCommand(cmd) => string | Promise<string> (retour affiché), initialLines. */
export default function Terminal({ prompt = 'ratven@local:~$', onCommand, initialLines = [{ kind: 'out', text: 'Ratven shell — saisissez une commande.' }] }) {
  const [lines, setLines] = useState(initialLines);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState([]);
  const [cursor, setCursor] = useState(-1);
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [lines]);

  const run = async (raw) => {
    const cmd = raw.trim();
    setLines((l) => [...l, { kind: 'in', text: `${prompt} ${raw}` }]);
    if (!cmd) return;
    setHistory((h) => [cmd, ...h]); setCursor(-1);
    if (cmd === 'clear') return setLines([]);
    setBusy(true);
    try {
      const out = onCommand ? await onCommand(cmd) : `ratven: commande non branchée : ${cmd}`;
      if (out != null) setLines((l) => [...l, { kind: 'out', text: String(out) }]);
    } catch (err) {
      setLines((l) => [...l, { kind: 'err', text: err.message }]);
    } finally { setBusy(false); }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !busy) { run(value); setValue(''); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); const i = Math.min(cursor + 1, history.length - 1); setCursor(i); setValue(history[i] ?? value); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); const i = Math.max(cursor - 1, -1); setCursor(i); setValue(i < 0 ? '' : history[i]); }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); setLines([]); }
  };

  return (
    <div className="term" onClick={() => inputRef.current?.focus()}>
      <div className="term-scroll">
        {lines.map((l, i) => <pre key={i} className={`term-line ${l.kind}`}>{l.text}</pre>)}
        <label className="term-input">
          <span className="term-prompt">{prompt}</span>
          <input ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKeyDown}
            spellCheck={false} autoComplete="off" aria-label="Commande" disabled={busy} />
        </label>
        <div ref={endRef} />
      </div>
    </div>
  );
}
