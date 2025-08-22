import React from 'react';
import type { EventFormData } from '../EventWizard';
import SimpleInput from '../../../form/input/SimpleInput';
import CustomCalendar from '../../../ui/CustomCalendar';
import CustomTimePicker from '../../../ui/CustomTimePicker';
import NumberInput from '../../../ui/NumberInput';
import Alert from '../../../ui/Alert';
import { Calendar, Clock, Users } from 'lucide-react';

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
      
      // Si les heures sont définies, les ajouter aux dates pour la comparaison
      if (formData.heure_debut) {
        const [hours, minutes] = formData.heure_debut.split(':');
        startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      }
      
      if (formData.heure_fin) {
        const [hours, minutes] = formData.heure_fin.split(':');
        endDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      }
      
      if (endDate <= startDate) {
        setError('La date/heure de fin doit être postérieure à la date/heure de début');
      } else {
        setError('');
      }
    }
  };

  const handleTimeChange = (field: 'heure_debut' | 'heure_fin', value: string) => {
    onFormDataChange({ [field]: value });
    
    // Validation automatique des heures si les deux dates sont identiques
    if (formData.date_debut && formData.date_fin && formData.date_debut === formData.date_fin) {
      const startDate = new Date(formData.date_debut);
      const endDate = new Date(formData.date_fin);
      
      // Ajouter les heures aux dates
      if (field === 'heure_debut' || formData.heure_debut) {
        const heureDebut = field === 'heure_debut' ? value : formData.heure_debut;
        if (heureDebut) {
          const [hours, minutes] = heureDebut.split(':');
          startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        }
      }
      
      if (field === 'heure_fin' || formData.heure_fin) {
        const heureFin = field === 'heure_fin' ? value : formData.heure_fin;
        if (heureFin) {
          const [hours, minutes] = heureFin.split(':');
          endDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        }
      }
      
      if (endDate <= startDate) {
        setError('La date/heure de fin doit être postérieure à la date/heure de début');
      } else {
        setError('');
      }
    }
  };

  const handleCapacityChange = (value: number | undefined) => {
    onFormDataChange({ capacite_max: value });
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

      {/* Date de début */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date de début *
        </label>
        <CustomCalendar
          value={formData.date_debut || ''}
          onChange={(date) => handleDateChange('date_debut', date)}
          placeholder="Sélectionnez la date de début"
          className="w-full"
          allowFutureDates={true}
        />
        <p className="text-xs text-gray-500 mt-1">
          Date du début de l'événement
        </p>
      </div>

      {/* Heure de début */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Heure de début *
        </label>
        <CustomTimePicker
          value={formData.heure_debut || ''}
          onChange={(time) => handleTimeChange('heure_debut', time)}
          placeholder="Sélectionnez l'heure de début"
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Heure précise du début de l'événement
        </p>
      </div>

      {/* Date de fin */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date de fin *
        </label>
        <CustomCalendar
          value={formData.date_fin || ''}
          onChange={(date) => handleDateChange('date_fin', date)}
          placeholder="Sélectionnez la date de fin"
          className="w-full"
          allowFutureDates={true}
          minDate={formData.date_debut || undefined}
        />
        <p className="text-xs text-gray-500 mt-1">
          Date de fin de l'événement
        </p>
      </div>

      {/* Heure de fin */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Heure de fin *
        </label>
        <CustomTimePicker
          value={formData.heure_fin || ''}
          onChange={(time) => handleTimeChange('heure_fin', time)}
          placeholder="Sélectionnez l'heure de fin"
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Heure précise de fin de l'événement
        </p>
      </div>

      {/* Capacité maximale */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Capacité maximale
        </label>
        <NumberInput
          value={formData.capacite_max}
          onChange={handleCapacityChange}
          placeholder="0"
          min={0}
          max={10000}
          step={1}
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Nombre maximum de participants autorisés (optionnel)
        </p>
      </div>



      {/* Message d'erreur */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Conseils */}
      <Alert
        variant="info"
        title="💡 Conseils pour votre événement"
        message="Prévoyez un temps de préparation avant l'événement. La durée recommandée est de 2 à 4 heures pour un événement standard. Pour les événements en ligne, testez votre plateforme à l'avance. La capacité maximale aide à gérer les inscriptions."
        className="mt-6"
      />
    </div>
  );
};

export default Step2DateTime;
