import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  uploadProfilePhoto, 
  deleteProfilePhoto, 
  createPreviewUrl, 
  cleanupPreviewUrl, 
  isTemporaryUrl,
  getDefaultAvatarUrl 
} from '../../utils/imageOptimization';

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoChange: (url: string) => void;
  onPhotoRemove: () => void;
  userId: string;
  userName?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  currentPhotoUrl,
  onPhotoChange,
  onPhotoRemove,
  userId,
  userName = '',
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tailles des avatars selon la prop size
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-32 sm:h-32',
    lg: 'w-32 h-32 sm:w-40 sm:h-40'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6 sm:w-8 sm:h-8',
    lg: 'w-8 h-8 sm:w-10 sm:h-10'
  };

  // Nettoyer les URLs temporaires lors du démontage
  useEffect(() => {
    return () => {
      if (previewUrl && isTemporaryUrl(previewUrl)) {
        cleanupPreviewUrl(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      // Créer une URL temporaire pour l'aperçu immédiat
      const tempUrl = createPreviewUrl(file);
      setPreviewUrl(tempUrl);
      onPhotoChange(tempUrl);

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
        onPhotoChange(result.url);
        
        // Réinitialiser après un délai
        setTimeout(() => {
          setUploadProgress(0);
          setIsUploading(false);
        }, 500);
      } else {
        setError(result.error || 'Erreur lors de l\'upload');
        // Nettoyer l'URL temporaire en cas d'erreur
        cleanupPreviewUrl(tempUrl);
        setPreviewUrl(null);
        onPhotoChange('');
        setIsUploading(false);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error('Erreur lors du traitement de l\'image:', error);
      setError('Erreur lors du traitement de l\'image');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handlePhotoRemove = async () => {
    try {
      const urlToRemove = currentPhotoUrl || previewUrl;
      
      if (urlToRemove && !isTemporaryUrl(urlToRemove)) {
        await deleteProfilePhoto(urlToRemove);
      }
      
      if (previewUrl && isTemporaryUrl(previewUrl)) {
        cleanupPreviewUrl(previewUrl);
        setPreviewUrl(null);
      }
      
      onPhotoRemove();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression de la photo');
    }
  };

  const displayUrl = previewUrl || currentPhotoUrl || getDefaultAvatarUrl(userName);
  const isGooglePhoto = currentPhotoUrl?.includes('googleusercontent.com');
  const isUploadedPhoto = currentPhotoUrl?.includes('profile-photos');

  return (
    <div className={`relative ${className}`}>
      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Zone de photo */}
      <div className="relative inline-block group">
        {/* Photo principale */}
        <div 
          className={`${sizeClasses[size]} rounded-full overflow-hidden cursor-pointer transition-all duration-200 ${
            disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
          }`}
          onClick={handleFileSelect}
        >
          {isUploading ? (
            // Indicateur de chargement
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mx-auto mb-2"></div>
                <p className="text-xs text-gray-500">{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            // Image
            <img 
              src={displayUrl} 
              alt="Photo de profil" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback vers l'avatar par défaut en cas d'erreur
                const target = e.target as HTMLImageElement;
                target.src = getDefaultAvatarUrl(userName);
              }}
            />
          )}
        </div>

        {/* Bouton de suppression */}
        {(currentPhotoUrl || previewUrl) && !isUploading && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePhotoRemove();
            }}
                          className="absolute -top-2 -right-2 bg-secondary-coral text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-secondary-coral/90 transition-all duration-200 shadow-lg hover:scale-110 z-10"
            title="Supprimer la photo"
            disabled={disabled}
          >
            <X className="w-3 h-3" />
          </button>
        )}

        {/* Overlay pour indiquer que c'est cliquable */}
        {!isUploading && !disabled && (
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <Camera className={`${iconSizes[size]} text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
          </div>
        )}

        {/* Indicateur de statut */}
        {currentPhotoUrl && (
          <div className="absolute -bottom-1 -right-1">
            {isGooglePhoto ? (
                              <div className="bg-primary-blue text-white rounded-full w-5 h-5 flex items-center justify-center">
                <CheckCircle className="w-3 h-3" />
              </div>
            ) : isUploadedPhoto ? (
                              <div className="bg-secondary-mint text-white rounded-full w-5 h-5 flex items-center justify-center">
                <Upload className="w-3 h-3" />
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Message d'erreur */}
      {error && (
                    <div className="mt-2 flex items-center gap-2 text-secondary-coral text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Informations sur les formats supportés */}
      {!currentPhotoUrl && !previewUrl && !isUploading && (
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            JPG, PNG, WebP • Max 5MB
          </p>
        </div>
      )}

      {/* Indicateur de source pour les photos Google */}
      {isGooglePhoto && (
        <div className="mt-2 text-center">
                          <div className="inline-flex items-center gap-1 bg-primary-blue/5 text-primary-blue px-2 py-1 rounded-full text-xs">
            <CheckCircle className="w-3 h-3" />
            <span>Photo Google</span>
          </div>
        </div>
      )}
    </div>
  );
};
