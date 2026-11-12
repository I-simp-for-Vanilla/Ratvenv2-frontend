import { useEffect, useRef } from 'react';

export default function SearchBar({ placeholder = 'Rechercher une base, une table, un fichier…', onSearch, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => {
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); ref.current?.focus(); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);
  return (
    <form className={`input-wrap search ${className}`} role="search" onSubmit={(e) => { e.preventDefault(); onSearch?.(ref.current.value); }}>
      <i className="bi bi-search" aria-hidden="true" />
      <input ref={ref} className="input" type="text" placeholder={placeholder} aria-label="Rechercher" />
      <kbd className="kbd">/</kbd>
    </form>
  );
}
