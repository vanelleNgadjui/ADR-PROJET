import React from 'react';
import type { EventFormData } from '../EventWizard';
import SimpleInput from '../../../form/input/SimpleInput';
import TextArea from '../../../form/input/TextArea';
import Select from '../../../form/Select';
import { MapPin, Video, Globe } from 'lucide-react';

interface Step3LocationProps {
  formData: EventFormData;
  onFormDataChange: (updates: Partial<EventFormData>) => void;
  error: string;
  setError: (error: string) => void;
}

const Step3Location: React.FC<Step3LocationProps> = ({
  formData,
  onFormDataChange,
  error,
  setError,
}) => {
  const formatOptions = [
    { value: 'en_presentiel', label: 'Présentiel' },
    { value: 'en_ligne', label: 'Virtuel' },
    { value: 'hybride', label: 'Hybride' },
  ];

  const handleFormatChange = (format: string) => {
    onFormDataChange({ 
      format: format as 'en_presentiel' | 'en_ligne' | 'hybride',
      lieu: '',
      adresse: ''
    });
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* En-tête de l'étape */}
      <div className="text-left lg:text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Lieu et format de l'événement
        </h3>
        <p className="text-gray-600">
          Choisissez comment votre événement se déroulera
        </p>
      </div>

      {/* Sélection du format */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Format de l'événement *
        </label>
        <Select
          options={formatOptions}
          placeholder="Sélectionnez le format de l'événement"
          onChange={handleFormatChange}
          defaultValue={formData.format}
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Choisissez comment votre événement se déroulera
        </p>
      </div>

      {/* Champs spécifiques selon le format */}
      {formData.format === 'en_presentiel' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse complète *
            </label>
            <TextArea
              value={formData.adresse || ''}
              onChange={(value) => onFormDataChange({ adresse: value })}
              placeholder="Ex: 123 Rue de la Paix, 75001 Paris, France"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Adresse complète pour que les participants puissent vous trouver
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du lieu (optionnel)
            </label>
            <SimpleInput
              type="text"
              value={formData.lieu || ''}
              onChange={(e) => onFormDataChange({ lieu: e.target.value })}
              placeholder="Ex: Salle des Fêtes, Église Saint-Pierre, etc."
            />
            <p className="text-xs text-gray-500 mt-1">
              Nom du bâtiment ou de la salle si applicable
            </p>
          </div>
        </div>
      )}

      {formData.format === 'en_ligne' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lien de l'événement virtuel *
            </label>
            <SimpleInput
              type="url"
              value={formData.lieu || ''}
              onChange={(e) => onFormDataChange({ lieu: e.target.value })}
              placeholder="Ex: https://zoom.us/j/123456789 ou https://meet.google.com/abc-defg-hij"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lien Zoom, Google Meet, ou autre plateforme de visioconférence
            </p>
          </div>

          <div className="bg-primary-blue/10 border border-primary-blue/20 rounded-lg p-4">
            <h4 className="font-medium text-primary-blue mb-2">💡 Conseils pour les événements virtuels</h4>
            <ul className="text-sm text-primary-blue space-y-1">
              <li>• Testez votre lien avant l'événement</li>
              <li>• Prévoyez un mot de passe si nécessaire</li>
              <li>• Envoyez les instructions de connexion aux participants</li>
              <li>• Préparez un plan B en cas de problème technique</li>
            </ul>
          </div>
        </div>
      )}

      {formData.format === 'hybride' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse du lieu présentiel *
            </label>
            <TextArea
              value={formData.adresse || ''}
              onChange={(value) => onFormDataChange({ adresse: value })}
              placeholder="Ex: 123 Rue de la Paix, 75001 Paris, France"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lien de l'événement virtuel *
            </label>
            <SimpleInput
              type="url"
              value={formData.lieu || ''}
              onChange={(e) => onFormDataChange({ lieu: e.target.value })}
              placeholder="Ex: https://zoom.us/j/123456789"
            />
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">🎯 Événement hybride</h4>
            <p className="text-sm text-purple-800">
              Votre événement sera accessible à la fois en présentiel et en ligne. 
              Assurez-vous que les deux formats offrent une expérience de qualité.
            </p>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}


    </div>
  );
};

export default Step3Location;
