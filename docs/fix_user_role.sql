-- Script de correction immédiate pour l'utilisateur actuel
-- À exécuter dans Supabase SQL Editor

-- 1. Voir l'état actuel de l'utilisateur
SELECT 
    id,
    email,
    prenom,
    nom,
    role,
    role_mission,
    role_mission_autre
FROM public.users 
WHERE email = 'VOTRE_EMAIL@example.com'  -- Remplacez par votre email
LIMIT 1;

-- 2. Corriger le rôle si nécessaire (si role_mission existe mais role = 'participant')
UPDATE public.users 
SET role = 'organisateur'
WHERE email = 'VOTRE_EMAIL@example.com'  -- Remplacez par votre email
AND role_mission IS NOT NULL 
AND role = 'participant';

-- 3. Vérifier la correction
SELECT 
    id,
    email,
    prenom,
    nom,
    role,
    role_mission,
    role_mission_autre
FROM public.users 
WHERE email = 'VOTRE_EMAIL@example.com'  -- Remplacez par votre email
LIMIT 1;

-- 4. Voir tous les utilisateurs avec role_mission pour vérification
SELECT 
    id,
    email,
    prenom,
    nom,
    role,
    role_mission
FROM public.users 
WHERE role_mission IS NOT NULL
ORDER BY role, email;
