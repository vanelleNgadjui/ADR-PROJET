# 🚀 Guide de Déploiement - Optimisation Photos de Profil

## 📋 Prérequis

- ✅ Projet Supabase configuré
- ✅ Base de données avec la table `users` existante
- ✅ Frontend React/TypeScript fonctionnel
- ✅ Accès à l'interface Supabase SQL Editor

## 🔧 Étape 1 : Configuration Supabase Storage

### 1.1 Exécuter le script SQL

1. Ouvrir l'interface Supabase
2. Aller dans **SQL Editor**
3. Créer un nouveau script
4. Copier le contenu de `docs/setup_profile_photos_storage_fixed.sql`
5. Exécuter le script

### 1.2 Vérifier la configuration

```sql
-- Vérifier que le bucket a été créé
SELECT * FROM storage.buckets WHERE id = 'profile-photos';

-- Vérifier que les politiques RLS existent
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- Tester la configuration
SELECT test_profile_photo_upload();
```

**Résultat attendu :** `SUCCESS: Profile photo storage setup is complete`

## 🔧 Étape 2 : Configuration Frontend

### 2.1 Vérifier les variables d'environnement

Dans votre fichier `.env.local` :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2.2 Installer les dépendances (si nécessaire)

```bash
cd frontend
npm install
```

### 2.3 Tester la compilation

```bash
npm run build
```

**Résultat attendu :** Compilation réussie sans erreurs critiques

## 🔧 Étape 3 : Test de l'Upload

### 3.1 Tester l'upload manuel

1. Aller sur `http://localhost:5173`
2. Se connecter avec un compte existant
3. Aller dans l'onboarding
4. Tester l'upload d'une photo de profil

### 3.2 Vérifier dans Supabase

```sql
-- Vérifier les fichiers uploadés
SELECT * FROM storage.objects WHERE bucket_id = 'profile-photos';

-- Vérifier les statistiques
SELECT * FROM profile_photos_analytics;
```

## 🔧 Étape 4 : Validation Complète

### 4.1 Test de Performance

1. **Taille des images** : Vérifier que les images sont redimensionnées à 400x400px
2. **Compression** : Vérifier que la taille est réduite (~70% de réduction)
3. **Chargement** : Vérifier que les images se chargent rapidement

### 4.2 Test de Sécurité

1. **Permissions** : Vérifier que seuls les utilisateurs connectés peuvent uploader
2. **Validation** : Tester avec des fichiers non autorisés (rejetés)
3. **Nettoyage** : Vérifier que les anciennes photos sont supprimées

### 4.3 Test d'UX

1. **Aperçu immédiat** : Vérifier que l'aperçu s'affiche instantanément
2. **Progression** : Vérifier que la barre de progression fonctionne
3. **Erreurs** : Tester les messages d'erreur
4. **Fallback** : Vérifier l'avatar par défaut

## 🔧 Étape 5 : Monitoring

### 5.1 Configurer les alertes (optionnel)

```sql
-- Créer une fonction pour surveiller l'espace disque
CREATE OR REPLACE FUNCTION check_storage_usage()
RETURNS TABLE(
  bucket_name TEXT,
  total_size BIGINT,
  file_count BIGINT,
  usage_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.name as bucket_name,
    COALESCE(SUM(o.metadata->>'size')::BIGINT, 0) as total_size,
    COUNT(o.id) as file_count,
    ROUND(
      (COALESCE(SUM(o.metadata->>'size')::BIGINT, 0)::NUMERIC / 1073741824) * 100, 2
    ) as usage_percentage
  FROM storage.buckets b
  LEFT JOIN storage.objects o ON b.id = o.bucket_id
  WHERE b.id = 'profile-photos'
  GROUP BY b.id, b.name;
END;
$$ LANGUAGE plpgsql;
```

### 5.2 Dashboard de monitoring

```sql
-- Vue pour le monitoring en temps réel
CREATE OR REPLACE VIEW profile_photos_monitoring AS
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM users WHERE photo_profil_url IS NOT NULL) as users_with_photos,
  (SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'profile-photos') as total_files,
  (SELECT COALESCE(SUM(metadata->>'size')::BIGINT, 0) FROM storage.objects WHERE bucket_id = 'profile-photos') as total_size_bytes,
  (SELECT ROUND(COALESCE(AVG(metadata->>'size')::BIGINT, 0) / 1024.0, 2) FROM storage.objects WHERE bucket_id = 'profile-photos') as avg_file_size_kb,
  NOW() as last_updated;
```

## 🔧 Étape 6 : Optimisations Avancées

### 6.1 CDN Configuration (optionnel)

Si vous utilisez un CDN :

