import { useId } from 'react';

/** Champ de formulaire. `as` : 'input' (défaut) | 'select' | 'textarea'. */
export default function Field({ label, error, hint, icon, end, as: As = 'input', children, className = '', ...props }) {
  const id = useId();
  const cls = As === 'input' ? 'input' : As;
  const control = <As id={id} className={cls} aria-invalid={!!error} {...props}>{children}</As>;
  return (
    <div className={`field ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      {icon || end ? (
        <div className="input-wrap">
          {icon && <i className={`bi bi-${icon}`} aria-hidden="true" />}
          {control}
          {end && <span className="input-end">{end}</span>}
        </div>
      ) : control}
      {error ? <span className="field-error">{error}</span> : hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}
