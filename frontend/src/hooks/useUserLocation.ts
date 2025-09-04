import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

interface UseUserLocationReturn {
  location: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserLocation = (): UseUserLocationReturn => {
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchLocation = async () => {
    if (!user) {
      setLocation(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('localisation')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      setLocation(data?.localisation || null);
    } catch (err) {
      console.error('Erreur lors de la récupération de la localisation:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, [user]);

  return {
    location,
    loading,
    error,
    refetch: fetchLocation,
  };
};
