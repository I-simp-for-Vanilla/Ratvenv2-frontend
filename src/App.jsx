import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Sidenav from './components/Sidenav.jsx'
import Accueil from './pages/Accueil.jsx'
import Icones from './pages/Icones.jsx'
import SQLTable from './pages/SQLTable.jsx'

export default function App() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="app">
      <Header navOpen={navOpen} onToggleNav={() => setNavOpen((o) => !o)} />
      <div className="layout">
        <Sidenav open={navOpen} onNavigate={() => setNavOpen(false)} />
        {navOpen && <div className="overlay" onClick={() => setNavOpen(false)} />}
        <main className="main">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/icones" element={<Icones />} />
            <Route path="/tables" element={<SQLTable />} />
            <Route path="*" element={<Accueil />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
