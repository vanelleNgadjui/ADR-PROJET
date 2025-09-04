# Architecture Modulaire - L'Agenda du Royaume

## Vue d'ensemble
Ce document détaille l'architecture modulaire et la stack technique utilisée dans le projet "L'Agenda du Royaume", une plateforme de gestion d'événements chrétiens.

## Stack Technique par Module

| Module / Fonctionnalité | Stack Technique | Statut | Détails |
|-------------------------|-----------------|---------|---------|
| **Interface utilisateur** | React 19 + Vite + TypeScript | ✅ Implémenté | Interface moderne avec composants réutilisables |
| **Styling & Design** | Tailwind CSS + Framer Motion | ✅ Implémenté | Design system cohérent avec animations |
| **Routing** | React Router DOM v7 | ✅ Implémenté | Navigation SPA avec gestion des états |
| **Authentification** | Supabase Auth | ✅ Implémenté | Gestion des comptes, rôles et sessions |
| **Base de données** | Supabase (PostgreSQL) | ✅ Implémenté | Schéma relationnel avec RLS policies |
| **Stockage fichiers** | Supabase Storage | ✅ Implémenté | Buckets pour photos de profil et images d'événements |
| **Gestion des événements** | React + Supabase | ✅ Implémenté | CRUD complet avec wizard de création |
| **Système de catégories** | Supabase + React | ✅ Implémenté | Hiérarchie catégories/sous-catégories |
| **Recherche & filtres** | React + Supabase | ✅ Implémenté | Filtrage avancé avec modales |
| **Gestion des utilisateurs** | Supabase + React | ✅ Implémenté | Profils, rôles, permissions |
| **Système de communautés** | Supabase + React | ✅ Implémenté | Groupes, églises, associations |
| **Gestion des billets** | React + Supabase | 🔄 En développement | Structure de base implémentée |
| **Dashboard & Analytics** | React + ApexCharts | 🔄 En développement | Composants de base créés |
| **Système de notifications** | React + Supabase | 🔄 En développement | Interface de base implémentée |
| **Gestion des sessions** | React + Supabase | 🔄 En développement | Structure pour événements multi-sessions |
| **Système de paiement** | Non défini | ❌ À implémenter | Intégration Stripe/autre à prévoir |
| **Push notifications** | Non défini | ❌ À implémenter | Service de notifications temps réel |
| **Moteur de recherche avancé** | Non défini | ❌ À implémenter | Algolia/Meilisearch pour performance |
| **CMS Admin** | React + Supabase | 🔄 En développement | Interface d'administration en cours |
| **API Backend** | Supabase Edge Functions | ❌ À implémenter | Logique métier complexe |
| **Tests automatisés** | Non défini | ❌ À implémenter | Jest/Vitest + Testing Library |
| **CI/CD** | Non défini | ❌ À implémenter | GitHub Actions/GitLab CI |
| **Monitoring** | Non défini | ❌ À implémenter | Sentry/LogRocket |
| **Performance** | Vite + React 19 | ✅ Implémenté | Build optimisé avec code splitting |

## Technologies Principales

### Frontend
- **React 19** : Framework principal avec hooks et composants fonctionnels
- **TypeScript** : Typage statique pour la robustesse du code
- **Vite** : Build tool moderne et rapide
- **Tailwind CSS** : Framework CSS utilitaire avec design system personnalisé
- **Framer Motion** : Animations et transitions fluides
- **React Router DOM** : Routing côté client avec gestion des états

### Backend & Base de données
- **Supabase** : Backend-as-a-Service avec PostgreSQL
- **PostgreSQL** : Base de données relationnelle robuste
- **Row Level Security (RLS)** : Sécurité des données au niveau des lignes
- **Edge Functions** : Logique serveur serverless (à implémenter)

### Gestion des données
- **Supabase Client** : Client JavaScript officiel
- **Hooks personnalisés** : Logique métier réutilisable (useAuth, useProfilePhoto, etc.)
- **Context API** : Gestion d'état globale (thème, sidebar)

### Composants UI
- **Système de composants** : Bibliothèque de composants réutilisables
- **Formulaires** : Composants de formulaire avec validation
- **Modales** : Système de modales flexible
- **Navigation** : Sidebars, headers, breadcrumbs
- **Cartes d'événements** : Différentes variantes (vertical, horizontal, grille)

### Fonctionnalités avancées
- **Wizard de création** : Assistant multi-étapes pour la création d'événements
- **Gestion des images** : Upload, optimisation, stockage
- **Système de rôles** : Participant, organisateur, modérateur, admin
- **Gestion des permissions** : Accès contrôlé selon le rôle utilisateur

## Architecture des composants

```
src/
├── components/           # Composants réutilisables
│   ├── ui/              # Composants de base (boutons, inputs, etc.)
│   ├── events/          # Composants spécifiques aux événements
│   ├── sidebar/         # Navigation latérale
│   ├── header/          # En-têtes de page
│   ├── dashboard/       # Composants de tableau de bord
│   ├── form/            # Composants de formulaire
│   └── auth/            # Composants d'authentification
├── pages/               # Pages de l'application
├── hooks/               # Hooks personnalisés
├── lib/                 # Configuration et clients externes
├── types/               # Définitions TypeScript
├── utils/               # Fonctions utilitaires
└── context/             # Contextes React globaux
```

## État d'implémentation

### ✅ Complètement implémenté
- Architecture de base React + TypeScript
- Système d'authentification complet
- Gestion des événements (CRUD)
- Interface utilisateur responsive
- Système de catégories
- Gestion des utilisateurs et rôles
- Stockage et gestion des images
- Navigation et routing

### 🔄 En cours de développement
- Système de billets et inscriptions
- Dashboard et analytics
- Système de notifications
- Gestion des sessions d'événements
- Interface d'administration

### ❌ À implémenter
- Système de paiement
- Push notifications
- Moteur de recherche avancé
- Tests automatisés
- CI/CD
- Monitoring et analytics avancés

## Prochaines étapes recommandées

1. **Finaliser le système de billets** : Intégrer un système de paiement (Stripe)
2. **Implémenter les notifications** : Système de notifications temps réel
3. **Développer l'analytics** : Métriques et tableaux de bord complets
4. **Ajouter les tests** : Tests unitaires et d'intégration
5. **Optimiser les performances** : Lazy loading, code splitting avancé
6. **Mettre en place le monitoring** : Suivi des erreurs et performances

## Notes techniques

- Le projet utilise une architecture modulaire avec séparation claire des responsabilités
- Supabase fournit une base solide pour l'authentification et la base de données
- L'interface est optimisée pour mobile et desktop avec Tailwind CSS
- Le système de composants est conçu pour être réutilisable et maintenable
- TypeScript assure la robustesse du code avec un typage strict
