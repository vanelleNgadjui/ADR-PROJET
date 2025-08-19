import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';
import type { User } from '@supabase/supabase-js';

export const useUserSync = () => {
  const { user, session } = useAuth();

  // Synchroniser l'utilisateur avec notre table users
  const syncUserToDatabase = async (authUser: User, role: 'participant' | 'organisateur' = 'participant') => {
    try {
      // Vérifier si l'utilisateur existe déjà dans notre table
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id, role')
        .eq('id', authUser.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Erreur lors de la vérification utilisateur:', checkError);
        return { error: checkError };
      }

      // Si l'utilisateur n'existe pas, le créer
      if (!existingUser) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email!,
            password_hash: '', // Pas de mot de passe hashé pour OAuth
            nom: authUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
            prenom: authUser.user_metadata?.full_name?.split(' ')[0] || '',
            role: role,
            photo_profil_url: authUser.user_metadata?.avatar_url || null,
            date_creation: new Date().toISOString(),
          });

        if (insertError) {
          console.error('Erreur lors de la création utilisateur:', insertError);
          return { error: insertError };
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      return { error };
    }
  };

  // Écouter les changements d'authentification pour synchroniser
  useEffect(() => {
    if (user && session) {
      // Récupérer le rôle depuis localStorage (pour OAuth) ou les métadonnées
      const pendingRole = localStorage.getItem('pendingRole');
      const role = pendingRole || user.user_metadata?.role || 'participant';
      
      // Attendre un peu avant de nettoyer localStorage pour s'assurer que le rôle est utilisé
      setTimeout(() => {
        if (pendingRole) {
          localStorage.removeItem('pendingRole');
        }
      }, 2000);
      
      syncUserToDatabase(user, role as 'participant' | 'organisateur');
    }
  }, [user, session]);

  return { syncUserToDatabase };
}; 