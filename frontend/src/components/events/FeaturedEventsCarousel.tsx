import React, { useState, useEffect } from 'react';

interface FeaturedEvent {
  id: number;
  titre: string;
  image_couverture: string;
  categorie?: string;
  organisateur?: {
    nom: string;
    prenom: string;
  };
  lieu?: string;
  date_debut?: string;
  date_fin?: string;
}

interface FeaturedEventsCarouselProps {
  events: FeaturedEvent[];
}

const FeaturedEventsCarousel: React.FC<FeaturedEventsCarouselProps> = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (events.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [events.length]);

  if (!events || events.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative w-full overflow-hidden rounded-b-lg">
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * (100 / events.length)}%)`,
          width: `${events.length * 100}%`
        }}
      >
        {events.map((event) => (
           <div key={event.id} className="relative flex-shrink-0" style={{width: `${100 / events.length}%`}}>
             <div 
               className="rounded-b-lg p-4 h-32 md:h-36 lg:h-36 flex items-center relative bg-cover bg-center"
               style={{
                 backgroundImage: `url(${event.image_couverture})`,
               }}
             >
               {/* Overlay sombre avec flou */}
               <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-b-lg"></div>
               
               {/* Contenu au-dessus de l'overlay */}
               <div className="relative z-10 flex items-center justify-between lg:justify-center w-full px-4 lg:gap-12">
                 {/* Contenu gauche */}
                 <div className="flex flex-col justify-center gap-1 h-full w-64 flex-shrink-0">
                   {/* Groupe 1: Organisateur, Titre, Bouton */}
                   <div className="space-y-0">
                     {/* Organisateur */}
                     <div className="text-[10px] sm:text-xs text-white/90">
                       {event.organisateur ? `${event.organisateur.prenom} ${event.organisateur.nom}` : 'Organisateur'}
                     </div>
                     
                     {/* Titre */}
                     <div className="text-xs sm:text-sm font-semibold text-white line-clamp-1">
                       {event.titre}
                     </div>
                   </div>
                   
                   {/* Groupe 2: Lieu et Date */}
                   <div className="space-y-0">
                     <div className="text-[10px] sm:text-xs text-white/90">
                       {event.lieu || 'Lieu non spécifié'}
                     </div>
                     <div className="text-[10px] sm:text-xs text-white/90">
                       {event.date_debut ? formatDate(event.date_debut) : 'Date non spécifiée'}
                     </div>
                   </div>
                 </div>
                 
                 {/* Contenu droite */}
                 <div className="flex flex-col items-center justify-center h-full w-32 flex-shrink-0">
                   {/* Image avec badge */}
                   <div className="relative">
                     <div className="w-24 md:w-28 lg:w-40 h-24 md:h-28 lg:h-28 rounded-lg overflow-hidden bg-gray-200" style={{boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.2)'}}>
                       <img
                         src={event.image_couverture}
                         alt={event.titre}
                         className="w-full h-full object-cover"
                         onError={(e) => {
                           e.currentTarget.style.display = 'none';
                         }}
                       />
                     </div>
                     
                     {/* Badge sponsorisation - centre au coin bas gauche de l'image */}
                     <div className="absolute -bottom-2 -left-3 w-6 h-6 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(255, 140, 0, 0.20)'}}>
                       <svg className="w-3.5 h-3.5 text-primary-orange" fill="currentColor" viewBox="0 0 20 20">
                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                       </svg>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        ))}
      </div>
      
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
        {events.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              index === currentIndex ? 'bg-primary-orange shadow-sm' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedEventsCarousel;
