import React from 'react';
import { Button, Badge } from '../../components/dashboard/ui';
import { PlusIcon, ArrowRightIcon, UserIcon, CheckCircleIcon, AlertTriangleIcon, InfoIcon } from 'lucide-react';

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

        {/* Section Badge */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Composant Badge</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Variants */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Variants Light</h3>
              <div className="space-y-3">
                <Badge variant="light" color="primary">Organisateur</Badge>
                <Badge variant="light" color="secondary">Participant</Badge>
                <Badge variant="light" color="success">Validé</Badge>
                <Badge variant="light" color="error">Erreur</Badge>
                <Badge variant="light" color="warning">En attente</Badge>
                <Badge variant="light" color="info">Information</Badge>
              </div>
            </div>

            {/* Variants Solid */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Variants Solid</h3>
              <div className="space-y-3">
                <Badge variant="solid" color="primary">Organisateur</Badge>
                <Badge variant="solid" color="secondary">Participant</Badge>
                <Badge variant="solid" color="success">Validé</Badge>
                <Badge variant="solid" color="error">Erreur</Badge>
                <Badge variant="solid" color="warning">En attente</Badge>
                <Badge variant="solid" color="info">Information</Badge>
              </div>
            </div>

            {/* Tailles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Tailles</h3>
              <div className="space-y-3">
                <Badge size="sm" color="primary">Small</Badge>
                <Badge size="md" color="primary">Medium (default)</Badge>
                <Badge size="lg" color="primary">Large</Badge>
              </div>
            </div>
          </div>

          {/* Exemples d'usage */}
          <div className="mt-8 p-6 bg-white rounded-lg shadow-card">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Exemples d'usage</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Badge variant="light" color="success" startIcon={<CheckCircleIcon className="w-3 h-3" />}>
                Événement validé
              </Badge>
              <Badge variant="light" color="warning" startIcon={<AlertTriangleIcon className="w-3 h-3" />}>
                En attente de validation
              </Badge>
              <Badge variant="solid" color="primary" startIcon={<UserIcon className="w-3 h-3" />}>
                Organisateur
              </Badge>
              <Badge variant="solid" color="secondary" startIcon={<UserIcon className="w-3 h-3" />}>
                Participant
              </Badge>
              <Badge variant="light" color="info" startIcon={<InfoIcon className="w-3 h-3" />}>
                Nouveau
              </Badge>
            </div>
          </div>
        </section>

        {/* Informations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Informations</h3>
          <p className="text-blue-700">
            Ces composants ont été adaptés du template dashboard avec nos couleurs :
          </p>
          <ul className="mt-2 text-blue-700 space-y-1">
            <li>• <strong>Button Primary</strong> : Bleu organisateur (#00008B)</li>
            <li>• <strong>Button Secondary</strong> : Orange participant (#FFA500)</li>
            <li>• <strong>Badge Primary</strong> : Bleu organisateur avec transparence</li>
            <li>• <strong>Badge Secondary</strong> : Orange participant avec transparence</li>
            <li>• <strong>Badge Success</strong> : Vert menthe (#62BF92)</li>
            <li>• <strong>Badge Error</strong> : Coral (#EE6239)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestDashboardComponents;
