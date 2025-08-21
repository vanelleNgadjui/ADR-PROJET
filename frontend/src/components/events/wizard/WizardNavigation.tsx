import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
  loading?: boolean;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  canProceed,
  loading = false,
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="mt-8 flex items-center justify-between">
      {/* Bouton Précédent */}
      <button
        onClick={onPrevious}
        disabled={isFirstStep || loading}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          isFirstStep || loading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
        }`}
      >
        <ChevronLeftIcon className="w-5 h-5" />
        Précédent
      </button>

      {/* Indicateur de progression */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Étape {currentStep} sur {totalSteps}
        </p>
        <p className="text-xs text-gray-500">
          {Math.round((currentStep / totalSteps) * 100)}% terminé
        </p>
      </div>

      {/* Bouton Suivant/Terminer */}
      <button
        onClick={onNext}
        disabled={!canProceed || loading}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          !canProceed || loading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Chargement...
          </>
        ) : (
          <>
            {isLastStep ? 'Terminer' : 'Suivant'}
            {!isLastStep && <ChevronRightIcon className="w-5 h-5" />}
          </>
        )}
      </button>
    </div>
  );
};

export default WizardNavigation;
