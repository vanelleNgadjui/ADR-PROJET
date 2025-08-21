import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabaseClient';
import WizardStep from './WizardStep';
import WizardProgress from './WizardProgress';
import WizardNavigation from './WizardNavigation';
import Step1BasicInfo from './steps/Step1BasicInfo';
import Step2DateTime from './steps/Step2DateTime';
import Step3Location from './steps/Step3Location';
import Step4Pricing from './steps/Step4Pricing';
import Step5Enrichment from './steps/Step5Enrichment';
import Step6Validation from './steps/Step6Validation';

// Types pour les données du wizard
export interface EventFormData {
  // Étape 1: Informations fondamentales
  titre: string;
  description: string;
  image_couverture: string;
  sous_categorie_id: number | null;
  
  // Étape 2: Date et heure
  date_debut: string;
  date_fin: string;
  capacite_max: number | null;
  
  // Étape 3: Lieu et format
  format: 'presentiel' | 'virtuel' | 'hybride';
  type_lieu: 'adresse' | 'lien_video' | null;
  lieu: string;
  adresse: string;
  
  // Étape 4: Tarification et billets
  tarification: 'gratuit' | 'payant' | 'don_libre' | 'mixte';
  tickets: TicketData[];
  tickets_categories: TicketCategoryData[];
  
  // Étape 5: Enrichissement (optionnel)
  programme: string;
  niveau_difficulte: string | null;
  langue: 'fr' | 'en' | 'es' | null;
  frequence: string | null;
  intervenants: SpeakerData[];
  mots_cles: string[];
  
  // Métadonnées
  statut: 'brouillon' | 'publie' | 'annule';
  niveau_privacy: 'public' | 'prive' | 'communautaire';
  est_accessible: boolean;
}

export interface TicketData {
  id?: number;
  nom: string;
  description?: string;
  prix: number;
  quantite?: number;
  date_debut_vente?: string;
  date_fin_vente?: string;
  type_billet?: string;
  conditions?: string;
  image_url?: string;
  is_visible: boolean;
  category_id?: number;
}

export interface TicketCategoryData {
  id?: number;
  nom: string;
  description?: string;
  ordre: number;
}

export interface SpeakerData {
  id?: number;
  nom: string;
  description?: string;
  email?: string;
  photo_url?: string;
  role_fonction?: string;
  autres_infos?: any;
}

interface EventWizardProps {
  eventId?: number; // Pour l'édition d'un événement existant
}

