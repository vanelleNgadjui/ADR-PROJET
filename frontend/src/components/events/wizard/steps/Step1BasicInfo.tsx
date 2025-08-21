import React, { useState, useEffect } from 'react';
import type { EventFormData } from '../EventWizard';
import { supabase } from '../../../../lib/supabaseClient';
import { Input } from '../../../ui/Input';
import { Button } from '../../../ui/Button';
import { Camera, X } from 'lucide-react';

interface Step1BasicInfoProps {
  formData: EventFormData;
  onFormDataChange: (updates: Partial<EventFormData>) => void;
  error: string;
  setError: (error: string) => void;
}

interface Category {
  id: number;
  nom: string;
  description?: string;
}

interface SubCategory {
  id: number;
  categorie_id: number;
  nom: string;
  description?: string;
}

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
  formData,
  onFormDataChange,
  error,
  setError,
}) => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Charger les catégories et sous-catégories
  useEffect(() => {
    loadCategories();
  }, []);

  // Charger les sous-catégories quand une catégorie est sélectionnée
  useEffect(() => {
    if (formData.sous_categorie_id) {
      loadSubCategories();
    }
  }, [formData.sous_categorie_id]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('id, nom, description')
        .order('nom');

      if (error) throw error;
      // Categories not used, just load subcategories directly
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
      setError('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  const loadSubCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('sous_categories')
        .select('id, categorie_id, nom, description')
        .order('nom');

      if (error) throw error;
      setSubCategories(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des sous-catégories:', err);
      setError('Erreur lors du chargement des sous-catégories');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation du fichier
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('L\'image doit faire moins de 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format d\'image non supporté. Utilisez JPG, PNG ou WebP');
      return;
    }

    try {
      setUploadingImage(true);
      setError('');

      // Créer un nom unique pour le fichier
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `event-covers/${fileName}`;

      // Upload vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      onFormDataChange({ image_couverture: publicUrl });
    } catch (err) {
      console.error('Erreur lors de l\'upload de l\'image:', err);
      setError('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    onFormDataChange({ image_couverture: '' });
  };



  return (
    <div className="space-y-6">
      {/* En-tête de l'étape */}
      <div className="text-left lg:text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Informations fondamentales
        </h3>
        <p className="text-gray-600">
          Commençons par les informations de base de votre événement
        </p>
      </div>

      {/* Titre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Titre de l'événement *
        </label>
        <Input
          type="text"
          value={formData.titre}
          onChange={(e) => onFormDataChange({ titre: e.target.value })}
          placeholder="Ex: Concert Gospel de Noël"
          className="w-full"
          required
          label=""
        />
        <p className="text-xs text-gray-500 mt-1">
          Choisissez un titre accrocheur et descriptif
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onFormDataChange({ description: e.target.value })}
          placeholder="Décrivez votre événement de manière attractive..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.description?.length || 0}/500 caractères
        </p>
      </div>

      {/* Image de couverture */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image de couverture *
        </label>
        
        {formData.image_couverture ? (
          <div className="relative">
            <img
              src={formData.image_couverture}
              alt="Couverture de l'événement"
              className="w-full h-48 object-cover rounded-lg border border-gray-300"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">
                {uploadingImage ? 'Upload en cours...' : 'Cliquez pour ajouter une image'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG ou WebP • Max 5MB
              </p>
            </label>
          </div>
        )}
        
        {uploadingImage && (
          <div className="mt-2 flex items-center gap-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Upload en cours...</span>
          </div>
        )}
      </div>

      {/* Catégorie */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Catégorie *
        </label>
        <select
          value={formData.sous_categorie_id || ''}
          onChange={(e) => {
            const subCategoryId = e.target.value ? parseInt(e.target.value) : 1;
            onFormDataChange({ sous_categorie_id: subCategoryId });
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Sélectionnez une catégorie</option>
          {subCategories.map((subCategory) => (
            <option key={subCategory.id} value={subCategory.id}>
              {subCategory.nom}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Choisissez la catégorie qui correspond le mieux à votre événement
        </p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Indicateur de chargement */}
      {loading && (
        <div className="text-center py-4">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Chargement des catégories...</p>
        </div>
      )}
    </div>
  );
};

export default Step1BasicInfo;



