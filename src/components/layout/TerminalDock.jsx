import { useLayout } from './LayoutContext';
import IconButton from '../ui/IconButton';
import Terminal from '../terminal/Terminal';

/** Terminal fixe en bas de page : redimensionnable (poignée du haut) et masquable. */
export default function TerminalDock({ onCommand }) {
  const { dockOpen, setDockOpen, dockH, setDockH } = useLayout();

  const startResize = (e) => {
    e.preventDefault();
    const startY = e.clientY, startH = dockH;
    document.body.classList.add('is-resizing-y');
    const move = (ev) => setDockH(Math.round(Math.min(window.innerHeight * 0.7, Math.max(120, startH + startY - ev.clientY))));
    const up = () => {
      document.body.classList.remove('is-resizing-y');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  if (!dockOpen) {
    return <button type="button" className="dock-tab" onClick={() => setDockOpen(true)}><i className="bi bi-terminal" />Terminal<i className="bi bi-chevron-up" style={{ fontSize: 11 }} /></button>;
  }
  return (
    <section className="dock" aria-label="Terminal">
      <div className="dock-grip" onPointerDown={startResize} role="separator" aria-orientation="horizontal" aria-label="Redimensionner le terminal" />
      <div className="dock-head">
        <span><i className="bi bi-terminal" style={{ marginRight: 8 }} />Terminal</span>
        <IconButton icon="chevron-down" label="Masquer le terminal" onClick={() => setDockOpen(false)} />
      </div>
      <Terminal onCommand={onCommand} />
    </section>
  );
}
