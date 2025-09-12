import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import NewsletterForm from '../components/ui/NewsletterForm';
import MagicBento from '../components/ui/MagicBento';
import EventCardVertical from '../components/events/EventCardVertical';
import EventCardVerticalV2 from '../components/events/EventCardVerticalV2';
import FallingText from '../components/ui/TextAnimations/FallingText';
import Carousel from '../components/ui/Carousel';
import CardSwap, { Card as CardSwapCard } from '../components/ui/CardSwap';
import { Music, BookOpen, Users, Mountain } from 'lucide-react';
import { Button, ScrollStack, ScrollStackItem } from '../components/ui';
import PageTitle from '../components/common/PageTitle';
import adrBg from '../assets/ADR-BG.png';
import bgEventsGrid from '../assets/bg-events-grid.png';
import imageDownloadApp from '../assets/image-download-app.png';
import card1Svg from '../assets/Card-1.svg';
import card2Svg from '../assets/Card-2.svg';
import card3Svg from '../assets/Card-3.svg';
import card4Svg from '../assets/Card-4.svg';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Chargement des événements pour la landing page
  useEffect(() => {
    const loadLandingEvents = async () => {
      setIsLoading(true);
      
      // Événements mock pour la landing page (6 événements)
      const mockEvents = [
        {
          id: 1,
          titre: 'Lève-toi France 2024, 5ème édition',
          lieu: 'Palais des Congrès de Versailles',
          adresse: 'Versailles, FR',
          date_debut: '2024-07-21T09:00:00Z',
          date_fin: '2024-07-22T18:00:00Z',
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
          date_debut: '2024-08-19T09:00:00Z',
          date_fin: '2024-08-26T18:00:00Z',
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
          date_debut: '2024-09-10T09:00:00Z',
          date_fin: '2024-09-19T18:00:00Z',
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
        },
        {
          id: 4,
          titre: 'Concert Gospel International',
          lieu: 'Olympia',
          adresse: 'Paris, FR',
          date_debut: '2024-10-15T19:00:00Z',
          date_fin: '2024-10-15T23:00:00Z',
          image_couverture: 'https://picsum.photos/400/300?random=4',
          tarification: 'payant',
          prix_min: 45,
          organisateur: {
            id: '4',
            nom: 'Gospel',
            prenom: 'International',
            avatar_url: 'https://picsum.photos/40/40?random=4',
            role: 'organisateur'
          },
          participants_count: 8,
          participants_avatars: [
            'https://picsum.photos/40/40?random=40',
            'https://picsum.photos/40/40?random=41',
            'https://picsum.photos/40/40?random=42'
          ]
        },
        {
          id: 5,
          titre: 'Retraite Spirituelle Montagne',
          lieu: 'Station de ski',
          adresse: 'Chamonix, FR',
          date_debut: '2024-11-08T08:00:00Z',
          date_fin: '2024-11-10T18:00:00Z',
          image_couverture: 'https://picsum.photos/400/300?random=5',
          tarification: 'payant',
          prix_min: 280,
          organisateur: {
            id: '5',
            nom: 'Retraites',
            prenom: 'Spirituelles',
            avatar_url: 'https://picsum.photos/40/40?random=5',
            role: 'organisateur'
          },
          participants_count: 12,
          participants_avatars: [
            'https://picsum.photos/40/40?random=50',
            'https://picsum.photos/40/40?random=51',
            'https://picsum.photos/40/40?random=52'
          ]
        },
        {
          id: 6,
          titre: 'Webinaire Louange & Adoration',
          lieu: 'En ligne',
          adresse: 'Zoom',
          date_debut: '2024-12-05T20:00:00Z',
          date_fin: '2024-12-05T22:00:00Z',
          image_couverture: 'https://picsum.photos/400/300?random=6',
          tarification: 'gratuit',
          organisateur: {
            id: '6',
            nom: 'Louange',
            prenom: 'Online',
            avatar_url: 'https://picsum.photos/40/40?random=6',
            role: 'organisateur'
          },
          participants_count: 35,
          participants_avatars: [
            'https://picsum.photos/40/40?random=60',
            'https://picsum.photos/40/40?random=61',
            'https://picsum.photos/40/40?random=62'
          ]
        }
      ];

      // Simuler un délai de chargement
      setTimeout(() => {
        setEvents(mockEvents);
        setIsLoading(false);
      }, 500);
    };

    loadLandingEvents();
  }, []);

  // Redirection basée sur le rôle de l'utilisateur
  useEffect(() => {
    const checkUserRoleAndRedirect = async () => {
      if (user) {
        // Ajouter un petit délai pour éviter les redirections multiples
        const timeoutId = setTimeout(async () => {
          try {
            const { data, error } = await supabase
              .from('users')
              .select('role')
              .eq('id', user.id)
              .single();
            
            if (!error && data) {
              if (data.role === 'participant') {
                navigate('/home');
              } else if (data.role === 'organisateur') {
                navigate('/homeOrg');
              } else if (data.role === 'admin') {
                navigate('/admin-dashboard');
              }
            }
          } catch (err) {
            console.error('Erreur lors de la vérification du rôle:', err);
          }
        }, 500); // Délai de 500ms

        return () => clearTimeout(timeoutId);
      }
    };

    checkUserRoleAndRedirect();
  }, [user, navigate]);

  return (
    <div className="bg-neutral-white min-h-screen flex flex-col">
      <PageTitle 
        title="Landing Page" 
        description="Découvrez tous les événements chrétiens au même endroit. Créez, découvrez et vivez les événements qui nourrissent votre foi."
      />
      {/* 1. Header - Full width sur mobile */}
      <Header />

      {/* 2. Hero */}
    
      <section className="relative flex flex-col md:flex-row items-center justify-between pt-12 pb-4 bg-gradient-to-br from-primary-blue/5 to-primary-orange/5 rounded-b-3xl mx-4 overflow-hidden lg:pt-16">        {/* Texte à gauche */}
        <div className="w-full md:w-[65%] flex flex-col items-center md:items-start justify-center text-center md:text-left px-6 md:pl-12">
                      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Tous les événements chrétiens.<br />Au même endroit.</h1>
          <p className="text-lg md:text-xl text-neutral-700 mb-8 max-w-sm md:max-w-none">Créez. Découvrez. Vivez les événements qui nourrissent votre foi.</p>
                    {/* ScrollStack à droite - masqué sur deskstop */}

        {/* ScrollStack optimisé pour mobile - Images parfaitement centrées et visibles */}
        <section className="h-[500px] w-screen block md:hidden">
          <ScrollStack 
            className="h-full w-full flex justify-center"
            itemDistance={40}
            itemScale={0.08}
            itemStackDistance={25}
            baseScale={0.85}
            stackPosition="25%"
            scaleEndPosition="40%"
          >
            <ScrollStackItem itemClassName="w-[88%] max-w-[320px]">   
              <div className="flex justify-center items-center h-full p-3">
                <img 
                  src={card1Svg} 
                  alt="Card 1" 
                  className="w-full h-auto object-contain rounded-2xl shadow-2xl drop-shadow-xl"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            </ScrollStackItem>
            <ScrollStackItem itemClassName="w-[88%] max-w-[320px]">
              <div className="flex justify-center items-center h-full p-3">
                <img 
                  src={card2Svg} 
                  alt="Card 2" 
                  className="w-full h-auto object-contain rounded-2xl shadow-2xl drop-shadow-xl"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            </ScrollStackItem>
            <ScrollStackItem itemClassName="w-[88%] max-w-[320px]">
              <div className="flex justify-center items-center h-full p-3">
                <img 
                  src={card3Svg} 
                  alt="Card 3" 
                  className="w-full h-auto object-contain rounded-2xl shadow-2xl drop-shadow-xl"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            </ScrollStackItem>
            <ScrollStackItem itemClassName="w-[88%] max-w-[320px]">
              <div className="flex justify-center items-center h-full p-3">
                <img 
                  src={card4Svg} 
                  alt="Card 4" 
                  className="w-full h-auto object-contain rounded-2xl shadow-2xl drop-shadow-xl"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            </ScrollStackItem>
          </ScrollStack>
        </section>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => {
                document.getElementById('top-events')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-primary-blue hover:bg-primary-blue/90 rounded-lg transition-colors"
            >
              Découvrir les événements
            </button>
            <Link to="/auth/choix-role">
            <Button variant="secondary">Organiser un événement</Button>
            </Link>
          </div>
        </div>
        {/* CardSwap à droite - masqué sur mobile */}
        <div className="relative w-full md:w-[35%] min-h-[340px] hidden md:block">
          <div className="absolute -bottom-16 right-0">
            <CardSwap width={420} height={320} verticalDistance={38} delay={3500}>
              <CardSwapCard 
                customClass="shadow-xl"
                backgroundImage={card1Svg}
                backgroundSize="cover"
                backgroundPosition="center"
              />
              <CardSwapCard 
                customClass="shadow-xl"
                backgroundImage={card2Svg}
                backgroundSize="cover"
                backgroundPosition="center"
              />
              <CardSwapCard 
                customClass="shadow-xl"
                backgroundImage={card3Svg}
                backgroundSize="cover"
                backgroundPosition="center"
              />
              <CardSwapCard 
                customClass="shadow-xl"
                backgroundImage={card4Svg}
                backgroundSize="cover"
                backgroundPosition="center"
              />
            </CardSwap>
          </div>
        </div>
       
      
  
      </section>
      {/* 3. Section Mission & Valeurs */}
      <section className="relative flex flex-col items-center justify-center pt-10 pb-0 rounded-3xl mx-4 overflow-hidden min-h-[200px]">
      <div className="w-full max-w-3xl mx-auto h-[150px] md:h-[200px] overflow-hidden mx-4 my-8">
          <FallingText
            text="Chaque jour, des dizaines d’événements chrétiens sont organisés, mais ils restent invisibles, dispersés, mal promus."
            highlightWords={["Chaque", "jour", "invisibles", "dispersés", "mal", "promus"]}
            fontSize="2rem"
            trigger="auto"
            gravity={0.5}
            backgroundColor="transparent"
            // Surcharge la couleur via CSS
            // On cible .text-primary-blue dans le composant ou via global CSS si besoin
          />
          <style>{`
            .text-cyan-500 { color: #1e3a8a !important; }
          `}</style>
        </div>

      </section>

      {/* 4. Section Mission avec image */}
      <section className="mt-0 mb-0 mx-4 relative overflow-hidden rounded-3xl min-h-[400px] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgEventsGrid})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/75 to-white/60"></div>
        <div className="relative z-10 p-8 md:p-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Image à gauche */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img 
              src={imageDownloadApp} 
              alt="Application mobile Agenda du Royaume" 
              className="w-full max-w-md h-auto rounded-2xl shadow-lg"
            />
          </div>
          {/* Texte à droite */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-blue">Notre mission</h2>
            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed">
              Rendre visibles, accessibles et inoubliables tous les événements chrétiens francophones. Nous croyons à la puissance de la rencontre, du partage et de la foi vécue ensemble.
          </p>
          </div>
        </div>
        </div>
      </section>

      {/* 5. Fonctionnalités clés */}
      <section className="mt-0 mb-12 mx-0 md:mx-4 flex flex-col items-center justify-center rounded-3xl overflow-hidden"
        style={{ backgroundImage: `url(${adrBg})` }}>
        <div className="relative z-10 p-4 md:p-12 w-full">
          <h2 className="text-3xl font-bold mb-6 text-primary-orange text-center">Avantages & Fonctionnalités</h2>
        <p className="text-lg text-neutral-700 mb-8 text-center max-w-2xl mx-auto">
          Découvrez tout ce que l’Agenda du Royaume offre aux participants et aux organisateurs : visibilité, simplicité, outils premium et expérience communautaire unique.
        </p>
        <div className="w-full max-w-none md:max-w-7xl mx-0 md:mx-auto flex justify-center">
          <MagicBento
            // Personnalisation possible : passer des props ou modifier le composant pour afficher les avantages clés
          />
        </div>
        </div>
      </section>
      {/* Ajout du style global premium pour la section fonctionnalités */}

      {/* 6. Top Events */}
      <section id="top-events" className="my-12 mx-4">
        <h2 className="text-3xl font-bold mb-8 text-primary-blue text-center">Top événements à venir</h2>
        <div className="my-8 max-w-5xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun événement trouvé pour la landing page.</p>
                </div>
              ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {events.map((event) => (
                <div key={event.id}>
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
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Lien "Voir tout" en bas */}
        <div className="text-center mt-8">
          <Link to="/auth/choix-role" className="inline-flex items-center text-primary-blue hover:text-primary-blue/80 font-medium text-sm underline">
            Voir tout →
          </Link>
        </div>
      </section>


      {/* 7. Rester connecté */}
      <section className="my-12 mx-4 flex justify-center">
        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-stretch">
          {/* Colonne Carousel */}
          <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md h-full min-h-[420px] flex items-center justify-center bg-white rounded-2xl shadow-lg p-8">
          <Carousel
                baseWidth={380}
                items={[
                  {
                    id: 1,
                    title: "Un événement inoubliable !",
                    description: "J'ai découvert des conférences et des concerts incroyables grâce à l'Agenda du Royaume. L'inscription était simple et l'ambiance formidable.",
                    icon: <span className="inline-block w-10 h-10 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold text-xl">A</span>,
                  },
                  {
                    id: 2,
                    title: "La plateforme idéale pour s'engager",
                    description: "En tant qu'organisatrice, j'ai pu facilement publier mon événement et suivre les inscriptions. L'équipe est réactive et l'outil très intuitif.",
                    icon: <span className="inline-block w-10 h-10 rounded-full bg-primary-orange text-white flex items-center justify-center font-bold text-xl">B</span>,
                  },
                  {
                    id: 3,
                    title: "Un vrai plus pour la communauté",
                    description: "Enfin un site qui centralise tous les événements chrétiens ! Je recommande à tous mes amis de l'utiliser.",
                    icon: <span className="inline-block w-10 h-10 rounded-full bg-secondary-coral text-white flex items-center justify-center font-bold text-xl">C</span>,
                  },
                ]}
                autoplay={true}
                autoplayDelay={4000}
                pauseOnHover={true}
                loop={true}
              />
            </div>
          </div>
          {/* Colonne newsletter */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md h-full min-h-[420px] flex items-center justify-center bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-center w-full">
              <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
} 