import { supabase, PROFILE_PHOTOS_BUCKET, MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES, OPTIMAL_IMAGE_SIZE } from '../lib/supabaseClient';

export interface ImageOptimizationResult {
  success: boolean;
  url?: string;
  error?: string;
  optimizedFile?: File;
}

/**
 * Valide un fichier image selon les critères définis
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Vérifier le type de fichier
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Type de fichier non supporté. Formats acceptés : ${ALLOWED_IMAGE_TYPES.join(', ')}`
    };
  }

  // Vérifier la taille
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Fichier trop volumineux. Taille maximale : ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB`
    };
  }

  return { valid: true };
};

/**
 * Compresse et redimensionne une image
 */
export const optimizeImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculer les nouvelles dimensions en conservant le ratio
      const { width: targetWidth, height: targetHeight } = OPTIMAL_IMAGE_SIZE;
      const ratio = Math.min(targetWidth / img.width, targetHeight / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;

      // Configurer le canvas
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Dessiner l'image redimensionnée
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);

      // Convertir en blob avec compression
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const optimizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(optimizedFile);
          } else {
            reject(new Error('Erreur lors de l\'optimisation de l\'image'));
          }
        },
        file.type,
        0.8 // Qualité de compression (80%)
      );
    };

    img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Upload une image optimisée vers Supabase Storage
 */
export const uploadProfilePhoto = async (file: File, userId: string): Promise<ImageOptimizationResult> => {
  try {
    // Valider le fichier
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Optimiser l'image
    const optimizedFile = await optimizeImage(file);

    // Générer un nom de fichier unique
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExtension}`;
    const filePath = `${userId}/${fileName}`;

    // Upload vers Supabase Storage
    const { error } = await supabase.storage
      .from(PROFILE_PHOTOS_BUCKET)
      .upload(filePath, optimizedFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Erreur upload:', error);
      return { success: false, error: 'Erreur lors de l\'upload de l\'image' };
    }

    // Générer l'URL publique
    const { data: urlData } = supabase.storage
      .from(PROFILE_PHOTOS_BUCKET)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl,
      optimizedFile
    };

  } catch (error) {
    console.error('Erreur upload profile photo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

/**
 * Supprime une photo de profil du storage
 */
export const deleteProfilePhoto = async (fileUrl: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Extraire le chemin du fichier depuis l'URL
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(-2).join('/'); // userId/filename

    const { error } = await supabase.storage
      .from(PROFILE_PHOTOS_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Erreur suppression:', error);
      return { success: false, error: 'Erreur lors de la suppression' };
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur delete profile photo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

/**
 * Génère une URL d'aperçu temporaire pour une image
 */
export const createPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Nettoie les URLs temporaires
 */
export const cleanupPreviewUrl = (url: string): void => {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Vérifie si une URL est une URL temporaire
 */
export const isTemporaryUrl = (url: string): boolean => {
  return url.startsWith('blob:') || url.startsWith('data:');
};

/**
 * Image par défaut pour les utilisateurs sans photo
 */
export const getDefaultAvatarUrl = (name: string): string => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
  const color = colors[name.length % colors.length];

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${color.slice(1)}&color=fff&size=200&bold=true`;
};
