-- =====================================================
-- FIX: Création automatique d'utilisateurs depuis Supabase Auth
-- =====================================================

-- 1. Modifier la table users pour rendre password_hash optionnel
ALTER TABLE public.users ALTER COLUMN password_hash DROP NOT NULL;

-- 2. Créer une fonction pour gérer la création d'utilisateurs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    password_hash,
    nom,
    prenom,
    role,
    statut_compte_enum,
    photo_profil_url,
    date_creation,
    date_dernier_login
  )
  VALUES (
    NEW.id,
    NEW.email,
    NULL, -- Pas de mot de passe pour OAuth
    COALESCE(NEW.raw_user_meta_data->>'nom', ''),
    COALESCE(NEW.raw_user_meta_data->>'prenom', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'participant')::role_utilisateur_enum,
    'actif',
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Créer le trigger pour la création automatique
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Créer une fonction pour gérer la mise à jour des utilisateurs
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS trigger AS $$
BEGIN
  UPDATE public.users
  SET
    email = NEW.email,
    nom = COALESCE(NEW.raw_user_meta_data->>'nom', users.nom),
    prenom = COALESCE(NEW.raw_user_meta_data->>'prenom', users.prenom),
    photo_profil_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', users.photo_profil_url),
    date_dernier_login = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Créer le trigger pour la mise à jour automatique
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_user_update();

-- 6. Créer une fonction pour migrer les utilisateurs existants
CREATE OR REPLACE FUNCTION public.migrate_existing_auth_users()
RETURNS void AS $$
DECLARE
  auth_user RECORD;
BEGIN
  -- Parcourir tous les utilisateurs auth qui n'ont pas d'entrée dans users
  FOR auth_user IN 
    SELECT 
      au.id,
      au.email,
      au.raw_user_meta_data,
      au.created_at
    FROM auth.users au
    LEFT JOIN public.users u ON au.id = u.id
    WHERE u.id IS NULL
  LOOP
    -- Insérer l'utilisateur dans la table users
    INSERT INTO public.users (
      id,
      email,
      password_hash,
      nom,
      prenom,
      role,
      statut_compte_enum,
      photo_profil_url,
      date_creation,
      date_dernier_login
    )
    VALUES (
      auth_user.id,
      auth_user.email,
      NULL, -- Pas de mot de passe pour OAuth
      COALESCE(auth_user.raw_user_meta_data->>'nom', ''),
      COALESCE(auth_user.raw_user_meta_data->>'prenom', ''),
      COALESCE(auth_user.raw_user_meta_data->>'role', 'participant')::role_utilisateur_enum,
      'actif',
      auth_user.raw_user_meta_data->>'avatar_url',
      auth_user.created_at,
      NOW()
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Exécuter la migration des utilisateurs existants
SELECT public.migrate_existing_auth_users();

-- 8. Vérifier que les utilisateurs ont été créés
SELECT 
  u.id,
  u.email,
  u.nom,
  u.prenom,
  u.role,
  u.date_creation
FROM public.users u
ORDER BY u.date_creation DESC;
