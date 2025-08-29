import { Link, useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  UsersIcon, 
  SettingsIcon, 
  BarChart3Icon,
  FileTextIcon,
  BellIcon,
  UserIcon,
  LogOutIcon
} from "lucide-react";
import calendarIcon from "../../../assets/calendar.svg";
import { useAuth } from "../../../hooks/useAuth";
import { useSidebar } from "../../../context/dashboard/SidebarContext";
import { useTheme } from "../../../context/dashboard/ThemeContext";
import Avatar from "../../ui/Avatar";
import { useProfilePhoto } from "../../../hooks/useProfilePhoto";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const menuItems: MenuItem[] = [
  { name: "Tableau de bord", href: "/dashboard", icon: HomeIcon },
  { name: "Événements", href: "/events", icon: () => <img src={calendarIcon} alt="Événements" className="w-5 h-5" /> },
  { name: "Communautés", href: "/communities", icon: UsersIcon },
  { name: "Analytics", href: "/analytics", icon: BarChart3Icon },
  { name: "Rapports", href: "/reports", icon: FileTextIcon },
  { name: "Notifications", href: "/notifications", icon: BellIcon },
  { name: "Profil", href: "/profile", icon: UserIcon },
  { name: "Paramètres", href: "/settings", icon: SettingsIcon },
];

export default function Sidebar() {
  const { isExpanded, isMobileOpen, toggleMobileSidebar } = useSidebar();
  const { theme } = useTheme();
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const { getOptimizedUrl } = useProfilePhoto({
    userId: user?.id || '',
    userName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur',
    initialPhotoUrl: user?.user_metadata?.avatar_url || ''
  });

  const handleSignOut = async () => {
    try {
      await signOut();
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
      <div className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-16'
      } bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-700 lg:translate-x-0 lg:top-0 lg:h-screen ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Header - Logo (Desktop only) */}
        <div className="hidden lg:flex items-center h-16 px-3">
          <img 
            src={getLogoPath()}
            alt="Logo" 
            className={`${isExpanded ? 'h-8' : 'h-6'} w-auto`}
          />
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {(isExpanded || isMobileOpen) && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
                {item.badge && (isExpanded || isMobileOpen) && (
                  <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <Avatar
              src={getOptimizedUrl()}
              alt={user?.user_metadata?.full_name || user?.email || 'Utilisateur'}
              size="medium"
              role={user?.user_metadata?.role || 'participant'}
            />
            
            {(isExpanded || isMobileOpen) && (
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
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
              className="ml-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Se déconnecter"
            >
              <LogOutIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
