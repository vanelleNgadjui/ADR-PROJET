import React, { useState, useEffect } from 'react';
import { Modal } from '../../../ui/Modal';
import type { TicketCategorie } from '../../../../types/database';
import SimpleInput from '../../../form/input/SimpleInput';
import TextArea from '../../../form/input/TextArea';
import { Button } from '../../../ui/Button';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Partial<TicketCategorie>;
  onSave: (category: Partial<TicketCategorie>) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<TicketCategorie>>(
    category || {
      nom: '',
      description: '',
      ordre: 0,
    }
  );
  const [error, setError] = useState('');

  // Réinitialiser le formulaire quand la catégorie change
  useEffect(() => {
    setFormData(category || {
      nom: '',
      description: '',
      ordre: 0,
    });
    setError('');
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!formData.nom?.trim()) {
      setError('Le nom de la catégorie est requis');
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData(category || { nom: '', description: '', ordre: 0 });
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="md">
      <div className="space-y-6">
        {/* En-tête */}
        <div className="text-center">
        <h3 className="text-base font-medium text-gray-900">
            {category ? 'Modifier la catégorie' : 'Créer une nouvelle catégorie'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Définissez les informations de la catégorie de billets
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom de la catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la catégorie *
            </label>
            <SimpleInput
              value={formData.nom || ''}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Ex: VIP, Standard, Étudiant"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnel)
            </label>
            <TextArea
              value={formData.description || ''}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Description de cette catégorie de billets"
              rows={3}
            />
          </div>

          {/* Ordre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordre d'affichage
            </label>
            <SimpleInput
              value={formData.ordre?.toString() || '0'}
              onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) || 0 })}
              placeholder="0"
              type="number"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ordre d'affichage des catégories (0 = premier)
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex justify-end gap-3 pt-4">
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
              {category ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CategoryModal;
