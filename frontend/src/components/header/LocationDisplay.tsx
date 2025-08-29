import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import locationIcon from '../../assets/location.svg';
import downArrowIcon from '../../assets/down-arrow.svg';

interface LocationDisplayProps {
  className?: string;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ 
  className = '' 
}) => {
  const { user } = useAuth();

  // Récupérer la localisation depuis les métadonnées Supabase
  const location = user?.user_metadata?.location;
  
  // Parser la localisation pour extraire ville et pays
  const parseLocation = (locationString: string) => {
    if (!locationString) return { city: null, country: null };
    
    const parts = locationString.split(', ');
    if (parts.length >= 2) {
      return {
        city: parts[0].trim(),
        country: parts[parts.length - 1].trim()
      };
    } else if (parts.length === 1) {
      return {
        city: parts[0].trim(),
        country: null
      };
    }
    
    return { city: null, country: null };
  };

  const { city, country } = parseLocation(location || '');
  const displayCity = city || 'Inconnu';

  return (
    <div className={`flex flex-col gap-0 ${className}`}>
      {/* Ligne du haut : icône + "Localisation" */}
      <div className="flex items-center gap-1">
        <img src={locationIcon} alt="Localisation" className="w-3 h-3 text-gray-500" />
        <span className="text-xs font-normal text-gray-500">
          Localisation
        </span>
      </div>
      
      {/* Ligne du bas : ville + icône arrow alignée à droite */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 pl-4">
          {displayCity}
        </span>
        <img src={downArrowIcon} alt="Sélectionner" className="w-3 h-3 text-gray-400" />
      </div>
    </div>
  );
};

export default LocationDisplay;
