import { useEffect, useRef, useState } from 'react';

/**
 * <Dropdown trigger={({ open, toggle }) => <button onClick={toggle}>…</button>}>
 *   {(close) => <MenuItem onClick={close}>…</MenuItem>}
 * </Dropdown>
 */
export default function Dropdown({ trigger, children, align = 'end', width }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const away = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc); };
  }, [open]);

  const close = () => setOpen(false);
  return (
    <div className="dd" ref={ref}>
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open && (
        <div className={`dd-menu dd-${align}`} style={{ width }} role="menu">
          {typeof children === 'function' ? children(close) : children}
        </div>
      )}
    </div>
  );
}

export function MenuItem({ icon, danger, active, children, className = '', ...props }) {
  return (
    <button type="button" role="menuitem" className={`menu-item${danger ? ' danger' : ''}${active ? ' is-active' : ''} ${className}`} {...props}>
      {icon && <i className={`bi bi-${icon}`} aria-hidden="true" />}
      {children}
    </button>
  );
}
export const MenuSeparator = () => <div className="menu-sep" role="separator" />;
export const MenuTitle = ({ children }) => <div className="menu-title">{children}</div>;
