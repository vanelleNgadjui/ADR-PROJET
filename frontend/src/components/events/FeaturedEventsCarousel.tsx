import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, UsersIcon } from 'lucide-react';
import calendarIcon from '../../assets/calendar.svg';
import locationIcon from '../../assets/location.svg';

interface FeaturedEvent {
  id: number;
  titre: string;
  image_couverture: string;
  description?: string;
  date_debut?: string;
  lieu?: string;
  participants_count?: number;
  tag?: string;
}

interface FeaturedEventsCarouselProps {
  events: FeaturedEvent[];
}

const FeaturedEventsCarousel: React.FC<FeaturedEventsCarouselProps> = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Défilement automatique en boucle continue
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 6000); // Change toutes les 6 secondes (plus de temps pour lire)

    return () => clearInterval(interval);
  }, [events.length]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Gestion du swipe tactile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      {/* Container du carousel */}
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${events.length * 100}%`
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {events.map((event, index) => (
          <div
            key={event.id}
            className="relative flex-shrink-0 w-full"
          >
            <div className="mx-0">
              {/* Bannière simple - image uniquement */}
              <div className="relative overflow-hidden">
                {/* Image */}
                <img
                  src={event.image_couverture}
                  alt={event.titre}
                  className="w-full h-32 md:h-36 lg:h-40 object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicateurs simples */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
        {events.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-white shadow-sm' 
                : 'bg-white/40'
            }`}
          />
        ))}
      </div>

    </div>
  );
};

export default FeaturedEventsCarousel;
