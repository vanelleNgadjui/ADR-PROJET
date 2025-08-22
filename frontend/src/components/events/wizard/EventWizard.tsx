import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabaseClient';
import PageTitle from '../../common/PageTitle';
import EventHeader from '../EventHeader';
import WizardStep from './WizardStep';
import WizardProgress from './WizardProgress';
import WizardNavigation from './WizardNavigation';
import Step1BasicInfo from './steps/Step1BasicInfo';
import Step2DateTime from './steps/Step2DateTime';
import Step3Location from './steps/Step3Location';
import Step4Pricing from './steps/Step4Pricing';
import Step5Enrichment from './steps/Step5Enrichment';
import Step6Validation from './steps/Step6Validation';
import type { 
  Event, 
  Ticket, 
  TicketCategorie, 
  EventIntervenant,
  EventSession,
  FormatEnum,
  TarificationEnum,
  StatutEvenementEnum,
  NiveauPrivacyEnum,
  FrequenceEnum,
  TypeLieuEnum
} from '../../../types/database';

// Hook pour détecter la taille d'écran
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  return isDesktop;
};

// Type pour les données du wizard (correspond au schéma SQL)
export interface EventFormData {
  // Étape 1: Informations fondamentales
  titre: string;
  description?: string;
  image_couverture?: string;
  sous_categorie_id: number;
  
  // Étape 2: Date et heure
  date_debut: string;
  heure_debut?: string;
  date_fin?: string;
  heure_fin?: string;
  capacite_max?: number;
  
  // Étape 3: Lieu et format
  format: FormatEnum;
  lieu?: string;
  adresse?: string;
  
  // Étape 4: Tarification et billets
  tarification: TarificationEnum;
  tickets: Ticket[];
  tickets_categories: TicketCategorie[];
  
  // Étape 5: Enrichissement (optionnel)
  programme?: string;
  programme_mode?: 'simple' | 'structured';
  frequence: FrequenceEnum;
  intervenants: EventIntervenant[];
  mots_cles: string[];
  sessions?: EventSession[];
  
  // Métadonnées
  statut: StatutEvenementEnum;
  niveau_privacy: NiveauPrivacyEnum;
}

interface EventWizardProps {
  eventId?: number; // Pour l'édition d'un événement existant
}

