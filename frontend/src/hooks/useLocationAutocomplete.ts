import { useState, useEffect, useCallback } from 'react';

export interface LocationSuggestion {
  id: string;
  name: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  country: string;
}

export const useLocationAutocomplete = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour rechercher les suggestions
  const searchLocations = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
              // API OpenStreetMap Nominatim (gratuite, pas de clé requise)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(query)}&` +
          `format=json&` +
          `limit=8&` + // Augmenté pour plus de résultats
          `addressdetails=1&` +
          `accept-language=fr,en` // Support français et anglais
        );

      if (!response.ok) {
        throw new Error('Erreur réseau');
      }

      const data = await response.json();
      
      // Formater les suggestions
      const formattedSuggestions: LocationSuggestion[] = data.map((item: any, index: number) => {
        const name = item.name || item.display_name.split(',')[0];
        const country = item.address?.country || '';
        
        return {
          id: `${item.place_id}_${index}`,
          name: name,
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
          type: item.type,
          country: country
        };
      });

      setSuggestions(formattedSuggestions);
    } catch (err) {
      console.error('Erreur autocomplétion:', err);
      setError('Erreur lors de la recherche');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce pour éviter trop de requêtes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocations(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchLocations]);

  // Fonction pour sélectionner une localisation
  const selectLocation = (location: LocationSuggestion) => {
    setSearchTerm(location.display_name);
    setSuggestions([]);
    return location;
  };

  // Fonction pour effacer les suggestions
  const clearSuggestions = () => {
    setSuggestions([]);
    setError(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    suggestions,
    loading,
    error,
    selectLocation,
    clearSuggestions
  };
}; 