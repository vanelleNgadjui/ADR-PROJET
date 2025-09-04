import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';
import type { 
  RoleUtilisateurEnum, 
  RoleMissionEnum, 
  GenreEnum, 
  AudienceEnum, 
  FormatEnum, 
  FrequenceEnum, 
  TarificationEnum,
  TypeEvenementSpecifiqueEnum 
} from '../types/database';

interface OnboardingData {
  // Informations personnelles
  nom: string;
  prenom: string;
  date_naissance?: string;
  telephone?: string;
  genre?: GenreEnum;
  
  // Localisation
  localisation?: string;
  latitude?: number;
  longitude?: number;
  
  // Mission/Rôle
  mission?: RoleMissionEnum;
  mission_autre?: string;
  
  // Préférences
  preferences_categories?: number[];
  preferences_audiences?: AudienceEnum[];
  preferences_format?: FormatEnum[];
  preferences_frequence?: FrequenceEnum[];
  preferences_tarification?: TarificationEnum[];
  types_evenements_crees?: TypeEvenementSpecifiqueEnum[];
  
  // Notifications
  notifications_email?: boolean;
  notifications_push?: boolean;
  notifications_sms?: boolean;
  notification_frequency?: 'immediate' | 'daily' | 'weekly';
}

interface UseOnboardingReturn {
  saveOnboardingData: (data: OnboardingData) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

export const useOnboarding = (): UseOnboardingReturn => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const saveOnboardingData = async (data: OnboardingData) => {
    if (!user) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    try {
      setLoading(true);

      // Préparer les données pour la mise à jour
      const updateData: Partial<OnboardingData> = {
        nom: data.nom,
        prenom: data.prenom,
        date_naissance: data.date_naissance,
        telephone: data.telephone,
        genre: data.genre,
        localisation: data.localisation,
        latitude: data.latitude,
        longitude: data.longitude,
        mission: data.mission,
        mission_autre: data.mission_autre,
        preferences_categories: data.preferences_categories,
        preferences_audiences: data.preferences_audiences,
        preferences_format: data.preferences_format,
        preferences_frequence: data.preferences_frequence,
        preferences_tarification: data.preferences_tarification,
        types_evenements_crees: data.types_evenements_crees,
        notifications_email: data.notifications_email,
        notifications_push: data.notifications_push,
        notifications_sms: data.notifications_sms,
        notification_frequency: data.notification_frequency,
      };

      // Supprimer les valeurs undefined
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      // Mettre à jour l'utilisateur dans la base de données
      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Erreur lors de la sauvegarde de l\'onboarding:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'onboarding:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    saveOnboardingData,
    loading,
  };
};
