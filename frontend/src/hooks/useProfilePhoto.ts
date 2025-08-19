import { useState, useEffect, useCallback } from 'react';
import { 
  uploadProfilePhoto, 
  deleteProfilePhoto, 
  createPreviewUrl, 
  cleanupPreviewUrl, 
  isTemporaryUrl,
  getDefaultAvatarUrl 
} from '../utils/imageOptimization';

interface UseProfilePhotoOptions {
  userId: string;
  userName?: string;
  initialPhotoUrl?: string;
}

interface UseProfilePhotoReturn {
  photoUrl: string;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  uploadPhoto: (file: File) => Promise<boolean>;
  removePhoto: () => Promise<void>;
  clearError: () => void;
  getOptimizedUrl: (url?: string) => string;
}

export const useProfilePhoto = ({
  userId,
  userName = '',
  initialPhotoUrl = ''
}: UseProfilePhotoOptions): UseProfilePhotoReturn => {
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Mettre à jour l'URL de la photo quand initialPhotoUrl change
  useEffect(() => {
    setPhotoUrl(initialPhotoUrl);
  }, [initialPhotoUrl]);

  // Nettoyer les URLs temporaires lors du démontage
  useEffect(() => {
    return () => {
      if (previewUrl && isTemporaryUrl(previewUrl)) {
        cleanupPreviewUrl(previewUrl);
      }
    };
  }, [previewUrl]);

  const uploadPhoto = useCallback(async (file: File): Promise<boolean> => {
    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      // Créer une URL temporaire pour l'aperçu immédiat
      const tempUrl = createPreviewUrl(file);
      setPreviewUrl(tempUrl);
      setPhotoUrl(tempUrl);

      // Simuler le progrès
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload et optimisation
      const result = await uploadProfilePhoto(file, userId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.url) {
        // Nettoyer l'URL temporaire
        cleanupPreviewUrl(tempUrl);
        setPreviewUrl(null);
        
        // Mettre à jour avec l'URL optimisée
        setPhotoUrl(result.url);
        
        // Réinitialiser après un délai
        setTimeout(() => {
          setUploadProgress(0);
          setIsUploading(false);
        }, 500);

        return true;
      } else {
        setError(result.error || 'Erreur lors de l\'upload');
        // Nettoyer l'URL temporaire en cas d'erreur
        cleanupPreviewUrl(tempUrl);
        setPreviewUrl(null);
        setPhotoUrl('');
        setIsUploading(false);
        setUploadProgress(0);
        return false;
      }
    } catch (error) {
      console.error('Erreur lors du traitement de l\'image:', error);
      setError('Erreur lors du traitement de l\'image');
      setIsUploading(false);
      setUploadProgress(0);
      return false;
    }
  }, [userId]);

  const removePhoto = useCallback(async (): Promise<void> => {
    try {
      const urlToRemove = photoUrl || previewUrl;
      
      if (urlToRemove && !isTemporaryUrl(urlToRemove)) {
        await deleteProfilePhoto(urlToRemove);
      }
      
      if (previewUrl && isTemporaryUrl(previewUrl)) {
        cleanupPreviewUrl(previewUrl);
        setPreviewUrl(null);
      }
      
      setPhotoUrl('');
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression de la photo');
    }
  }, [photoUrl, previewUrl]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getOptimizedUrl = useCallback((url?: string): string => {
    const targetUrl = url || photoUrl;
    
    if (!targetUrl) {
      return getDefaultAvatarUrl(userName);
    }

    // Si c'est une URL de notre bucket, ajouter des paramètres d'optimisation
    if (targetUrl.includes('profile-photos')) {
      return `${targetUrl}?width=400&height=400&quality=80`;
    }

    // Pour les URLs Google, les retourner telles quelles
    if (targetUrl.includes('googleusercontent.com')) {
      return targetUrl;
    }

    // Pour les autres URLs, les retourner telles quelles
    return targetUrl;
  }, [photoUrl, userName]);

  return {
    photoUrl,
    isUploading,
    uploadProgress,
    error,
    uploadPhoto,
    removePhoto,
    clearError,
    getOptimizedUrl
  };
};
