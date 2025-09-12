import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

interface UseUserProfilePhotoReturn {
  photoUrl: string | null;
  loading: boolean;
  error: string | null;
}

export const useUserProfilePhoto = (): UseUserProfilePhotoReturn => {
  const { user } = useAuth();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPhoto = async () => {
      if (!user) {
        setPhotoUrl(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Récupérer la photo depuis la base de données
        const { data, error: dbError } = await supabase
          .from('users')
          .select('photo_profil_url')
          .eq('id', user.id)
          .single();

        if (dbError) {
          console.error('Erreur récupération photo:', dbError);
          // Fallback: utiliser la photo Google depuis les métadonnées
          setPhotoUrl(user.user_metadata?.avatar_url || null);
        } else {
          // Utiliser la photo de la DB si elle existe, sinon fallback sur Google
          setPhotoUrl(data?.photo_profil_url || user.user_metadata?.avatar_url || null);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de la photo:', err);
        setError('Erreur lors de la récupération de la photo');
        // Fallback: utiliser la photo Google depuis les métadonnées
        setPhotoUrl(user.user_metadata?.avatar_url || null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPhoto();
  }, [user]);

  return {
    photoUrl,
    loading,
    error
  };
};
