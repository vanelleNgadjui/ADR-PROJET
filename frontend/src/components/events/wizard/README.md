# Wizard de Création d'Événements

## 📋 Vue d'ensemble

Le wizard de création d'événements est un composant React modulaire qui guide les organisateurs à travers un processus en 6 étapes pour créer un événement complet.

## 🏗️ Structure

```
wizard/
├── EventWizard.tsx          # Composant principal
├── WizardStep.tsx           # Composant d'étape générique
├── WizardProgress.tsx       # Barre de progression
├── WizardNavigation.tsx     # Boutons navigation
├── index.ts                 # Exports
├── README.md               # Documentation
└── steps/
    ├── Step1BasicInfo.tsx   # Informations fondamentales
    ├── Step2DateTime.tsx    # Date et heure
    ├── Step3Location.tsx    # Lieu et format
    ├── Step4Pricing.tsx     # Tarification et billets
    ├── Step5Enrichment.tsx  # Enrichissement optionnel
    └── Step6Validation.tsx  # Validation et publication
```

## 🎯 Étapes du Wizard

### Étape 1: Informations fondamentales
- **Titre** de l'événement (obligatoire)
- **Description** (obligatoire)
- **Image de couverture** (obligatoire)
- **Catégorie** (obligatoire)

### Étape 2: Date et heure
- **Date de début** (obligatoire)
- **Date de fin** (obligatoire)
- **Capacité maximale** (optionnel)

### Étape 3: Lieu et format
- **Format** : Présentiel, Virtuel, Hybride (obligatoire)
- **Adresse** (pour présentiel/hybride)
- **Lien vidéo** (pour virtuel/hybride)

### Étape 4: Tarification et billets
- **Type de tarification** : Gratuit, Payant, Don libre, Mixte
- **Catégories de billets** (pour payant/mixte)
- **Billets individuels** avec prix, quantité, dates de vente

### Étape 5: Enrichissement (optionnel)
- **Programme détaillé**
- **Niveau de difficulté**
- **Langue**
- **Fréquence**
- **Intervenants**
- **Mots-clés**

### Étape 6: Validation et publication
- **Validation complète** des données
- **Prévisualisation** de l'événement
- **Publication** ou sauvegarde en brouillon

## 🚀 Utilisation

```tsx
import { EventWizard } from './components/events/wizard';

// Créer un nouvel événement
<EventWizard />

// Éditer un événement existant
<EventWizard eventId={123} />
```

## 🔧 Fonctionnalités

### Auto-sauvegarde
- Sauvegarde automatique en brouillon toutes les 3 secondes
- Indicateur visuel de sauvegarde

### Validation progressive
- Validation par étape avant de passer à la suivante
- Messages d'erreur contextuels
- Validation complète à l'étape finale

### Logique conditionnelle
- Champs qui apparaissent/disparaissent selon les sélections
- Validation adaptée au format choisi
- Configuration des billets selon le type de tarification

### Intégration Supabase
- Sauvegarde en temps réel
- Upload d'images vers Supabase Storage
- Gestion des relations entre tables

## 📊 Types TypeScript

```tsx
interface EventFormData {
  // Étape 1
  titre: string;
  description: string;
  image_couverture: string;
  sous_categorie_id: number | null;
  
  // Étape 2
  date_debut: string;
  date_fin: string;
  capacite_max: number | null;
  
  // Étape 3
  format: 'presentiel' | 'virtuel' | 'hybride';
  type_lieu: 'adresse' | 'lien_video' | null;
  lieu: string;
  adresse: string;
  
  // Étape 4
  tarification: 'gratuit' | 'payant' | 'don_libre' | 'mixte';
  tickets: TicketData[];
  tickets_categories: TicketCategoryData[];
  
  // Étape 5
  programme: string;
  niveau_difficulte: string | null;
  langue: 'fr' | 'en' | 'es' | null;
  frequence: string | null;
  intervenants: SpeakerData[];
  mots_cles: string[];
  
  // Métadonnées
  statut: 'brouillon' | 'publie' | 'annule';
  niveau_privacy: 'public' | 'prive' | 'communautaire';
  est_accessible: boolean;
}
```

## 🎨 Design

- **Responsive** : Adapté mobile, tablette, desktop
- **Accessible** : Support des lecteurs d'écran
- **UX optimisée** : Navigation intuitive, feedback visuel
- **Thème cohérent** : Utilise les couleurs et composants du design system

## 🔄 État et Navigation

- **État centralisé** dans le composant principal
- **Navigation fluide** entre les étapes
- **Persistance** des données lors de la navigation
- **Validation** avant progression

## 🚨 Gestion d'erreurs

- **Validation côté client** en temps réel
- **Messages d'erreur** contextuels et clairs
- **Gestion des erreurs réseau** avec retry
- **Fallbacks** pour les données manquantes

## 📱 Responsive Design

- **Mobile-first** : Optimisé pour les petits écrans
- **Tablette** : Adaptation des grilles et espacements
- **Desktop** : Utilisation optimale de l'espace disponible

## 🔐 Sécurité

- **Validation côté serveur** en plus du client
- **Authentification** requise pour l'accès
- **Autorisations** basées sur les rôles utilisateur
- **Sanitisation** des données utilisateur

## 🧪 Tests

- **Tests unitaires** pour chaque étape
- **Tests d'intégration** pour le flux complet
- **Tests E2E** pour les scénarios critiques
- **Tests de régression** automatisés

## 📈 Performance

- **Lazy loading** des composants d'étape
- **Optimisation** des re-renders
- **Memoization** des calculs coûteux
- **Compression** des images uploadées

## 🔮 Évolutions futures

- **Mode hors ligne** avec synchronisation
- **Templates** d'événements prédéfinis
- **Collaboration** multi-utilisateurs
- **Intégration** avec des outils externes
- **Analytics** détaillés du processus de création