const EventWizard: React.FC<EventWizardProps> = ({ eventId }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoSaving, setAutoSaving] = useState(false);
  
  // Données du formulaire
  const [formData, setFormData] = useState<EventFormData>({
    titre: '',
    description: '',
    image_couverture: '',
    sous_categorie_id: null,
    date_debut: '',
    date_fin: '',
    capacite_max: null,
    format: 'presentiel',
    type_lieu: null,
    lieu: '',
    adresse: '',
    tarification: 'gratuit',
    tickets: [],
    tickets_categories: [],
    programme: '',
    niveau_difficulte: null,
    langue: 'fr',
    frequence: null,
    intervenants: [],
    mots_cles: [],
    statut: 'brouillon',
    niveau_privacy: 'public',
    est_accessible: true,
  });

  const totalSteps = 6;

  // Vérifier que l'utilisateur est connecté et est un organisateur
  useEffect(() => {
    if (!user) {
      navigate('/auth/connexion');
      return;
    }
    
    // Vérifier le rôle (à implémenter selon votre logique)
    // if (userRole !== 'organisateur') {
    //   navigate('/dashboard');
    //   return;
    // }
  }, [user, navigate]);

  // Charger les données d'un événement existant si on est en mode édition
  useEffect(() => {
    if (eventId) {
      loadExistingEvent(eventId);
    }
  }, [eventId]);

  const loadExistingEvent = async (id: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          tickets (*),
          tickets_categories (*),
          event_intervenants (*)
        `)
        .eq('id', id)
        .eq('organisateur_id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        // Transformer les données pour correspondre au format du wizard
        setFormData({
          titre: data.titre || '',
          description: data.description || '',
          image_couverture: data.image_couverture || '',
          sous_categorie_id: data.sous_categorie_id,
          date_debut: data.date_debut || '',
          date_fin: data.date_fin || '',
          capacite_max: data.capacite_max,
          format: data.format || 'presentiel',
          type_lieu: data.type_lieu,
          lieu: data.lieu || '',
          adresse: data.adresse || '',
          tarification: data.tarification || 'gratuit',
          tickets: data.tickets || [],
          tickets_categories: data.tickets_categories || [],
          programme: data.programme || '',
          niveau_difficulte: data.niveau_difficulte,
          langue: data.langue || 'fr',
          frequence: data.frequence,
          intervenants: data.event_intervenants || [],
          mots_cles: [], // À récupérer depuis event_mots_cles
          statut: data.statut || 'brouillon',
          niveau_privacy: data.niveau_privacy || 'public',
          est_accessible: data.est_accessible ?? true,
        });
      }
    } catch (err) {
      console.error('Erreur lors du chargement de l\'événement:', err);
      setError('Erreur lors du chargement de l\'événement');
    } finally {
      setLoading(false);
    }
  };

  // Auto-sauvegarde en brouillon
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (formData.titre || formData.description) {
        autoSaveDraft();
      }
    }, 3000); // Auto-sauvegarde après 3 secondes d'inactivité

    return () => clearTimeout(autoSaveTimer);
  }, [formData]);

  const autoSaveDraft = async () => {
    if (!user) return;
    
    try {
      setAutoSaving(true);
      
      const eventData = {
        ...formData,
        organisateur_id: user.id,
        updated_at: new Date().toISOString(),
      };

      if (eventId) {
        // Mise à jour d'un événement existant
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', eventId)
          .eq('organisateur_id', user.id);

        if (error) throw error;
      } else {
        // Création d'un nouvel événement
        const { data, error } = await supabase
          .from('events')
          .insert([eventData])
          .select()
          .single();

        if (error) throw error;
        
        // Mettre à jour l'eventId pour les prochaines sauvegardes
        if (data) {
          // Note: Il faudrait gérer l'eventId dans le state ou via une ref
        }
      }
    } catch (err) {
      console.error('Erreur lors de l\'auto-sauvegarde:', err);
    } finally {
      setAutoSaving(false);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps && validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.titre.trim()) {
          setError('Le titre est obligatoire');
          return false;
        }
        if (!formData.description.trim()) {
          setError('La description est obligatoire');
          return false;
        }
        if (!formData.sous_categorie_id) {
          setError('Veuillez sélectionner une catégorie');
          return false;
        }
        break;
      
      case 2:
        if (!formData.date_debut) {
          setError('La date de début est obligatoire');
          return false;
        }
        if (!formData.date_fin) {
          setError('La date de fin est obligatoire');
          return false;
        }
        if (new Date(formData.date_fin) <= new Date(formData.date_debut)) {
          setError('La date de fin doit être postérieure à la date de début');
          return false;
        }
        break;
      
      case 3:
        if (!formData.format) {
          setError('Veuillez sélectionner un format');
          return false;
        }
        if (formData.format === 'presentiel' && !formData.adresse.trim()) {
          setError('L\'adresse est obligatoire pour un événement présentiel');
          return false;
        }
        if (formData.format === 'virtuel' && !formData.lieu.trim()) {
          setError('Le lien vidéo est obligatoire pour un événement virtuel');
          return false;
        }
        break;
      
      case 4:
        if (!formData.tarification) {
          setError('Veuillez sélectionner un type de tarification');
          return false;
        }
        if (formData.tarification === 'payant' && formData.tickets.length === 0) {
          setError('Veuillez créer au moins un billet pour un événement payant');
          return false;
        }
        break;
      
      case 5:
        // Étape optionnelle - toujours valide
        break;
      
      case 6:
        // Validation finale
        break;
    }
    
    return true;
  };

  const handleFormDataChange = (updates: Partial<EventFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const renderCurrentStep = () => {
    const stepProps = {
      formData,
      onFormDataChange: handleFormDataChange,
      error,
      setError,
    };

    switch (currentStep) {
      case 1:
        return <Step1BasicInfo {...stepProps} />;
      case 2:
        return <Step2DateTime {...stepProps} />;
      case 3:
        return <Step3Location {...stepProps} />;
      case 4:
        return <Step4Pricing {...stepProps} />;
      case 5:
        return <Step5Enrichment {...stepProps} />;
      case 6:
        return <Step6Validation {...stepProps} />;
      default:
        return <div>Étape non reconnue</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement de l'événement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {eventId ? 'Modifier l\'événement' : 'Créer un nouvel événement'}
          </h1>
          <p className="text-gray-600">
            Suivez les étapes pour créer un événement complet et attractif
          </p>
        </div>

        {/* Barre de progression */}
        <WizardProgress currentStep={currentStep} totalSteps={totalSteps} />

        {/* Indicateur d'auto-sauvegarde */}
        {autoSaving && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-blue-700">Sauvegarde automatique...</span>
            </div>
          </div>
        )}

        {/* Contenu de l'étape */}
        <div className="mt-8">
          <WizardStep stepNumber={currentStep} totalSteps={totalSteps}>
            {renderCurrentStep()}
          </WizardStep>
        </div>

        {/* Navigation */}
        <WizardNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canProceed={validateCurrentStep()}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default EventWizard;
