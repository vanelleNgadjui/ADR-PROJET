import React from 'react';
import type { EventFormData } from '../EventWizard';
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
    {
      value: 'presentiel',
      label: 'Présentiel',
      description: 'Événement en personne',
      icon: MapPin,
      color: 'bg-green-100 text-green-800 border-green-200',
      activeColor: 'bg-green-500 text-white border-green-500',
    },
    {
      value: 'virtuel',
      label: 'Virtuel',
      description: 'Événement en ligne',
      icon: Video,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      activeColor: 'bg-blue-500 text-white border-blue-500',
    },
    {
      value: 'hybride',
      label: 'Hybride',
      description: 'Présentiel + en ligne',
      icon: Globe,
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      activeColor: 'bg-purple-500 text-white border-purple-500',
    },
  ];

  const handleFormatChange = (format: 'presentiel' | 'virtuel' | 'hybride') => {
    onFormDataChange({ 
      format,
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
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Format de l'événement *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formatOptions.map((option) => {
            const Icon = option.icon;
            const isActive = formData.format === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => handleFormatChange(option.value as any)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  isActive 
                    ? option.activeColor 
                    : `${option.color} hover:border-gray-300`
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6" />
                  <div>
                    <h4 className="font-semibold">{option.label}</h4>
                    <p className="text-sm opacity-80">{option.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Champs spécifiques selon le format */}
      {formData.format === 'presentiel' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse complète *
            </label>
            <textarea
              value={formData.adresse}
              onChange={(e) => onFormDataChange({ adresse: e.target.value })}
              placeholder="Ex: 123 Rue de la Paix, 75001 Paris, France"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Adresse complète pour que les participants puissent vous trouver
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du lieu (optionnel)
            </label>
            <input
              type="text"
              value={formData.lieu}
              onChange={(e) => onFormDataChange({ lieu: e.target.value })}
              placeholder="Ex: Salle des Fêtes, Église Saint-Pierre, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Nom du bâtiment ou de la salle si applicable
            </p>
          </div>
        </div>
      )}

      {formData.format === 'virtuel' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lien de l'événement virtuel *
            </label>
            <input
              type="url"
              value={formData.lieu}
              onChange={(e) => onFormDataChange({ lieu: e.target.value })}
              placeholder="Ex: https://zoom.us/j/123456789 ou https://meet.google.com/abc-defg-hij"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Lien Zoom, Google Meet, ou autre plateforme de visioconférence
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Conseils pour les événements virtuels</h4>
            <ul className="text-sm text-blue-800 space-y-1">
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
            <textarea
              value={formData.adresse}
              onChange={(e) => onFormDataChange({ adresse: e.target.value })}
              placeholder="Ex: 123 Rue de la Paix, 75001 Paris, France"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lien de l'événement virtuel *
            </label>
            <input
              type="url"
              value={formData.lieu}
              onChange={(e) => onFormDataChange({ lieu: e.target.value })}
              placeholder="Ex: https://zoom.us/j/123456789"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
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

      {/* Aperçu du format sélectionné */}
      {formData.format && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Format sélectionné</h4>
          <div className="flex items-center gap-2">
            {formatOptions.find(opt => opt.value === formData.format)?.icon && 
              React.createElement(formatOptions.find(opt => opt.value === formData.format)!.icon, {
                className: "w-5 h-5 text-gray-600"
              })
            }
            <span className="text-gray-700">
              {formatOptions.find(opt => opt.value === formData.format)?.label}
            </span>
          </div>
          {formData.adresse && (
            <p className="text-sm text-gray-600 mt-2">
              <strong>Lieu :</strong> {formData.adresse}
            </p>
          )}
          {formData.lieu && formData.format !== 'presentiel' && (
            <p className="text-sm text-gray-600 mt-1">
              <strong>Lien :</strong> {formData.lieu}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Step3Location;
