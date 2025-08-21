import React from 'react';

interface WizardStepProps {
  stepNumber: number;
  totalSteps: number;
  children: React.ReactNode;
}

const WizardStep: React.FC<WizardStepProps> = ({ stepNumber, totalSteps, children }) => {
  const progressPercentage = Math.round((stepNumber / totalSteps) * 100);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      {/* Progressbar et informations */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Informations d'étape alignées à droite */}
        <div className="flex justify-end mt-2 space-y-1">
          <div className="text-right">
            <p className="text-xs text-gray-600">
              Étape {stepNumber} sur {totalSteps}
            </p>
            <p className="text-xs text-gray-500">
              {progressPercentage}% terminé
            </p>
          </div>
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
