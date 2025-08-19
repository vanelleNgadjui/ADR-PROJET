import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// Types pour les enums
export interface EnumValues {
  [key: string]: string[];
}

// Hook pour récupérer tous les enums en une seule fois
export const useAllEnums = () => {
  const [enums, setEnums] = useState<EnumValues>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllEnums = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .rpc('get_all_enum_values');

        if (fetchError) {
          console.error('Erreur récupération enums:', fetchError);
          setError(fetchError.message);
          // Fallback vers des valeurs par défaut
          setEnums({
            format_enum: ['en_presentiel', 'en_ligne', 'hybride'],
            tarification_enum: ['gratuit', 'payant', 'don_libre', 'mixte'],
            frequence_enum: ['ponctuel', 'quotidien', 'hebdomadaire', 'bi_hebdomadaire', 'mensuel', 'trimestriel', 'annuel'],
            audience_enum: ['familles', 'jeunes', 'pasteurs', 'etudiants', 'seniors', 'enfants', 'couples', 'tout_public'],
            type_evenement_specifique_enum: ['seminaire', 'conference', 'atelier', 'culte', 'concert', 'retreat', 'formation', 'webinar'],
            role_mission_enum: ['eglise_locale', 'reseau_eglises', 'ministere_individuel', 'association_chretienne', 'ong_chretienne', 'groupe_jeunesse', 'pasteur', 'evangeliste', 'missionnaire', 'formateur', 'conference_orateur', 'artiste_gospel', 'label_musical_chretien', 'compagnie_artistique', 'maison_dedition', 'organisateur_festival', 'organisateur_concert', 'ecole_biblique', 'autre'],
            statut_evenement_enum: ['brouillon', 'en_attente_validation', 'valide', 'publie', 'archive', 'refuse'],
            langue_enum: ['fr', 'en', 'es', 'pt', 'ar', 'autre'],
            niveau_difficulte_enum: ['debutant', 'intermediaire', 'avance'],
            type_lieu_enum: ['en_salle', 'en_plein_air', 'virtuel'],
            niveau_privacy_enum: ['public', 'prive', 'sur_invitation'],
            type_communauté_enum: ['eglise', 'cellule', 'groupe_jeunes', 'groupe_femmes', 'groupe_hommes', 'ministere', 'association', 'reseau', 'autre'],
            role_utilisateur_enum: ['participant', 'organisateur', 'moderateur', 'admin'],
            type_session_enum: ['pleniere', 'atelier', 'table_ronde', 'priere', 'louange', 'pause'],
            canal_diffusion_enum: ['youtube', 'zoom', 'instagram_live', 'facebook_live', 'site_web', 'teams', 'meet'],
            genre_enum: ['homme', 'femme', 'prefere_ne_pas_preciser']
          });
        } else {
          setEnums(data || {});
        }
      } catch (err) {
        console.error('Erreur inattendue:', err);
        setError('Erreur inattendue lors du chargement des enums');
      } finally {
        setLoading(false);
      }
    };

    fetchAllEnums();
  }, []);

  return { enums, loading, error };
};

// Hook pour récupérer un enum spécifique
export const useEnum = (enumName: string) => {
  const [values, setValues] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnum = async () => {
      try {
        setLoading(true);
        setError(null);

        const functionName = `get_${enumName}_values`;
        const { data, error: fetchError } = await supabase
          .rpc(functionName);

        if (fetchError) {
          console.error(`Erreur récupération ${enumName}:`, fetchError);
          setError(fetchError.message);
          // Fallback vers des valeurs par défaut selon l'enum
          const fallbackValues = getFallbackValues(enumName);
          setValues(fallbackValues);
        } else {
          setValues(data || []);
        }
      } catch (err) {
        console.error('Erreur inattendue:', err);
        setError('Erreur inattendue lors du chargement de l\'enum');
        const fallbackValues = getFallbackValues(enumName);
        setValues(fallbackValues);
      } finally {
        setLoading(false);
      }
    };

    fetchEnum();
  }, [enumName]);

  return { values, loading, error };
};

// Fonction utilitaire pour les valeurs de fallback
const getFallbackValues = (enumName: string): string[] => {
  const fallbacks: { [key: string]: string[] } = {
    format_enum: ['en_presentiel', 'en_ligne', 'hybride'],
    tarification_enum: ['gratuit', 'payant', 'don_libre', 'mixte'],
    frequence_enum: ['ponctuel', 'quotidien', 'hebdomadaire', 'bi_hebdomadaire', 'mensuel', 'trimestriel', 'annuel'],
    audience_enum: ['familles', 'jeunes', 'pasteurs', 'etudiants', 'seniors', 'enfants', 'couples', 'tout_public'],
    type_evenement_specifique_enum: ['seminaire', 'conference', 'atelier', 'culte', 'concert', 'retreat', 'formation', 'webinar'],
    role_mission_enum: ['eglise_locale', 'reseau_eglises', 'ministere_individuel', 'association_chretienne', 'ong_chretienne', 'groupe_jeunesse', 'pasteur', 'evangeliste', 'missionnaire', 'formateur', 'conference_orateur', 'artiste_gospel', 'label_musical_chretien', 'compagnie_artistique', 'maison_dedition', 'organisateur_festival', 'organisateur_concert', 'ecole_biblique', 'autre'],
    statut_evenement_enum: ['brouillon', 'en_attente_validation', 'valide', 'publie', 'archive', 'refuse'],
    langue_enum: ['fr', 'en', 'es', 'pt', 'ar', 'autre'],
    niveau_difficulte_enum: ['debutant', 'intermediaire', 'avance'],
    type_lieu_enum: ['en_salle', 'en_plein_air', 'virtuel'],
    niveau_privacy_enum: ['public', 'prive', 'sur_invitation'],
    type_communauté_enum: ['eglise', 'cellule', 'groupe_jeunes', 'groupe_femmes', 'groupe_hommes', 'ministere', 'association', 'reseau', 'autre'],
    role_utilisateur_enum: ['participant', 'organisateur', 'moderateur', 'admin'],
    type_session_enum: ['pleniere', 'atelier', 'table_ronde', 'priere', 'louange', 'pause'],
    canal_diffusion_enum: ['youtube', 'zoom', 'instagram_live', 'facebook_live', 'site_web', 'teams', 'meet'],
    genre_enum: ['homme', 'femme', 'prefere_ne_pas_preciser']
  };

  return fallbacks[enumName] || [];
};

