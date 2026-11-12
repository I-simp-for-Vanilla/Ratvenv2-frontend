import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Shell from './components/layout/Shell';
import EmptyState from './components/ui/EmptyState';
import AuthPage from './pages/AuthPage';
import DatabasePage from './pages/DatabasePage';
import TablePage from './pages/TablePage';
import SqlPage from './pages/SqlPage';
import TerminalPage from './pages/TerminalPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<Shell />}>
          <Route index element={<Navigate to="/data" replace />} />
          <Route path="data" element={<EmptyState icon="database" title="Choisissez une base" text="Sélectionnez une base de données dans le panneau de gauche pour voir ses tables." />} />
          <Route path="data/:db" element={<DatabasePage />} />
          <Route path="data/:db/:table" element={<TablePage />} />
          <Route path="sql" element={<SqlPage />} />
          <Route path="sql/:file" element={<SqlPage />} />
          <Route path="terminal" element={<TerminalPage />} />
          <Route path="*" element={<EmptyState icon="compass" title="Page introuvable" text="Cette adresse ne correspond à aucune page de Ratven." />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
