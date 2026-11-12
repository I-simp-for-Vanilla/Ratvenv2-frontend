import { forwardRef } from 'react';

const IconButton = forwardRef(function IconButton({ icon, label, badge, active, className = '', ...props }, ref) {
  return (
    <button ref={ref} type="button" className={`btn-icon${active ? ' is-on' : ''} ${className}`} aria-label={label} title={label} {...props}>
      <i className={`bi bi-${icon}`} aria-hidden="true" />
      {badge > 0 && <span className="dot-badge">{badge}</span>}
    </button>
  );
});
export default IconButton;
