# 🔐 DOCUMENTATION AUTHENTIFICATION - L'AGENDA DU ROYAUME

## 📋 Vue d'ensemble

Cette documentation décrit l'implémentation du système d'authentification pour la plateforme "L'Agenda du Royaume", adaptée au schéma de base de données PostgreSQL/Supabase actuel.

## 🎯 Objectifs

- **Authentification simple** : Connexion Google + email/mot de passe
- **Parcours guidé** : Choix du rôle → Inscription → Onboarding
- **Sécurité** : Validation email, gestion des rôles, RLS
- **UX fluide** : Mobile-first, responsive, conversion optimisée

## 🏗️ Architecture technique

### Stack utilisée
- **Frontend** : React 19 + TypeScript + Vite
- **Backend** : Supabase (PostgreSQL + Auth + Storage)
- **UI** : Tailwind CSS + Composants existants
- **Routing** : React Router DOM

### Schéma de base de données
```sql
-- Table users (schéma actuel)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL, -- Pour auth email/password
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  date_naissance DATE,
  telephone VARCHAR(20),
  role role_utilisateur_enum NOT NULL DEFAULT 'participant',
  statut_compte_enum VARCHAR(50) DEFAULT 'actif',
  photo_profil_url VARCHAR(255),
  date_creation TIMESTAMP DEFAULT NOW(),
  date_dernier_login TIMESTAMP
);

-- Enum des rôles
CREATE TYPE role_utilisateur_enum AS ENUM (
  'participant',
  'organisateur', 
  'moderateur',
  'admin'
);
```

## 🚀 Parcours utilisateur (contextuel)

### **Flux principal (intention claire) :**
1. Landing Page → Bouton contextuel → Inscription directe → Onboarding

### **Flux secondaire (intention floue) :**
1. Landing Page → "Créer un compte" → Choix de rôle → Inscription → Onboarding

### 1. Page d'accueil (LandingPage.tsx)
**URL** : `/`
- **Header** : Boutons "Se connecter" et "Créer un compte"
  - "Se connecter" → `/auth/connexion`
  - "Créer un compte" → `/auth/choix-role` (pas d'intention claire)
- **Hero section** : Deux boutons contextuels (redirection intelligente)
  - **Utilisateur NON connecté :**
    - "Découvrir les événements" → `/auth/inscription/participant`
    - "Organiser un événement" → `/auth/inscription/organisateur`
  - **Utilisateur DÉJÀ connecté :**
    - "Découvrir les événements" → `/events` (liste des événements)
    - "Organiser un événement" → `/organisateur/creer-evenement`

### 2. Choix du rôle (optionnel)
**URL** : `/auth/choix-role`
- **Objectif** : Clarifier les deux rôles principaux (quand l'intention n'est pas claire)
- **Design** : Deux cartes côte à côte (mobile : empilées)
- **Actions** : 
  - "Je veux participer" → `/auth/inscription/participant`
  - "Je veux organiser" → `/auth/inscription/organisateur`
- **Cas d'usage** : Utilisateur clique sur "Créer un compte" dans le header

### 3. Inscription
**URL** : `/auth/inscription/:role`
- **Méthodes** : Google OAuth + Email/Mot de passe
- **Champs** : Email, mot de passe, CGU
- **Validation** : Email unique, mot de passe sécurisé
- **Rôle** : Défini selon l'URL (`participant` ou `organisateur`)
- **Navigation** : Lien "Déjà inscrit ? Se connecter" → `/auth/connexion`

### 4. Connexion
**URL** : `/auth/connexion`
- **Méthodes** : Google OAuth + Email/Mot de passe
- **Récupération** : Lien "Mot de passe oublié"
- **Redirection** : Vers le dashboard selon le rôle
- **Navigation** : Lien "Pas encore de compte ? S'inscrire" → `/auth/choix-role`

### 5. Onboarding
**URL** : `/auth/onboarding/:role`
- **Participant** : Localisation + Centres d'intérêt
- **Organisateur** : Profil public + Coordonnées
- **Stockage** : Données dans la table `users`

## 📱 Composants UI à créer

### 1. Pages d'authentification
```
src/pages/auth/
├── ChoixRole.tsx
├── Inscription.tsx
├── Connexion.tsx
├── OnboardingParticipant.tsx
└── OnboardingOrganisateur.tsx
```

### 2. Composants réutilisables
```
src/components/auth/
├── AuthLayout.tsx
├── GoogleAuthButton.tsx
├── PasswordInput.tsx
├── EmailInput.tsx
└── RoleCard.tsx
```

### 3. Hooks personnalisés
```
src/hooks/
├── useAuth.ts
├── useGoogleAuth.ts
├── useOnboarding.ts
└── useSmartRedirect.ts
```

## 🔧 Implémentation technique

### 0. Hook de redirection intelligente

```typescript
// src/hooks/useSmartRedirect.ts
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

export const useSmartRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const redirectToAction = (action: 'discover' | 'organize') => {
    if (user) {
      // Utilisateur connecté
      if (action === 'discover') {
        navigate('/events');
      } else {
        navigate('/organisateur/creer-evenement');
      }
    } else {
      // Utilisateur non connecté
      if (action === 'discover') {
        navigate('/auth/inscription/participant');
      } else {
        navigate('/auth/inscription/organisateur');
      }
    }
  };

  return { redirectToAction };
};
```

### 1. Configuration Supabase Auth

```typescript
// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
```

### 2. Hook d'authentification

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};
```

### 3. Connexion Google

```typescript
// src/hooks/useGoogleAuth.ts
import { supabase } from '../lib/supabaseClient';

