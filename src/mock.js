// Données fictives pour visualiser l'interface. À remplacer par vos appels API.
const prenoms = ['Camille', 'Lucas', 'Emma', 'Hugo', 'Léa', 'Nathan', 'Chloé', 'Louis', 'Manon', 'Jules'];
const noms = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent'];
const pays = ['France', 'Belgique', 'Suisse', 'Canada', 'Espagne', 'Italie'];
const statuts = ['actif', 'inactif', 'en attente'];

export const COLUMNS = [
  { key: 'id', label: 'id', type: 'int', width: 80 },
  { key: 'nom', label: 'nom', type: 'varchar(120)', width: 200 },
  { key: 'email', label: 'email', type: 'varchar(255)', width: 260 },
  { key: 'pays', label: 'pays', type: 'varchar(60)', width: 140 },
  { key: 'statut', label: 'statut', type: 'enum', width: 130 },
  { key: 'total', label: 'total', type: 'decimal(10,2)', width: 120 },
  { key: 'cree_le', label: 'cree_le', type: 'datetime', width: 190 },
];

export const ROWS = Array.from({ length: 370 }, (_, i) => {
  const p = prenoms[(i * 7) % 10], n = noms[(i * 3) % 10];
  return {
    id: i + 1,
    nom: `${p} ${n}`,
    email: `${p}.${n}${i}@exemple.fr`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    pays: pays[(i * 5) % pays.length],
    statut: i % 17 === 0 ? null : statuts[(i * 11) % 3],
    total: Math.round(((i * 9301 + 49297) % 233280) / 23.3) / 100 * 10,
    cree_le: new Date(2026, 0, 1 + (i % 300), 8 + (i % 10), (i * 7) % 60).toISOString().replace('T', ' ').slice(0, 19),
  };
});

export const DATABASES = [
  {
    name: 'boutique', engine: 'MySQL 8.0', host: 'localhost:3306', charset: 'utf8mb4', size: '48,2 Mo', created: '12/03/2026',
    tables: [
      { name: 'clients', rows: 370, columns: 7, size: '1,4 Mo', updated: '10/11/2026' },
      { name: 'commandes', rows: 1280, columns: 9, size: '3,8 Mo', updated: '11/11/2026' },
      { name: 'produits', rows: 96, columns: 8, size: '320 Ko', updated: '02/11/2026' },
    ],
  },
  {
    name: 'analytics', engine: 'MySQL 8.0', host: 'db.ratven.io:3306', charset: 'utf8mb4', size: '212 Mo', created: '04/06/2026',
    tables: [
      { name: 'evenements', rows: 84210, columns: 6, size: '96 Mo', updated: '12/11/2026' },
      { name: 'sessions', rows: 12044, columns: 5, size: '14 Mo', updated: '12/11/2026' },
    ],
  },
];

export const CONNECTORS = [
  { id: 1, name: 'Local', host: 'localhost:3306', ok: true },
  { id: 2, name: 'Production', host: 'db.ratven.io:3306', ok: true },
  { id: 3, name: 'Recette', host: 'recette.ratven.io:3306', ok: false },
];

export const NOTIFICATIONS = [
  { id: 1, icon: 'check-circle', title: 'Requête terminée', text: 'nettoyage_clients.sql — 370 lignes modifiées', time: 'il y a 4 min', unread: true },
  { id: 2, icon: 'exclamation-triangle', title: 'Connecteur indisponible', text: 'Recette ne répond plus', time: 'il y a 1 h', unread: true },
  { id: 3, icon: 'table', title: 'Table créée', text: 'boutique.produits', time: 'hier', unread: false },
];

export const SQL_FILES = [
  { id: 'nettoyage-clients', name: 'nettoyage_clients.sql', content: "UPDATE clients\nSET statut = 'inactif'\nWHERE statut IS NULL; -- à vérifier avant exécution" },
  { id: 'top-commandes', name: 'top_commandes.sql', content: 'SELECT client_id, SUM(total) AS ca\nFROM commandes\nGROUP BY client_id\nORDER BY ca DESC\nLIMIT 20;' },
  { id: 'export-produits', name: 'export_produits.sql', content: 'SELECT * FROM produits;' },
];

export const CHAT_SEED = [
  { id: 1, role: 'assistant', text: 'Bonjour, je peux vous aider à écrire, expliquer ou optimiser vos requêtes SQL.' },
];