```typescript
// Dans utils/imageOptimization.ts
export const getOptimizedUrl = (url: string, width: number = 400, height: number = 400) => {
  if (url.includes('profile-photos')) {
    // Ajouter des paramètres CDN
    return `${url}?width=${width}&height=${height}&quality=80&format=webp`;
  }
  return url;
};
```

### 6.2 Cache Headers (optionnel)

```sql
-- Configurer les headers de cache pour les photos de profil
UPDATE storage.buckets 
SET public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
WHERE id = 'profile-photos';
```

## 🔧 Étape 7 : Tests de Charge

### 7.1 Test avec plusieurs utilisateurs

1. Créer plusieurs comptes de test
2. Uploader des photos simultanément
3. Vérifier les performances

### 7.2 Test de nettoyage

```sql
-- Tester le nettoyage automatique
SELECT cleanup_orphaned_profile_photos();

-- Vérifier les fichiers orphelins
SELECT COUNT(*) FROM storage.objects 
WHERE bucket_id = 'profile-photos' 
  AND name NOT IN (
    SELECT photo_profil_url 
    FROM users 
    WHERE photo_profil_url LIKE '%profile-photos%'
  );
```

## 🔧 Étape 8 : Documentation

### 8.1 Mettre à jour la documentation

1. Documenter les nouvelles fonctionnalités
2. Créer des guides utilisateur
3. Documenter les procédures de maintenance

### 8.2 Formation de l'équipe

1. Former l'équipe sur l'utilisation
2. Documenter les procédures de dépannage
3. Créer des runbooks d'incident

## 🚨 Dépannage

### Problèmes Courants

#### 1. Erreur "Bucket not found"

```sql
-- Vérifier que le bucket existe
SELECT * FROM storage.buckets WHERE id = 'profile-photos';

-- Si pas de bucket, le créer manuellement
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('profile-photos', 'profile-photos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
```

#### 2. Erreur "Policy not found"

```sql
-- Vérifier les politiques
SELECT * FROM pg_policies WHERE tablename = 'objects';

-- Recréer les politiques si nécessaire
CREATE POLICY "Users can upload their own profile photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### 3. Erreur "Function not found"

```sql
-- Vérifier les fonctions
SELECT proname FROM pg_proc WHERE proname LIKE '%profile%';

-- Recréer les fonctions si nécessaire
-- (Copier le contenu du script SQL)
```

#### 4. Images qui ne se chargent pas

1. Vérifier les permissions RLS
2. Vérifier que les URLs sont correctes
3. Vérifier les headers CORS

```sql
-- Vérifier les permissions
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%profile%';
```

### Logs et Debug

```sql
-- Voir les logs d'upload
SELECT * FROM storage.objects 
WHERE bucket_id = 'profile-photos' 
ORDER BY created_at DESC 
LIMIT 10;

-- Voir les erreurs récentes
SELECT * FROM storage.objects 
WHERE bucket_id = 'profile-photos' 
  AND metadata->>'error' IS NOT NULL;
```

## ✅ Checklist de Validation

- [ ] Bucket `profile-photos` créé
- [ ] Politiques RLS configurées
- [ ] Fonctions PostgreSQL créées
- [ ] Frontend compile sans erreurs
- [ ] Upload de photos fonctionne
- [ ] Redimensionnement automatique
- [ ] Suppression de photos fonctionne
- [ ] Avatars par défaut s'affichent
- [ ] Performance acceptable (<2s de chargement)
- [ ] Sécurité validée (permissions, validation)
- [ ] Monitoring configuré
- [ ] Documentation mise à jour
- [ ] Tests de charge effectués
- [ ] Équipe formée

## 📊 Métriques de Succès

Après le déploiement, surveiller :

- **Adoption** : >80% des utilisateurs avec photo
- **Performance** : <2s de chargement moyen
- **Erreurs** : <1% de taux d'échec
- **Stockage** : <1GB total utilisé
- **Satisfaction** : >90% d'utilisateurs satisfaits

## 🔄 Maintenance

### Tâches Récurrentes

1. **Nettoyage hebdomadaire** : Supprimer les fichiers orphelins
2. **Monitoring quotidien** : Vérifier les métriques
3. **Backup mensuel** : Sauvegarder les configurations
4. **Audit trimestriel** : Vérifier les permissions et la sécurité

### Scripts de Maintenance

```sql
-- Nettoyage automatique (à exécuter régulièrement)
SELECT cleanup_orphaned_profile_photos();

-- Vérification de l'intégrité
SELECT 
  COUNT(*) as total_users,
  COUNT(photo_profil_url) as users_with_photos,
  COUNT(CASE WHEN photo_profil_url LIKE '%profile-photos%' THEN 1 END) as uploaded_photos
FROM users;
```
