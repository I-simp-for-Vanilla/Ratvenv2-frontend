import { useCallback, useState } from 'react';

/** Thème sombre par défaut ; le choix est mémorisé côté navigateur. */
export default function useTheme() {
  const [theme, setThemeState] = useState(() => document.documentElement.dataset.theme || 'dark');
  const setTheme = useCallback((t) => {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('ratven-theme', t); } catch {}
    setThemeState(t);
  }, []);
  const toggle = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme]);
  return { theme, toggle };
}
