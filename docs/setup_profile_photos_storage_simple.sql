-- Configuration du bucket pour les photos de profil
-- Version simplifiée et robuste
-- À exécuter dans l'interface Supabase SQL Editor

-- 1. Créer le bucket pour les photos de profil
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  5242880, -- 5MB en bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 2. Créer les politiques RLS pour le bucket
-- Upload
CREATE POLICY "Users can upload their own profile photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Lecture publique
CREATE POLICY "Profile photos are publicly viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-photos');

-- Suppression
CREATE POLICY "Users can delete their own profile photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Mise à jour
CREATE POLICY "Users can update their own profile photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Créer une fonction pour obtenir l'URL optimisée d'une photo de profil
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

-- 4. Créer un index pour optimiser les requêtes sur les photos de profil
CREATE INDEX IF NOT EXISTS idx_users_photo_profil_url 
ON users(photo_profil_url) 
WHERE photo_profil_url IS NOT NULL;

-- 5. Créer une vue pour les utilisateurs avec photos optimisées
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

-- 6. Créer une fonction pour nettoyer les fichiers orphelins
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

-- 7. Créer une fonction pour valider les URLs de photos de profil
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

-- 8. Créer une vue pour les statistiques détaillées (version sécurisée)
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

-- 9. Créer une fonction pour tester la configuration
CREATE OR REPLACE FUNCTION test_profile_photo_setup()
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
  
  -- Vérifier que les vues existent
  IF NOT EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'profile_photos_analytics') THEN
    RETURN 'ERROR: profile_photos_analytics view does not exist';
  END IF;
  
  RETURN 'SUCCESS: Profile photo storage setup is complete and ready to use';
END;
$$ LANGUAGE plpgsql;

-- 10. Créer un trigger pour nettoyer automatiquement les photos supprimées
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

-- 11. Créer le trigger sur la table users
DROP TRIGGER IF EXISTS user_photo_deletion_trigger ON users;
CREATE TRIGGER user_photo_deletion_trigger
  AFTER UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_photo_deletion();

-- 12. Tester la configuration
SELECT test_profile_photo_setup();

-- 13. Afficher les statistiques initiales (sécurisé)
SELECT 
  total_users,
  users_with_photos,
  google_photos,
  uploaded_photos,
  users_without_photos,
  photo_coverage_percentage
FROM profile_photos_analytics;
