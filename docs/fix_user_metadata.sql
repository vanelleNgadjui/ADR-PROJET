-- Script pour corriger les user_metadata
-- Problème : role_mission se retrouve dans user_metadata.role

-- 1. Voir l'état actuel des user_metadata
SELECT 
    id,
    email,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'ngadjuivanelle@gmail.com';

-- 2. Corriger les user_metadata (à exécuter via Supabase Dashboard)
-- Note : Cette requête doit être exécutée dans Supabase Dashboard > Authentication > Users
-- Trouvez l'utilisateur et modifiez manuellement les user_metadata

-- 3. Vérifier la correction
SELECT 
    id,
    email,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'ngadjuivanelle@gmail.com';

-- 4. Alternative : Mettre à jour via l'API (dans le code)
-- Dans le dashboard, ajouter une correction automatique
