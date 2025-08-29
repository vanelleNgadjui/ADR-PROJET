import { Link, useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  UserIcon, 
  LogOutIcon,
  MapPinIcon,
  BellIcon,
  PlusIcon,
  MinusIcon
} from "lucide-react";
import calendarIcon from '../../assets/calendar.svg';
import bookmarkIcon from '../../assets/bookmark.svg';
import { useState } from "react";
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
  { name: "Calendrier", href: "/calendar", icon: () => <img src={calendarIcon} alt="Calendrier" className="w-4 h-4" /> },
  { name: "Favoris", href: "/favorites", icon: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  ) },
  { name: "Notifications", href: "/notifications", icon: BellIcon },
  { name: "Profil", href: "/profile", icon: UserIcon },
];

export default function HomeSidebar() {
  const { isExpanded, isMobileOpen, toggleMobileSidebar, toggleSidebar } = useSidebar();
  const { theme } = useTheme();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isOrganizerExpanded, setIsOrganizerExpanded] = useState(true);
  
  const { getOptimizedUrl } = useProfilePhoto({
    userId: user?.id || '',
    userName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur',
    initialPhotoUrl: user?.user_metadata?.avatar_url || ''
  });

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
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out ${
          isExpanded ? 'w-64' : 'w-16'
        } bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700 lg:translate-x-0 lg:top-0 lg:h-screen ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
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
          <img 
            src={getLogoPath()}
            alt="Logo" 
            className={`${isExpanded ? 'h-8' : 'h-6'} w-auto`}
          />
        </div>
        
        {/* Structure avec flex pour fixer le footer en bas */}
        <div className="flex flex-col h-full lg:h-[calc(100vh-4rem)]">
          {/* Contenu principal scrollable */}
          <div className="flex-1 overflow-hidden flex flex-col">
          {/* Section Actions principales */}
          {(isExpanded || isMobileOpen) && (
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 space-y-3 flex-shrink-0">
              {/* Bouton "Mes événements" */}
              <Link
                to="/my-events"
                className="w-full bg-primary-blue text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-primary-blue/90 transition-colors text-sm font-medium shadow-sm"
              >
                <img src={calendarIcon} alt="Calendrier" className="w-4 h-4 mr-2" />
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
          )}
          
                    {/* Navigation Menu - Scrollable */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              const isHomeActive = item.href === '/home' && isActive;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isHomeActive
                      ? 'bg-transparent text-primary-blue border border-primary-blue hover:bg-primary-blue/10'
                      : isActive
                      ? 'bg-primary-blue text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${
                    isHomeActive ? 'text-primary-blue' : 
                    isActive ? 'text-white' : 'text-gray-500'
                  }`} />
                  {(isExpanded || isMobileOpen) && (
                    <span className="ml-3 truncate">{item.name}</span>
                  )}
                  {item.badge && (isExpanded || isMobileOpen) && (
                    <span className={`ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      isHomeActive ? 'bg-primary-blue/10 text-primary-blue' :
                      isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Événements consultés récemment */}
          {(isExpanded || isMobileOpen) && (
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
          )}

          </div>

          {/* User Profile Section - Fixé en bas */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex-shrink-0 bg-white dark:bg-gray-900">
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
              
              {(isExpanded || isMobileOpen) && (
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.user_metadata?.role === 'organisateur' ? 'Organisateur' : 
                     user?.user_metadata?.role === 'admin' ? 'Administrateur' : 'Participant'}
                  </p>
                </div>
              )}
              
              <button
                onClick={handleSignOut}
                className="ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Se déconnecter"
              >
                <LogOutIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
