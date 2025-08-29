import React, { useState } from 'react';

interface EventCardVerticalV2Props {
  event: {
    id: number;
    titre: string;
    description?: string;
    lieu?: string;
    adresse?: string;
    date_debut: string;
    date_fin?: string;
    image_couverture?: string;
    tarification: 'gratuit' | 'payant' | 'don_libre' | 'mixte';
    capacite_max?: number;
    prix_min?: number;
  };
}

const EventCardVerticalV2: React.FC<EventCardVerticalV2Props> = ({ event }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Image */}
      <div className="relative h-32 bg-gray-200 flex-shrink-0">
        <img
          src={event.image_couverture || 'https://picsum.photos/400/300?random=1'}
          alt={event.titre}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Contenu */}
      <div className="p-2 flex-1 flex flex-col">
        {/* Titre avec bookmark - hauteur fixe pour 2 lignes */}
        <div className="flex items-start justify-between mb-1 min-h-[3rem]">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 mr-1 text-sm">
            {event.titre}
          </h3>
          <button 
            onClick={handleBookmarkClick}
            className={`transition-colors flex-shrink-0 mt-0.5 p-0.5 rounded-full hover:bg-yellow-50 ${
              isBookmarked ? 'text-yellow-500' : 'text-gray-600'
            }`}
          >
            <svg className="w-3 h-3" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Lieu, date et prix */}
        <div className="flex items-start justify-between text-sm text-gray-600">
          {/* Adresse et date à gauche */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <img src="/src/assets/location.svg" alt="Location" className="w-3 h-3 filter brightness-0 opacity-50" />
              <span className="truncate font-normal text-xs max-w-[80px]">
                {event.lieu || event.adresse || 'Lieu à définir'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <img src="/src/assets/calendar.svg" alt="Calendar" className="w-3 h-3 filter brightness-0 opacity-50" />
              <span className="font-normal text-xs">
                {new Date(event.date_debut).toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Prix à droite */}
          <div className="flex flex-col items-center text-center gap-0">
            <span className="text-[10px] text-gray-500 text-center whitespace-nowrap -mb-0.5">À partir de</span>
            <span className="text-sm font-medium text-gray-900 text-center">
              {event.tarification === 'gratuit' ? 'Gratuit' : 
               event.prix_min ? `${event.prix_min}€` : 'Prix à définir'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCardVerticalV2;
