import React, { useState, useEffect } from 'react';
import type { EventFormData } from '../EventWizard';
import { supabase, EVENT_IMAGES_BUCKET } from '../../../../lib/supabaseClient';
import { useAuth } from '../../../../hooks/useAuth';
import { Button } from '../../../ui/Button';
import SimpleInput from '../../../form/input/SimpleInput';
import Select from '../../../form/Select';
import FileInput from '../../../form/input/FileInput';
import TextArea from '../../../form/input/TextArea';
import { ImageDropZone } from '../../../form';
import { Camera, X } from 'lucide-react';

interface Step1BasicInfoProps {
  formData: EventFormData;
  onFormDataChange: (updates: Partial<EventFormData>) => void;
  error: string;
  setError: (error: string) => void;
}

interface FieldErrors {
  titre?: string;
  description?: string;
  image_couverture?: string;
  sous_categorie_id?: string;
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
  const { user } = useAuth();
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

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

  // Debug: Log des changements d'image
  useEffect(() => {
    console.log('Image de couverture mise à jour:', formData.image_couverture);
  }, [formData.image_couverture]);

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

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculer les nouvelles dimensions (max 1200px de large)
        const maxWidth = 1200;
        const maxHeight = 800;
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir en blob avec qualité 0.8
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadImage = async (file: File) => {
    // Validation du fichier
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setFieldErrors(prev => ({ ...prev, image_couverture: `L'image est trop volumineuse (${(file.size / 1024 / 1024).toFixed(1)}MB). Taille maximale : 5MB` }));
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setFieldErrors(prev => ({ ...prev, image_couverture: `Format non supporté : ${file.type}. Utilisez JPG, PNG ou WebP` }));
      return;
    }

    try {
      setUploadingImage(true);
      setError('');

      // Compresser l'image si elle est trop grande
      let fileToUpload = file;
      if (file.size > 500 * 1024) { // Si > 500KB, compresser
        console.log('🔄 Compression de l\'image...');
        fileToUpload = await compressImage(file);
        console.log('✅ Image compressée:', fileToUpload.size, 'bytes');
      }

      // Créer un nom unique pour le fichier
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `event-covers/${fileName}`;

      console.log('Début upload vers bucket:', EVENT_IMAGES_BUCKET);
      
      // Upload vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(EVENT_IMAGES_BUCKET)
        .upload(filePath, fileToUpload);

      if (uploadError) {
        console.error('Erreur upload:', uploadError);
        throw uploadError;
      }

      console.log('Upload réussi, obtention URL publique...');

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from(EVENT_IMAGES_BUCKET)
        .getPublicUrl(filePath);

      console.log('✅ Image uploadée avec succès:', { filePath, publicUrl });
      console.log('🔄 Mise à jour du state avec l\'URL...');
      onFormDataChange({ image_couverture: publicUrl });
      console.log('✅ State mis à jour');
      // Effacer l'erreur de l'image si elle existe
      setFieldErrors(prev => ({ ...prev, image_couverture: undefined }));
    } catch (err) {
      console.error('Erreur lors de l\'upload de l\'image:', err);
      
      // Erreurs spécifiques selon le type d'erreur
      if (err && typeof err === 'object' && 'statusCode' in err) {
        const error = err as any;
        if (error.statusCode === '413') {
          setFieldErrors(prev => ({ ...prev, image_couverture: 'L\'image est trop volumineuse pour le serveur. Essayez une image plus petite.' }));
        } else if (error.statusCode === '401') {
          setFieldErrors(prev => ({ ...prev, image_couverture: 'Erreur d\'authentification. Veuillez vous reconnecter.' }));
        } else if (error.statusCode === '403') {
          setFieldErrors(prev => ({ ...prev, image_couverture: 'Vous n\'avez pas les permissions pour uploader des images.' }));
        } else {
          setFieldErrors(prev => ({ ...prev, image_couverture: `Erreur serveur (${error.statusCode}): ${error.message || 'Erreur inconnue'}` }));
        }
      } else {
        setFieldErrors(prev => ({ ...prev, image_couverture: 'Erreur lors de l\'upload de l\'image. Vérifiez votre connexion.' }));
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('🖼️ FileInput: Fichier reçu:', file.name, file.size, file.type);
      await uploadImage(file);
    }
  };

