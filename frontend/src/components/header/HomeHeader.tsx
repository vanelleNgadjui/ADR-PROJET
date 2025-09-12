import { useState } from "react";
import { Link } from "react-router-dom";
import NotificationDropdown from "../dashboard/header/NotificationDropdown";
import UserDropdown from "../dashboard/header/UserDropdown";
import LocationDisplay from "./LocationDisplay";
import { MenuIcon, XIcon, MoreHorizontalIcon } from "lucide-react";
import calendarIcon from "../../assets/calendar.svg";
import { ThemeToggleButton } from "../dashboard/common/ThemeToggleButton";
import { useSidebar } from "../../context/dashboard/SidebarContext";
import { useTheme } from "../../context/dashboard/ThemeContext";
import { useAuth } from "../../hooks/useAuth";

interface HomeHeaderProps {
  onClick?: () => void;
  onToggle: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ onClick, onToggle }) => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, isExpanded } = useSidebar();
  const { theme } = useTheme();
  const { user } = useAuth();

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  return (
    <header 
      className="flex bg-white border-gray-200 z-50 dark:border-gray-800 dark:bg-gray-900 lg:border-b shadow-sm"
      style={{
        left: isMobileOpen ? '0' : window.innerWidth >= 1024 ? (isExpanded ? '16rem' : '4rem') : '0',
        right: '0'
      }}
    >
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 py-1.5 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="block w-10 h-10 text-gray-500 lg:hidden dark:text-gray-400"
            onClick={onToggle}
          >
            {isMobileOpen ? (
              <XIcon className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={onClick}
            className="items-center justify-center hidden w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
          >
            <MenuIcon className="w-5 h-5" />
          </button>

          <Link to={user ? "/home" : "/"} className="lg:hidden">
            <img
              className="h-8"
              src={theme === 'dark' ? '/src/assets/LOGO-ADR-blanc-jaune.png' : '/src/assets/LOGO-ADR-bleu-jaune.png'}
              alt="Agenda du Royaume"
            />
          </Link>

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

          <div className="hidden lg:flex items-center gap-3">
            {/* Calendrier - comme notification */}
            <button className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white">
              <img src={calendarIcon} alt="Calendrier" className="w-5 h-5" />
            </button>

            {/* Localisation */}
            <LocationDisplay />
          </div>
        </div>
        
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-3">
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

export default HomeHeader;

