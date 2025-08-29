import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import calendarIcon from '../../assets/calendar.svg';
import locationIcon from '../../assets/location.svg';
import filterIcon from '../../assets/filter 06.svg';
import { Button } from '../ui/Button';
import { SimpleInput } from '../form';
import { Select } from '../form';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange: (filters: any) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onFiltersChange }) => {
  const [filters, setFilters] = useState({
    categories: [] as string[],
    date: '',
    location: '',
    priceRange: { min: 0, max: 500 },
    isOnline: false,
    isInPerson: false,
    isFree: false
  });

  const categories = [
    { id: 'concerts', name: 'Les Concerts', color: 'from-blue-500 to-purple-600' },
    { id: 'conferences', name: 'Les Conférences', color: 'from-orange-500 to-yellow-500' },
    { id: 'seminars', name: 'Les séminaires', color: 'from-cyan-500 to-teal-500' },
    { id: 'evangelizations', name: 'Les Evangélisations', color: 'from-red-500 to-orange-500' }
  ];

  const quickDates = [
    { id: 'today', name: 'Aujourd\'hui' },
    { id: 'tomorrow', name: 'Demain' },
    { id: 'thisWeek', name: 'Cette semaine' }
  ];

  const handleCategoryToggle = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleQuickDateSelect = (dateId: string) => {
    setFilters(prev => ({ ...prev, date: dateId }));
  };

  const handleLocationTypeToggle = (type: 'online' | 'inPerson') => {
    setFilters(prev => ({
      ...prev,
      isOnline: type === 'online' ? !prev.isOnline : prev.isOnline,
      isInPerson: type === 'inPerson' ? !prev.isInPerson : prev.isInPerson
    }));
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      date: '',
      location: '',
      priceRange: { min: 0, max: 500 },
      isOnline: false,
      isInPerson: false,
      isFree: false
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Sidebar droite */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img src={filterIcon} alt="Filtres" className="w-6 h-6" />
            <h2 className="text-xl font-semibold text-gray-900">Filtres</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto h-[calc(100vh-200px)]">

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Par Catégories</h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={filters.categories.includes(category.id) ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryToggle(category.id)}
                  className="h-12 text-sm"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Par Date</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                {quickDates.map((date) => (
                  <Button
                    key={date.id}
                    variant={filters.date === date.id ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleQuickDateSelect(date.id)}
                  >
                    {date.name}
                  </Button>
                ))}
              </div>
              <div className="relative">
                <img src={calendarIcon} alt="Calendrier" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10" />
                <SimpleInput
                  type="text"
                  placeholder="Choisir une date"
                  className="pl-12"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Par Localisation</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={filters.isOnline ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleLocationTypeToggle('online')}
                >
                  En ligne
                </Button>
                <Button
                  variant={filters.isInPerson ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleLocationTypeToggle('inPerson')}
                >
                  En présentiel
                </Button>
              </div>
              <div className="relative">
                <img src={locationIcon} alt="Localisation" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10 opacity-40" />
                <SimpleInput
                  type="text"
                  placeholder="Rechercher votre emplacement"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="pl-12"
                />
              </div>
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Par Prix</h3>
            <div className="space-y-4">
              <Button
                variant={filters.isFree ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, isFree: !prev.isFree }))}
                className="w-full"
              >
                Gratuit
              </Button>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Prix</span>
                  <span>{filters.priceRange.min}€ - {filters.priceRange.max}€</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.priceRange.min}
                    onChange={(e) => handlePriceRangeChange(parseInt(e.target.value), filters.priceRange.max)}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.priceRange.max}
                    onChange={(e) => handlePriceRangeChange(filters.priceRange.min, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <SimpleInput
                    type="number"
                    value={filters.priceRange.min}
                    onChange={(e) => handlePriceRangeChange(parseInt(e.target.value), filters.priceRange.max)}
                    className="text-center"
                    placeholder="Min"
                  />
                  <span className="flex items-center text-gray-500">-</span>
                  <SimpleInput
                    type="number"
                    value={filters.priceRange.max}
                    onChange={(e) => handlePriceRangeChange(filters.priceRange.min, parseInt(e.target.value))}
                    className="text-center"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={handleClearFilters}
              className="flex-1"
            >
              Effacer
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleApplyFilters}
              className="flex-1"
            >
              Appliquer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
