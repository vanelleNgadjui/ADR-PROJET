import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import HomeLayout from '../components/layout/HomeLayout';
import EventCardVertical from '../components/events/EventCardVertical';
import EventCardHorizontal from '../components/events/EventCardHorizontal';
import FeaturedEventsCarousel from '../components/events/FeaturedEventsCarousel';
import CategoriesSection from '../components/sections/CategoriesSection';
import AdvancedSearchHeader from '../components/search/AdvancedSearchHeader';
import HorizontalScrollContainer from '../components/ui/HorizontalScrollContainer';

const HomePage: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeFilters, setActiveFilters] = useState({});

  const handleFiltersChange = (filters: any) => {
    setActiveFilters(filters);
    console.log('Filtres appliqués:', filters);
    // TODO: Appliquer les filtres aux événements
  };

  // Redirection si non authentifié
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/connexion" replace />;
  }

  return (
    <HomeLayout>
      <div className="flex-1 bg-gray-50">
        {/* Contenu principal */}
        <main className="pb-2 sm:px-4 sm:pb-4 lg:pt-2 lg:pb-8 lg:px-8">
          {/* Section Carousel des événements phares */}
          <section className="mb-6">
            <FeaturedEventsCarousel
              events={[
                {
                  id: 1,
                  titre: 'Lève-toi France 2023, 4ème édition',
                  image_couverture: 'https://picsum.photos/1200/300?random=1',
                  categorie: 'CONFÉRENCE',
                  organisateur: {
                    nom: 'Team',
                    prenom: 'Zoe'
                  },
                  lieu: 'Palais des Congrès de Versailles',
                  date_debut: '2024-01-21T09:00:00Z'
                },
                {
                  id: 2,
                  titre: 'Séminaire Business Cameroun',
                  image_couverture: 'https://picsum.photos/1200/300?random=2',
                  categorie: 'FORMATION',
                  organisateur: {
                    nom: 'Business',
                    prenom: 'Cameroun'
                  },
                  lieu: 'Douala - Yaoundé',
                  date_debut: '2024-03-19T09:00:00Z'
                },
                {
                  id: 3,
                  titre: 'Conférence des jeunes église ICC',
                  image_couverture: 'https://picsum.photos/1200/300?random=3',
                  categorie: 'JEUNES',
                  organisateur: {
                    nom: 'Church',
                    prenom: 'ICC'
                  },
                  lieu: 'San Francisco',
                  date_debut: '2024-03-10T09:00:00Z'
                }
              ]}
            />
          </section>

          {/* Section Catégories */}
          <CategoriesSection />

          {/* Section AdvancedSearchHeader */}
          <section className="mb-6">
            <AdvancedSearchHeader onFiltersChange={handleFiltersChange} className="border-0 bg-transparent" />
          </section>



          {/* Section Événements à venir */}
          <section className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Événements à venir
              </h2>
              <Link to="/upcoming" className="text-gray-900 hover:text-gray-700 font-normal text-sm">
                Voir tout
              </Link>
            </div>
            
            {/* Événements à venir avec scroll horizontal */}
            <HorizontalScrollContainer>
              <div className="w-80 flex-shrink-0 h-full">
                <EventCardVertical
                  event={{
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
                      'https://picsum.photos/40/40?random=12',
                      'https://picsum.photos/40/40?random=13',
                      'https://picsum.photos/40/40?random=14'
                    ]
                  }}
                  onFollowToggle={(organizerId, isFollowing) => {
                    console.log(`${isFollowing ? 'Suivi' : 'Ne suit plus'} l'organisateur ${organizerId}`);
                  }}
                />
              </div>
              
              <div className="w-80 flex-shrink-0 h-full">
                <EventCardVertical
                  event={{
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
                      'https://picsum.photos/40/40?random=22',
                      'https://picsum.photos/40/40?random=23'
                    ]
                  }}
                  onFollowToggle={(organizerId, isFollowing) => {
                    console.log(`${isFollowing ? 'Suivi' : 'Ne suit plus'} l'organisateur ${organizerId}`);
                  }}
                />
              </div>
              
              <div className="w-80 flex-shrink-0 h-full">
                <EventCardVertical
                  event={{
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
                      'https://picsum.photos/40/40?random=32',
                      'https://picsum.photos/40/40?random=33',
                      'https://picsum.photos/40/40?random=34',
                      'https://picsum.photos/40/40?random=35'
                    ]
                  }}
                  onFollowToggle={(organizerId, isFollowing) => {
                    console.log(`${isFollowing ? 'Suivi' : 'Ne suit plus'} l'organisateur ${organizerId}`);
                  }}
                />
              </div>
              
              <div className="w-80 flex-shrink-0 h-full">
                <EventCardVertical
                  event={{
                    id: 4,
                    titre: 'Retraite spirituelle en montagne',
                    lieu: 'Chamonix',
                    adresse: 'France',
                    date_debut: '2024-04-15T08:00:00Z',
                    date_fin: '2024-04-20T18:00:00Z',
                    image_couverture: 'https://picsum.photos/400/300?random=4',
                    tarification: 'payant',
                    prix_min: 350,
                    organisateur: {
                      id: '4',
                      nom: 'Retraites',
                      prenom: 'Spirituelles',
                      avatar_url: 'https://picsum.photos/40/40?random=4',
                      role: 'organisateur'
                    },
                    participants_count: 18,
                    participants_avatars: [
                      'https://picsum.photos/40/40?random=40',
                      'https://picsum.photos/40/40?random=41',
                      'https://picsum.photos/40/40?random=42'
                    ]
                  }}
                  onFollowToggle={(organizerId, isFollowing) => {
                    console.log(`${isFollowing ? 'Suivi' : 'Ne suit plus'} l'organisateur ${organizerId}`);
                  }}
                />
              </div>
            </HorizontalScrollContainer>
          </section>

          {/* Section Suggestions pour vous */}
          <section className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Suggestions pour vous
              </h2>
              <Link to="/suggestions" className="text-gray-900 hover:text-gray-700 font-normal text-sm">
                Voir tout
              </Link>
            </div>
            
            {/* Suggestions avec cartes horizontales et scroll vertical */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <EventCardHorizontal
                event={{
                  id: 4,
                  titre: 'Atelier de développement personnel',
                  lieu: 'Paris',
                  adresse: 'France',
                  date_debut: '2024-02-15T14:00:00Z',
                  date_fin: '2024-02-15T17:00:00Z',
                  image_couverture: 'https://picsum.photos/100/100?random=4',
                  tarification: 'payant',
                  prix_min: 25,
                  organisateur: {
                    id: '4',
                    nom: 'Dupont',
                    prenom: 'Marie',
                    avatar_url: 'https://picsum.photos/20/20?random=4',
                    role: 'organisateur'
                  },
                  participants_count: 12,
                  participants_avatars: [
                    'https://picsum.photos/20/20?random=40',
                    'https://picsum.photos/20/20?random=41',
                    'https://picsum.photos/20/20?random=42'
                  ]
                }}
                onFollowToggle={(organizerId, isFollowing) => {
                  console.log(`${isFollowing ? 'Suivi' : 'Ne suit plus'} l'organisateur ${organizerId}`);
                }}
              />
              
              <EventCardHorizontal
                event={{
                  id: 5,
                  titre: 'Conférence sur l\'innovation technologique',
                  lieu: 'Lyon',
                  adresse: 'France',
                  date_debut: '2024-02-20T09:00:00Z',
                  date_fin: '2024-02-20T18:00:00Z',
                  image_couverture: 'https://picsum.photos/100/100?random=5',
                  tarification: 'payant',
                  prix_min: 50,
                  organisateur: {
                    id: '5',
                    nom: 'Martin',
                    prenom: 'Pierre',
                    avatar_url: 'https://picsum.photos/20/20?random=5',
                    role: 'organisateur'
                  },
                  participants_count: 35,
                  participants_avatars: [
                    'https://picsum.photos/20/20?random=50',
                    'https://picsum.photos/20/20?random=51',
                    'https://picsum.photos/20/20?random=52'
                  ]
                }}
                onFollowToggle={(organizerId, isFollowing) => {
                  console.log(`${isFollowing ? 'Suivi' : 'Ne suit plus'} l'organisateur ${organizerId}`);
                }}
              />
              
              <EventCardHorizontal
                event={{
                  id: 6,
                  titre: 'Soirée networking entrepreneurs',
                  lieu: 'Marseille',
                  adresse: 'France',
                  date_debut: '2024-02-25T19:00:00Z',
                  date_fin: '2024-02-25T23:00:00Z',
                  image_couverture: 'https://picsum.photos/100/100?random=6',
                  tarification: 'gratuit',
                  organisateur: {
                    id: '6',
                    nom: 'Bernard',
                    prenom: 'Sophie',
                    avatar_url: 'https://picsum.photos/20/20?random=6',
                    role: 'organisateur'
                  },
                  participants_count: 28,
                  participants_avatars: [
                    'https://picsum.photos/20/20?random=60',
                    'https://picsum.photos/20/20?random=61',
                    'https://picsum.photos/20/20?random=62'
                  ]
                }}
                onFollowToggle={(organizerId, isFollowing) => {
                  console.log(`${isFollowing ? 'Suivi' : 'Ne suit plus'} l'organisateur ${organizerId}`);
                }}
              />
              
              <EventCardHorizontal
                event={{
                  id: 7,
                  titre: 'Formation en leadership',
                  lieu: 'Toulouse',
                  adresse: 'France',
                  date_debut: '2024-03-01T10:00:00Z',
                  date_fin: '2024-03-01T16:00:00Z',
                  image_couverture: 'https://picsum.photos/100/100?random=7',
                  tarification: 'payant',
                  prix_min: 75,
                  organisateur: {
                    id: '7',
                    nom: 'Leroy',
                    prenom: 'Thomas',
                    avatar_url: 'https://picsum.photos/20/20?random=7',
                    role: 'organisateur'
                  },
                  participants_count: 18,
                  participants_avatars: [
                    'https://picsum.photos/20/20?random=70',
                    'https://picsum.photos/20/20?random=71',
                    'https://picsum.photos/20/20?random=72'
                  ]
                }}
                onFollowToggle={(organizerId, isFollowing) => {
                  console.log(`${isFollowing ? 'Suivi' : 'Ne suit plus'} l'organisateur ${organizerId}`);
                }}
              />
            </div>
          </section>
        </main>
      </div>
    </HomeLayout>
  );
};

export default HomePage;