  const handleDropZoneUpload = async (file: File) => {
    console.log('🖼️ DropZone: Fichier reçu:', file.name, file.size, file.type);
    await uploadImage(file);
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

      {/* Image de couverture - EN PREMIER */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image de couverture *
        </label>
        
        {formData.image_couverture ? (
          <div className="relative">
            <img
              src={formData.image_couverture}
              alt="Couverture de l'événement"
              className="w-full h-64 object-cover lg:object-contain rounded-lg border border-neutral-black/10 lg:bg-gray-50"
              onError={(e) => {
                console.error('Erreur de chargement image:', e);
                e.currentTarget.style.display = 'none';
              }}
              onLoad={() => console.log('Image chargée avec succès')}
            />
            <Button
              onClick={removeImage}
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 p-1 rounded-full text-secondary-coral hover:text-secondary-coral border border-secondary-coral hover:border-secondary-coral"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop: DropZone */}
            <div className="hidden lg:block">
              <ImageDropZone
                onImageUpload={handleDropZoneUpload}
                uploading={uploadingImage}
              />
            </div>
            
            {/* Mobile: FileInput classique */}
            <div className="lg:hidden">
              <div className="border-2 border-dashed border-neutral-black/10 rounded-lg p-6 text-center hover:border-neutral-black/20 transition-colors">
                <FileInput
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="mobile-image-input"
                />
                <label htmlFor="mobile-image-input" className="cursor-pointer">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">
                    {uploadingImage ? 'Upload en cours...' : 'Cliquez pour ajouter une image'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG ou WebP • Max 5MB
                  </p>
                </label>
              </div>
            </div>
          </>
        )}
        
        {uploadingImage && (
          <div className="mt-2 flex items-center gap-2 text-primary-blue">
            <div className="w-4 h-4 border-2 border-primary-blue border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Upload en cours...</span>
          </div>
        )}
        
        {/* Message d'erreur pour l'image */}
        {fieldErrors.image_couverture && (
          <p className="mt-2 text-xs text-primary-orange">{fieldErrors.image_couverture}</p>
        )}
      </div>

      {/* Titre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Titre de l'événement *
        </label>
        <SimpleInput
          type="text"
          value={formData.titre}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            onFormDataChange({ titre: value });
            
            // Validation en temps réel
            if (value.length === 0) {
              setFieldErrors(prev => ({ ...prev, titre: 'Le titre est obligatoire' }));
            } else if (value.length < 3) {
              setFieldErrors(prev => ({ ...prev, titre: 'Le titre doit contenir au moins 3 caractères' }));
            } else if (value.length > 100) {
              setFieldErrors(prev => ({ ...prev, titre: 'Le titre ne peut pas dépasser 100 caractères' }));
            } else {
              setFieldErrors(prev => ({ ...prev, titre: undefined }));
            }
          }}
          placeholder="Ex: Concert Gospel de Noël"
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Choisissez un titre accrocheur et descriptif
        </p>
        {fieldErrors.titre && (
          <p className="mt-2 text-xs text-primary-orange">{fieldErrors.titre}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <TextArea
          value={formData.description || ''}
          onChange={(value) => {
            onFormDataChange({ description: value });
            
            // Validation en temps réel
            if (value.length === 0) {
              setFieldErrors(prev => ({ ...prev, description: 'La description est obligatoire' }));
            } else if (value.length < 10) {
              setFieldErrors(prev => ({ ...prev, description: 'La description doit contenir au moins 10 caractères' }));
            } else if (value.length > 500) {
              setFieldErrors(prev => ({ ...prev, description: 'La description ne peut pas dépasser 500 caractères' }));
            } else {
              setFieldErrors(prev => ({ ...prev, description: undefined }));
            }
          }}
          placeholder="Décrivez votre événement de manière attractive..."
          rows={4}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.description?.length || 0}/500 caractères
        </p>
        {fieldErrors.description && (
          <p className="mt-2 text-xs text-primary-orange">{fieldErrors.description}</p>
        )}
      </div>

      {/* Catégorie */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2">
          Catégorie *
        </label>
        <Select
          options={subCategories.map((subCategory) => ({
            value: subCategory.id.toString(),
            label: subCategory.nom
          }))}
          placeholder="Sélectionnez une catégorie"
          onChange={(value) => {
            const subCategoryId = value ? parseInt(value) : 1;
            onFormDataChange({ sous_categorie_id: subCategoryId });
            
            // Validation en temps réel
            if (!value) {
              setFieldErrors(prev => ({ ...prev, sous_categorie_id: 'Veuillez sélectionner une catégorie' }));
            } else {
              setFieldErrors(prev => ({ ...prev, sous_categorie_id: undefined }));
            }
          }}
          defaultValue={formData.sous_categorie_id?.toString() || ''}
        />
        <p className="text-xs text-gray-500 mt-1">
          Choisissez la catégorie qui correspond le mieux à votre événement
        </p>
        {fieldErrors.sous_categorie_id && (
          <p className="mt-2 text-xs text-primary-orange">{fieldErrors.sous_categorie_id}</p>
        )}
      </div>



      {/* Indicateur de chargement */}
      {loading && (
        <div className="text-center py-4">
          <div className="w-6 h-6 border-2 border-primary-blue border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Chargement des catégories...</p>
        </div>
      )}
    </div>
  );
};

export default Step1BasicInfo;



