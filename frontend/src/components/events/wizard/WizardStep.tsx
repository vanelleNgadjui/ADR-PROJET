import React from 'react';

interface WizardStepProps {
  stepNumber: number;
  totalSteps: number;
  children: React.ReactNode;
}

const WizardStep: React.FC<WizardStepProps> = ({ stepNumber, totalSteps, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      {/* En-tête de l'étape */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
            {stepNumber}
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Étape {stepNumber} sur {totalSteps}
          </h2>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Contenu de l'étape */}
      <div className="min-h-[400px]">
        {children}
      </div>
    </div>
  );
};

export default WizardStep;
