# 📊 Plan d'Intégration Dashboard - Agenda du Royaume

## 🎯 **Objectif**
Intégrer progressivement les composants du template `free-react-tailwind-admin-dashboard-main` dans notre application, en adaptant chaque composant à notre stack et design system.

## 🏗️ **Structure des Dossiers**

```
src/
├── components/
│   ├── dashboard/
│   │   ├── ui/           # Composants UI de base (Button, Badge, etc.)
│   │   ├── layout/       # Layouts (Sidebar, Header, etc.)
│   │   ├── forms/        # Composants formulaires
│   │   ├── charts/       # Graphiques et analytics
│   │   └── tables/       # Tableaux de données
│   ├── ui/              # Composants UI existants
│   └── auth/            # Composants auth existants
├── pages/
│   └── dashboard/
│       ├── participant/  # Pages dashboard participant
│       ├── organisateur/ # Pages dashboard organisateur
│       └── admin/        # Pages dashboard admin
├── hooks/
│   └── dashboard/       # Hooks spécifiques dashboard
├── context/
│   └── dashboard/       # Contextes dashboard
└── utils/
    └── dashboard/       # Utilitaires dashboard
```

## 📋 **Plan d'Intégration Progressive**

### **Phase 1 : Composants UI de Base** ✅
- [ ] Button (variants, tailles, icônes)
- [ ] Badge (couleurs, variants)
- [ ] Dropdown (menu, items)
- [ ] Modal (backdrop, animations)
- [ ] Input/Form elements
- [ ] Card (layouts, variants)

### **Phase 2 : Composants Layout** 🔄
- [ ] Sidebar (navigation, états)
- [ ] Header (search, notifications)
- [ ] Layout system (responsive)
- [ ] Navigation context

### **Phase 3 : Composants Avancés** ⏳
- [ ] Charts (ApexCharts)
- [ ] Tables (pagination, tri)
- [ ] Calendar (FullCalendar)
- [ ] File upload (Dropzone)

### **Phase 4 : Intégration Dashboard** ⏳
- [ ] Assembler les composants
- [ ] Créer les pages par rôle
- [ ] Connecter l'authentification
- [ ] Intégrer les données

## 🎨 **Adaptation Design System**

### **Couleurs à Utiliser**
```css
/* Organisateurs */
--color-primary-blue: #00008B;

/* Participants */
--color-primary-orange: #FFA500;

/* Accents */
--color-secondary-coral: #EE6239;
--color-secondary-mint: #62BF92;
```

### **Composants à Adapter**
- [ ] Remplacer `brand-500` par nos couleurs
- [ ] Adapter les variants aux rôles
- [ ] Intégrer notre système d'icônes
- [ ] Respecter notre typographie

## 🔧 **Compatibilité Stack**

### **Versions Actuelles (Compatibles)**
- React: 19.1.0 ✅
- TypeScript: 5.8.3 ✅
- Vite: 7.0.4 ✅
- Tailwind CSS: 3.4.17 ✅

### **Adaptations Nécessaires**
- [ ] Imports React Router (react-router-dom vs react-router)
- [ ] Classes Tailwind CSS (v3 vs v4)
- [ ] Configuration PostCSS
- [ ] Types TypeScript

## 📝 **Workflow de Développement**

### **Pour Chaque Composant**
1. **Extraire** le composant du template
2. **Adapter** les imports et dépendances
3. **Tester** individuellement
4. **Intégrer** dans notre structure
5. **Documenter** les changements
6. **Commit** avec message descriptif

### **Gestion des Versions**
- **Branch** : `feature/dashboard-integration`
- **Commits** : Un par composant intégré
- **Rollback** : Possible à chaque étape
- **Tests** : Vérification après chaque intégration

## 🚀 **Prochaines Étapes**

### **Composant Prioritaire : Button**
- [ ] Extraire `Button.tsx` du template
- [ ] Adapter les couleurs à notre palette
- [ ] Tester les variants et tailles
- [ ] Intégrer dans `src/components/dashboard/ui/`
- [ ] Documenter l'utilisation

## 📊 **Suivi de Progression**

### **Composants Intégrés**
- [ ] Aucun pour l'instant

### **Composants en Cours**
- [ ] Button (prochain)

### **Composants Restants**
- [ ] Badge
- [ ] Dropdown
- [ ] Modal
- [ ] Input/Form
- [ ] Card
- [ ] Sidebar
- [ ] Header
- [ ] Charts
- [ ] Tables
- [ ] Calendar

---

**Dernière mise à jour :** $(date)
**Statut :** 🟡 En préparation
**Prochaine action :** Intégration du composant Button
