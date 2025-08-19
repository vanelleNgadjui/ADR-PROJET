-- Migration pour renommer role_mission en mission
-- Date: $(date)
-- Description: Simplification du nom de colonne pour plus de clarté

-- 1. Renommer la colonne role_mission en mission
ALTER TABLE public.users 
RENAME COLUMN role_mission TO mission;

-- 2. Renommer la colonne role_mission_autre en mission_autre (optionnel, pour cohérence)
ALTER TABLE public.users 
RENAME COLUMN role_mission_autre TO mission_autre;

-- 3. Vérifier que la migration s'est bien passée
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
AND column_name IN ('mission', 'mission_autre')
ORDER BY column_name;

-- 4. Afficher quelques exemples pour vérification
SELECT 
    id,
    email,
    prenom,
    nom,
    role,
    mission,
    mission_autre
FROM public.users 
WHERE mission IS NOT NULL
LIMIT 5;
