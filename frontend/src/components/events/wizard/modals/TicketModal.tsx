import React, { useState } from 'react';
import { Modal } from '../../../ui/Modal';
import type { Ticket, TicketCategorie } from '../../../../types/database';
import SimpleInput from '../../../form/input/SimpleInput';
import TextArea from '../../../form/input/TextArea';
import Select from '../../../form/Select';
import { Button } from '../../../ui/Button';
import { CreditCard, Trash2 } from 'lucide-react';
import { supabase } from '../../../../lib/supabaseClient';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket?: Partial<Ticket>;
  categories: TicketCategorie[];
  onSave: (ticket: Partial<Ticket>) => void;
}

const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  ticket,
  categories,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Ticket>>(
    ticket || {
      nom: '',
      description: '',
      prix: 0,
      quantite: undefined,
      date_debut_vente: '',
      date_fin_vente: '',
      type_billet: '',
      conditions: '',
      image_url: '',
      is_visible: true,
    }
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `ticket-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
    } catch (error) {
      console.error('Erreur upload image:', error);
      setError('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!formData.nom?.trim()) {
      setError('Le nom du billet est requis');
      return;
    }

    if (formData.prix === undefined || formData.prix < 0) {
      setError('Le prix doit être positif');
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData(ticket || {
      nom: '',
      description: '',
      prix: 0,
      quantite: undefined,
      date_debut_vente: '',
      date_fin_vente: '',
      type_billet: '',
      conditions: '',
      image_url: '',
      is_visible: true,
    });
    setError('');
    onClose();
  };

  const categoryOptions = [
    { value: '', label: 'Aucune catégorie' },
    ...categories
      .filter(cat => cat.id) // Filtrer les catégories sans id
      .map(cat => ({ value: cat.id.toString(), label: cat.nom }))
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="lg">
      <div className="max-h-[70vh] md:max-h-[85vh] overflow-y-auto hide-scrollbar scroll-container">
        {/* En-tête fixe */}
        <div className="sticky top-0 bg-white pb-4 border-b border-gray-200 mb-4 z-10">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {ticket ? 'Modifier le billet' : 'Créer un nouveau billet'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Définissez les informations du billet
            </p>
          </div>
        </div>

                {/* Contenu scrollable */}
        <div className="space-y-3">
          {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nom du billet */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du billet *
            </label>
            <SimpleInput
              value={formData.nom || ''}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Ex: Billet Standard, VIP, Étudiant"
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
              placeholder="Description détaillée du billet"
              rows={2}
            />
          </div>

          {/* Prix et quantité */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (€) *
              </label>
              <SimpleInput
                value={formData.prix?.toString() || '0'}
                onChange={(e) => setFormData({ ...formData, prix: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                type="number"
                min="0"
                step={0.01}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité
              </label>
              <SimpleInput
                value={formData.quantite?.toString() || ''}
                onChange={(e) => setFormData({ ...formData, quantite: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="Illimitée si vide"
                type="number"
                min="1"
              />
            </div>
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <Select
              options={categoryOptions}
              placeholder="Sélectionner une catégorie"
              onChange={(value) => setFormData({ ...formData, category_id: value ? parseInt(value) : undefined })}
              defaultValue={formData.category_id?.toString() || ''}
            />
          </div>

          {/* Dates de vente */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Début de vente
              </label>
              <SimpleInput
                value={formData.date_debut_vente || ''}
                onChange={(e) => setFormData({ ...formData, date_debut_vente: e.target.value })}
                type="datetime-local"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fin de vente
              </label>
              <SimpleInput
                value={formData.date_fin_vente || ''}
                onChange={(e) => setFormData({ ...formData, date_fin_vente: e.target.value })}
                type="datetime-local"
              />
            </div>
          </div>

          {/* Conditions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conditions spéciales
            </label>
            <TextArea
              value={formData.conditions || ''}
              onChange={(value) => setFormData({ ...formData, conditions: value })}
              placeholder="Conditions particulières pour ce billet"
              rows={1}
            />
          </div>

          {/* Image du billet */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image du billet
            </label>
            {formData.image_url ? (
              <div className="relative">
                <img
                  src={formData.image_url}
                  alt="Image du billet"
                  className="w-full h-24 object-cover rounded-lg border border-neutral-black/10"
                />
                <Button
                  type="button"
                  onClick={() => setFormData({ ...formData, image_url: '' })}
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
                  onChange={handleImageUpload}
                  className="hidden"
                  id="ticket-image-upload"
                  disabled={uploadingImage}
                />
                <label htmlFor="ticket-image-upload" className="cursor-pointer">
                  <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">
                    {uploadingImage ? 'Upload en cours...' : 'Cliquez pour ajouter une image'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG jusqu'à 5MB
                  </p>
                </label>
              </div>
            )}
          </div>

          {/* Visibilité */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ticket-visible"
              checked={formData.is_visible}
              onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                              className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-neutral-black/10 rounded"
            />
            <label htmlFor="ticket-visible" className="ml-2 block text-sm text-gray-900">
              Billet visible pour les participants
            </label>
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
              {ticket ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </Modal>
  );
};

export default TicketModal;
