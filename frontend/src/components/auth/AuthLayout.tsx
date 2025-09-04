import React from 'react';
import { Link } from 'react-router-dom';
import { AuthHeader } from './AuthHeader';
import Footer from '../ui/Footer';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string;
  containerSize?: 'small' | 'medium' | 'large';
  backgroundImage?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  backTo = '/',
  containerSize = 'medium',
  backgroundImage
}) => {
  const getContainerClass = () => {
    switch (containerSize) {
      case 'small':
        return 'max-w-md'; // 448px - pour les formulaires
      case 'large':
        return 'max-w-5xl'; // 1024px - pour les pages avec cartes
      default:
        return 'max-w-4xl'; // 896px - par défaut
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            {/* Header - Full width sur mobile */}
      <div className="header-full-width">
        <AuthHeader showBackButton={showBackButton} backTo={backTo} />
      </div>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4">
        <div className={`w-full ${getContainerClass()}`}>
          {/* Card */}
          <div 
            className={`rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 relative ${backgroundImage ? '' : 'bg-white'}`}
            style={backgroundImage ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            } : {}}
          >
            {backgroundImage && (
              <div className="absolute inset-0 bg-white/98 backdrop-blur-sm rounded-lg -z-10"></div>
            )}
            {/* Title */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Content */}
            {children}
          </div>

        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}; 