import React from 'react';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

const WizardProgress: React.FC<WizardProgressProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, title: 'Informations', description: 'Titre et description' },
    { number: 2, title: 'Date & Heure', description: 'Planning de l\'événement' },
    { number: 3, title: 'Lieu & Format', description: 'Où et comment' },
    { number: 4, title: 'Tarification', description: 'Billets et prix' },
    { number: 5, title: 'Enrichissement', description: 'Détails optionnels' },
    { number: 6, title: 'Validation', description: 'Finalisation' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Étape */}
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  step.number < currentStep
                    ? 'bg-green-500 text-white'
                    : step.number === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.number < currentStep ? '✓' : step.number}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-xs font-medium ${
                  step.number <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className={`text-xs ${
                  step.number <= currentStep ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>

            {/* Ligne de connexion */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4">
                <div 
                  className={`h-full transition-all duration-300 ${
                    step.number < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WizardProgress;
