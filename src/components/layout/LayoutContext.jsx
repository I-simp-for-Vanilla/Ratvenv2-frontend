import { createContext, useContext, useMemo, useState } from 'react';

const Ctx = createContext(null);

/** État de l'overlay : visibilité des panneaux et hauteur du terminal. */
export function LayoutProvider({ children }) {
  const [navOpen, setNavOpen] = useState(true);
  const [subOpen, setSubOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [dockOpen, setDockOpen] = useState(true);
  const [dockH, setDockH] = useState(260);
  const value = useMemo(() => ({ navOpen, setNavOpen, subOpen, setSubOpen, chatOpen, setChatOpen, dockOpen, setDockOpen, dockH, setDockH }),
    [navOpen, subOpen, chatOpen, dockOpen, dockH]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useLayout = () => useContext(Ctx);
