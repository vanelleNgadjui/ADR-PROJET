# Initialisation du projet frontend

## 1. Création du projet
- Création d’un monorepo avec un dossier `frontend` pour le projet React/TypeScript/Vite.
- Initialisation du projet avec :
  ```bash
  npm create vite@latest . -- --template react-ts --yes
  npm install
  ```

## 2. Installation de Tailwind CSS, PostCSS et Autoprefixer
- Installation des dépendances :
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  ```

## 3. Problème rencontré : binaire `tailwindcss` absent
- Après installation, le binaire `tailwindcss` n’était pas présent dans `node_modules/.bin`.
- Plusieurs tentatives d’installation n’ont pas résolu le problème.
- Cause probable : incompatibilité avec Node.js v22 (préférer Node 20 LTS pour la stabilité avec Tailwind 4).

## 4. Création manuelle des fichiers de configuration
- Création manuelle de `tailwind.config.js` et `postcss.config.js`.
- Problème supplémentaire : le projet utilise `"type": "module"` dans `package.json`.
- Solution : renommer `postcss.config.js` en `postcss.config.cjs` pour la compatibilité CommonJS.

## 5. Problème avec Tailwind 4 et PostCSS
- Erreur : Tailwind 4 nécessite le plugin PostCSS séparé `@tailwindcss/postcss`.
- Solution :
  ```bash
  npm install -D @tailwindcss/postcss
  ```
- Modifier `postcss.config.cjs` :
  ```js
  module.exports = {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  }
  ```

## 6. Vérification
- Ajout des directives Tailwind dans `src/index.css` :
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- Lancement du projet :
  ```bash
  npm run dev
  ```
- Résultat : l’icône Vite/React s’affiche, Tailwind fonctionne.

## 7. Conseils
- Pour éviter les bugs avec Tailwind 4, utiliser Node 20 LTS.
- Toujours vérifier la compatibilité des plugins lors de l’installation de versions majeures.

---

**Cette documentation doit être mise à jour à chaque étape importante du projet.** 