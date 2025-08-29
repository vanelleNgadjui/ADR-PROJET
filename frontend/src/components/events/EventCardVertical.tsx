import React, { useState } from 'react';
import FollowButton from '../ui/FollowButton';
import Badge from '../ui/Badge';

interface EventCardVerticalProps {
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
    organisateur: {
      id: string;
      nom: string;
      prenom: string;
      avatar_url?: string;
      role: string;
    };
    participants_count: number;
    participants_avatars: string[];
    prix_min?: number;
  };
  onFollowToggle?: (organizerId: string, isFollowing: boolean) => void;
}

const EventCardVertical: React.FC<EventCardVerticalProps> = ({ event, onFollowToggle }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 flex-shrink-0">
        <img
          src={event.image_couverture || 'https://picsum.photos/400/300?random=1'}
          alt={event.titre}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Contenu */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Organisateur et Participants - AVANT le titre */}
        <div className="flex items-center justify-between mb-2 gap-2">
          {/* Organisateur */}
          <div className="flex items-center flex-1 min-w-0">
            <div className="w-6 h-6 bg-gray-300 rounded-full mr-2 flex-shrink-0 overflow-hidden">
              <img 
                src={event.organisateur.avatar_url || 'https://picsum.photos/40/40?random=1'} 
                alt={`${event.organisateur.prenom} ${event.organisateur.nom}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1 justify-center">
              <span className="text-[10px] font-medium text-gray-900 truncate">
                {event.organisateur.prenom} {event.organisateur.nom}
              </span>
              <button
                onClick={() => onFollowToggle?.(event.organisateur.id, false)}
                className="text-[8px] px-2 py-0.5 bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-md transition-colors cursor-pointer w-fit"
              >
                Suivre
              </button>
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center flex-shrink-0">
            {event.participants_count >= 5 ? (
              <>
                <div className="flex -space-x-1 mr-1">
                  {event.participants_avatars.slice(0, 3).map((avatar, index) => (
                    <div 
                      key={index}
                      className="w-4 h-4 rounded-full overflow-hidden border border-white"
                    >
                      <img 
                        src={avatar} 
                        alt={`Participant ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback si l'image ne charge pas
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="w-full h-full bg-gray-300 hidden"></div>
                    </div>
                  ))}
                </div>
                <span className="text-[9px] text-gray-500 whitespace-nowrap">
                  +{event.participants_count} participent
                </span>
              </>
            ) : (
              <span className="text-[9px] text-green-600 font-medium whitespace-nowrap">
                Nouveau
              </span>
            )}
          </div>
        </div>

        {/* Titre avec bookmark - hauteur fixe pour 2 lignes */}
        <div className="flex items-start justify-between mb-1 min-h-[3rem]">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
            {event.titre}
          </h3>
          <button 
            onClick={handleBookmarkClick}
            className={`transition-colors flex-shrink-0 mt-0.5 p-1 rounded-full hover:bg-yellow-50 ${
              isBookmarked ? 'text-yellow-500' : 'text-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Lieu, date et prix */}
        <div className="flex items-start justify-between text-sm text-gray-600 mb-3">
          {/* Adresse et date à gauche */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <img src="/src/assets/location.svg" alt="Location" className="w-3 h-3 filter brightness-0 opacity-50" />
              <span className="truncate font-normal text-xs">{event.lieu || event.adresse || 'Lieu à définir'}</span>
            </div>
            <div className="flex items-center gap-1">
              <img src="/src/assets/calendar.svg" alt="Calendar" className="w-3 h-3 filter brightness-0 opacity-50" />
              <span className="font-normal text-xs">{new Date(event.date_debut).toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'short',
                year: 'numeric'
              })}</span>
            </div>
          </div>

          {/* Prix à droite */}
          <div className="flex flex-col items-center text-center gap-0">
            <span className="text-[8px] text-gray-500 text-center whitespace-nowrap -mb-1">À partir de</span>
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

export default EventCardVertical;
