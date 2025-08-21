import React, { useState } from 'react';
import { EventFormData, SpeakerData } from '../EventWizard';
import { PlusIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline';

interface Step5EnrichmentProps {
  formData: EventFormData;
  onFormDataChange: (updates: Partial<EventFormData>) => void;
  error: string;
  setError: (error: string) => void;
}

const Step5Enrichment: React.FC<Step5EnrichmentProps> = ({
  formData,
  onFormDataChange,
  error,
  setError,
}) => {
  const [showSpeakerForm, setShowSpeakerForm] = useState(false);
  const [editingSpeakerIndex, setEditingSpeakerIndex] = useState<number | null>(null);

  const difficultyOptions = [
    { value: 'debutant', label: 'Débutant' },
    { value: 'intermediaire', label: 'Intermédiaire' },
    { value: 'avance', label: 'Avancé' },
    { value: 'tous_niveaux', label: 'Tous niveaux' },
  ];

  const languageOptions = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'Anglais' },
    { value: 'es', label: 'Espagnol' },
  ];

  const frequencyOptions = [
    { value: 'ponctuel', label: 'Ponctuel' },
    { value: 'hebdomadaire', label: 'Hebdomadaire' },
    { value: 'mensuel', label: 'Mensuel' },
    { value: 'trimestriel', label: 'Trimestriel' },
    { value: 'annuel', label: 'Annuel' },
  ];

  const addSpeaker = () => {
    const newSpeaker: SpeakerData = {
      nom: '',
      description: '',
      email: '',
      photo_url: '',
      role_fonction: '',
      autres_infos: {},
    };

    onFormDataChange({
      intervenants: [...formData.intervenants, newSpeaker]
    });
    setEditingSpeakerIndex(formData.intervenants.length);
    setShowSpeakerForm(true);
  };

  const updateSpeaker = (index: number, updates: Partial<SpeakerData>) => {
    const updatedSpeakers = [...formData.intervenants];
    updatedSpeakers[index] = { ...updatedSpeakers[index], ...updates };
    onFormDataChange({ intervenants: updatedSpeakers });
  };

  const removeSpeaker = (index: number) => {
    const updatedSpeakers = formData.intervenants.filter((_, i) => i !== index);
    onFormDataChange({ intervenants: updatedSpeakers });
  };

  const addKeyword = (keyword: string) => {
    if (keyword.trim() && !formData.mots_cles.includes(keyword.trim())) {
      onFormDataChange({
        mots_cles: [...formData.mots_cles, keyword.trim()]
      });
    }
  };

  const removeKeyword = (keyword: string) => {
    onFormDataChange({
      mots_cles: formData.mots_cles.filter(k => k !== keyword)
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête de l'étape */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Enrichissement (optionnel)
        </h3>
        <p className="text-gray-600">
          Ajoutez des détails supplémentaires pour rendre votre événement plus attractif
        </p>
      </div>

      {/* Programme détaillé */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Programme détaillé
        </label>
        <textarea
          value={formData.programme}
          onChange={(e) => onFormDataChange({ programme: e.target.value })}
          placeholder="Décrivez le déroulé de votre événement, les activités prévues, etc."
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          Détaillez le programme pour donner envie aux participants de s'inscrire
        </p>
      </div>

      {/* Niveau de difficulté */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Niveau de difficulté
        </label>
        <select
          value={formData.niveau_difficulte || ''}
          onChange={(e) => onFormDataChange({ niveau_difficulte: e.target.value || null })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Sélectionnez un niveau</option>
          {difficultyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Langue */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Langue principale
        </label>
        <select
          value={formData.langue || 'fr'}
          onChange={(e) => onFormDataChange({ langue: e.target.value as 'fr' | 'en' | 'es' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Fréquence */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fréquence de l'événement
        </label>
        <select
          value={formData.frequence || ''}
          onChange={(e) => onFormDataChange({ frequence: e.target.value || null })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Sélectionnez une fréquence</option>
          {frequencyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Intervenants */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Intervenants
          </label>
          <button
            onClick={addSpeaker}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Ajouter un intervenant
          </button>
        </div>

        {formData.intervenants.length > 0 ? (
          <div className="space-y-3">
            {formData.intervenants.map((speaker, index) => (
              <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-6 h-6 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {speaker.nom || 'Intervenant sans nom'}
                      </h4>
                      {speaker.role_fonction && (
                        <p className="text-sm text-gray-600">{speaker.role_fonction}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingSpeakerIndex(index);
                        setShowSpeakerForm(true);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => removeSpeaker(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {speaker.description && (
                  <p className="text-sm text-gray-600">{speaker.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Aucun intervenant ajouté. Ajoutez les personnes qui animeront votre événement.
          </p>
        )}
      </div>

      {/* Mots-clés */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mots-clés
        </label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ajouter un mot-clé"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addKeyword(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addKeyword(input.value);
                input.value = '';
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ajouter
            </button>
          </div>

          {formData.mots_cles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.mots_cles.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Ajoutez des mots-clés pour améliorer la visibilité de votre événement
        </p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Conseils */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">💡 Conseils pour l'enrichissement</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Un programme détaillé augmente l'engagement des participants</li>
          <li>• Les intervenants ajoutent de la crédibilité à votre événement</li>
          <li>• Les mots-clés aident à la découverte de votre événement</li>
          <li>• Tous ces champs sont optionnels mais recommandés</li>
        </ul>
      </div>

      {/* Aperçu de l'enrichissement */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Aperçu de l'enrichissement</h4>
        <div className="space-y-2 text-sm text-gray-700">
          {formData.programme && (
            <p>
              <strong>Programme:</strong> {formData.programme.length} caractères
            </p>
          )}
          {formData.niveau_difficulte && (
            <p>
              <strong>Niveau:</strong> {difficultyOptions.find(opt => opt.value === formData.niveau_difficulte)?.label}
            </p>
          )}
          {formData.frequence && (
            <p>
              <strong>Fréquence:</strong> {frequencyOptions.find(opt => opt.value === formData.frequence)?.label}
            </p>
          )}
          <p>
            <strong>Intervenants:</strong> {formData.intervenants.length} personne(s)
          </p>
          <p>
            <strong>Mots-clés:</strong> {formData.mots_cles.length} mot(s)-clé(s)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step5Enrichment;
