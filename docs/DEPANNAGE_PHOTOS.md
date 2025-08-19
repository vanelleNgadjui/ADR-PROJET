# 🚨 Guide de Dépannage - Photos de Profil

## ❌ Erreurs Courantes et Solutions

### 1. Erreur "division by zero"

**Problème :** La vue `profile_photos_analytics` essaie de diviser par zéro quand il n'y a pas d'utilisateurs.

**Solution :** Utiliser le script `setup_profile_photos_storage_simple.sql` qui inclut une protection contre la division par zéro.

```sql
-- Vérifier si la vue existe et la recréer
DROP VIEW IF EXISTS profile_photos_analytics;
CREATE OR REPLACE VIEW profile_photos_analytics AS
SELECT 
  COUNT(*) as total_users,
  COUNT(photo_profil_url) as users_with_photos,
  COUNT(CASE WHEN photo_profil_url LIKE '%googleusercontent.com%' THEN 1 END) as google_photos,
  COUNT(CASE WHEN photo_profil_url LIKE '%profile-photos%' THEN 1 END) as uploaded_photos,
  COUNT(CASE WHEN photo_profil_url IS NULL OR photo_profil_url = '' THEN 1 END) as users_without_photos,
  CASE 
    WHEN COUNT(*) = 0 THEN 0.00
    ELSE ROUND(
      (COUNT(photo_profil_url)::DECIMAL / COUNT(*)) * 100, 2
    )
  END as photo_coverage_percentage
FROM users;
```

### 2. Erreur "column does not exist"

**Problème :** Le script fait référence à des colonnes qui n'existent pas dans votre schéma.

**Solution :** Utiliser le script corrigé qui correspond à votre schéma :

```sql
-- Vérifier votre schéma
\d users;

-- Utiliser les bons noms de colonnes
-- date_creation au lieu de created_at
-- date_dernier_login au lieu de updated_at
```

### 3. Erreur "bucket already exists"

**Problème :** Le bucket `profile-photos` existe déjà.

**Solution :** Le script utilise `ON CONFLICT (id) DO NOTHING` pour éviter cette erreur.

```sql
-- Vérifier les buckets existants
SELECT * FROM storage.buckets;

-- Si le bucket existe, continuer avec les politiques
```

### 4. Erreur "policy already exists"

**Problème :** Les politiques RLS existent déjà.

**Solution :** Supprimer les anciennes politiques avant de les recréer.

```sql
-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can upload their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Profile photos are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;

-- Recréer les politiques
CREATE POLICY "Users can upload their own profile photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 5. Erreur "function already exists"

**Problème :** Les fonctions PostgreSQL existent déjà.

**Solution :** Utiliser `CREATE OR REPLACE FUNCTION` (déjà inclus dans le script).

```sql
-- Vérifier les fonctions existantes
SELECT proname FROM pg_proc WHERE proname LIKE '%profile%';

-- Les fonctions seront automatiquement remplacées
```

### 6. Erreur "trigger already exists"

**Problème :** Le trigger existe déjà.

**Solution :** Le script utilise `DROP TRIGGER IF EXISTS` pour éviter cette erreur.

```sql
-- Vérifier les triggers existants
SELECT * FROM pg_trigger WHERE tgname LIKE '%photo%';

-- Le script les supprime automatiquement
```

## 🔧 Script de Diagnostic

Exécutez ce script pour diagnostiquer les problèmes :

```sql
-- Script de diagnostic complet
DO $$
DECLARE
  bucket_exists BOOLEAN;
  policies_count INTEGER;
  functions_count INTEGER;
  views_count INTEGER;
  trigger_exists BOOLEAN;
