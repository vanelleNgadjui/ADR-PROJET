import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { 
  HomeIcon, 
  BellIcon, 
  CalendarIcon, 
  PlusIcon, 
  MinusIcon,
  UsersIcon,
  TicketIcon,
  HelpCircleIcon,
  CrownIcon,
  UserIcon,
  LogOutIcon
} from 'lucide-react';
import calendarIcon from '../../assets/calendar.svg';
import { useAuth } from "../../hooks/useAuth";
import { useSidebar } from "../../context/dashboard/SidebarContext";
import { useTheme } from "../../context/dashboard/ThemeContext";
import Avatar from "../ui/Avatar";
import { useProfilePhoto } from "../../hooks/useProfilePhoto";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const menuItems: MenuItem[] = [
  { name: "Accueil", href: "/home", icon: HomeIcon },
  { name: "Billets & Inscription", href: "/tickets", icon: TicketIcon },
  { name: "Calendrier", href: "/calendar", icon: () => <img src={calendarIcon} alt="Calendrier" className="w-4 h-4" /> },
  { name: "Favoris", href: "/favorites", icon: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  ) },
  { name: "Organisateurs", href: "/followed-organizers", icon: UsersIcon },
  { name: "Notifications", href: "/notifications", icon: BellIcon },
  { name: "Profil", href: "/profile", icon: UserIcon },
  { name: "Support & Assistance", href: "/support", icon: HelpCircleIcon },
];

