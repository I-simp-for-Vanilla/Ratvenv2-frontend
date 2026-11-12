# Violet Starter

React + Vite, React Router, Bootstrap Icons. Thème sombre violet.

```bash
npm install
npm run dev
```

## Génération du frontend

Je suis en train de créer un site de **SGBD** en React nommé Ratven avec comme code couleur : **noir** et **violet**. Le mode sombre est le mode par défaut. Je souhaite que tu me génères l'interface react dans un style **sobre** et **professionel**, avec quelques ombres et lumières, mais tout en gardant un design axé sur le **fonctionnel** avant tout. Ne génère que la partie graphique (composants avec html/css et js pour les animations, je m'occupe d'implémenter la partie fonctionelle). N'hésite pas à construire plein de composants réutilisables afin de faciliter la maintenabilité du projet.

### Composition de l'overlay :

- un header avec le logo et le titre "Ratven" sur la gauche, une barre de recherche au milieu, une dropdown pour gérer les connecteurs à la base de données, un logo notifications avec une dropdown et un logo profile utilisateur qui mène vers une page d'inscription/connexion sur la droite.
- un menu `burger` sur le côté type **snowflake**, avec possibilité d'aller dans la partie contenant les données, la partie contenant les fichiers SQL ou un `terminal unix`. Le menu doit pouvoir être caché même sur ordinateur.
    - Pour la partie données, deuxième `sidebar` avec les liens vers les pages de bases de données et les pages de tables correspondantes qui apparaissent en `dropdown`. Le menu doit pouvoir être caché même sur ordinateur.
    - Pour la partie fichiers SQL, deuxième sidebar avec les liens vers les pages de fichier
- Le contenu principal
- un `chat` de l'autre côté pour parler avec un `llm`, pouvant également être caché.
- un `terminal` attaché au bas de la page en position : fixed, pouvant être resized et caché, n'est pas affiché dans la page `terminal`

### Je veux que tu me génères les pages suivantes :

- Formulaire de connexion / inscription avec : addresse email, nom d'utilisateur, mdp + connexion avec le nom d'utilisateur + mdp
- page de la base de données avec les informations principales et la liste des tables associées. Boutons pour créer une table, qui ouvre un formulaire en `popup` avec quelques champs basiques et bouton options sur chaques lignes de table pour la supprimer (icone `...`)
- `Datatable` pour afficher une table, avec plusieurs pages, barre de recherche pour trouver une donnée, type de la colonne, possibilité de trier sur une colonne en particulier et possibilité de filtrer sur une colonne (avec affichage des valeurs si moins de 20 valeurs différentes, comme pour excel ou snowflake) + possibilité de resize les colonnes (comme pour excel)
- zone de `code` pour écrire du SQL (avec un formulaire)
- une page pour afficher un `terminal` (sur cette page, on n'a pas le terminal de l'overlay en plus)

### Bibliothèques à utiliser

- bootstrap-icons
- react-router
- autres bibliothèques que tu jugeras utiles