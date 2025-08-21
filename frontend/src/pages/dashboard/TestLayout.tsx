import { PlusIcon, DownloadIcon, FilterIcon } from "lucide-react";
import DashboardLayout from "../../components/dashboard/layout/DashboardLayout";
import PageHeader from "../../components/dashboard/layout/PageHeader";
import PageContainer from "../../components/dashboard/layout/PageContainer";
import { Button } from "../../components/ui/Button";
import { EventsCard, CommunitiesCard } from "../../components/dashboard";

export default function TestLayout() {
  const breadcrumbs = [
    { name: "Accueil", href: "/dashboard" },
    { name: "Test Layout", href: "/test-layout" }
  ];

  const actions = (
    <>
      <Button variant="outline" size="sm">
        <FilterIcon className="w-4 h-4 mr-2" />
        Filtrer
      </Button>
      <Button variant="outline" size="sm">
        <DownloadIcon className="w-4 h-4 mr-2" />
        Exporter
      </Button>
      <Button variant="primary" size="sm">
        <PlusIcon className="w-4 h-4 mr-2" />
        Nouveau
      </Button>
    </>
  );

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          title="Test des Composants Layout"
          subtitle="Page de test pour vérifier le bon fonctionnement des composants de layout"
          breadcrumbs={breadcrumbs}
          actions={actions}
        >
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Cette page utilise le DashboardLayout avec Sidebar, Header, PageHeader et PageContainer.
            </p>
          </div>
        </PageHeader>

        {/* Contenu de test */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EventsCard />
          <CommunitiesCard />
        </div>

        {/* Section de test supplémentaire */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test des Composants Layout
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-gray-600 dark:text-gray-400">
              Cette page démontre l'utilisation des composants de layout :
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• <strong>DashboardLayout</strong> - Layout principal avec sidebar et header</li>
              <li>• <strong>Sidebar</strong> - Navigation latérale avec menu et profil utilisateur</li>
              <li>• <strong>PageHeader</strong> - En-tête de page avec titre, breadcrumbs et actions</li>
              <li>• <strong>PageContainer</strong> - Conteneur principal avec options de largeur et padding</li>
            </ul>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
