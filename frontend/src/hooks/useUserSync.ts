import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

interface UseUserSyncReturn {
  isUserSynced: boolean;
  loading: boolean;
  error: string | null;
  syncUser: () => Promise<void>;
}

export const useUserSync = (): UseUserSyncReturn => {
  const [isUserSynced, setIsUserSynced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const syncUser = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Vérifier si l'utilisateur existe dans la table users
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw fetchError;
      }

      // Si l'utilisateur n'existe pas, le créer
      if (!existingUser) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email || '',
            password_hash: null, // Pas de mot de passe pour OAuth
            nom: user.user_metadata?.nom || '',
            prenom: user.user_metadata?.prenom || '',
            role: user.user_metadata?.role || 'participant',
            statut_compte_enum: 'actif',
            photo_profil_url: user.user_metadata?.avatar_url || null,
            date_creation: new Date().toISOString(),
            date_dernier_login: new Date().toISOString(),
          });

        if (insertError) {
          throw insertError;
        }
      }

      setIsUserSynced(true);
    } catch (err) {
      console.error('Erreur lors de la synchronisation de l\'utilisateur:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Synchroniser automatiquement quand l'utilisateur change
  useEffect(() => {
    if (user) {
      syncUser();
    } else {
      setIsUserSynced(false);
    }
  }, [user]);

  return {
    isUserSynced,
    loading,
    error,
    syncUser,
  };
};