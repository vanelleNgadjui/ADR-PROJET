# 🗄️ Guide de Configuration de la Base de Données

## 📋 **Prérequis**

1. **Compte Supabase** : Créez un compte sur [supabase.com](https://supabase.com)
2. **Projet Supabase** : Créez un nouveau projet
3. **Variables d'environnement** : Configurez les clés d'API

## 🚀 **Étapes de Configuration**

### **1. Création du projet Supabase**

1. Connectez-vous à [supabase.com](https://supabase.com)
2. Cliquez sur **"New Project"**
3. Choisissez votre organisation
4. Remplissez les informations :
   - **Name** : `agenda-du-royaume`
   - **Database Password** : Choisissez un mot de passe fort
   - **Region** : Sélectionnez la région la plus proche
5. Cliquez sur **"Create new project"**

### **2. Récupération des clés d'API**

1. Dans votre projet Supabase, allez dans **Settings** → **API**
2. Copiez les informations suivantes :
   - **Project URL** : `https://your-project-id.supabase.co`
   - **anon public** : Clé publique anonyme

### **3. Configuration des variables d'environnement**

1. Dans le dossier `frontend`, créez un fichier `.env.local` :
```bash
cp env.example .env.local
```

2. Modifiez le fichier `.env.local` avec vos vraies valeurs :
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **4. Exécution du script SQL**

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Cliquez sur **"New query"**
3. Copiez le contenu du fichier `docs/schema.sql`
4. Cliquez sur **"Run"** pour exécuter le script

### **5. Vérification de la configuration**

1. Allez dans **Table Editor** pour vérifier que toutes les tables sont créées
2. Vérifiez que les données de base sont insérées dans `categories` et `sous_categories`

## 🔧 **Configuration avancée**

### **Politiques de sécurité RLS (Row Level Security)**

Pour activer la sécurité au niveau des lignes :

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE communautes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sous_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE communaute_utilisateurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_canaux_diffusion ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_mots_cles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_intervenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_sessions ENABLE ROW LEVEL SECURITY;

-- Politique pour les événements publics
CREATE POLICY "Événements publics visibles par tous" ON events
FOR SELECT USING (niveau_privacy = 'public' AND statut = 'publie');

-- Politique pour les événements privés
CREATE POLICY "Événements privés visibles par les membres" ON events
FOR SELECT USING (
  niveau_privacy = 'prive' AND 
  groupe_prive_id IN (
    SELECT communaute_id FROM communaute_utilisateurs 
    WHERE user_id = auth.uid() AND statut = 'accepte'
  )
);

-- Politique pour les organisateurs
CREATE POLICY "Organisateurs peuvent modifier leurs événements" ON events
FOR ALL USING (organisateur_id = auth.uid());
```

### **Configuration de l'authentification**

1. Allez dans **Authentication** → **Settings**
2. Configurez les providers d'authentification :
   - **Email** : Activé par défaut
   - **Google** : Optionnel
   - **Facebook** : Optionnel

3. Configurez les redirections :
   - **Site URL** : `http://localhost:5173`
   - **Redirect URLs** : 
     - `http://localhost:5173/auth/callback`
     - `http://localhost:5173/dashboard`

### **Configuration du stockage**

1. Allez dans **Storage**
2. Créez les buckets suivants :
   - `event-images` : Pour les images d'événements
   - `user-avatars` : Pour les photos de profil
   - `community-images` : Pour les images de communautés

3. Configurez les politiques de stockage :

```sql
-- Politique pour les images d'événements
CREATE POLICY "Images d'événements publiques" ON storage.objects
FOR SELECT USING (bucket_id = 'event-images');

-- Politique pour les avatars utilisateurs
CREATE POLICY "Avatars utilisateurs" ON storage.objects
FOR ALL USING (
  bucket_id = 'user-avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## 🧪 **Test de la configuration**

### **Test de connexion**

1. Redémarrez votre serveur de développement :
```bash
npm run dev
```

2. Ouvrez la console du navigateur et testez :
```javascript
import { supabase } from './src/lib/supabaseClient';

// Test de connexion
const { data, error } = await supabase
  .from('categories')
  .select('*')
  .limit(1);

console.log('Test de connexion:', { data, error });
```

### **Test des données de base**

Vérifiez que les catégories sont bien insérées :
```javascript
const { data: categories } = await supabase
  .from('categories')
  .select('*');

console.log('Catégories:', categories);
```

## 🔒 **Sécurité et bonnes pratiques**

### **Variables d'environnement**

- ✅ **À faire** : Utiliser `.env.local` pour les variables locales
- ❌ **À éviter** : Commiter les vraies clés d'API dans Git

### **Politiques de sécurité**

- ✅ **À faire** : Activer RLS sur toutes les tables
- ✅ **À faire** : Définir des politiques spécifiques
- ❌ **À éviter** : Laisser les tables sans protection

### **Backup et maintenance**

- ✅ **À faire** : Configurer des backups automatiques
- ✅ **À faire** : Monitorer les performances
- ✅ **À faire** : Mettre à jour régulièrement Supabase

## 🚨 **Dépannage**

### **Erreur de connexion**

```bash
# Vérifiez vos variables d'environnement
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

### **Erreur de permissions**

```sql
-- Vérifiez les politiques RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

### **Erreur de types ENUM**

```sql
-- Vérifiez que les types ENUM sont créés
SELECT typname FROM pg_type WHERE typtype = 'e';
```

## 📞 **Support**

- **Documentation Supabase** : [supabase.com/docs](https://supabase.com/docs)
- **Discord Supabase** : [discord.gg/supabase](https://discord.gg/supabase)
- **GitHub Issues** : Pour les problèmes spécifiques au projet

---

## ✅ **Checklist de configuration**

- [ ] Projet Supabase créé
- [ ] Clés d'API récupérées
- [ ] Variables d'environnement configurées
- [ ] Script SQL exécuté
- [ ] Tables créées et vérifiées
- [ ] Données de base insérées
- [ ] RLS activé (optionnel)
- [ ] Authentification configurée (optionnel)
- [ ] Stockage configuré (optionnel)
- [ ] Tests de connexion réussis

**🎉 Votre base de données est maintenant configurée et prête à être utilisée !** 