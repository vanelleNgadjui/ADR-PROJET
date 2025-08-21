import React from 'react';
import type { EventFormData } from '../EventWizard';
import { Calendar, Clock } from 'lucide-react';

interface Step2DateTimeProps {
  formData: EventFormData;
  onFormDataChange: (updates: Partial<EventFormData>) => void;
  error: string;
  setError: (error: string) => void;
}

const Step2DateTime: React.FC<Step2DateTimeProps> = ({
  formData,
  onFormDataChange,
  error,
  setError,
}) => {
  const handleDateChange = (field: 'date_debut' | 'date_fin', value: string) => {
    onFormDataChange({ [field]: value });
    
    // Validation automatique des dates
    if (field === 'date_fin' && formData.date_debut && value) {
      const startDate = new Date(formData.date_debut);
      const endDate = new Date(value);
      
      if (endDate <= startDate) {
        setError('La date de fin doit être postérieure à la date de début');
      } else {
        setError('');
      }
    }
  };

  const handleCapacityChange = (value: string) => {
    const capacity = value ? parseInt(value) : undefined;
    onFormDataChange({ capacite_max: capacity });
  };

  return (
    <div className="space-y-6">
      {/* En-tête de l'étape */}
      <div className="text-left lg:text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Date et heure de l'événement
        </h3>
        <p className="text-gray-600">
          Définissez le planning de votre événement
        </p>
      </div>

      {/* Date et heure de début */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date et heure de début *
        </label>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <input
            type="datetime-local"
            value={formData.date_debut}
            onChange={(e) => handleDateChange('date_debut', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Date et heure précises du début de l'événement
        </p>
      </div>

      {/* Date et heure de fin */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date et heure de fin *
        </label>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <input
            type="datetime-local"
            value={formData.date_fin}
            onChange={(e) => handleDateChange('date_fin', e.target.value)}
            min={formData.date_debut}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Date et heure précises de la fin de l'événement
        </p>
      </div>

      {/* Capacité maximale */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Capacité maximale
        </label>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" />
          <input
            type="number"
            value={formData.capacite_max || ''}
            onChange={(e) => handleCapacityChange(e.target.value)}
            placeholder="Ex: 100"
            min="1"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-gray-500">participants</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Nombre maximum de participants autorisés (optionnel)
        </p>
      </div>

      {/* Aperçu de la durée */}
      {formData.date_debut && formData.date_fin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Aperçu de l'événement</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <p>
              <strong>Début :</strong> {new Date(formData.date_debut).toLocaleString('fr-FR')}
            </p>
            <p>
              <strong>Fin :</strong> {new Date(formData.date_fin).toLocaleString('fr-FR')}
            </p>
            <p>
              <strong>Durée :</strong> {
                Math.round((new Date(formData.date_fin).getTime() - new Date(formData.date_debut).getTime()) / (1000 * 60 * 60 * 24))
              } jour(s)
            </p>
            {formData.capacite_max && (
              <p>
                <strong>Capacité :</strong> {formData.capacite_max} participants
              </p>
            )}
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Conseils */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">💡 Conseils</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Prévoyez un temps de préparation avant l'événement</li>
          <li>• La durée recommandée est de 2 à 4 heures pour un événement standard</li>
          <li>• Pour les événements en ligne, testez votre plateforme à l'avance</li>
          <li>• La capacité maximale aide à gérer les inscriptions</li>
        </ul>
      </div>
    </div>
  );
};

export default Step2DateTime;
