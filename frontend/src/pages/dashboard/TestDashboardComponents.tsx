import React from 'react';
import { Button } from '../../components/dashboard/ui';
import { PlusIcon, ArrowRightIcon, UserIcon } from 'lucide-react';

const TestDashboardComponents: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test des Composants Dashboard
        </h1>

        {/* Section Button */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Composant Button</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Variants */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Variants</h3>
              <div className="space-y-3">
                <Button variant="primary" onClick={() => console.log('Primary clicked')}>
                  Primary (Organisateur)
                </Button>
                <Button variant="secondary" onClick={() => console.log('Secondary clicked')}>
                  Secondary (Participant)
                </Button>
                <Button variant="outline" onClick={() => console.log('Outline clicked')}>
                  Outline
                </Button>
                <Button variant="ghost" onClick={() => console.log('Ghost clicked')}>
                  Ghost
                </Button>
              </div>
            </div>

            {/* Tailles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Tailles</h3>
              <div className="space-y-3">
                <Button size="sm" variant="primary">
                  Small
                </Button>
                <Button size="md" variant="primary">
                  Medium (default)
                </Button>
                <Button size="lg" variant="primary">
                  Large
                </Button>
              </div>
            </div>

            {/* États */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">États</h3>
              <div className="space-y-3">
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button variant="primary" loading>
                  Loading
                </Button>
                <Button variant="primary" startIcon={<PlusIcon className="w-4 h-4" />}>
                  Avec icône gauche
                </Button>
                <Button variant="primary" endIcon={<ArrowRightIcon className="w-4 h-4" />}>
                  Avec icône droite
                </Button>
              </div>
            </div>
          </div>

          {/* Exemples d'usage */}
          <div className="mt-8 p-6 bg-white rounded-lg shadow-card">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Exemples d'usage</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" startIcon={<PlusIcon className="w-4 h-4" />}>
                Créer un événement
              </Button>
              <Button variant="secondary" startIcon={<UserIcon className="w-4 h-4" />}>
                Voir le profil
              </Button>
              <Button variant="outline">
                Annuler
              </Button>
              <Button variant="ghost" endIcon={<ArrowRightIcon className="w-4 h-4" />}>
                Continuer
              </Button>
            </div>
          </div>
        </section>

        {/* Informations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Informations</h3>
          <p className="text-blue-700">
            Ce composant Button a été adapté du template dashboard avec nos couleurs :
          </p>
          <ul className="mt-2 text-blue-700 space-y-1">
            <li>• <strong>Primary</strong> : Bleu organisateur (#00008B)</li>
            <li>• <strong>Secondary</strong> : Orange participant (#FFA500)</li>
            <li>• <strong>Outline</strong> : Bordure grise avec hover</li>
            <li>• <strong>Ghost</strong> : Transparent avec bordure bleue</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestDashboardComponents;
