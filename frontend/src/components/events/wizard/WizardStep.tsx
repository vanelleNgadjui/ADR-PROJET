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
            className="bg-primary-blue h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Informations d'étape : étape à gauche, pourcentage à droite */}
        <div className="flex justify-between items-center mt-2">
          <div className="text-left">
            <p className="text-xs text-gray-600">
              Étape {stepNumber} sur {totalSteps}
            </p>
          </div>
          <div className="text-right">
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