// Fonction utilitaire pour formater les labels des enums
export const formatEnumLabel = (value: string): string => {
  const labels: { [key: string]: string } = {
    // Formats
    'en_presentiel': 'En présentiel',
    'en_ligne': 'En ligne',
    'hybride': 'Hybride',
    
    // Fréquences
    'ponctuel': 'Événements ponctuels',
    'quotidien': 'Événements quotidiens',
    'hebdomadaire': 'Événements hebdomadaires',
    'bi_hebdomadaire': 'Événements bi-hebdomadaires',
    'mensuel': 'Événements mensuels',
    'trimestriel': 'Événements trimestriels',
    'annuel': 'Événements annuels',
    
    // Tarifications
    'gratuit': 'Gratuit',
    'payant': 'Payant',
    'don_libre': 'Don libre',
    'mixte': 'Mixte',
    
    // Types d'événements
    'seminaire': 'Séminaire',
    'conference': 'Conférence',
    'atelier': 'Atelier',
    'culte': 'Culte',
    'concert': 'Concert',
    'retreat': 'Retraite',
    'formation': 'Formation',
    'webinar': 'Webinaire',
    
    // Audiences
    'familles': 'Familles',
    'femmes': 'Femmes',
    'hommes': 'Hommes',
    'jeunes': 'Jeunes',
    'serviteurs de Dieu': 'Serviteurs de Dieu',
    'etudiants': 'Étudiants',
    'seniors': 'Seniors',
    'enfants': 'Enfants',
    'couples': 'Couples',
    'ministeres': 'Ministères',
    'tout_public': 'Tout public',
    
    // Rôles/Missions
    'eglise_locale': 'Église locale',
    'reseau_eglises': 'Réseau d\'églises',
    'ministere_individuel': 'Ministère individuel',
    'association_chretienne': 'Association chrétienne',
    'ong_chretienne': 'ONG chrétienne',
    'groupe_jeunesse': 'Groupe de jeunesse',
    'pasteur': 'Pasteur',
    'evangeliste': 'Évangéliste',
    'missionnaire': 'Missionnaire',
    'formateur': 'Formateur',
    'conference_orateur': 'Conférencier',
    'artiste_gospel': 'Artiste gospel',
    'label_musical_chretien': 'Label musical chrétien',
    'compagnie_artistique': 'Compagnie artistique',
    'maison_dedition': 'Maison d\'édition',
    'organisateur_festival': 'Organisateur de festival',
    'organisateur_concert': 'Organisateur de concert',
    'ecole_biblique': 'École biblique',
    'autre_mission': 'Autre',
    
    // Genres
    'homme': 'Homme',
    'femme': 'Femme',
    'prefere_ne_pas_preciser': 'Préfère ne pas préciser',
    
    // Statuts
    'brouillon': 'Brouillon',
    'en_attente_validation': 'En attente de validation',
    'valide': 'Validé',
    'publie': 'Publié',
    'archive': 'Archivé',
    'refuse': 'Refusé',
    
    // Langues
    'fr': 'Français',
    'en': 'Anglais',
    'es': 'Espagnol',
    'pt': 'Portugais',
    'ar': 'Arabe',
    'autre_langue': 'Autre',
    
    // Niveaux
    'debutant': 'Débutant',
    'intermediaire': 'Intermédiaire',
    'avance': 'Avancé',
    
    // Lieux
    'en_salle': 'En salle',
    'en_plein_air': 'En plein air',
    'virtuel': 'Virtuel',
    
    // Confidentialité
    'public': 'Public',
    'prive': 'Privé',
    'sur_invitation': 'Sur invitation',
    
    // Communautés
    'eglise_communaute': 'Église',
    'cellule': 'Cellule',
    'groupe_jeunes': 'Groupe de jeunes',
    'groupe_femmes': 'Groupe de femmes',
    'groupe_hommes': 'Groupe d\'hommes',
    'ministere': 'Ministère',
    'association': 'Association',
    'reseau': 'Réseau',
    
    // Rôles utilisateurs
    'participant': 'Participant',
    'organisateur': 'Organisateur',
    'moderateur': 'Modérateur',
    'admin': 'Administrateur',
    
    // Types de session
    'pleniere': 'Plénière',
    'atelier_session': 'Atelier',
    'table_ronde': 'Table ronde',
    'priere': 'Prière',
    'louange': 'Louange',
    'pause': 'Pause',
    
    // Canaux de diffusion
    'youtube': 'YouTube',
    'zoom': 'Zoom',
    'instagram_live': 'Instagram Live',
    'facebook_live': 'Facebook Live',
    'site_web': 'Site web',
    'teams': 'Teams',
    'meet': 'Meet'
  };
  
  return labels[value] || value.replace('_', ' ');
};

 