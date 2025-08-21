import React from 'react';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  isExpanded?: boolean;
  onToggleSidebar?: () => void; // Function to toggle sidebar
}

const WizardProgress: React.FC<WizardProgressProps> = ({ currentStep, totalSteps, isExpanded = true, onToggleSidebar }) => {
  const steps = [
    { 
      number: 1, 
      title: 'Informations fondamentales', 
      description: 'Titre, description, image de couverture et catégorie de votre événement' 
    },
    { 
      number: 2, 
      title: 'Date & Heure', 
      description: 'Définissez le planning, la durée et la capacité maximale de participants' 
    },
    { 
      number: 3, 
      title: 'Lieu & Format', 
      description: 'Choisissez entre présentiel, virtuel ou hybride et précisez l\'adresse ou le lien' 
    },
    { 
      number: 4, 
      title: 'Tarification & Billets', 
      description: 'Configurez la tarification (gratuit, payant, don libre) et créez vos billets' 
    },
    { 
      number: 5, 
      title: 'Enrichissement', 
      description: 'Ajoutez programme détaillé, intervenants, mots-clés et autres détails optionnels' 
    },
    { 
      number: 6, 
      title: 'Validation & Publication', 
      description: 'Vérifiez toutes les informations et publiez votre événement' 
    },
  ];

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm transition-all duration-300 bg-cover bg-center bg-no-repeat ${
        isExpanded ? 'p-6' : 'p-2 cursor-pointer'
      }`}
      style={{ backgroundImage: 'url(/src/assets/ADR-BG.png)' }}
      onClick={!isExpanded ? onToggleSidebar : undefined}
    >
      <div className={`transition-all duration-300 ${
        isExpanded ? 'space-y-6' : 'space-y-4'
      }`}>
        {steps.map((step, index) => (
          <div key={step.number} className={`flex items-start transition-all duration-300 ${
            isExpanded ? 'space-x-4' : 'justify-center'
          }`}>
            {/* Colonne gauche : Chiffres et traits */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div 
                className={`rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  isExpanded ? 'w-10 h-10 text-sm' : 'w-6 h-6 text-xs'
                } ${
                  step.number < currentStep
                    ? 'bg-green-500 text-white'
                    : step.number === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.number < currentStep ? '✓' : step.number}
              </div>
              
              {/* Ligne de connexion verticale */}
              {index < steps.length - 1 && (
                <div className="w-0.5 h-12 mt-2">
                  <div 
                    className={`w-full h-full transition-all duration-300 ${
                      step.number < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </div>

                               {/* Colonne droite : Labels et descriptions - cachés si pas expanded */}
                   {isExpanded && (
                     <div className="flex-1 min-w-0">
                       <p className={`text-sm font-semibold mb-1 text-left ${
                         step.number <= currentStep ? 'text-gray-900' : 'text-gray-500'
                       }`}>
                         {step.title}
                       </p>
                       <p className={`text-xs leading-relaxed text-left ${
                         step.number <= currentStep ? 'text-gray-600' : 'text-gray-400'
                       }`}>
                         {step.description}
                       </p>
                     </div>
                   )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WizardProgress;
