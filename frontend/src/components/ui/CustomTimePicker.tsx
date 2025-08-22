import React, { useState, useRef, useEffect } from 'react';
import { Clock as ClockIcon, X } from 'lucide-react';

interface CustomTimePickerProps {
  value: string;
  onChange: (time: string) => void;
  role?: 'participant' | 'organisateur';
  placeholder?: string;
  className?: string;
}

export default function CustomTimePicker({ 
  value, 
  onChange, 
  role = 'organisateur',
  placeholder = "",
  className = ""
}: CustomTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [manualInputValue, setManualInputValue] = useState(value);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  // Extraire les heures et minutes de la valeur actuelle
  const getHoursFromValue = () => {
    if (!value || !value.includes(':')) return '';
    return value.split(':')[0];
  };

  const getMinutesFromValue = () => {
    if (!value || !value.includes(':')) return '';
    return value.split(':')[1];
  };

  // Fermer avec Escape et clic à l'extérieur
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current && 
        !popupRef.current.contains(e.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const focusColors = role === 'participant' 
    ? 'focus:outline-none focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange' 
    : 'focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent';

  const primaryColorBg = role === 'participant' ? 'bg-primary-orange' : 'bg-primary-blue';

  const formatDisplayTime = (timeString: string) => {
    if (!timeString) return '';
    
    // Si pas de ":", c'est une valeur partielle
    if (!timeString.includes(':')) {
      return timeString;
    }
    
    const [hours, minutes] = timeString.split(':');
    
    // Gérer les cas où hours ou minutes sont undefined
    if (!hours || !minutes) {
      return timeString;
    }
    
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleTimeSelect = (time: string) => {
    onChange(time);
    setIsOpen(false);
  };

  // Heures courantes pour les événements
  const commonTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Input déclencheur */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ClockIcon className="h-5 w-5 text-gray-400" />
        </div>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full pl-10 pr-4 py-3 border rounded-lg bg-white text-left transition-colors appearance-none text-base
            ${isOpen 
              ? 'border-primary-blue ring-2 ring-primary-blue/20' 
              : 'border-gray-300'
            }
            ${focusColors}
            ${value ? 'text-gray-900' : 'text-gray-400'}
          `}
        >
          {value ? formatDisplayTime(value) : formatDisplayTime(getCurrentTime())}
        </button>
      </div>

      {/* Time picker popup - Simple et clair */}
      {isOpen && (
        <div 
          ref={popupRef}
          className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            // Bloquer seulement les événements qui ne viennent pas d'un input
            const target = e.target as HTMLElement;
            if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-700">Sélectionner une heure</div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              title="Fermer"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          {/* Grille d'heures courantes */}
          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {commonTimes.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`
                  py-2 px-3 text-sm rounded-lg transition-colors text-center
                  ${value === time 
                    ? `${primaryColorBg} text-white` 
                    : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }
                `}
              >
                {formatDisplayTime(time)}
              </button>
            ))}
          </div>

          {/* Input manuel */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
              <label className="block text-xs text-gray-600 mb-1">Ou saisir manuellement :</label>
              <div className="flex items-center justify-between w-full">
                <input
                  id="hours-input"
                  type="text"
                  placeholder="14"
                  maxLength={2}
                  defaultValue={getHoursFromValue()}
                  className="w-[45%] px-2 py-2 border border-gray-300 rounded-lg text-base text-center focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  onKeyDown={(e) => {
                    console.log('🕐 Hours - Key pressed:', e.key, 'Key code:', e.keyCode);
                    
                    // Permettre seulement les chiffres et navigation
                    if (/^[0-9]$/.test(e.key) || e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                      console.log('✅ Hours - Allowing key:', e.key);
                      return;
                    }
                    
                    // Navigation vers le champ minutes
                    if (e.key === 'ArrowRight' || e.key === ':') {
                      console.log('➡️ Hours - Navigating to minutes');
                      e.preventDefault();
                      document.getElementById('minutes-input')?.focus();
                      return;
                    }
                    
                    // Fermer le popup
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      console.log('🚪 Hours - Closing popup');
                      e.preventDefault();
                      e.stopPropagation();
                      setIsOpen(false);
                      return;
                    }
                    
                    // Bloquer tout le reste
                    console.log('❌ Hours - Blocking key:', e.key);
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onChange={(e) => {
                    const originalValue = e.target.value;
                    let hours = e.target.value.replace(/\D/g, '');
                    
                    console.log('🕐 Hours - Input changed:', { original: originalValue, cleaned: hours });
                    
                    // Validation : 0-23
                    const hoursNum = parseInt(hours);
                    if (hoursNum > 23) {
                      console.log('⚠️ Hours - Value too high, setting to 23');
                      hours = '23';
                      e.target.value = '23';
                    }
                    
                    // Auto-navigation vers minutes après 2 chiffres
                    if (hours.length === 2) {
                      console.log('➡️ Hours - Auto-navigating to minutes');
                      document.getElementById('minutes-input')?.focus();
                    }
                    
                    // Mettre à jour la valeur complète
                    const minutesInput = document.getElementById('minutes-input') as HTMLInputElement;
                    const minutes = minutesInput?.value || '';
                    const newValue = hours && minutes ? `${hours}:${minutes}` : hours;
                    console.log('🔄 Hours - Final value:', { hours, minutes, newValue });
                    onChange(newValue);
                    
                    // Log de la valeur finale affichée dans le bouton principal
                    setTimeout(() => {
                      const buttonText = buttonRef.current?.textContent;
                      console.log('🎯 Hours - Button display value:', buttonText);
                    }, 0);
                  }}
                />
                <span className="text-gray-400 text-lg mx-2">:</span>
                <input
                  id="minutes-input"
                  type="text"
                  placeholder="30"
                  maxLength={2}
                  defaultValue={getMinutesFromValue()}
                  className="w-[45%] px-2 py-2 border border-gray-300 rounded-lg text-base text-center focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  onKeyDown={(e) => {
                    console.log('🕐 Minutes - Key pressed:', e.key, 'Key code:', e.keyCode);
                    
                    // Permettre seulement les chiffres et navigation
                    if (/^[0-9]$/.test(e.key) || e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                      console.log('✅ Minutes - Allowing key:', e.key);
                      return;
                    }
                    
                    // Navigation vers le champ heures
                    if (e.key === 'ArrowLeft') {
                      console.log('⬅️ Minutes - Navigating to hours');
                      e.preventDefault();
                      document.getElementById('hours-input')?.focus();
                      return;
                    }
                    
                    // Fermer le popup
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      console.log('🚪 Minutes - Closing popup');
                      e.preventDefault();
                      e.stopPropagation();
                      setIsOpen(false);
                      return;
                    }
                    
                    // Bloquer tout le reste
                    console.log('❌ Minutes - Blocking key:', e.key);
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onChange={(e) => {
                    const originalValue = e.target.value;
                    let minutes = e.target.value.replace(/\D/g, '');
                    
                    console.log('🕐 Minutes - Input changed:', { original: originalValue, cleaned: minutes });
                    
                    // Validation : 0-59
                    const minutesNum = parseInt(minutes);
                    if (minutesNum > 59) {
                      console.log('⚠️ Minutes - Value too high, setting to 59');
                      minutes = '59';
                      e.target.value = '59';
                    }
                    
                    // Mettre à jour la valeur complète
                    const hoursInput = document.getElementById('hours-input') as HTMLInputElement;
                    const hours = hoursInput?.value || '';
                    const newValue = hours && minutes ? `${hours}:${minutes}` : '';
                    console.log('🔄 Minutes - Final value:', { hours, minutes, newValue });
                    onChange(newValue);
                    
                    // Log de la valeur finale affichée dans le bouton principal
                    setTimeout(() => {
                      const buttonText = buttonRef.current?.textContent;
                      console.log('🎯 Minutes - Button display value:', buttonText);
                    }, 0);
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Format : 24h (ex: 14:30). Utilisez Tab ou les flèches pour naviguer.</p>
            </div>
        </div>
      )}
    </div>
  );
}
