import React, { useState, useEffect } from 'react';
import { Modal } from '../../../ui/Modal';
import type { EventIntervenant } from '../../../../types/database';
import SimpleInput from '../../../form/input/SimpleInput';
import TextArea from '../../../form/input/TextArea';
import { Button } from '../../../ui/Button';
import { User, Upload, Trash2 } from 'lucide-react';
import { supabase } from '../../../../lib/supabaseClient';

interface SpeakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  speaker?: Partial<EventIntervenant>;
  onSave: (speaker: Partial<EventIntervenant>) => void;
}

const SpeakerModal: React.FC<SpeakerModalProps> = ({
  isOpen,
  onClose,
  speaker,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<EventIntervenant>>(
    speaker || {
      nom: '',
      description: '',
      email: '',
      photo_url: '',
      role_fonction: '',
      autres_infos: {},
    }
  );
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState('');

  // Réinitialiser le formulaire quand l'intervenant change
  useEffect(() => {
    setFormData(speaker || {
      nom: '',
      description: '',
      email: '',
      photo_url: '',
      role_fonction: '',
      autres_infos: {},
    });
    setError('');
  }, [speaker]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `speaker-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, photo_url: publicUrl });
    } catch (error) {
      console.error('Erreur upload photo:', error);
      setError('Erreur lors de l\'upload de la photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!formData.nom?.trim()) {
      setError('Le nom de l\'intervenant est requis');
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData(speaker || {
      nom: '',
      description: '',
      email: '',
      photo_url: '',
      role_fonction: '',
      autres_infos: {},
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
              {speaker ? 'Modifier l\'intervenant' : 'Ajouter un intervenant'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Définissez les informations de l'intervenant
            </p>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="space-y-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <SimpleInput
                value={formData.nom || ''}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                placeholder="Ex: Jean Dupont"
              />
            </div>

            {/* Rôle/Fonction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rôle ou fonction
              </label>
              <SimpleInput
                value={formData.role_fonction || ''}
                onChange={(e) => setFormData({ ...formData, role_fonction: e.target.value })}
                placeholder="Ex: Conférencier, Animateur, Expert"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <SimpleInput
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="exemple@email.com"
                type="email"
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
                placeholder="Présentation de l'intervenant, son expertise, etc."
                rows={3}
              />
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo de profil
              </label>
              {formData.photo_url ? (
                <div className="relative">
                  <img
                    src={formData.photo_url}
                    alt="Photo de l'intervenant"
                    className="w-24 h-24 object-cover rounded-lg border border-neutral-black/10"
                  />
                  <Button
                    type="button"
                    onClick={() => setFormData({ ...formData, photo_url: '' })}
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 p-1 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-neutral-black/10 rounded-lg p-4 text-center hover:border-neutral-black/20 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="speaker-photo-upload"
                    disabled={uploadingPhoto}
                  />
                  <label htmlFor="speaker-photo-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">
                      {uploadingPhoto ? 'Upload en cours...' : 'Cliquez pour ajouter une photo'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG jusqu'à 5MB
                    </p>
                  </label>
                </div>
              )}
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
                {speaker ? 'Modifier' : 'Ajouter'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default SpeakerModal;
