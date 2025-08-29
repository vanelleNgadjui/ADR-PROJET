import React, { useState } from 'react';
import { SearchIcon, XIcon, ChevronDownIcon } from 'lucide-react';
import calendarIcon from '../../assets/calendar.svg';
import locationIcon from '../../assets/location.svg';
import { SimpleInput } from '../form';
import FilterModal from '../filters/FilterModal';

interface FilterState {
  search: string;
  location: string;
  dateRange: string;
  category: string;
  priceRange: string;
  organizer: string;
}

interface AdvancedSearchHeaderProps {
  onFiltersChange?: (filters: FilterState) => void;
  className?: string;
}

const AdvancedSearchHeader: React.FC<AdvancedSearchHeaderProps> = ({ 
  onFiltersChange, 
  className = '' 
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: '',
    dateRange: '',
    category: '',
    priceRange: '',
    organizer: '',
  });

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Mettre à jour les filtres actifs
    const newActiveFilters = Object.entries(newFilters)
      .filter(([_, val]) => val !== '')
      .map(([key, val]) => `${key}: ${val}`);
    setActiveFilters(newActiveFilters);
    
    onFiltersChange?.(newFilters);
  };

  const clearFilter = (key: keyof FilterState) => {
    const newFilters = { ...filters, [key]: '' };
    setFilters(newFilters);
    
    const newActiveFilters = Object.entries(newFilters)
      .filter(([_, val]) => val !== '')
      .map(([key, val]) => `${key}: ${val}`);
    setActiveFilters(newActiveFilters);
    
    onFiltersChange?.(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      search: '',
      location: '',
      dateRange: '',
      category: '',
      priceRange: '',
      organizer: '',
    };
    setFilters(emptyFilters);
    setActiveFilters([]);
    onFiltersChange?.(emptyFilters);
  };

  const clearSearch = () => {
    handleFilterChange('search', '');
  };

  const categories = [
    'Toutes les catégories',
    'Conférences',
    'Séminaires',
    'Ateliers',
    'Retraites',
    'Formations',
    'Événements sociaux',
    'Cérémonies',
  ];

  const dateRanges = [
    'Toutes les dates',
    'Cette semaine',
    'Ce mois',
    'Dans 3 mois',
    'Dans 6 mois',
    'Cette année',
  ];

  const priceRanges = [
    'Tous les prix',
    'Gratuit',
    'Moins de 50€',
    '50€ - 100€',
    '100€ - 200€',
    'Plus de 200€',
  ];

  return (
    <div className={`${className}`}>
      {/* Barre de recherche et filtres */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          {/* Barre de recherche - responsive */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <SearchIcon className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Rechercher un événement"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="h-10 sm:h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2 sm:py-2.5 pl-10 sm:pl-12 pr-12 sm:pr-14 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-blue dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-primary-blue"
              />
              {filters.search ? (
                <button 
                  onClick={clearSearch}
                  className="absolute right-2 sm:right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center justify-center w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              ) : (
                <button className="absolute right-2 sm:right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-1.5 sm:px-[7px] py-1 sm:py-[4.5px] text-xs text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                  <span className="hidden sm:inline"> ⌘ </span>
                  <span className="hidden sm:inline"> K </span>
                  <span className="sm:hidden">⌘K</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filtres actifs */}
        {activeFilters.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
              <span className="text-sm font-medium text-gray-700">Filtres actifs :</span>
              <button
                onClick={clearAllFilters}
                className="text-xs text-primary-blue hover:text-primary-blue/80 font-medium self-start sm:self-auto"
              >
                Tout effacer
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs bg-primary-blue/10 text-primary-blue border border-primary-blue/20"
                >
                  <span className="truncate max-w-[120px] sm:max-w-[200px]">{filter}</span>
                  <button
                    onClick={() => {
                      const [key] = filter.split(': ');
                      clearFilter(key as keyof FilterState);
                    }}
                    className="ml-1 sm:ml-2 hover:text-primary-blue/80 flex-shrink-0"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de filtres */}
      <FilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFiltersChange={(newFilters) => {
          // Convertir les filtres de la modale vers le format attendu
          const convertedFilters = {
            search: newFilters.search,
            location: newFilters.location,
            dateRange: newFilters.date,
            category: newFilters.categories.join(', '),
            priceRange: newFilters.isFree ? 'Gratuit' : `${newFilters.priceRange.min}€ - ${newFilters.priceRange.max}€`,
            organizer: ''
          };
          
          setFilters(convertedFilters);
          onFiltersChange?.(convertedFilters);
          
          // Mettre à jour les filtres actifs
          const newActiveFilters = Object.entries(convertedFilters)
            .filter(([_, val]) => val !== '' && val !== '0€ - 500€')
            .map(([key, val]) => `${key}: ${val}`);
          setActiveFilters(newActiveFilters);
        }}
      />
    </div>
  );
};

export default AdvancedSearchHeader;
