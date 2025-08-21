-- Script d'exécution de la migration pour ajouter image_url aux tickets
-- À exécuter dans Supabase SQL Editor

-- Migration pour ajouter le champ image_url à la table tickets
-- Date: 2024-12-19
-- Description: Ajoute la possibilité d'avoir une image pour chaque ticket

-- Ajouter la colonne image_url à la table tickets
ALTER TABLE public.tickets 
ADD COLUMN image_url character varying;

-- Ajouter un commentaire pour documenter le champ
COMMENT ON COLUMN public.tickets.image_url IS 'URL de l''image du ticket (optionnel)';

-- Vérifier que la colonne a été ajoutée
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tickets' AND column_name = 'image_url';
