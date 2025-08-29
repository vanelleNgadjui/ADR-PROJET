import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, XIcon, SearchIcon } from 'lucide-react';
import { ThemeToggleButton } from '../dashboard/common/ThemeToggleButton';
import { useTheme } from '../../context/dashboard/ThemeContext';

const LandingHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-50 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              className="h-8"
              src={theme === 'dark' ? '/src/assets/LOGO-ADR-blanc-jaune.png' : '/src/assets/LOGO-ADR-bleu-jaune.png'}
              alt="Agenda du Royaume"
            />
          </Link>

          {/* Barre de recherche - Desktop */}
          <div className="hidden lg:block flex-1 max-w-2xl mx-8">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un événement près de chez vous..."
                className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link 
              to="/auth/signin" 
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Se connecter
            </Link>
            <Link 
              to="/auth/signup" 
              className="bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-primary-blue/90 transition-colors"
            >
              S'inscrire
            </Link>
            <ThemeToggleButton />
          </nav>

          {/* Menu mobile */}
          <button
            className="lg:hidden w-10 h-10 text-gray-500 dark:text-gray-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XIcon className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Menu mobile déroulant */}
        {isMobileMenuOpen && (
          <div className="lg:hidden w-full px-3 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            {/* Barre de recherche mobile */}
            <div className="mb-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un événement..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>
            </div>

            {/* Navigation mobile */}
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/auth/signin" 
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Se connecter
              </Link>
              <Link 
                to="/auth/signup" 
                className="bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-primary-blue/90 transition-colors text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                S'inscrire
              </Link>
              <div className="flex justify-center pt-2">
                <ThemeToggleButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingHeader;
