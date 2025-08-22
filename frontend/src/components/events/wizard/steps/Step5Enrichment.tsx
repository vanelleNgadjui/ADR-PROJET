import React, { useState } from 'react';
import type { EventFormData } from '../EventWizard';
import type { EventIntervenant, EventSession, FrequenceEnum } from '../../../../types/database';
import { Plus, Trash2, User, Edit } from 'lucide-react';
import TextArea from '../../../form/input/TextArea';
import Select from '../../../form/Select';
import SimpleInput from '../../../form/input/SimpleInput';
import Radio from '../../../form/input/Radio';
import KeywordInput from '../../../form/input/KeywordInput';
import { Button } from '../../../ui/Button';
import Alert from '../../../ui/Alert';
import SpeakerModal from '../modals/SpeakerModal';
import SessionModal from '../modals/SessionModal';
import SessionList from '../SessionList';

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
  const [showSpeakerModal, setShowSpeakerModal] = useState(false);
  const [editingSpeakerIndex, setEditingSpeakerIndex] = useState<number | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [editingSessionIndex, setEditingSessionIndex] = useState<number | null>(null);


  const frequencyOptions = [
    { value: 'ponctuel', label: 'Ponctuel' },
    { value: 'hebdomadaire', label: 'Hebdomadaire' },
    { value: 'mensuel', label: 'Mensuel' },
    { value: 'trimestriel', label: 'Trimestriel' },
    { value: 'annuel', label: 'Annuel' },
  ];

  const addSpeaker = () => {
    setEditingSpeakerIndex(null);
    setShowSpeakerModal(true);
  };

  const handleSaveSpeaker = (speakerData: Partial<EventIntervenant>) => {
    if (editingSpeakerIndex !== null) {
      // Modifier un intervenant existant
      const updatedSpeakers = [...formData.intervenants];
      updatedSpeakers[editingSpeakerIndex] = { ...updatedSpeakers[editingSpeakerIndex], ...speakerData };
      onFormDataChange({ intervenants: updatedSpeakers });
    } else {
      // Ajouter un nouvel intervenant
      onFormDataChange({
        intervenants: [...formData.intervenants, speakerData as EventIntervenant]
      });
    }
  };

  const removeSpeaker = (index: number) => {
    const updatedSpeakers = formData.intervenants.filter((_, i) => i !== index);
    onFormDataChange({ intervenants: updatedSpeakers });
  };

  // Fonctions pour les sessions
  const addSession = () => {
    setEditingSessionIndex(null);
    setShowSessionModal(true);
  };

  const handleSaveSession = (sessionData: Partial<EventSession>) => {
    if (editingSessionIndex !== null) {
      // Modifier une session existante
      const updatedSessions = [...(formData.sessions || [])];
      updatedSessions[editingSessionIndex] = { ...updatedSessions[editingSessionIndex], ...sessionData };
      onFormDataChange({ sessions: updatedSessions });
    } else {
      // Ajouter une nouvelle session
      onFormDataChange({
        sessions: [...(formData.sessions || []), sessionData as EventSession]
      });
    }
  };

  const removeSession = (sessionId: number) => {
    const updatedSessions = (formData.sessions || []).filter(s => s.id !== sessionId);
    onFormDataChange({ sessions: updatedSessions });
  };



  return (
    <div className="space-y-6">
      {/* En-tête de l'étape */}
      <div className="text-left lg:text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Configuration avancée
        </h3>
        <p className="text-gray-600">
          Ajoutez des détails supplémentaires pour rendre votre événement plus attractif
        </p>
      </div>

      {/* Intervenants */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Intervenants
          </label>
                     <Button
             onClick={addSpeaker}
             variant="ghost"
             size="sm"
             className="flex items-center gap-2"
           >
             <Plus className="w-4 h-4" />
             Ajouter un intervenant
           </Button>
        </div>

        {formData.intervenants.length > 0 ? (
          <div className="space-y-3">
            {formData.intervenants.map((speaker, index) => (
              <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                                     <div className="flex items-center gap-3">
                     <User className="w-6 h-6 text-gray-400" />
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
                    <Button
                      onClick={() => {
                        setEditingSpeakerIndex(index);
                        setShowSpeakerModal(true);
                      }}
                      variant="ghost"
                      size="sm"
                      className="p-1 text-primary-blue hover:bg-primary-blue/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => removeSpeaker(index)}
                      variant="ghost"
                      size="sm"
                      className="p-1 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

      {/* Programme */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Programme de l'événement
        </label>
        
        {/* Choix du mode */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-4">
            <Radio
              id="programme-simple"
              name="programme_mode"
              value="simple"
              checked={formData.programme_mode !== 'structured'}
              onChange={(value) => onFormDataChange({ programme_mode: value as 'simple' | 'structured' })}
              label="Programme simple"
            />
            <Radio
              id="programme-structured"
              name="programme_mode"
              value="structured"
              checked={formData.programme_mode === 'structured'}
              onChange={(value) => onFormDataChange({ programme_mode: value as 'simple' | 'structured' })}
              label="Programme structuré"
            />
          </div>
        </div>

        {/* Mode simple */}
        {formData.programme_mode !== 'structured' && (
          <div>
            <TextArea
              value={formData.programme || ''}
              onChange={(value) => onFormDataChange({ programme: value })}
              placeholder="Décrivez le déroulé de votre événement, les activités prévues, etc."
              rows={6}
            />
            <p className="text-xs text-gray-500 mt-1">
              Détaillez le programme pour donner envie aux participants de s'inscrire
            </p>
          </div>
        )}

        {/* Mode structuré */}
        {formData.programme_mode === 'structured' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Sessions du programme</span>
              <Button
                onClick={addSession}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter une session
              </Button>
            </div>
            
            <SessionList
              sessions={formData.sessions || []}
              intervenants={formData.intervenants}
              onEditSession={(session) => {
                const index = (formData.sessions || []).findIndex(s => s.id === session.id);
                setEditingSessionIndex(index);
                setShowSessionModal(true);
              }}
              onDeleteSession={removeSession}
            />
          </div>
        )}
      </div>

      {/* Fréquence */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fréquence de l'événement
        </label>
        <Select
          options={[
            { value: '', label: 'Sélectionnez une fréquence' },
            ...frequencyOptions
          ]}
          defaultValue={formData.frequence || ''}
          onChange={(value) => onFormDataChange({ frequence: value as FrequenceEnum || undefined })}
          placeholder="Sélectionnez une fréquence"
        />
      </div>

      {/* Mots-clés */}
      <KeywordInput
        value={formData.mots_cles}
        onChange={(keywords) => onFormDataChange({ mots_cles: keywords })}
        placeholder="Ajouter un mot-clé"
        label="Mots-clés"
      />

      {/* Message d'erreur */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Conseils */}
      <Alert
        variant="info"
        title="💡 Conseils pour l'enrichissement"
        message="Un programme détaillé augmente l'engagement des participants. Les intervenants ajoutent de la crédibilité à votre événement. Les mots-clés aident à la découverte de votre événement. Tous ces champs sont optionnels mais recommandés."
      />

      {/* Modale pour les intervenants */}
      <SpeakerModal
        isOpen={showSpeakerModal}
        onClose={() => setShowSpeakerModal(false)}
        speaker={editingSpeakerIndex !== null ? formData.intervenants[editingSpeakerIndex] : undefined}
        onSave={handleSaveSpeaker}
      />

      {/* Modale pour les sessions */}
      <SessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        session={editingSessionIndex !== null ? formData.sessions?.[editingSessionIndex] : undefined}
        intervenants={formData.intervenants}
        onSave={handleSaveSession}
      />
    </div>
  );
};

export default Step5Enrichment;
