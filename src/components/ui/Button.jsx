/** variant : 'default' | 'primary' | 'ghost' | 'danger' */
export default function Button({ variant = 'default', icon, children, className = '', ...props }) {
  const v = variant === 'default' ? '' : ` btn-${variant}`;
  return (
    <button type="button" className={`btn${v} ${className}`} {...props}>
      {icon && <i className={`bi bi-${icon}`} aria-hidden="true" />}
      {children}
    </button>
  );
}
