-- Migration pour étendre la longueur du champ localisation
-- Problème: Le champ localisation est limité à 100 caractères mais les adresses complètes peuvent être plus longues

-- Vérifier la contrainte actuelle
SELECT 
    column_name, 
    character_maximum_length, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'localisation';

-- Étendre la longueur du champ localisation à 255 caractères
ALTER TABLE public.users 
ALTER COLUMN localisation TYPE character varying(255);

-- Vérifier que la modification a été appliquée
SELECT 
    column_name, 
    character_maximum_length, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'localisation';

-- Commentaire pour documenter le changement
COMMENT ON COLUMN public.users.localisation IS 'Localisation de l''utilisateur (adresse complète) - Limite étendue à 255 caractères pour supporter les adresses longues';
