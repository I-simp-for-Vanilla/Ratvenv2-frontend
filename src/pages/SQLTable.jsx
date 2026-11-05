import DataTable from '../components/Table.jsx'

// Données factices : remplace-les par le résultat de ton API (SELECT * FROM users)
const roles = ['admin', 'editor', 'viewer']
const rows = Array.from({ length: 37 }, (_, i) => ({
  id: i + 1,
  email: `user${i + 1}@example.com`,
  role: roles[i % 3],
  score: Math.round(((i * 37) % 100) * 10) / 10,
  active: i % 4 !== 0,
  deleted_at: i % 7 === 0 ? '2026-09-12' : null,
}))

export default function SQLTable() {
  return (
    <section className="page">
      <h1>Données</h1>
      <p className="lead">Affichage d'une table SQL avec tri, recherche et pagination.</p>
      <DataTable title="users" rows={rows} pageSize={10} />
    </section>
  )
}
