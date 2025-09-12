import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, X, AlertTriangle } from 'lucide-react';
import { useLocationAutocomplete } from '../../hooks/useLocationAutocomplete';
import type { LocationSuggestion } from '../../hooks/useLocationAutocomplete';
import { cleanAndShortenAddress, formatAddressForDisplay, isAddressValid } from '../../utils/locationUtils';

interface LocationAutocompleteProps {
  value: string;
  onChange: (location: string) => void;
  onLocationSelect?: (location: LocationSuggestion) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  role?: 'participant' | 'organisateur';
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  onLocationSelect,
  placeholder = "Commencez à taper votre ville, pays...",
  required = false,
  className = "",
  role = 'organisateur'
}) => {
  const {
    searchTerm,
    setSearchTerm,
    suggestions,
    loading,
    error,
    selectLocation,
    clearSuggestions
  } = useLocationAutocomplete();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Synchroniser avec la valeur externe
  useEffect(() => {
    if (value && !selectedLocation) {
      setSearchTerm(value);
    }
  }, [value, selectedLocation]);

  // Gérer les clics en dehors du composant
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        clearSuggestions();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearSuggestions]);

  // Gérer la sélection d'une localisation
  const handleLocationSelect = (location: LocationSuggestion) => {
    setSelectedLocation(location);
    
    // Nettoyer et raccourcir l'adresse pour la base de données
    const cleanedAddress = cleanAndShortenAddress(location.display_name);
    
    setSearchTerm(cleanedAddress);
    onChange(cleanedAddress);
    
    // Passer l'objet location avec l'adresse nettoyée
    onLocationSelect?.({
      ...location,
      display_name: cleanedAddress
    });
    
    setIsOpen(false);
    clearSuggestions();
  };

  // Gérer la saisie
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setSelectedLocation(null);
    setIsOpen(true);
  };

  // Vérifier si l'adresse actuelle est trop longue
  const isCurrentAddressTooLong = searchTerm.length > 100;
  const hasAddressWarning = isCurrentAddressTooLong && !selectedLocation;

  // Gérer la suppression
  const handleClear = () => {
    setSearchTerm('');
    onChange('');
    setSelectedLocation(null);
    setIsOpen(false);
    clearSuggestions();
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Input principal */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-10 pr-10 py-2 sm:py-3 border rounded-lg focus:ring-2 bg-white text-gray-900 text-sm sm:text-base ${
            hasAddressWarning 
              ? 'border-secondary-coral focus:ring-secondary-coral focus:border-secondary-coral'
              : role === 'participant' 
                ? 'border-gray-300 focus:ring-primary-orange focus:border-primary-orange' 
                : 'border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
          }`}
        />
        
        {/* Bouton de suppression */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Avertissement pour adresse trop longue */}
      {hasAddressWarning && (
        <div className="mt-2 flex items-center gap-2 text-secondary-coral text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>
            Adresse trop longue ({searchTerm.length}/100 caractères). 
            Veuillez sélectionner une suggestion ou raccourcir l'adresse.
          </span>
        </div>
      )}

      {/* Dropdown des suggestions */}
      {isOpen && (suggestions.length > 0 || loading || error) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {/* Loading */}
          {loading && (
            <div className="p-2 sm:p-3 text-center">
              <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin mx-auto ${
                role === 'participant' ? 'border-primary-orange' : 'border-primary-blue'
              }`} />
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Recherche en cours...</p>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="p-2 sm:p-3 text-center">
              <p className="text-xs sm:text-sm text-secondary-coral">{error}</p>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleLocationSelect(suggestion)}
                  className="w-full px-2 sm:px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {suggestion.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {cleanAndShortenAddress(suggestion.display_name)}
                      </p>
                      {suggestion.display_name.length > 100 && (
                        <p className="text-xs text-secondary-coral mt-1">
                          Sera raccourcie pour la sauvegarde
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Aucun résultat */}
          {!loading && !error && suggestions.length === 0 && searchTerm.length >= 2 && (
            <div className="p-2 sm:p-3 text-center">
              <p className="text-xs sm:text-sm text-gray-500">Aucun résultat trouvé</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 