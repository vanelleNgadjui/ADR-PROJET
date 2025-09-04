import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from '../../context/dashboard/SidebarContext';
import { useTheme } from '../../context/dashboard/ThemeContext';
import Avatar from '../ui/Avatar';
import { useProfilePhoto } from '../../hooks/useProfilePhoto';
import { 
  HomeIcon, 
  BarChart3Icon,
  CalendarIcon, 
  UsersIcon,
  TicketIcon,
  MegaphoneIcon,
  PieChartIcon,
  SettingsIcon,
  ArchiveIcon,
  HelpCircleIcon,
  CreditCardIcon,
  WrenchIcon,
  LogOutIcon,
  CrownIcon,
  UserIcon
} from 'lucide-react';

const OrganizerSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, toggleMobileSidebar, toggleSidebar } = useSidebar();
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const activeItemRef = useRef<HTMLAnchorElement>(null);
  const [isSubscriptionExpanded, setIsSubscriptionExpanded] = useState(true);

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

  // Menus pour organisateurs
  const organizerMenus = [
    { name: 'Accueil', href: '/homeOrg', icon: HomeIcon },
    { name: 'Événements', href: '/events', icon: CalendarIcon },
    { name: 'Participants', href: '/participants', icon: UserIcon },
    { name: 'Communautés', href: '/communities', icon: UsersIcon },
    { name: 'Billets & Inscription', href: '/tickets', icon: TicketIcon },
    { name: 'Promotion & Communication', href: '/promotion', icon: MegaphoneIcon },
    { name: 'Suivi & Analyse', href: '/analytics', icon: PieChartIcon },
    { name: 'Outils de Collaboration', href: '/collaboration', icon: WrenchIcon },
    { name: 'Finances & Paiements', href: '/finances', icon: CreditCardIcon },
    { name: 'Archives', href: '/archives', icon: ArchiveIcon },
    { name: 'Support & Assistance', href: '/support', icon: HelpCircleIcon },
    { name: 'Paramètres', href: '/settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Overlay mobile */}
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
          <Link to="/homeOrg">
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
                {/* Bouton "Tableau de bord" - comme "Mes événements" */}
                <Link
                  to="/dashboard"
                  className="w-full bg-primary-blue text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-primary-blue/90 transition-colors text-sm font-medium shadow-sm"
                >
                  <BarChart3Icon className="w-4 h-4 mr-2" />
                  Tableau de bord
                </Link>

                {/* Section "Abonnements" */}
                <div className="bg-gradient-to-br from-primary-blue/5 to-primary-blue/10 dark:from-primary-blue/20 dark:to-primary-blue/30 rounded-lg border border-primary-blue/20 overflow-hidden">
                  {/* Header avec titre et icône */}
                  <div className="px-4 py-3 flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-white">
                      Abonnements
                    </h3>
                    <button
                      onClick={() => setIsSubscriptionExpanded(!isSubscriptionExpanded)}
                      className="p-1 hover:bg-primary-blue/20 rounded transition-colors"
                      title={isSubscriptionExpanded ? 'Réduire' : 'Développer'}
                    >
                      {isSubscriptionExpanded ? (
                        <svg className="w-3 h-3 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {/* Contenu de l'accordéon */}
                  {isSubscriptionExpanded && (
                    <div className="px-4 pb-4 space-y-3">
                      <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                        Débloquez des fonctionnalités premium pour aller plus loin
                      </p>
                      <Link
                        to="/subscriptions"
                        className="w-full bg-transparent border border-primary-blue text-primary-blue px-3 py-2 rounded-lg text-[10px] font-medium hover:bg-primary-blue/10 transition-colors flex items-center justify-center"
                      >
                        <CrownIcon className="w-3 h-3 mr-1" />
                        Voir les plans
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Version rétractée - icônes centrées
              <div className="px-2 py-4 border-b border-gray-200 dark:border-gray-700 space-y-3 flex-shrink-0">
                {/* Bouton "Tableau de bord" rétracté */}
                <Link
                  to="/dashboard"
                  className="w-12 h-12 bg-primary-blue text-white rounded-lg flex items-center justify-center hover:bg-primary-blue/90 transition-colors shadow-sm"
                  title="Tableau de bord"
                >
                  <BarChart3Icon className="w-5 h-5" />
                </Link>

                {/* Icône "Abonnements" rétractée */}
                <div className="w-12 h-12 bg-gradient-to-br from-primary-blue/5 to-primary-blue/10 dark:from-primary-blue/20 dark:to-primary-blue/30 rounded-lg border border-primary-blue/20 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity" title="Abonnements">
                  <CrownIcon className="w-5 h-5 text-primary-blue" />
                </div>
              </div>
            )}

            {/* Navigation Menu - Scrollable */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {organizerMenus.map((menu) => {
                const Icon = menu.icon;
                const isActive = location.pathname === menu.href;
                const isMesEvenementsActive = menu.href === '/mes-evenements' && isActive;
                
                return (
                  <Link
                    key={menu.name}
                    to={menu.href}
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
                    <Icon className={`w-5 h-5 flex-shrink-0 ${
                      isMesEvenementsActive ? 'text-white' :
                      isActive ? 'text-primary-blue' : 'text-gray-500'
                    }`} />
                    {(isExpanded || isMobileOpen) && (
                      <span className="ml-3 truncate">{menu.name}</span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Événements Brouillons */}
            {(isExpanded || isMobileOpen) ? (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                    Événements Brouillons
                  </h3>
                  <button className="text-[10px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex-shrink-0 ml-2">
                    Voir tout
                  </button>
                </div>
                <div className="space-y-1.5 max-h-20 overflow-y-auto">
                  <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-md flex-shrink-0 flex items-center justify-center">
                      <span className="text-white text-[10px] font-medium">CG</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        Concert Gospel
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        Brouillon
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-md flex-shrink-0 flex items-center justify-center">
                      <span className="text-white text-[10px] font-medium">CF</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        Conférence Foi
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        Brouillon
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-teal-500 rounded-md flex-shrink-0 flex items-center justify-center">
                      <span className="text-white text-[10px] font-medium">RS</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        Retraite Spirituelle
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        Brouillon
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Version rétractée - juste une icône centrée
              <div className="px-2 py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 flex justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-md flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity" title="Événements Brouillons">
                  <span className="text-white text-[10px] font-medium">EB</span>
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
                      role={user?.user_metadata?.role || 'organisateur'}
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
};

export default OrganizerSidebar;
