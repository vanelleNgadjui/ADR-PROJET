import React from 'react';
import { Link } from 'react-router-dom';

interface FunctionalityCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  actions: {
    primary: {
      label: string;
      to: string;
      bgColor: string;
      hoverColor: string;
    };
    secondary: {
      label: string;
      to: string;
    };
  };
}

const FunctionalityCard: React.FC<FunctionalityCardProps> = ({
  title,
  description,
  icon,
  iconBgColor,
  iconColor,
  actions
}) => {
      return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-105 h-full flex flex-col">
        <div className="p-4 sm:p-6 flex-1 flex flex-col">
          {/* Header avec icône et titre */}
          <div className="flex items-center mb-3 sm:mb-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${iconBgColor} rounded-xl flex items-center justify-center mr-3 sm:mr-4`}>
              <div className={iconColor}>
                {icon}
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h3>
          </div>
          
          {/* Description */}
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
            {description}
          </p>
          
          {/* Actions en bas - comme dans EventCardVertical */}
          <div className="flex flex-wrap gap-2 mt-auto">
            <Link 
              to={actions.primary.to}
              className={`px-3 py-2 sm:px-4 sm:py-2 ${actions.primary.bgColor} ${actions.primary.hoverColor} text-white text-xs sm:text-sm font-medium rounded-lg transition-colors`}
            >
              {actions.primary.label}
            </Link>
            <Link 
              to={actions.secondary.to}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              {actions.secondary.label}
            </Link>
          </div>
        </div>
      </div>
    );
  };

export default FunctionalityCard;

