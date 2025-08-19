import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomCalendarProps {
  value: string;
  onChange: (date: string) => void;
  role?: 'participant' | 'organisateur';
  placeholder?: string;
  className?: string;
}

export default function CustomCalendar({ 
  value, 
  onChange, 
  role = 'organisateur',
  placeholder = "",
  className = ""
}: CustomCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  // Fermer les dropdowns avec Escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowYearDropdown(false);
        setShowMonthDropdown(false);
      }
    };

    if (showYearDropdown || showMonthDropdown) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showYearDropdown, showMonthDropdown]);
  const [currentDate, setCurrentDate] = useState(() => {
    if (value) {
      return new Date(value);
    }
    // Commencer par la date d'aujourd'hui
    return new Date();
  });

  const focusColors = role === 'participant' 
    ? 'focus:ring-primary-orange focus:border-primary-orange' 
    : 'focus:ring-primary-blue focus:border-primary-blue';

  const primaryColor = role === 'participant' ? 'primary-orange' : 'primary-blue';
  const primaryColorHover = role === 'participant' ? 'hover:bg-primary-orange/10' : 'hover:bg-primary-blue/10';
  const primaryColorBg = role === 'participant' ? 'bg-primary-orange' : 'bg-primary-blue';
  const primaryColorText = role === 'participant' ? 'text-primary-orange' : 'text-primary-blue';

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = selectedDate.toISOString().split('T')[0];
    onChange(dateString);
    setIsOpen(false);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const today = new Date();
    
    // ✅ Permettre seulement les mois passés pour les dates de naissance
    if (nextMonth <= today) {
      setCurrentDate(nextMonth);
    }
  };

  const goToPreviousYear = () => {
    // Permettre d'aller jusqu'à 100 ans en arrière pour les dates de naissance
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 100;
    if (currentDate.getFullYear() > minYear) {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
    }
  };

  const goToNextYear = () => {
    // ✅ Permettre seulement les années passées pour les dates de naissance
    const currentYear = new Date().getFullYear();
    if (currentDate.getFullYear() < currentYear) {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
    }
  };



  // Générer les jours du mois
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const today = new Date();
  const selectedDate = value ? new Date(value) : null;

  const days: React.ReactElement[] = [];
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  // Ajouter les jours vides du début
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-7" />);
  }

  // Ajouter les jours du mois
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const isToday = date.toISOString().split('T')[0] === today.toISOString().split('T')[0];
    const isSelected = selectedDate && date.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];
    const isPast = date <= new Date(today.setHours(0, 0, 0, 0));

    days.push(
      <button
        key={day}
        onClick={() => isPast && handleDateSelect(day)}
        disabled={!isPast}
        className={`
          h-7 w-7 rounded text-xs font-medium transition-all duration-200
          ${!isPast 
            ? 'text-gray-300 cursor-not-allowed' 
            : `${primaryColorHover} cursor-pointer`
          }
          ${isToday 
            ? role === 'participant'
              ? 'border-2 border-primary-orange text-primary-orange'
              : 'border-2 border-primary-blue text-primary-blue'
            : 'border border-transparent'
          }
          ${isSelected 
            ? role === 'participant'
              ? 'bg-primary-orange text-white hover:bg-primary-orange'
              : 'bg-primary-blue text-white hover:bg-primary-blue'
            : 'text-gray-700 hover:text-gray-900'
          }
        `}
      >
        {day}
      </button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Input déclencheur - UNE SEULE ICÔNE */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-left transition-colors appearance-none
            ${focusColors}
            ${value ? 'text-gray-900' : 'text-gray-400'}
          `}
        >
          {value ? formatDisplayDate(value) : formatDisplayDate(new Date().toISOString().split('T')[0])}
        </button>
      </div>

      {/* Calendrier popup - Taille ultra compacte */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2">
          {/* Header avec navigation année/mois */}
          <div className="flex items-center justify-between mb-2">
                         {/* Navigation année - Dropdown personnalisé */}
             <div className="flex items-center gap-1 relative">
               <button
                 onClick={goToPreviousYear}
                 className="p-0.5 rounded hover:bg-gray-100 transition-colors"
                 title="Année précédente"
               >
                 <ChevronLeft className="h-2.5 w-2.5 text-gray-600" />
               </button>
                               <button
                  onClick={() => {
                    setShowYearDropdown(!showYearDropdown);
                    setShowMonthDropdown(false); // Fermer l'autre dropdown
                  }}
                  className={`text-sm font-medium px-2 py-1 rounded transition-colors cursor-pointer min-w-[60px] text-center ${
                    showYearDropdown 
                      ? role === 'participant' 
                        ? 'bg-primary-orange/10 text-primary-orange border border-primary-orange/20'
                        : 'bg-primary-blue/10 text-primary-blue border border-primary-blue/20'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {currentDate.getFullYear()}
                </button>
                {showYearDropdown && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto min-w-[100px]">
                    <div className="p-2">
                      {Array.from({ length: 101 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <button
                            key={year}
                            onClick={() => {
                              setCurrentDate(new Date(year, currentDate.getMonth(), 1));
                              setShowYearDropdown(false);
                            }}
                            className={`block w-full px-3 py-2.5 text-sm text-left hover:bg-gray-100 transition-colors rounded ${
                              year === currentDate.getFullYear() 
                                ? role === 'participant' 
                                  ? 'bg-primary-orange/10 text-primary-orange font-medium'
                                  : 'bg-primary-blue/10 text-primary-blue font-medium'
                                : 'text-gray-700'
                            }`}
                          >
                            {year}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
               <button
                 onClick={goToNextYear}
                 className="p-0.5 rounded hover:bg-gray-100 transition-colors"
                 title="Année suivante"
               >
                 <ChevronRight className="h-2.5 w-2.5 text-gray-600" />
               </button>
             </div>

            {/* Navigation mois - Dropdown personnalisé */}
            <div className="flex items-center gap-1 relative">
              <button
                onClick={goToPreviousMonth}
                className="p-0.5 rounded hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-2.5 w-2.5 text-gray-600" />
              </button>
              <button
                onClick={() => {
                  setShowMonthDropdown(!showMonthDropdown);
                  setShowYearDropdown(false); // Fermer l'autre dropdown
                }}
                className={`text-sm font-medium px-2 py-1 rounded transition-colors cursor-pointer min-w-[70px] text-center ${
                  showMonthDropdown 
                    ? role === 'participant' 
                      ? 'bg-primary-orange/10 text-primary-orange border border-primary-orange/20'
                      : 'bg-primary-blue/10 text-primary-blue border border-primary-blue/20'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {currentDate.toLocaleDateString('fr-FR', { month: 'long' })}
              </button>
              {showMonthDropdown && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto min-w-[100px]">
                  <div className="p-2">
                    {[
                      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
                    ].map((month, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentDate(new Date(currentDate.getFullYear(), index, 1));
                          setShowMonthDropdown(false);
                        }}
                        className={`block w-full px-3 py-2.5 text-sm text-left hover:bg-gray-100 transition-colors rounded ${
                          index === currentDate.getMonth() 
                            ? role === 'participant' 
                              ? 'bg-primary-orange/10 text-primary-orange font-medium'
                              : 'bg-primary-blue/10 text-primary-blue font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={goToNextMonth}
                className="p-0.5 rounded hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="h-2.5 w-2.5 text-gray-600" />
              </button>
            </div>
          </div>



          {/* Grille des jours */}
          <div className="grid grid-cols-7 gap-0.5 mb-2">
            {dayNames.map(day => (
              <div key={day} className="h-7 flex items-center justify-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-0.5">
            {days}
          </div>

          {/* Footer avec actions */}
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Effacer
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className={`px-3 py-1.5 rounded text-xs ${primaryColorBg} text-white hover:opacity-90 transition-opacity`}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Overlay pour fermer le calendrier */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsOpen(false);
            setShowYearDropdown(false);
            setShowMonthDropdown(false);
          }}
        />
      )}
    </div>
  );
}
