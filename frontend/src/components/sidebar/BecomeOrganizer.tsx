import React, { useState } from 'react';

const BecomeOrganizer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="bg-gray-50 rounded-lg p-4 relative">
        {/* Bouton fermer */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Contenu */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Devenez organisateur
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Prenez les commandes et créez vos propres événements pour enrichir la communauté. 
            Découvrez comment faire partie des leaders inspirants de l'ADR.
          </p>
        </div>

        {/* Bouton d'action */}
        <button className="w-full bg-secondary-yellow text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary-yellow/90 transition-colors">
          Je deviens organisateur
        </button>
      </div>
    </div>
  );
};

export default BecomeOrganizer;

const BecomeOrganizer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="bg-gray-50 rounded-lg p-4 relative">
        {/* Bouton fermer */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Contenu */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Devenez organisateur
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Prenez les commandes et créez vos propres événements pour enrichir la communauté. 
            Découvrez comment faire partie des leaders inspirants de l'ADR.
          </p>
        </div>

        {/* Bouton d'action */}
        <button className="w-full bg-secondary-yellow text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary-yellow/90 transition-colors">
          Je deviens organisateur
        </button>
      </div>
    </div>
  );
};

export default BecomeOrganizer;
