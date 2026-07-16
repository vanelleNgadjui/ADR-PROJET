import React, { useState } from 'react';
import type { EventFormData } from '../EventWizard';
import { CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { Button } from '../../../ui/Button';

interface Step6ValidationProps {
  formData: EventFormData;
  onFormDataChange: (updates: Partial<EventFormData>) => void;
  error: string;
  setError: (error: string) => void;
}

const Step6Validation: React.FC<Step6ValidationProps> = ({
  formData,
  onFormDataChange,
  error,
  setError,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Validation complète de l'événement
  const validateEvent = () => {
    const errors: string[] = [];

    // Étape 1: Informations fondamentales
    if (!formData.titre.trim()) errors.push('Le titre est obligatoire');
    if (!formData.description?.trim()) errors.push('La description est obligatoire');
    if (!formData.image_couverture) errors.push('L\'image de couverture est obligatoire');
    if (!formData.sous_categorie_id) errors.push('La catégorie est obligatoire');

    // Étape 2: Date et heure
    if (!formData.date_debut) errors.push('La date de début est obligatoire');
    if (!formData.date_fin) errors.push('La date de fin est obligatoire');
    if (formData.date_debut && formData.date_fin) {
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
        errors.push('La date/heure de fin doit être postérieure à la date/heure de début');
      }
    }

    // Étape 3: Lieu et format
    if (!formData.format) errors.push('Le format est obligatoire');
    if (formData.format === 'en_presentiel' && !formData.adresse?.trim()) {
      errors.push('L\'adresse est obligatoire pour un événement présentiel');
    }
    if (formData.format === 'en_ligne' && !formData.lieu?.trim()) {
      errors.push('Le lien vidéo est obligatoire pour un événement virtuel');
    }

    // Étape 4: Tarification
    if (!formData.tarification) errors.push('Le type de tarification est obligatoire');
    if (formData.tarification === 'payant' && formData.tickets.length === 0) {
      errors.push('Au moins un billet est requis pour un événement payant');
    }

    return errors;
  };

  const validationErrors = validateEvent();
  const isValid = validationErrors.length === 0;

  const handlePublish = async () => {
    if (!isValid) {
      setError('Veuillez corriger les erreurs avant de publier');
      return;
    }

    setPublishing(true);
    setError('');

    try {
      // Ici, vous appelleriez votre API pour publier l'événement
      // Pour l'instant, on simule une publication
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mettre à jour le statut
      onFormDataChange({ statut: 'publie' });
      
      // Rediriger vers la page de succès ou le dashboard
      // navigate('/dashboard/events');
      
    } catch (err) {
      console.error('Erreur lors de la publication:', err);
      setError('Erreur lors de la publication de l\'événement');
    } finally {
      setPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    setPublishing(true);
    setError('');

    try {
      // Sauvegarder en brouillon
      await new Promise(resolve => setTimeout(resolve, 1000));
      onFormDataChange({ statut: 'brouillon' });
      
      // Rediriger vers le dashboard
      // navigate('/dashboard/events');
      
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde du brouillon');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête de l'étape */}
      <div className="text-left lg:text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Validation et publication
        </h3>
        <p className="text-gray-600">
          Vérifiez les informations et publiez votre événement
        </p>
      </div>

      {/* Statut de validation */}
      <div className={`p-4 rounded-lg border ${
        isValid 
                      ? 'bg-primary-orange/10 border-primary-orange/20' 
          : 'bg-primary-blue/10 border-primary-blue/20'
      }`}>
        <div className="flex items-center gap-3">
          {isValid ? (
            <CheckCircle className="w-6 h-6 text-primary-orange" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-primary-blue" />
          )}
          <div>
            <h4 className={`font-medium ${
              isValid ? 'text-primary-orange' : 'text-primary-blue'
            }`}>
              {isValid ? 'Événement prêt à être publié' : 'Événement incomplet'}
            </h4>
            <p className={`text-sm ${
              isValid ? 'text-primary-orange' : 'text-primary-blue'
            }`}>
              {isValid 
                ? 'Toutes les informations obligatoires sont renseignées'
                : `${validationErrors.length} erreur(s) à corriger`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Erreurs de validation */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-900 mb-2">Erreurs à corriger :</h4>
          <ul className="space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-sm text-red-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Récapitulatif de l'événement */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Récapitulatif de votre événement</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations de base */}
          <div className="space-y-3">
            <h5 className="font-medium text-gray-700">Informations de base</h5>
            <div className="space-y-2 text-sm">
              <p><strong>Titre :</strong> {formData.titre || 'Non renseigné'}</p>
              <p><strong>Description :</strong> {formData.description ? `${formData.description.substring(0, 100)}...` : 'Non renseignée'}</p>
              <p><strong>Image :</strong> {formData.image_couverture ? '✅ Ajoutée' : '❌ Manquante'}</p>
            </div>
          </div>

          {/* Planning */}
          <div className="space-y-3">
            <h5 className="font-medium text-gray-700">Planning</h5>
            <div className="space-y-2 text-sm">
              <p><strong>Début :</strong> {formData.date_debut ? new Date(formData.date_debut).toLocaleString('fr-FR') : 'Non renseigné'}</p>
              <p><strong>Fin :</strong> {formData.date_fin ? new Date(formData.date_fin).toLocaleString('fr-FR') : 'Non renseigné'}</p>
              <p><strong>Capacité :</strong> {formData.capacite_max || 'Illimitée'}</p>
            </div>
          </div>

          {/* Lieu et format */}
          <div className="space-y-3">
            <h5 className="font-medium text-gray-700">Lieu et format</h5>
            <div className="space-y-2 text-sm">
              <p><strong>Format :</strong> {formData.format || 'Non renseigné'}</p>
              {formData.format === 'en_presentiel' && (
                <p><strong>Adresse :</strong> {formData.adresse || 'Non renseignée'}</p>
              )}
              {formData.format === 'en_ligne' && (
                <p><strong>Lien :</strong> {formData.lieu || 'Non renseigné'}</p>
              )}
            </div>
          </div>

          {/* Tarification */}
          <div className="space-y-3">
            <h5 className="font-medium text-gray-700">Tarification</h5>
            <div className="space-y-2 text-sm">
              <p><strong>Type :</strong> {formData.tarification || 'Non renseigné'}</p>
              {formData.tarification === 'payant' && (
                <p><strong>Billets :</strong> {formData.tickets.length} billet(s)</p>
              )}
              {formData.intervenants.length > 0 && (
                <p><strong>Intervenants :</strong> {formData.intervenants.length} personne(s)</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bouton de prévisualisation */}
      <div className="flex justify-center">
                 <Button
           onClick={() => setShowPreview(!showPreview)}
           variant="ghost"
           className="flex items-center gap-2"
         >
           <Eye className="w-5 h-5" />
           {showPreview ? 'Masquer la prévisualisation' : 'Voir la prévisualisation'}
         </Button>
      </div>

      {/* Prévisualisation */}
      {showPreview && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Prévisualisation publique</h4>
          <div className="bg-white rounded-lg p-4 border border-neutral-black/10">
            {/* Ici vous pourriez afficher une prévisualisation de l'événement */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold">{formData.titre}</h3>
              <p className="text-gray-600">{formData.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>📅 {formData.date_debut ? new Date(formData.date_debut).toLocaleDateString('fr-FR') : 'Date à définir'}</span>
                <span>📍 {formData.format}</span>
                <span>💰 {formData.tarification}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleSaveDraft}
          disabled={publishing}
          variant="secondary"
        >
          {publishing ? 'Sauvegarde...' : 'Sauvegarder en brouillon'}
        </Button>

        <Button
          onClick={handlePublish}
          disabled={!isValid || publishing}
          variant="primary"
        >
          {publishing ? 'Publication...' : 'Publier l\'événement'}
        </Button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Conseils finaux */}
              <div className="bg-primary-orange/10 border border-primary-orange/20 rounded-lg p-4">
          <h4 className="font-medium text-primary-orange mb-2">🎉 Félicitations !</h4>
          <p className="text-sm text-primary-orange">
          Vous êtes sur le point de publier votre événement. Une fois publié, il sera visible 
          par tous les utilisateurs de la plateforme et pourra recevoir des inscriptions.
        </p>
      </div>
    </div>
  );
};

export default Step6Validation;
