import React, { useState } from 'react';
import FollowButton from '../ui/FollowButton';
import Badge from '../ui/Badge';

interface EventCardHorizontalProps {
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

const EventCardHorizontal: React.FC<EventCardHorizontalProps> = ({ event, onFollowToggle }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow h-32 flex">
      {/* Image */}
      <div className="relative w-24 h-full bg-gray-200 flex-shrink-0">
        <img
          src={event.image_couverture || 'https://picsum.photos/100/100?random=1'}
          alt={event.titre}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Contenu */}
      <div className="flex-1 p-2 flex flex-col justify-between h-full">
        {/* Titre et participants */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-1 min-h-[3rem]">
            <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm flex-1 mr-1">
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
          
          {/* Participants (remplace l'organisateur) */}
          <div className="flex items-center gap-1 mb-1">
            {event.participants_count >= 5 ? (
              <>
                <div className="flex -space-x-1 mr-1">
                  {event.participants_avatars.slice(0, 3).map((avatar, index) => (
                    <div 
                      key={index}
                      className="w-3 h-3 rounded-full overflow-hidden border border-white"
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
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  +{event.participants_count} participent
                </span>
              </>
            ) : (
              <span className="text-xs text-green-600 font-medium whitespace-nowrap">
                Nouveau
              </span>
            )}
          </div>
        </div>

        {/* Informations de base */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          {/* Lieu et date */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <img src="/src/assets/location.svg" alt="Location" className="w-3 h-3 filter brightness-0 opacity-50" />
              <span className="truncate font-normal max-w-[60px]">{event.lieu || event.adresse || 'Lieu à définir'}</span>
            </div>
            <div className="flex items-center gap-1">
              <img src="/src/assets/calendar.svg" alt="Calendar" className="w-3 h-3 filter brightness-0 opacity-50" />
              <span className="font-normal">{new Date(event.date_debut).toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'short',
                year: 'numeric'
              })}</span>
            </div>
          </div>

          {/* Prix */}
          <div className="flex flex-col items-end text-center">
            <span className="text-[10px] text-gray-500 text-center whitespace-nowrap">À partir de</span>
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

export default EventCardHorizontal;
