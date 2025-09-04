-- Migration pour ajouter les champs de notifications à la table users
-- Date: $(date)

-- Ajouter les colonnes de notifications à la table users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS notifications_email boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS notifications_push boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS notifications_sms boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS notification_frequency character varying DEFAULT 'immediate'::character varying;

-- Ajouter des commentaires pour documenter les colonnes
COMMENT ON COLUMN public.users.notifications_email IS 'L''utilisateur souhaite recevoir des notifications par email';
COMMENT ON COLUMN public.users.notifications_push IS 'L''utilisateur souhaite recevoir des notifications push';
COMMENT ON COLUMN public.users.notifications_sms IS 'L''utilisateur souhaite recevoir des notifications par SMS';
COMMENT ON COLUMN public.users.notification_frequency IS 'Fréquence des notifications: immediate, daily, weekly';

-- Créer un index pour optimiser les requêtes sur les notifications
CREATE INDEX IF NOT EXISTS idx_users_notifications_email ON public.users(notifications_email);
CREATE INDEX IF NOT EXISTS idx_users_notifications_push ON public.users(notifications_push);
CREATE INDEX IF NOT EXISTS idx_users_notification_frequency ON public.users(notification_frequency);

-- Mettre à jour les utilisateurs existants avec des valeurs par défaut
UPDATE public.users 
SET 
  notifications_email = true,
  notifications_push = true,
  notifications_sms = false,
  notification_frequency = 'immediate'
WHERE notifications_email IS NULL;

-- Vérifier que la migration s'est bien passée
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
  AND column_name LIKE 'notification%'
ORDER BY column_name;
