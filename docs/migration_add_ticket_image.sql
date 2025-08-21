-- Migration pour ajouter le champ image_url à la table tickets
-- Date: 2024-12-19
-- Description: Ajoute la possibilité d'avoir une image pour chaque ticket

-- Ajouter la colonne image_url à la table tickets
ALTER TABLE public.tickets 
ADD COLUMN image_url character varying;

-- Ajouter un commentaire pour documenter le champ
COMMENT ON COLUMN public.tickets.image_url IS 'URL de l''image du ticket (optionnel)';

-- Mettre à jour les types TypeScript correspondants
-- Le type Ticket dans database.ts doit inclure: image_url?: string;
