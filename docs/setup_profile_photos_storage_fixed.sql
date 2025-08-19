-- Configuration du bucket pour les photos de profil
-- À exécuter dans l'interface Supabase SQL Editor
-- Version corrigée pour le schéma de base de données existant

-- 1. Créer le bucket pour les photos de profil
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  5242880, -- 5MB en bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 2. Créer une politique RLS pour permettre l'upload des photos de profil
CREATE POLICY "Users can upload their own profile photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Créer une politique RLS pour permettre la lecture des photos de profil
CREATE POLICY "Profile photos are publicly viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-photos');

-- 4. Créer une politique RLS pour permettre la suppression des photos de profil
CREATE POLICY "Users can delete their own profile photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. Créer une politique RLS pour permettre la mise à jour des photos de profil
CREATE POLICY "Users can update their own profile photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 6. Créer une fonction pour nettoyer automatiquement les anciennes photos
CREATE OR REPLACE FUNCTION cleanup_old_profile_photos()
RETURNS void AS $$
BEGIN
  -- Supprimer les photos de profil orphelines (plus de 30 jours)
  DELETE FROM storage.objects 
  WHERE bucket_id = 'profile-photos' 
    AND created_at < NOW() - INTERVAL '30 days'
    AND name NOT IN (
      SELECT photo_profil_url 
      FROM users 
      WHERE photo_profil_url IS NOT NULL 
        AND photo_profil_url LIKE '%profile-photos%'
    );
END;
$$ LANGUAGE plpgsql;

-- 7. Créer un trigger pour nettoyer automatiquement les photos supprimées
CREATE OR REPLACE FUNCTION handle_user_photo_deletion()
RETURNS TRIGGER AS $$
BEGIN
  -- Si l'ancienne photo de profil existe et est dans notre bucket, la supprimer
  IF OLD.photo_profil_url IS NOT NULL 
     AND OLD.photo_profil_url LIKE '%profile-photos%'
     AND (NEW.photo_profil_url IS NULL OR NEW.photo_profil_url != OLD.photo_profil_url) THEN
    
    -- Extraire le chemin du fichier depuis l'URL
    DELETE FROM storage.objects 
    WHERE bucket_id = 'profile-photos' 
      AND name LIKE '%' || OLD.photo_profil_url || '%';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Créer le trigger sur la table users
DROP TRIGGER IF EXISTS user_photo_deletion_trigger ON users;
CREATE TRIGGER user_photo_deletion_trigger
  AFTER UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_photo_deletion();

