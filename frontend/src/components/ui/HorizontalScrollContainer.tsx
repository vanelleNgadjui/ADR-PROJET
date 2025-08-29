import React from 'react';

interface HorizontalScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  gap?: '0' | '1' | '2' | '3' | '4'; // Espacement entre les éléments
}

const HorizontalScrollContainer: React.FC<HorizontalScrollContainerProps> = ({ 
  children, 
  className = '',
  gap = '3' // Par défaut gap-3 pour les événements
}) => {
  const gapClass = gap === '0' ? 'gap-0' : gap === '1' ? 'gap-1' : gap === '2' ? 'gap-2' : gap === '3' ? 'gap-3' : 'gap-4';
  
  return (
    <div className={`flex overflow-x-auto ${gapClass} pb-4 hide-scrollbar ${className}`}>
      {children}
    </div>
  );
};

export default HorizontalScrollContainer;
