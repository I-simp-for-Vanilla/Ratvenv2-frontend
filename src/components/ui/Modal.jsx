import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import IconButton from './IconButton';

export default function Modal({ open, title, onClose, children, footer, width }) {
  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="modal card" role="dialog" aria-modal="true" aria-label={title} style={{ width }}>
        <div className="modal-head">
          <h3>{title}</h3>
          <IconButton icon="x-lg" label="Fermer" onClick={onClose} />
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
