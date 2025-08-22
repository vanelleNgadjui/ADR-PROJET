import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/Button';

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
      <Button
        onClick={onPrevious}
        disabled={isFirstStep || loading}
        variant="outline"
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-5 h-5" />
        Précédent
      </Button>



      {/* Bouton Suivant/Terminer */}
      <Button
        onClick={onNext}
        disabled={!canProceed || loading}
        variant={isLastStep ? "primary" : "ghost"}
        className="flex items-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Chargement...
          </>
        ) : (
          <>
            {isLastStep ? 'Terminer' : 'Suivant'}
            {!isLastStep && <ChevronRight className="w-5 h-5" />}
          </>
        )}
      </Button>
    </div>
  );
};

export default WizardNavigation;
