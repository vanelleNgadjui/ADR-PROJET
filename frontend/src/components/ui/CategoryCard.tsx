import React from 'react';

interface CategoryCardProps {
  title: string;
  cardNumber?: 1 | 2 | 3 | 4; // Pour choisir quelle carte SVG utiliser
  onClick?: () => void;
  className?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  title, 
  cardNumber = 1, 
  onClick, 
  className = '' 
}) => {
  // Import dynamique des images SVG Card-edit
  const getCardImage = (number: number) => {
    switch (number) {
      case 1:
        return '/src/assets/Card-edit-1.svg';
      case 2:
        return '/src/assets/Card-edit-2.svg';
      case 3:
        return '/src/assets/Card-edit-3.svg';
      case 4:
        return '/src/assets/Card-edit-4.svg';
      default:
        return '/src/assets/Card-edit-1.svg';
    }
  };

  return (
    <div 
      className={`relative w-[110px] h-[110px] sm:w-28 sm:h-28 md:w-32 md:h-32 lg:h-40 lg:w-40 cursor-pointer transition-transform hover:scale-105 flex-none ${className}`} 
      onClick={onClick}
    >
      {/* Image SVG de la carte (arrière-plan uniquement) */}
      <img
        src={getCardImage(cardNumber)}
        alt={`Carte ${cardNumber}`}
        className="w-full h-full object-cover rounded-lg"
      />
      
      {/* Nom de la catégorie superposé en bas */}
      <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3">
        <h3 className="text-white font-medium text-[10px] sm:text-xs leading-tight px-2 py-1 w-24 sm:w-28 md:w-32 lg:w-36" style={{textShadow: window.innerWidth >= 1024 ? 'inset 0.5px 0.5px 1px rgba(0,0,0,0.2), 0.5px 0.5px 0.5px rgba(255,255,255,0.05)' : 'inset 1px 1px 2px rgba(0,0,0,0.3), 1px 1px 1px rgba(255,255,255,0.1)'}}>
          {title.includes(' &') ? (
            <>
              {title.split(' &')[0]}
              <br />
              &{title.split(' &')[1]}
            </>
          ) : (
            title
          )}
        </h3>
      </div>
    </div>
  );
};

export default CategoryCard;
