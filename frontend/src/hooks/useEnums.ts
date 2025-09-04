import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface EnumValues {
  [key: string]: string[];
}

interface UseEnumsReturn {
  enums: EnumValues;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useEnums = (): UseEnumsReturn => {
  const [enums, setEnums] = useState<EnumValues>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnums = async () => {
    try {
      setLoading(true);
      setError(null);

      // Utiliser la fonction get_all_enum_values() de la DB
      const { data, error: enumsError } = await supabase
        .rpc('get_all_enum_values');

      if (enumsError) {
        throw enumsError;
      }

      setEnums(data || {});
    } catch (err) {
      console.error('Erreur lors de la récupération des enums:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnums();
  }, []);

  return {
    enums,
    loading,
    error,
    refetch: fetchEnums,
  };
};

// Hook pour récupérer un enum spécifique
export const useEnum = (enumName: string) => {
  const [values, setValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnum = async () => {
      if (!enumName) return;

      try {
        setLoading(true);
        setError(null);

        // Utiliser la fonction get_enum_values() de la DB
        const { data, error: enumError } = await supabase
          .rpc('get_enum_values', { enum_name: enumName });

        if (enumError) {
          throw enumError;
        }

        setValues(data || []);
      } catch (err) {
        console.error(`Erreur lors de la récupération de l'enum ${enumName}:`, err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchEnum();
  }, [enumName]);

  return { values, loading, error };
};

// Hooks spécialisés pour chaque enum
export const useFormatEnum = () => useEnum('format_enum');
export const useTarificationEnum = () => useEnum('tarification_enum');
export const useStatutEvenementEnum = () => useEnum('statut_evenement_enum');
export const useFrequenceEnum = () => useEnum('frequence_enum');
export const useTypeLieuEnum = () => useEnum('type_lieu_enum');
export const useNiveauPrivacyEnum = () => useEnum('niveau_privacy_enum');
export const useAudienceEnum = () => useEnum('audience_enum');
export const useCanalDiffusionEnum = () => useEnum('canal_diffusion_enum');
export const useTypeSessionEnum = () => useEnum('type_session_enum');
export const useRoleUtilisateurEnum = () => useEnum('role_utilisateur_enum');
export const useStatutInvitationEnum = () => useEnum('statut_invitation_enum');
export const useRoleMissionEnum = () => useEnum('role_mission_enum');
export const useGenreEnum = () => useEnum('genre_enum');
export const useTypeCommunautéEnum = () => useEnum('type_communauté_enum');
export const useTypeEvenementSpecifiqueEnum = () => useEnum('type_evenement_specifique_enum');