const EventWizard: React.FC<EventWizardProps> = ({ eventId }) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const isDesktop = useIsDesktop(); // Hook pour détecter desktop
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoSaving, setAutoSaving] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  
  // Données du formulaire
  const [formData, setFormData] = useState<EventFormData>({
    titre: '',
    description: '',
    image_couverture: '',
    sous_categorie_id: 1, // Valeur par défaut, sera mise à jour
    date_debut: '',
    heure_debut: '',
    date_fin: '',
    heure_fin: '',
    capacite_max: undefined,
    format: 'presentiel',
    lieu: '',
    adresse: '',
    tarification: 'gratuit',
    tickets: [],
    tickets_categories: [],
    programme: '',
    frequence: 'ponctuel',
    intervenants: [],
    mots_cles: [],
    statut: 'brouillon',
    niveau_privacy: 'public',
  });

  const totalSteps = 6;

  // Fonction d'auto-sauvegarde optimisée
  const autoSaveDraft = useCallback(async (dataToSave: EventFormData) => {
    if (!user) return;
    
    try {
      setAutoSaving(true);
      
      const eventData = {
        ...dataToSave,
        organisateur_id: user.id,
        updated_at: new Date().toISOString(),
      };

      if (eventId) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', eventId)
          .eq('organisateur_id', user.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('events')
          .insert([eventData])
          .select()
          .single();

        if (error) throw error;
      }
      
      // Sauvegarde terminée
      console.log('Auto-sauvegarde terminée');
    } catch (err) {
      console.error('Erreur lors de l\'auto-sauvegarde:', err);
    } finally {
      setAutoSaving(false);
    }
  }, [user, eventId]);

  // Vérifier que l'utilisateur est connecté et est un organisateur
  useEffect(() => {
    // Attendre que l'auth soit chargée avant de vérifier
    if (authLoading) return;
    
    if (!user) {
      navigate('/auth/connexion');
      return;
    }
    
    // Vérifier le rôle (à implémenter selon votre logique)
    // if (userRole !== 'organisateur') {
    //   navigate('/dashboard');
    //   return;
    // }
  }, [user, authLoading, navigate]);

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
          // type_lieu supprimé car n'existe plus dans le schéma
          lieu: data.lieu || '',
          adresse: data.adresse || '',
          tarification: data.tarification || 'gratuit',
          tickets: data.tickets || [],
          tickets_categories: data.tickets_categories || [],
          programme: data.programme || '',
          frequence: data.frequence,
          intervenants: data.event_intervenants || [],
          mots_cles: [], // À récupérer depuis event_mots_cles
          statut: data.statut || 'brouillon',
          niveau_privacy: data.niveau_privacy || 'public',
        });
      }
    } catch (err) {
      console.error('Erreur lors du chargement de l\'événement:', err);
      setError('Erreur lors du chargement de l\'événement');
    } finally {
      setLoading(false);
    }
  };

  // Auto-sauvegarde manuelle uniquement - plus de boucle infinie
  // L'auto-sauvegarde sera déclenchée manuellement par les boutons

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

  // Validation mémorisée pour éviter les re-renders
  const currentStepValidation = useMemo(() => {
    switch (currentStep) {
      case 1:
        if (!formData.titre.trim()) {
          return { isValid: false, error: 'Le titre est obligatoire' };
        }
        if (!formData.description?.trim()) {
          return { isValid: false, error: 'La description est obligatoire' };
        }
        if (!formData.sous_categorie_id) {
          return { isValid: false, error: 'Veuillez sélectionner une catégorie' };
        }
        break;
      
      case 2:
        if (!formData.date_debut) {
          return { isValid: false, error: 'La date de début est obligatoire' };
        }
        if (!formData.date_fin) {
          return { isValid: false, error: 'La date de fin est obligatoire' };
        }
        // Créer des objets Date avec les heures si elles sont définies
        const startDate = new Date(formData.date_debut);
        const endDate = new Date(formData.date_fin);
        
        // Si les heures sont définies, les ajouter aux dates
        if (formData.heure_debut) {
          const [hours, minutes] = formData.heure_debut.split(':');
          startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        }
        
        if (formData.heure_fin) {
          const [hours, minutes] = formData.heure_fin.split(':');
          endDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        }
        
        if (endDate <= startDate) {
          return { isValid: false, error: 'La date/heure de fin doit être postérieure à la date/heure de début' };
        }
        break;
      
      case 3:
        if (!formData.format) {
          return { isValid: false, error: 'Veuillez sélectionner un format' };
        }
        if (formData.format === 'presentiel' && !formData.adresse?.trim()) {
          return { isValid: false, error: 'L\'adresse est obligatoire pour un événement présentiel' };
        }
        if (formData.format === 'virtuel' && !formData.lieu?.trim()) {
          return { isValid: false, error: 'Le lien vidéo est obligatoire pour un événement virtuel' };
        }
        break;
      
      case 4:
        if (!formData.tarification) {
          return { isValid: false, error: 'Veuillez sélectionner un type de tarification' };
        }
        if (formData.tarification === 'payant' && formData.tickets.length === 0) {
          return { isValid: false, error: 'Veuillez créer au moins un billet pour un événement payant' };
        }
        break;
      
      case 5:
        // Étape optionnelle - toujours valide
        break;
      
      case 6:
        // Validation finale
        break;
    }
    
    return { isValid: true, error: '' };
  }, [currentStep, formData]);

  // Mettre à jour l'erreur si nécessaire
  useEffect(() => {
    if (!currentStepValidation.isValid && currentStepValidation.error !== error) {
      setError(currentStepValidation.error);
    } else if (currentStepValidation.isValid && error) {
      setError('');
    }
  }, [currentStepValidation, error]);

  const validateCurrentStep = (): boolean => {
    return currentStepValidation.isValid;
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

  // Afficher le loading pendant le chargement de l'auth ou de l'événement
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            {authLoading ? 'Vérification de l\'authentification...' : 'Chargement de l\'événement...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageTitle 
        title={eventId ? "Modifier l'événement" : "Créer un événement"}
        description="Créez ou modifiez votre événement en suivant les étapes du wizard"
      />
      <div className="min-h-screen bg-gray-50">
      {/* Header spécifique aux événements */}
      <EventHeader 
        onToggleSidebar={() => {
          setIsSidebarExpanded(!isSidebarExpanded);
        }}
        isSidebarExpanded={isSidebarExpanded}
      />

      <div className="flex flex-row relative">
        {/* Overlay pour fermer la barre latérale sur mobile */}
        {!isDesktop && isSidebarExpanded && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-10 z-20 lg:hidden"
            onClick={() => setIsSidebarExpanded(false)}
          />
        )}
        
        {/* Navigation latérale - Responsive */}
        <div className={`bg-white transition-all duration-300 flex flex-col sticky top-16 sticky-element ${
          isDesktop ? 'w-80 z-30 border-r border-gray-200 h-[calc(100vh-4rem)]' : (isSidebarExpanded ? 'fixed top-16 left-0 w-56 z-30 h-[calc(100vh-4rem)]' : 'w-12 z-30 shadow-sm h-[calc(100vh-4rem)]')
        }`}>
          <div className={`flex-1 overflow-y-auto scroll-container ${
            isDesktop ? 'p-4 lg:p-6' : (isSidebarExpanded ? 'p-0' : 'p-2')
          }`} style={{ overscrollBehavior: 'none' }}>
            {/* Barre de progression */}
                                                           <WizardProgress 
                    currentStep={currentStep} 
                    totalSteps={totalSteps} 
                    isExpanded={isDesktop || isSidebarExpanded}
                    onToggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
                  />
            
            {/* Indicateur d'auto-sauvegarde */}
            {autoSaving && (
                      <div className="mt-4 p-3 bg-primary-blue/10 border border-primary-blue/20 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary-blue border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-primary-blue">Sauvegarde automatique...</span>
          </div>
        </div>
            )}
          </div>
        </div>

        {/* Contenu principal - Responsive */}
        <div className={`flex-1 ${
          isDesktop ? 'lg:pl-6' : (isSidebarExpanded ? 'pl-0' : 'pl-0')
        }`}>
          <div className="w-full p-4 lg:p-6">
            {/* Titre de la page et instructions */}
            <div className="mb-6 text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-left">
                {eventId ? 'Modifier l\'événement' : 'Créer un nouvel événement'}
              </h1>
              <p className="text-gray-600 text-left">
                Suivez les étapes pour créer un événement complet et attractif
              </p>
            </div>

            <WizardStep stepNumber={currentStep} totalSteps={totalSteps}>
              {renderCurrentStep()}
            </WizardStep>
            
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
      </div>
    </div>
    </>
  );
};

export default EventWizard;
