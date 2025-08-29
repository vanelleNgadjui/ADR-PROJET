import React from 'react';
import grid2Icon from '../../assets/grid 02.svg';
import listViewIcon from '../../assets/list view-rectangle.svg';

interface ViewToggleProps {
  viewMode: 'vertical2' | 'list';
  onViewModeChange: (mode: 'vertical2' | 'list') => void;
  className?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ 
  viewMode, 
  onViewModeChange, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Desktop: Grille et Ligne */}
      <div className="hidden lg:flex items-center gap-4">
        <button
          onClick={() => onViewModeChange('vertical2')}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            viewMode === 'vertical2'
              ? 'text-black bg-white border border-gray-200 px-3 py-2 rounded-lg'
              : 'text-black hover:text-gray-700'
          }`}
          title="Affichage en grille"
        >
          <img src={grid2Icon} alt="Grille" className="w-4 h-4" />
          <span>Grille</span>
        </button>
        
        <button
          onClick={() => onViewModeChange('list')}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            viewMode === 'list'
              ? 'text-black bg-white border border-gray-200 px-3 py-2 rounded-lg'
              : 'text-black hover:text-gray-700'
          }`}
          title="Affichage en ligne"
        >
          <img 
            src={listViewIcon} 
            alt="Vue ligne" 
            className={`w-4 h-4 ${
              viewMode === 'list'
                ? 'filter brightness-0' // Noir quand actif
                : 'filter brightness-0 opacity-60' // Gris quand inactif
            }`}
          />
          <span>Ligne</span>
        </button>
      </div>

      {/* Mobile: Grille et Ligne (sans labels) */}
      <div className="flex lg:hidden items-center gap-1">
        <button
          onClick={() => onViewModeChange('vertical2')}
          className={`flex items-center justify-center w-10 h-10 transition-colors ${
            viewMode === 'vertical2'
              ? 'text-black bg-white border border-gray-200 rounded-lg'
              : 'text-black hover:text-gray-700'
          }`}
          title="Affichage en grille"
        >
          <img src={grid2Icon} alt="Grille" className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onViewModeChange('list')}
          className={`flex items-center justify-center w-10 h-10 transition-colors ${
            viewMode === 'list'
              ? 'text-black bg-white border border-gray-200 rounded-lg'
              : 'text-black hover:text-gray-700'
          }`}
          title="Affichage en ligne"
        >
          <img 
            src={listViewIcon} 
            alt="Vue ligne" 
            className={`w-4 h-4 ${
              viewMode === 'list'
                ? 'filter brightness-0' // Noir quand actif
                : 'filter brightness-0 opacity-60' // Gris quand inactif
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default ViewToggle;