export const signInWithGoogle = async (role: 'participant' | 'organisateur') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/onboarding/${role}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  
  return { data, error };
};
```

### 4. Inscription email/mot de passe

```typescript
// src/hooks/useEmailAuth.ts
import { supabase } from '../lib/supabaseClient';

export const signUpWithEmail = async (
  email: string, 
  password: string, 
  role: 'participant' | 'organisateur'
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: role,
        nom: '', // À remplir dans l'onboarding
        prenom: '', // À remplir dans l'onboarding
      }
    }
  });
  
  return { data, error };
};
```

## 🎨 Design System

### Couleurs (palette officielle du projet)
```css
/* Couleurs principales */
--organisateur-blue: #00008B;  /* Bleu foncé pour organisateurs */
--participant-orange: #FFA500; /* Orange pour participants */
--neutral-white: #ffffff;
--neutral-black: #000000;
```

### Composants existants à réutiliser
- `Button.tsx` : Variantes primary/secondary
- `Input.tsx` : Champs de formulaire
- `Card.tsx` : Cartes de sélection de rôle
- `Header.tsx` : Navigation

### Responsive Design
- **Mobile-first** : Design optimisé pour mobile
- **Breakpoints** : sm (640px), md (768px), lg (1024px)
- **Navigation** : Menu hamburger sur mobile

## 🔐 Sécurité

### 1. Validation côté client
```typescript
// Validation email
const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validation mot de passe
const isValidPassword = (password: string) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password);
};
```

### 2. Politiques RLS (déjà configurées)
- Utilisateurs peuvent voir/modifier leur propre profil
- Admins/modo peuvent voir tous les utilisateurs
- Création de compte avec validation email

### 3. Gestion des erreurs
```typescript
const handleAuthError = (error: any) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Cet email est déjà utilisé';
    case 'auth/invalid-email':
      return 'Email invalide';
    case 'auth/weak-password':
      return 'Mot de passe trop faible';
    default:
      return 'Une erreur est survenue';
  }
};
```

## 📊 Données d'onboarding

### Participant
```typescript
interface OnboardingParticipant {
  // Localisation
  pays?: string;
  ville?: string;
  
  // Centres d'intérêt (stockés en JSONB)
  centres_interet?: string[];
  
  // Préférences
  notifications_email?: boolean;
  notifications_push?: boolean;
}
```

### Organisateur
```typescript
interface OnboardingOrganisateur {
  // Profil public
  nom_organisation?: string;
  type_organisation?: 'eglise' | 'ministere' | 'association' | 'independant';
  description?: string;
  logo_url?: string;
  
  // Coordonnées
  adresse?: string;
  telephone_contact?: string;
  site_web?: string;
  
  // Préférences
  notifications_email?: boolean;
  notifications_push?: boolean;
}
```

## 🚀 Plan d'implémentation

### Phase 1 : Structure de base
1. ✅ Configuration Supabase Auth
2. ✅ Création des hooks d'authentification
3. ✅ Mise en place du routing
4. ✅ Composants UI de base

### Phase 2 : Pages d'authentification
1. ✅ Page de choix de rôle
2. ✅ Page d'inscription (Google + Email)
3. ✅ Page de connexion
4. ✅ Gestion des erreurs

### Phase 3 : Onboarding
1. ✅ Onboarding participant
2. ✅ Onboarding organisateur
3. ✅ Stockage des données
4. ✅ Redirection vers dashboard

### Phase 4 : Intégration
1. ✅ Mise à jour du Header
2. ✅ Protection des routes
3. ✅ Gestion des sessions
4. ✅ Tests et optimisation

## 📝 Notes importantes

### Adaptations au schéma actuel
- **Rôles** : `participant`, `organisateur`, `moderateur`, `admin`
- **Pas de statut d'invitation** : Auto-adhésion aux communautés
- **Champs utilisateur** : Nom, prénom, email, rôle, photo_profil_url
- **Données supplémentaires** : Stockées en JSONB ou champs optionnels

### Simplifications par rapport à l'ancienne réflexion
- **Pas de vérification email** : Google OAuth évite cette étape
- **Onboarding simplifié** : Focus sur l'essentiel
- **Parcours linéaire** : Moins d'étapes, plus de conversion

### Extensions futures
- **Vérification email** : Pour les comptes email/mot de passe
- **Profil avancé** : Plus de champs dans l'onboarding
- **Préférences** : Notifications, thème, langue
- **Social login** : Facebook, Apple (si nécessaire)

---

**Cette documentation sera mise à jour au fur et à mesure de l'implémentation.** 