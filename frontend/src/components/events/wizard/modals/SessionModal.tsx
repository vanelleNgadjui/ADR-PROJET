import React, { useState, useEffect } from 'react';
import { Modal } from '../../../ui/Modal';
import type { EventSession, EventIntervenant, TypeSessionEnum } from '../../../../types/database';
import SimpleInput from '../../../form/input/SimpleInput';
import TextArea from '../../../form/input/TextArea';
import Select from '../../../form/Select';
import { Button } from '../../../ui/Button';
import { Calendar, Clock, User, MapPin } from 'lucide-react';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session?: Partial<EventSession>;
  intervenants: EventIntervenant[];
  onSave: (session: Partial<EventSession>) => void;
}

const SessionModal: React.FC<SessionModalProps> = ({
  isOpen,
  onClose,
  session,
  intervenants,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<EventSession>>(
    session || {
      titre: '',
      description: '',
      date_debut: '',
      date_fin: '',
      type_session: 'pleniere',
      intervenant_id: undefined,
      salle: '',
      ordre: 0,
    }
  );
  const [error, setError] = useState('');

  // Réinitialiser le formulaire quand la session change
  useEffect(() => {
    setFormData(session || {
      titre: '',
      description: '',
      date_debut: '',
      date_fin: '',
      type_session: 'pleniere',
      intervenant_id: undefined,
      salle: '',
      ordre: 0,
    });
    setError('');
  }, [session]);

  const sessionTypeOptions = [
    { value: 'pleniere', label: 'Plénière' },
    { value: 'atelier', label: 'Atelier' },
    { value: 'table_ronde', label: 'Table ronde' },
    { value: 'priere', label: 'Prière' },
    { value: 'louange', label: 'Louange' },
    { value: 'pause', label: 'Pause' },
    { value: 'conference', label: 'Conférence' },
    { value: 'networking', label: 'Networking' },
    { value: 'debat', label: 'Débat' },
    { value: 'autre', label: 'Autre' },
  ];

  const intervenantOptions = [
    { value: '', label: 'Aucun intervenant' },
    ...intervenants.map(intervenant => ({ 
      value: intervenant.id?.toString() || '', 
      label: intervenant.nom 
    }))
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!formData.titre?.trim()) {
      setError('Le titre de la session est requis');
      return;
    }

    if (!formData.date_debut) {
      setError('La date de début est requise');
      return;
    }

    if (!formData.date_fin) {
      setError('La date de fin est requise');
      return;
    }

    // Validation des dates
    const startDate = new Date(formData.date_debut);
    const endDate = new Date(formData.date_fin);
    
    if (endDate <= startDate) {
      setError('La date de fin doit être postérieure à la date de début');
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData(session || {
      titre: '',
      description: '',
      date_debut: '',
      date_fin: '',
      type_session: 'pleniere',
      intervenant_id: undefined,
      salle: '',
      ordre: 0,
    });
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="lg">
      <div className="max-h-[70vh] md:max-h-[85vh] overflow-y-auto hide-scrollbar scroll-container">
        {/* En-tête fixe */}
        <div className="sticky top-0 bg-white pb-4 border-b border-gray-200 mb-4 z-10">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {session ? 'Modifier la session' : 'Créer une nouvelle session'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Définissez les informations de la session
            </p>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="space-y-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de la session *
              </label>
              <SimpleInput
                value={formData.titre || ''}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Ex: Conférence d'ouverture, Atelier pratique"
              />
            </div>

            {/* Type de session */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de session
              </label>
              <Select
                options={sessionTypeOptions}
                defaultValue={formData.type_session || 'conference'}
                onChange={(value) => setFormData({ ...formData, type_session: value as TypeSessionEnum })}
                placeholder="Sélectionner un type"
              />
            </div>

            {/* Horaires */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Début *
                </label>
                <SimpleInput
                  value={formData.date_debut || ''}
                  onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                  type="datetime-local"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Fin *
                </label>
                <SimpleInput
                  value={formData.date_fin || ''}
                  onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                  type="datetime-local"
                />
              </div>
            </div>

            {/* Intervenant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Intervenant
              </label>
              <Select
                options={intervenantOptions}
                defaultValue={formData.intervenant_id?.toString() || ''}
                onChange={(value) => setFormData({ ...formData, intervenant_id: value ? parseInt(value) : undefined })}
                placeholder="Sélectionner un intervenant"
              />
            </div>

            {/* Salle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Salle
              </label>
              <SimpleInput
                value={formData.salle || ''}
                onChange={(e) => setFormData({ ...formData, salle: e.target.value })}
                placeholder="Ex: Salle A, Auditorium, En ligne"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <TextArea
                value={formData.description || ''}
                onChange={(value) => setFormData({ ...formData, description: value })}
                placeholder="Description détaillée de la session"
                rows={3}
              />
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex justify-end gap-3 pt-3 sticky bottom-0 bg-white border-t border-gray-200 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                {session ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default SessionModal;
