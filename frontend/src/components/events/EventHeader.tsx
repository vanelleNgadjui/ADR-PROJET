import { useState } from "react";
import { Link } from "react-router-dom";
import NotificationDropdown from "../dashboard/header/NotificationDropdown";
import UserDropdown from "../dashboard/header/UserDropdown";
import { MenuIcon, XIcon, MoreHorizontalIcon } from "lucide-react";
import { ThemeToggleButton } from "../dashboard/common/ThemeToggleButton";
import { useTheme } from "../../context/dashboard/ThemeContext";

interface EventHeaderProps {
  onToggleSidebar?: () => void; // Pour ouvrir/fermer la progression latérale sur mobile
  isSidebarExpanded?: boolean; // État de la barre latérale
}

const EventHeader: React.FC<EventHeaderProps> = ({ onToggleSidebar, isSidebarExpanded = false }) => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { theme } = useTheme();

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-40 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          {/* Menu burger - Mobile seulement */}
          <button
            className="block w-10 h-10 text-gray-500 lg:hidden dark:text-gray-400"
            onClick={onToggleSidebar}
          >
            {isSidebarExpanded ? (
              <XIcon className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>

          {/* Logo - Desktop: gauche, Mobile: centre */}
          <Link to="/" className="lg:order-first">
            <img
              className="h-8"
              src={theme === 'dark' ? '/src/assets/LOGO-ADR-blanc-jaune.png' : '/src/assets/LOGO-ADR-bleu-jaune.png'}
              alt="Agenda du Royaume"
            />
          </Link>

          {/* Bouton menu application - Mobile seulement */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            {isApplicationMenuOpen ? (
              <XIcon className="w-5 h-5" />
            ) : (
              <MoreHorizontalIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {/* Zone des actions utilisateur */}
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            {/* Dark Mode Toggler */}
            <ThemeToggleButton />
            
            {/* Notification Menu Area */}
            <NotificationDropdown />
          </div>
          
          {/* User Area */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default EventHeader;
