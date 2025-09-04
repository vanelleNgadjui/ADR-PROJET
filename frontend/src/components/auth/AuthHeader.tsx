import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/LOGO-ADR-bleu-jaune.png';

interface AuthHeaderProps {
  showBackButton?: boolean;
  backTo?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ 
  showBackButton = false, 
  backTo = '/' 
}) => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md shadow-sm px-4 md:px-8 h-16 flex items-center justify-between sticky top-0 z-40 border-b border-neutral-200 transition-all duration-300">
      {/* Logo */}
      <div className="flex items-center h-full">
        <Link to="/">
          <img src={logo} alt="Logo Agenda du Royaume" className="h-8 max-h-full w-auto rounded-md object-contain cursor-pointer hover:opacity-80 transition-opacity" />
        </Link>
      </div>
      
      {/* Navigation simple */}
      <nav className="hidden md:flex items-center gap-2">
        {showBackButton && (
          <Link
            to={backTo}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </Link>
        )}
      </nav>
      
      {/* Mobile menu button */}
      <div className="md:hidden">
        {showBackButton && (
          <Link
            to={backTo}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </Link>
        )}
      </div>
    </header>
  );
}; 