import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import NewsletterForm from '../components/ui/NewsletterForm';
import MagicBento from '../components/ui/MagicBento';
import Masonry from '../components/ui/Masonry';
import FallingText from '../components/ui/TextAnimations/FallingText';
import Carousel from '../components/ui/Carousel';
import CardSwap, { Card as CardSwapCard } from '../components/ui/CardSwap';
import { Music, BookOpen, Users, Mountain } from 'lucide-react';
import { Button } from '../components/ui';
import adrBg from '../assets/ADR-BG.png';
import bgEventsGrid from '../assets/bg-events-grid.png';
import imageDownloadApp from '../assets/image-download-app.png';

export default function LandingPage() {
  return (
    <div className="bg-neutral-white min-h-screen flex flex-col">
      {/* 1. Header */}
      <Header />

      {/* 2. Hero */}
    
      <section className="relative flex flex-col md:flex-row items-center justify-between pt-6 pb-4 bg-gradient-to-br from-primary-blue/5 to-primary-orange/5 rounded-b-3xl mx-4 overflow-hidden">        {/* Texte à gauche */}
        <div className="w-full md:w-[65%] flex flex-col items-center md:items-start justify-center text-center md:text-left px-6 md:pl-12">
                      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Tous les événements chrétiens.<br />Au même endroit.</h1>
          <p className="text-lg md:text-xl text-neutral-700 mb-8 max-w-sm md:max-w-none">Créez. Découvrez. Vivez les événements qui nourrissent votre foi.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/auth/connexion">
              <Button variant="primary">Découvrir les événements</Button>
            </Link>
            <Link to="/auth/choix-role">
              <Button variant="secondary">Organiser un événement</Button>
            </Link>
          </div>
        </div>
        {/* CardSwap à droite - masqué sur mobile */}
        <div className="relative w-full md:w-[35%] min-h-[340px] hidden md:block">
          <div className="absolute -bottom-24 right-0">
            <CardSwap width={420} height={320} verticalDistance={38} delay={3500}>
              <CardSwapCard customClass="bg-gradient-to-br from-primary-blue to-primary-orange text-white flex flex-col items-start justify-start p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Music className="w-8 h-8 text-white/90" />
                  <span className="text-2xl font-bold">Concerts</span>
                </div>
                <span className="text-base">Louez et vibrez en musique</span>
              </CardSwapCard>
              <CardSwapCard customClass="bg-gradient-to-br from-primary-orange to-secondary-coral text-white flex flex-col items-start justify-start p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-8 h-8 text-white/90" />
                  <span className="text-2xl font-bold">Conférences</span>
                </div>
                <span className="text-base">Approfondissez votre foi</span>
              </CardSwapCard>
              <CardSwapCard customClass="bg-gradient-to-br from-secondary-coral to-secondary-mint text-white flex flex-col items-start justify-start p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-8 h-8 text-white/90" />
                  <span className="text-2xl font-bold">Jeunesse</span>
                </div>
                <span className="text-base">Des temps forts pour les jeunes</span>
              </CardSwapCard>
              <CardSwapCard customClass="bg-gradient-to-br from-secondary-mint to-primary-blue text-white flex flex-col items-start justify-start p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Mountain className="w-8 h-8 text-white/90" />
                  <span className="text-2xl font-bold">Retraites</span>
                </div>
                <span className="text-base">Pause spirituelle et ressourcement</span>
              </CardSwapCard>
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
      <section className="my-12 mx-4">
        <h2 className="text-3xl font-bold mb-8 text-primary-blue text-center">Top événements à venir</h2>
        <div className="my-8 max-w-5xl mx-auto">
          <Masonry
            columns={3}
            items={[
              {
                id: '1',
                img: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Concert+Gospel',
                url: '#',
                height: Math.floor(300 + Math.random() * 200),
                title: 'Concert Gospel',
                date: '12/07/2024',
                cta: 'S’inscrire',
              },
              {
                id: '2',
                img: 'https://via.placeholder.com/400x300/F97316/FFFFFF?text=Conférence+Foi',
                url: '#',
                height: Math.floor(300 + Math.random() * 200),
                title: 'Conférence Foi',
                date: '18/07/2024',
                cta: 'Voir',
              },
              {
                id: '3',
                img: 'https://via.placeholder.com/400x300/EE6239/FFFFFF?text=Retraite+Spirituelle',
                url: '#',
                height: Math.floor(300 + Math.random() * 200),
                title: 'Retraite Spirituelle',
                date: '22/07/2024',
                cta: 'S’inscrire',
              },
              {
                id: '4',
                img: 'https://via.placeholder.com/400x300/62BF92/FFFFFF?text=Webinaire+Louange',
                url: '#',
                height: Math.floor(300 + Math.random() * 200),
                title: 'Webinaire Louange',
                date: '28/07/2024',
                cta: 'Voir',
              },
              {
                id: '5',
                img: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Concert+Jeunesse',
                url: '#',
                height: Math.floor(300 + Math.random() * 200),
                title: 'Concert Jeunesse',
                date: '30/07/2024',
                cta: 'S’inscrire',
              },
              {
                id: '6',
                img: 'https://via.placeholder.com/400x300/F97316/FFFFFF?text=Festival+Louange',
                url: '#',
                height: Math.floor(300 + Math.random() * 200),
                title: 'Festival Louange',
                date: '05/08/2024',
                cta: 'Voir',
              },
              {
                id: '7',
                img: 'https://via.placeholder.com/400x300/EE6239/FFFFFF?text=Journée+Jeunesse',
                url: '#',
                height: Math.floor(300 + Math.random() * 200),
                title: 'Journée Jeunesse',
                date: '10/08/2024',
                cta: 'S’inscrire',
              },
              {
                id: '8',
                img: 'https://via.placeholder.com/400x300/62BF92/FFFFFF?text=Soirée+Louange',
                url: '#',
                height: Math.floor(300 + Math.random() * 200),
                title: 'Soirée Louange',
                date: '15/08/2024',
                cta: 'Voir',
              },
              // Carte d'appel à l'action premium pour remplir le trou du bas
              {
                id: 'cta',
                isCta: true,
                img: '',
                url: '#',
                title: '',
                date: '',
                cta: '',
                height: 180, // hauteur adaptée pour combler le trou
              },
            ]}
            animateFrom="bottom"
            scaleOnHover={true}
            blurToFocus={true}
            colorShiftOnHover={true}
            renderItem={item => (
              item.isCta ? (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary-blue/90 to-primary-orange/80 rounded-[10px] shadow-lg">
                  <button className="px-6 py-3 rounded-lg bg-white text-primary-blue font-bold text-base shadow-lg hover:bg-primary-blue hover:text-white transition">
                    Découvrir tous les événements
                  </button>
                </div>
              ) : (
                <div className="relative w-full h-full rounded-[10px] overflow-hidden group cursor-pointer">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/10 p-4 flex flex-col gap-2">
                    <span className="text-xs text-white/80">{item.date}</span>
                    <span className="text-lg font-semibold text-white">{item.title}</span>
                    <button className="mt-2 px-3 py-1 rounded bg-primary-orange text-white text-xs font-semibold w-max hover:bg-primary-orange/90 transition">{item.cta}</button>
                  </div>
                </div>
              )
            )}
          />
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