import React, { useState } from 'react';
import { X } from 'lucide-react';
import SimpleInput from './SimpleInput';
import { Button } from '../../ui/Button';

interface KeywordInputProps {
  value: string[];
  onChange: (keywords: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

const KeywordInput: React.FC<KeywordInputProps> = ({
  value = [],
  onChange,
  placeholder = "Ajouter un mot-clé",
  label = "Mots-clés",
  className = "",
}) => {
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddKeyword = () => {
    const trimmedKeyword = newKeyword.trim();
    if (trimmedKeyword && !value.includes(trimmedKeyword)) {
      onChange([...value, trimmedKeyword]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    onChange(value.filter(keyword => keyword !== keywordToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 min-w-0">
            <SimpleInput
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
            />
          </div>
          <Button
            onClick={handleAddKeyword}
            variant="ghost"
            size="sm"
            disabled={!newKeyword.trim()}
            className="whitespace-nowrap flex-shrink-0"
          >
            Ajouter
          </Button>
        </div>

        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-blue/10 text-primary-blue rounded-full text-sm"
              >
                {keyword}
                <Button
                  onClick={() => handleRemoveKeyword(keyword)}
                  variant="ghost"
                  size="sm"
                  className="text-primary-blue hover:text-primary-blue p-0 h-auto"
                >
                  <X className="w-3 h-3" />
                </Button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-500 mt-1">
        Ajoutez des mots-clés pour améliorer la visibilité de votre événement
      </p>
    </div>
  );
};

export default KeywordInput;
