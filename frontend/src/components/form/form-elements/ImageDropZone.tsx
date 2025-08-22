import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload } from 'lucide-react';

interface ImageDropZoneProps {
  onImageUpload: (file: File) => void;
  uploading?: boolean;
  className?: string;
}

const ImageDropZone: React.FC<ImageDropZoneProps> = ({
  onImageUpload,
  uploading = false,
  className = ''
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.svg']
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
        ${isDragActive 
          ? 'border-primary-blue bg-primary-blue/5' 
          : 'border-gray-300 hover:border-gray-400'
        }
        ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center">
        <div className="mb-4">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${isDragActive ? 'bg-primary-blue text-white' : 'bg-gray-100 text-gray-600'}
          `}>
            {uploading ? (
              <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isDragActive ? (
              <Upload className="w-8 h-8" />
            ) : (
              <Camera className="w-8 h-8" />
            )}
          </div>
        </div>

        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          {uploading 
            ? 'Upload en cours...' 
            : isDragActive 
              ? 'Déposez votre image ici' 
              : 'Glissez-déposez votre image'
          }
        </h4>

        <p className="text-sm text-gray-600 mb-4">
          {uploading 
            ? 'Veuillez patienter...' 
            : 'ou cliquez pour parcourir vos fichiers'
          }
        </p>

        <div className="text-xs text-gray-500">
          <p>Formats acceptés : JPG, PNG, WebP</p>
          <p>Taille maximale : 5MB</p>
        </div>
      </div>
    </div>
  );
};

export default ImageDropZone;