-- 9. Créer une fonction pour obtenir l'URL optimisée d'une photo de profil
CREATE OR REPLACE FUNCTION get_optimized_profile_photo_url(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  photo_url TEXT;
BEGIN
  SELECT photo_profil_url INTO photo_url
  FROM users 
  WHERE id = user_id;
  
  -- Si pas de photo, retourner une URL d'avatar par défaut
  IF photo_url IS NULL OR photo_url = '' THEN
    RETURN 'https://ui-avatars.com/api/?name=U&background=3B82F6&color=fff&size=200&bold=true';
  END IF;
  
  -- Si c'est une URL Google OAuth, la retourner telle quelle
  IF photo_url LIKE '%googleusercontent.com%' THEN
    RETURN photo_url;
  END IF;
  
  -- Si c'est une URL de notre bucket, la retourner avec transformation
  IF photo_url LIKE '%profile-photos%' THEN
    -- Retourner l'URL avec transformation pour optimisation
    RETURN photo_url || '?width=400&height=400&quality=80';
  END IF;
  
  -- Sinon retourner l'URL telle quelle
  RETURN photo_url;
END;
$$ LANGUAGE plpgsql;

-- 10. Créer un index pour optimiser les requêtes sur les photos de profil
CREATE INDEX IF NOT EXISTS idx_users_photo_profil_url 
ON users(photo_profil_url) 
WHERE photo_profil_url IS NOT NULL;

-- 11. Créer une vue pour les utilisateurs avec photos optimisées
CREATE OR REPLACE VIEW users_with_photos AS
SELECT 
  id,
  email,
  nom,
  prenom,
  role,
  mission,
  get_optimized_profile_photo_url(id) as optimized_photo_url,
  photo_profil_url as original_photo_url,
  date_creation,
  date_dernier_login
FROM users;

-- 12. Créer une fonction pour migrer les photos existantes
CREATE OR REPLACE FUNCTION migrate_existing_profile_photos()
RETURNS void AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Parcourir tous les utilisateurs avec des photos de profil
  FOR user_record IN 
    SELECT id, photo_profil_url 
    FROM users 
    WHERE photo_profil_url IS NOT NULL 
      AND photo_profil_url NOT LIKE '%profile-photos%'
      AND photo_profil_url NOT LIKE '%googleusercontent.com%'
  LOOP
    -- Ici on pourrait ajouter une logique pour migrer les photos
    -- Pour l'instant, on garde les URLs existantes
    RAISE NOTICE 'User % has existing photo: %', user_record.id, user_record.photo_profil_url;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 13. Exécuter la migration des photos existantes
SELECT migrate_existing_profile_photos();

-- 14. Créer une fonction pour obtenir les statistiques du bucket
CREATE OR REPLACE FUNCTION get_profile_photos_stats()
RETURNS TABLE(
  total_files BIGINT,
  total_size BIGINT,
  avg_file_size BIGINT,
  oldest_file TIMESTAMPTZ,
  newest_file TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_files,
    COALESCE(SUM(metadata->>'size')::BIGINT, 0) as total_size,
    COALESCE(AVG(metadata->>'size')::BIGINT, 0) as avg_file_size,
    MIN(created_at) as oldest_file,
    MAX(created_at) as newest_file
  FROM storage.objects 
  WHERE bucket_id = 'profile-photos';
END;
$$ LANGUAGE plpgsql;

-- 15. Créer une fonction pour nettoyer les fichiers orphelins
CREATE OR REPLACE FUNCTION cleanup_orphaned_profile_photos()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Supprimer les fichiers qui ne correspondent à aucun utilisateur
  DELETE FROM storage.objects 
  WHERE bucket_id = 'profile-photos' 
    AND name NOT IN (
      SELECT photo_profil_url 
      FROM users 
      WHERE photo_profil_url IS NOT NULL 
        AND photo_profil_url LIKE '%profile-photos%'
    );
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 16. Créer une fonction pour valider les URLs de photos de profil
CREATE OR REPLACE FUNCTION validate_profile_photo_url(photo_url TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Vérifier si l'URL est valide
  IF photo_url IS NULL OR photo_url = '' THEN
    RETURN true; -- URL vide est valide (pas de photo)
  END IF;
  
  -- Vérifier les formats supportés
  IF photo_url LIKE '%.jpg' OR photo_url LIKE '%.jpeg' OR 
     photo_url LIKE '%.png' OR photo_url LIKE '%.webp' OR
     photo_url LIKE '%googleusercontent.com%' OR
     photo_url LIKE '%profile-photos%' THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql;

-- 17. Créer une fonction pour obtenir les métadonnées d'une photo
CREATE OR REPLACE FUNCTION get_profile_photo_metadata(photo_url TEXT)
RETURNS JSONB AS $$
DECLARE
  file_metadata JSONB;
BEGIN
  IF photo_url IS NULL OR photo_url = '' THEN
    RETURN '{"error": "No photo URL provided"}'::JSONB;
  END IF;
  
  -- Si c'est une URL de notre bucket, récupérer les métadonnées
  IF photo_url LIKE '%profile-photos%' THEN
    SELECT metadata INTO file_metadata
    FROM storage.objects 
    WHERE bucket_id = 'profile-photos' 
      AND name LIKE '%' || photo_url || '%'
    LIMIT 1;
    
    RETURN COALESCE(file_metadata, '{"error": "File not found"}'::JSONB);
  END IF;
  
  -- Pour les autres URLs, retourner des métadonnées basiques
  RETURN '{"source": "external", "url": "' || photo_url || '"}'::JSONB;
END;
$$ LANGUAGE plpgsql;

-- 18. Créer une vue pour les statistiques détaillées
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

-- 19. Créer une fonction pour tester l'upload de photos
CREATE OR REPLACE FUNCTION test_profile_photo_upload()
RETURNS TEXT AS $$
BEGIN
  -- Vérifier que le bucket existe
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'profile-photos') THEN
    RETURN 'ERROR: Bucket profile-photos does not exist';
  END IF;
  
  -- Vérifier que les politiques RLS existent
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users can upload their own profile photos') THEN
    RETURN 'ERROR: Upload policy does not exist';
  END IF;
  
  -- Vérifier que les fonctions existent
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_optimized_profile_photo_url') THEN
    RETURN 'ERROR: get_optimized_profile_photo_url function does not exist';
  END IF;
  
  RETURN 'SUCCESS: Profile photo storage setup is complete';
END;
$$ LANGUAGE plpgsql;

-- 20. Tester la configuration
SELECT test_profile_photo_upload();

-- 21. Afficher les statistiques initiales
SELECT * FROM profile_photos_analytics;
