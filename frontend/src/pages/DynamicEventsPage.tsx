import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import HomeLayout from '../components/layout/HomeLayout';
import EventCardVertical from '../components/events/EventCardVertical';
import EventCardVerticalV2 from '../components/events/EventCardVerticalV2';
import EventCardHorizontal from '../components/events/EventCardHorizontal';
import AdvancedSearchHeader from '../components/search/AdvancedSearchHeader';
import FilterModal from '../components/filters/FilterModal';
import PageHeader from '../components/dashboard/layout/PageHeader';
import ViewToggle from '../components/ui/ViewToggle';
import { Grid3X3Icon, ListIcon } from 'lucide-react';
import filterIcon from '../assets/filter 06.svg';
import calendarIcon from '../assets/calendar.svg';
import arrowLeftIcon from '../assets/arrow-left-rectangle.svg';

interface DynamicEventsPageProps {
  context: 'search' | 'category' | 'upcoming' | 'suggestions' | 'top-events' | 'recent';
}

const DynamicEventsPage: React.FC<DynamicEventsPageProps> = ({ context }) => {
  // Tous les hooks doivent être appelés en premier, avant toute logique conditionnelle
  const { user, loading } = useAuth();
  const { id: categoryId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // États locaux
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'vertical2' | 'list'>('vertical2');
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Configuration selon le contexte
  const getPageConfig = () => {
    switch (context) {
      case 'search':
        return {
          title: 'Recherche',
          breadcrumbs: [
            { name: 'Accueil', href: '/home' },
            { name: 'Recherche' }
          ],
          showSearch: true,
          showFilters: true
        };
      case 'category':
        const categoryNames: { [key: string]: string } = {
          '1': 'Concerts',
          '2': 'Conférences', 
          '3': 'Formations',
          '4': 'Évangélisation'
        };
        return {
          title: categoryNames[categoryId || ''] || 'Catégorie',
          breadcrumbs: [
            { name: 'Accueil', href: '/home' },
            { name: categoryNames[categoryId || ''] || 'Catégorie' }
          ],
          showSearch: true,
          showFilters: true
        };
      case 'upcoming':
        return {
          title: 'Événements à venir',
          breadcrumbs: [
            { name: 'Accueil', href: '/home' },
            { name: 'Événements à venir' }
          ],
          showSearch: true,
          showFilters: true
        };
      case 'suggestions':
        return {
          title: 'Suggestions pour vous',
          breadcrumbs: [
            { name: 'Accueil', href: '/home' },
            { name: 'Suggestions pour vous' }
          ],
          showSearch: false,
          showFilters: true
        };
      case 'top-events':
        return {
          title: 'Top Events',
          breadcrumbs: [
            { name: 'Accueil', href: '/home' },
            { name: 'Top Events' }
          ],
          showSearch: false,
          showFilters: true
        };
      case 'recent':
        return {
          title: 'Consultés récemment',
          breadcrumbs: [
            { name: 'Accueil', href: '/home' },
            { name: 'Consultés récemment' }
          ],
          showSearch: false,
          showFilters: false
        };
      default:
        return {
          title: 'Événements',
          breadcrumbs: [
            { name: 'Accueil', href: '/home' },
            { name: 'Événements' }
          ],
          showSearch: true,
          showFilters: true
        };
    }
  };

  const pageConfig = getPageConfig();

  // Fonction pour obtenir le texte dynamique du bouton filtre
  const getFilterButtonText = () => {
    if (activeFilters.dateRange && activeFilters.dateRange !== 'Toutes les dates') {
      return 'Par date';
    }
    if (activeFilters.category && activeFilters.category !== 'Toutes les catégories') {
      return 'Par catégorie';
    }
    if (activeFilters.priceRange && activeFilters.priceRange !== 'Tous les prix') {
      return 'Par prix';
    }
    if (activeFilters.location && activeFilters.location !== '') {
      return 'Par localisation';
    }
    return 'Filtres';
  };

  // Fonction pour obtenir la classe CSS du grid selon le mode
  const getGridClass = () => {
    switch (viewMode) {
      case 'vertical2':
        // Desktop: 3 colonnes, Mobile: 2 colonnes
        return "grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6";
      case 'list':
        // Desktop: 2 colonnes, Mobile: 1 colonne
        return "grid grid-cols-1 lg:grid-cols-2 gap-4";
      default:
        return "grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6";
    }
  };

  // Fonction pour rendre le bon composant selon le mode
  const renderEventCard = (event: any) => {
    switch (viewMode) {
      case 'vertical2':
        // Desktop: EventCardVertical (avec organisateur), Mobile: EventCardVerticalV2 (simplifié)
        return (
          <>
            {/* Desktop: EventCardVertical avec organisateur */}
            <div className="hidden lg:block">
              <EventCardVertical
                event={event}
                onFollowToggle={(organizerId, isFollowing) => {
                  console.log(`${isFollowing ? 'Suivi' : 'Ne suit plus'} l'organisateur ${organizerId}`);
                }}
              />
            </div>
            {/* Mobile: EventCardVerticalV2 simplifié */}
            <div className="lg:hidden">
              <EventCardVerticalV2 event={event} />
            </div>
          </>
        );
      case 'list':
        // Desktop et Mobile: EventCardHorizontal
        return (
          <EventCardHorizontal
            event={event}
            onFollowToggle={(organizerId, isFollowing) => {
              console.log(`${isFollowing ? 'Suivi' : 'Ne suit plus'} l'organisateur ${organizerId}`);
            }}
          />
        );
      default:
        return <EventCardVerticalV2 event={event} />;
    }
  };

  // Gestion des filtres
  const handleFiltersChange = (filters: any) => {
    setActiveFilters(filters);
    console.log('Filtres appliqués:', filters);
    // TODO: Appliquer les filtres aux événements
  };

  // Chargement des événements selon le contexte
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      
      // Simulation de chargement d'événements selon le contexte
      const mockEvents = [
        {
          id: 1,
          titre: 'Lève-toi France 2023, 4ème édition',
          lieu: 'Palais des Congrès de Versailles',
          adresse: 'Versailles, FR',
          date_debut: '2024-01-21T09:00:00Z',
          date_fin: '2024-01-22T18:00:00Z',
          image_couverture: 'https://picsum.photos/400/300?random=1',
          tarification: 'gratuit',
          organisateur: {
            id: '1',
            nom: 'Team',
            prenom: 'Zoe',
            avatar_url: 'https://picsum.photos/40/40?random=1',
            role: 'organisateur'
          },
          participants_count: 20,
          participants_avatars: [
            'https://picsum.photos/40/40?random=10',
            'https://picsum.photos/40/40?random=11',
            'https://picsum.photos/40/40?random=12'
          ]
        },
        {
          id: 2,
          titre: 'Séminaire Business Cameroun',
          lieu: 'Douala - Yaoundé',
          adresse: 'Cameroun',
          date_debut: '2024-03-19T09:00:00Z',
          date_fin: '2024-03-26T18:00:00Z',
          image_couverture: 'https://picsum.photos/400/300?random=2',
          tarification: 'payant',
          prix_min: 15000,
          organisateur: {
            id: '2',
            nom: 'Team',
            prenom: 'Zoe',
            avatar_url: 'https://picsum.photos/40/40?random=2',
            role: 'organisateur'
          },
          participants_count: 15,
          participants_avatars: [
            'https://picsum.photos/40/40?random=20',
            'https://picsum.photos/40/40?random=21',
            'https://picsum.photos/40/40?random=22'
          ]
        },
        {
          id: 3,
          titre: 'Conférence des jeunes église ICC',
          lieu: 'San Francisco',
          adresse: 'CA, USA',
          date_debut: '2024-03-10T09:00:00Z',
          date_fin: '2024-03-19T18:00:00Z',
          image_couverture: 'https://picsum.photos/400/300?random=3',
          tarification: 'gratuit',
          organisateur: {
            id: '3',
            nom: 'Church',
            prenom: 'ICC',
            avatar_url: 'https://picsum.photos/40/40?random=3',
            role: 'organisateur'
          },
          participants_count: 25,
          participants_avatars: [
            'https://picsum.photos/40/40?random=30',
            'https://picsum.photos/40/40?random=31',
            'https://picsum.photos/40/40?random=32'
          ]
        }
      ];

      // Simuler un délai de chargement
      setTimeout(() => {
        setEvents(mockEvents);
        setIsLoading(false);
      }, 500);
    };

    loadEvents();
  }, [context, categoryId]);

  // Gestion du retour
  const handleBack = () => {
    navigate('/home');
  };

  // Redirection si non authentifié - APRÈS tous les hooks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  return (
    <HomeLayout>
      <div className="flex-1 bg-gray-50">
        {/* Header Mobile */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between px-0 py-0">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <img src={arrowLeftIcon} alt="Retour" className="w-5 h-5" />
            </button>
            
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {pageConfig.title}
            </h1>
            
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <img src={calendarIcon} alt="Calendrier" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <main className="px-2 pb-2 sm:px-4 sm:pb-4 lg:pt-2 lg:pb-8 lg:px-8">
          {/* Desktop: PageHeader avec breadcrumbs et titre */}
          <div className="hidden lg:block">
            <PageHeader
              title={pageConfig.title}
              breadcrumbs={pageConfig.breadcrumbs}
            />
          </div>

          {/* Barre de recherche */}
          {pageConfig.showSearch && (
            <div className="mb-6">
              <AdvancedSearchHeader 
                onFiltersChange={handleFiltersChange} 
                className="border-0 bg-transparent" 
              />
            </div>
          )}

          {/* Actions (Filtres et Affichage) */}
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <div className="flex items-center gap-4">
              {pageConfig.showFilters && (
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <img src={filterIcon} alt="Filtres" className="w-4 h-4" />
                  {getFilterButtonText()}
                </button>
              )}
            </div>

            <ViewToggle 
              viewMode={viewMode} 
              onViewModeChange={setViewMode} 
            />
          </div>

          {/* Contenu des événements */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            </div>
          ) : (
            <div className={getGridClass()}>
              {events.map((event) => (
                <div key={event.id}>
                  {renderEventCard(event)}
                </div>
              ))}
            </div>
          )}

          {/* Message si aucun événement */}
          {!isLoading && events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Aucun événement trouvé.
              </p>
            </div>
          )}
        </main>

        {/* Modal des filtres */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onFiltersChange={handleFiltersChange}
        />
      </div>
    </HomeLayout>
  );
};

export default DynamicEventsPage;
