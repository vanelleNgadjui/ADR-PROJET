import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface NumberInputProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  role?: 'participant' | 'organisateur';
  className?: string;
  disabled?: boolean;
}

export default function NumberInput({ 
  value, 
  onChange, 
  min = 0,
  max = 999999,
  step = 1,
  placeholder = "",
  role = 'organisateur',
  className = "",
  disabled = false
}: NumberInputProps) {
  const focusColors = role === 'participant' 
    ? 'focus:ring-primary-orange focus:border-primary-orange' 
    : 'focus:ring-primary-blue focus:border-transparent';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Autoriser seulement les chiffres, backspace, delete, tab, escape, enter
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    const isNumber = /^[0-9]$/.test(e.key);
    
    if (!isNumber && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (newValue === '') {
      onChange(undefined);
    } else {
      const numValue = parseInt(newValue);
      if (!isNaN(numValue) && numValue >= min && numValue <= max) {
        onChange(numValue);
      }
    }
  };

  const handleIncrement = () => {
    if (disabled) return;
    const currentValue = value || min;
    const newValue = Math.min(currentValue + step, max);
    onChange(newValue);
  };

  const handleDecrement = () => {
    if (disabled) return;
    const currentValue = value || min;
    const newValue = Math.max(currentValue - step, min);
    onChange(newValue);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bouton de diminution */}
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || (value !== undefined && value <= min)}
        className={`
          absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center
          border border-r-0 border-gray-300 rounded-l-lg transition-colors z-10
          ${disabled || (value !== undefined && value <= min)
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }
        `}
        title="Diminuer"
      >
        <Minus className="w-4 h-4" />
      </button>

      {/* Input central */}
      <input
        type="text"
        inputMode="numeric"
        value={value || ''}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg text-center
          bg-white text-gray-900 placeholder-gray-400 transition-colors relative z-0
          ${focusColors}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
      />

      {/* Bouton d'augmentation */}
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || (value !== undefined && value >= max)}
        className={`
          absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center
          border border-l-0 border-gray-300 rounded-r-lg transition-colors z-10
          ${disabled || (value !== undefined && value >= max)
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }
        `}
        title="Augmenter"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