export default function HomeSidebar() {
  const { isExpanded, isMobileOpen, toggleMobileSidebar, toggleSidebar } = useSidebar();
  const { theme } = useTheme();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isOrganizerExpanded, setIsOrganizerExpanded] = useState(true);
  const activeItemRef = useRef<HTMLAnchorElement>(null);
  
  const { getOptimizedUrl } = useProfilePhoto({
    userId: user?.id || '',
    userName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur',
    initialPhotoUrl: user?.user_metadata?.avatar_url || ''
  });

  // Faire défiler automatiquement vers l'élément actif
  useEffect(() => {
    if (activeItemRef.current && isExpanded) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [location.pathname, isExpanded]);

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Erreur lors de la déconnexion:', error);
      } else {
        console.log('Déconnexion réussie');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Fonction pour choisir le bon logo selon le contexte
  const getLogoPath = () => {
    const isDark = theme === 'dark';
    
    if (isExpanded) {
      // Sidebar étendue : logo complet
      return isDark ? '/src/assets/LOGO-ADR-blanc-jaune.png' : '/src/assets/LOGO-ADR-bleu-jaune.png';
    } else {
      // Sidebar rétrécie : logo icône
      return isDark ? '/src/assets/LOGO-ADR-icone-blanc-jaune.png' : '/src/assets/LOGO-ADR-icone-bleu-jaune.png';
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed top-12 left-0 right-0 bottom-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed left-0 z-40 transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-64' : 'w-16'
        } bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }         ${
          isMobileOpen ? 'top-12 h-[calc(100vh-3rem)]' : 'top-0 h-screen'
        }`}
        onClick={() => {
          // Si la sidebar est rétrécie et qu'on clique dessus, l'étendre
          if (!isExpanded && !isMobileOpen) {
            toggleSidebar();
          }
        }}
      >
        
        {/* Header - Logo (Desktop only) */}
        <div className="hidden lg:flex items-center h-16 px-4 flex-shrink-0">
          <Link to="/home">
            <img 
              src={getLogoPath()}
              alt="Logo" 
              className={`${isExpanded ? 'h-8' : 'h-6'} w-auto`}
            />
          </Link>
        </div>
        
        {/* Structure avec flex pour fixer le footer en bas */}
        <div className="flex flex-col h-full lg:h-[calc(100vh-4rem)]">
          {/* Contenu principal scrollable */}
          <div className="flex-1 overflow-hidden flex flex-col">
          {/* Section Actions principales */}
          {(isExpanded || isMobileOpen) ? (
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 space-y-3 flex-shrink-0">
              {/* Bouton "Mes événements" */}
              <Link
                to="/my-events"
                className="w-full bg-primary-blue text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-primary-blue/90 transition-colors text-sm font-medium shadow-sm"
              >
                <CalendarIcon className="w-4 h-4 mr-2 text-white" />
                Mes événements
              </Link>

              {/* Section "Devenez organisateur" - Accordéon */}
              <div className="bg-gradient-to-br from-secondary-yellow/10 to-secondary-yellow/5 dark:from-secondary-yellow/20 dark:to-secondary-yellow/10 rounded-lg border border-secondary-yellow/20 overflow-hidden">
                {/* Header avec titre et icône */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-gray-900 dark:text-white">
                    Devenez organisateur
                  </h3>
                  <button
                    onClick={() => setIsOrganizerExpanded(!isOrganizerExpanded)}
                    className="p-1 hover:bg-secondary-yellow/20 rounded transition-colors"
                    title={isOrganizerExpanded ? 'Réduire' : 'Développer'}
                  >
                    {isOrganizerExpanded ? (
                      <MinusIcon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <PlusIcon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                </div>
                
                {/* Contenu de l'accordéon */}
                {isOrganizerExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                      Prenez les commandes et créez vos propres événements pour enrichir la communauté.
                    </p>
                    <button className="w-full bg-transparent border border-secondary-yellow text-secondary-yellow px-3 py-2 rounded-lg text-[10px] font-medium hover:bg-secondary-yellow/10 transition-colors">
                      Je deviens organisateur
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Version rétractée - icônes centrées
            <div className="px-2 py-4 border-b border-gray-200 dark:border-gray-700 space-y-3 flex-shrink-0">
              {/* Bouton "Mes événements" rétracté */}
              <Link
                to="/my-events"
                className="w-12 h-12 bg-primary-blue text-white rounded-lg flex items-center justify-center hover:bg-primary-blue/90 transition-colors shadow-sm"
                title="Mes événements"
              >
                <CalendarIcon className="w-5 h-5 text-white" />
              </Link>

              {/* Icône "Devenez organisateur" rétractée */}
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-yellow/10 to-secondary-yellow/5 dark:from-secondary-yellow/20 dark:to-secondary-yellow/10 rounded-lg border border-secondary-yellow/20 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity" title="Devenez organisateur">
                <CrownIcon className="w-5 h-5 text-secondary-yellow" />
              </div>
            </div>
          )}
          
                    {/* Navigation Menu - Scrollable */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              const isMesEvenementsActive = item.href === '/mes-evenements' && isActive;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  ref={isActive ? activeItemRef : null}
                  className={`flex items-center ${
                    isExpanded || isMobileOpen 
                      ? 'px-4 py-3' 
                      : 'px-1 py-2 justify-center'
                  } text-sm font-medium rounded-xl transition-all duration-200 ${
                    isMesEvenementsActive
                      ? 'bg-primary-blue text-white shadow-md'
                      : isActive
                      ? 'bg-transparent text-primary-blue border border-primary-blue hover:bg-primary-blue/10'
                      : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${
                    isMesEvenementsActive ? 'text-white' :
                    isActive ? 'text-primary-blue' : 'text-gray-500'
                  }`} />
                  {(isExpanded || isMobileOpen) && (
                    <span className="ml-3 truncate">{item.name}</span>
                  )}
                  {item.badge && (isExpanded || isMobileOpen) && (
                    <span className={`ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      isMesEvenementsActive ? 'bg-white/20 text-white' :
                      isActive ? 'bg-primary-blue/10 text-primary-blue' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Événements consultés récemment */}
          {(isExpanded || isMobileOpen) ? (
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                  Consultés récemment
                </h3>
                <button className="text-[10px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex-shrink-0 ml-2">
                  Voir tout
                </button>
              </div>
              <div className="space-y-1.5 max-h-20 overflow-y-auto">
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-md flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-[10px] font-medium">CJ</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                      Conférence des jeunes
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      San Francisco, CA
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-md flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-[10px] font-medium">LF</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                      Lève-toi France 2023
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      Versailles, FR
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-teal-500 rounded-md flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-[10px] font-medium">SB</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                      Séminaire Business Cameroun
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      Douala, CM
                    </p>
                  </div>
                </div>
                
                {/* Élément supplémentaire pour tester le scroll */}
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-md flex-shrink-0 flex items-center justify-center">
                    <span className="text-white text-[10px] font-medium">AD</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                      Atelier de développement personnel
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      Paris, FR
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Version rétractée - juste une icône centrée
            <div className="px-2 py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-md flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity" title="Consultés récemment">
                <span className="text-white text-[10px] font-medium">CR</span>
              </div>
            </div>
          )}

          </div>

          {/* User Profile Section - Fixé en bas */}
          <div className="border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
            {(isExpanded || isMobileOpen) ? (
              <div className="p-6">
                <div className="flex items-center">
                  <div className="relative">
                    <Avatar
                      src={getOptimizedUrl()}
                      alt={user?.user_metadata?.full_name || user?.email || 'Utilisateur'}
                      size="medium"
                      role={user?.user_metadata?.role || 'participant'}
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.user_metadata?.role === 'organisateur' ? 'Organisateur' : 
                       user?.user_metadata?.role === 'admin' ? 'Administrateur' : 'Participant'}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleSignOut}
                    className="ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Se déconnecter"
                  >
                    <LogOutIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            ) : (
              // Version rétractée - juste l'icône de déconnexion centrée
              <div className="p-2 flex justify-center">
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Se déconnecter"
                >
                  <LogOutIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