BEGIN
  -- Vérifier le bucket
  SELECT EXISTS(SELECT 1 FROM storage.buckets WHERE id = 'profile-photos') INTO bucket_exists;
  RAISE NOTICE 'Bucket profile-photos exists: %', bucket_exists;
  
  -- Vérifier les politiques
  SELECT COUNT(*) INTO policies_count FROM pg_policies 
  WHERE tablename = 'objects' AND policyname LIKE '%profile%';
  RAISE NOTICE 'Profile photo policies count: %', policies_count;
  
  -- Vérifier les fonctions
  SELECT COUNT(*) INTO functions_count FROM pg_proc 
  WHERE proname LIKE '%profile%';
  RAISE NOTICE 'Profile photo functions count: %', functions_count;
  
  -- Vérifier les vues
  SELECT COUNT(*) INTO views_count FROM pg_views 
  WHERE viewname LIKE '%profile%';
  RAISE NOTICE 'Profile photo views count: %', views_count;
  
  -- Vérifier le trigger
  SELECT EXISTS(SELECT 1 FROM pg_trigger WHERE tgname = 'user_photo_deletion_trigger') INTO trigger_exists;
  RAISE NOTICE 'Photo deletion trigger exists: %', trigger_exists;
  
  -- Vérifier les utilisateurs
  RAISE NOTICE 'Total users in database: %', (SELECT COUNT(*) FROM users);
  RAISE NOTICE 'Users with photos: %', (SELECT COUNT(*) FROM users WHERE photo_profil_url IS NOT NULL);
END $$;
```

## 🚀 Script de Réparation Rapide

Si vous rencontrez des problèmes, exécutez ce script de réparation :

```sql
-- Script de réparation rapide
BEGIN;

-- 1. Supprimer les éléments existants
DROP TRIGGER IF EXISTS user_photo_deletion_trigger ON users;
DROP VIEW IF EXISTS profile_photos_analytics;
DROP VIEW IF EXISTS users_with_photos;
DROP FUNCTION IF EXISTS handle_user_photo_deletion();
DROP FUNCTION IF EXISTS get_optimized_profile_photo_url(UUID);
DROP FUNCTION IF EXISTS cleanup_orphaned_profile_photos();
DROP FUNCTION IF EXISTS validate_profile_photo_url(TEXT);
DROP FUNCTION IF EXISTS test_profile_photo_setup();
DROP POLICY IF EXISTS "Users can upload their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Profile photos are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;

-- 2. Recréer le bucket (si nécessaire)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 3. Recréer les politiques
CREATE POLICY "Users can upload their own profile photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Profile photos are publicly viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can delete their own profile photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Recréer les fonctions et vues
-- (Copier le reste du script setup_profile_photos_storage_simple.sql)

COMMIT;
```

## 📋 Checklist de Vérification

Après avoir exécuté le script, vérifiez :

- [ ] Bucket `profile-photos` existe
- [ ] 4 politiques RLS créées
- [ ] Fonction `get_optimized_profile_photo_url` existe
- [ ] Vue `profile_photos_analytics` existe
- [ ] Vue `users_with_photos` existe
- [ ] Trigger `user_photo_deletion_trigger` existe
- [ ] Index `idx_users_photo_profil_url` existe
- [ ] Test de configuration retourne "SUCCESS"

## 🔍 Commandes de Vérification

```sql
-- Vérifier le bucket
SELECT * FROM storage.buckets WHERE id = 'profile-photos';

-- Vérifier les politiques
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%profile%';

-- Vérifier les fonctions
SELECT proname FROM pg_proc WHERE proname LIKE '%profile%';

-- Vérifier les vues
SELECT viewname FROM pg_views WHERE viewname LIKE '%profile%';

-- Vérifier le trigger
SELECT * FROM pg_trigger WHERE tgname = 'user_photo_deletion_trigger';

-- Vérifier l'index
SELECT * FROM pg_indexes WHERE indexname = 'idx_users_photo_profil_url';

-- Tester la configuration
SELECT test_profile_photo_setup();

-- Voir les statistiques
SELECT * FROM profile_photos_analytics;
```

## 🆘 Support

Si vous rencontrez encore des problèmes :

1. **Vérifiez les logs** : Regardez les messages d'erreur détaillés
2. **Utilisez le script de diagnostic** : Pour identifier le problème exact
3. **Exécutez le script de réparation** : Pour nettoyer et recréer
4. **Vérifiez les permissions** : Assurez-vous d'avoir les droits d'administration
5. **Consultez la documentation Supabase** : Pour les erreurs spécifiques à Supabase
