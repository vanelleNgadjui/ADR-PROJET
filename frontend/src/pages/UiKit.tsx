import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { PolymorphicButton } from '../components/ui/PolymorphicButton';
import MagicBento from '../components/ui/MagicBento';
import Masonry from '../components/ui/Masonry';
import { Home, User, Calendar, Music, BookOpen, Users, Mountain } from 'lucide-react';
import CardSwap, { Card as CardSwapCard } from '../components/ui/CardSwap';
import RotatingText from '../components/ui/TextAnimations/RotatingText';
import FallingText from '../components/ui/TextAnimations/FallingText';
import Carousel from '../components/ui/Carousel';
import AnimatedList from '../components/ui/AnimatedList';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import ScrollStack, { ScrollStackItem } from '../components/ui/ScrollStack';
import card1Svg from '../assets/Card-1.svg';
import card2Svg from '../assets/Card-2.svg';
import card3Svg from '../assets/Card-3.svg';
import card4Svg from '../assets/Card-4.svg';

export default function UiKit() {
  return (
    <div className="bg-neutral-white min-h-screen flex flex-col">
      {/* Header - Full width sur mobile */}
      <div className="header-full-width">
        <Header />
      </div>
      <div className="flex-1 p-8 space-y-8 pt-12 lg:pt-16">
      {/* Section Hero avec CardSwap aligné à droite */}
      <section className="relative flex flex-col md:flex-row items-center justify-between pt-16 pb-4 bg-gradient-to-br from-primary-blue/5 to-primary-orange/5 rounded-3xl mb-12 overflow-hidden">
        {/* Texte à gauche */}
        <div className="w-full md:w-[65%] flex flex-col items-start justify-center text-left md:mx-0 px-6 md:pl-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Tous les événements chrétiens. Au même endroit.</h1>
          <p className="text-lg md:text-xl text-neutral-700 mb-8">Créez. Découvrez. Vivez les événements qui nourrissent votre foi.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="primary">Découvrir les événements</Button>
            <Button variant="secondary">Organiser un événement</Button>
          </div>
        </div>
        {/* CardSwap à droite */}
        <div className="relative w-full md:w-[35%] min-h-[340px]">
          <div className="absolute -bottom-16 right-0">
            <CardSwap width={420} height={320} verticalDistance={40} delay={3500}>
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

      {/* Section FallingText */}
      <section className="relative flex flex-col items-center justify-center py-10 bg-gradient-to-br from-primary-blue/5 to-primary-orange/5 rounded-3xl mb-8 overflow-hidden min-h-[200px]">
        <div className="w-full max-w-3xl mx-auto">
          <FallingText
            text="Chaque jour, des dizaines d’événements chrétiens sont organisés, mais ils restent invisibles, dispersés, mal promus."
            highlightWords={["Chaque", "jour", "invisibles", "dispersés", "mal", "promus"]}
            fontSize="2rem"
            trigger="auto"
            gravity={3}
            backgroundColor="transparent"
            // Surcharge la couleur via CSS
            // On cible .text-primary-blue dans le composant ou via global CSS si besoin
          />
          <style>{`
            .text-cyan-500 { color: #1e3a8a !important; }
          `}</style>
        </div>
      </section>

     

      {/* Section Hero avec RotatingText */}
      <section className="relative flex flex-col md:flex-row items-center justify-between pt-16 pb-4 bg-gradient-to-br from-primary-blue/5 to-primary-orange/5 rounded-3xl mb-12 overflow-hidden">
        {/* Texte à gauche */}
        <div className="w-full md:w-[65%] flex flex-col items-start justify-center text-left md:mx-0 px-6 md:pl-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Tous les événements chrétiens. Au même endroit.</h1>
          <div className="text-lg md:text-xl text-neutral-700 mb-8 flex flex-wrap items-center">
            <RotatingText
              texts={["Créez", "Découvrez", "Vivez"]}
              rotationInterval={1800}
              mainClassName="inline-flex items-center bg-primary-blue text-white rounded-lg px-5 py-2 shadow-lg font-bold mr-3 transition-colors duration-300"
              splitBy="words"
            />
            <span>les événements qui nourrissent votre foi.</span>
          </div>
        </div>
        {/* CardSwap à droite */}
        <div className="relative w-full md:w-[35%] min-h-[340px]">
          <div className="absolute -bottom-16 right-0">
            <CardSwap width={420} height={320} verticalDistance={40} delay={3500}>
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
      <h1 className="text-h1 font-bold mb-6">UI Kit – Design System</h1>
      <section>
        <h2 className="text-h2 font-semibold mb-4">Boutons</h2>
        <div className="flex gap-4 flex-wrap">
          <Button variant="primary" icon={Home}>Primary</Button>
          <Button variant="secondary" icon={User}>Secondary</Button>
          <Button variant="ghost" icon={Calendar}>Ghost</Button>
          <Button loading>Loading</Button>
        </div>
        <div className="mt-4 flex gap-4 flex-wrap">
          <PolymorphicButton>Polymorphic Button</PolymorphicButton>
          <PolymorphicButton as="a" href="#" className="underline text-primary-blue">Polymorphic Link</PolymorphicButton>
        </div>
      </section>
      <section>
        <h2 className="text-h2 font-semibold mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Event Premium" description="Un événement premium avec une image, une description et des actions." image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" actions={<Button>Participer</Button>} />
          <Card title="Simple Card" description="Carte sans image, juste du texte." />
        </div>
      </section>
      <section>
        <h2 className="text-h2 font-semibold mb-4">Inputs</h2>
        <div className="flex flex-col gap-4 max-w-md">
          <Input label="Email" icon={<User />} placeholder="Votre email" />
          <Input label="Mot de passe" type="password" icon={<Home />} placeholder="••••••" error="Mot de passe requis" />
        </div>
      </section>
      <section>
        <h2 className="text-h2 font-semibold mb-4">Magic Bento</h2>
        <div className="my-8">
          <MagicBento />
        </div>
      </section>

      {/* Section AnimatedList */}
      <section>
        <h2 className="text-h2 font-semibold mb-4">Animated List (Test)</h2>
        <div className="my-8 flex justify-center">
          <AnimatedList />
        </div>
      </section>

      <section className="pt-8">
        <h2 className="text-h2 font-semibold mb-4">Masonry (Grille d'événements)</h2>
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
                img: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
                url: '#',
                height: Math.floor(300 + Math.random() * 200),
                title: 'Journée Jeunesse',
                date: '10/08/2024',
                cta: 'S’inscrire',
              },
              {
                id: '8',
                img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
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

       {/* Section Témoignages avec Carousel */}
       <section className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-primary-blue/5 to-primary-orange/5 rounded-3xl mt-16">
        <h2 className="text-3xl font-bold mb-8 text-primary-blue">Ils ont vécu l'expérience</h2>
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
      </section>


  <section className="h-[550px] w-full flex justify-center">
  <ScrollStack className="h-full w-full">
    <ScrollStackItem itemClassName="w-full"> 
      <img 
        src={card1Svg} 
        alt="Card 1" 
      />
    </ScrollStackItem>
    <ScrollStackItem itemClassName="w-full">
      <img 
        src={card2Svg} 
        alt="Card 2" 
      />
    </ScrollStackItem>
    <ScrollStackItem itemClassName="w-full">
      <img 
        src={card3Svg} 
        alt="Card 3" 
      />
    </ScrollStackItem>
        <ScrollStackItem itemClassName="w-full">
      <img 
        src={card4Svg} 
        alt="Card 4" 
      />
    </ScrollStackItem>
  </ScrollStack>
</section>
      </div>
      <Footer />
    </div>
  );
} 