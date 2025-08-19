import React from 'react';

interface CardProps {
  image?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ image, title, description, actions, className = '', children }) => (
  <div className={`bg-white rounded-md shadow-card p-6 flex flex-col gap-4 ${className}`} tabIndex={0} aria-label={title}>
    {image && <img src={image} alt={title} className="rounded-md w-full object-cover max-h-48" />}
    <div>
      <h3 className="text-h3 font-bold mb-2">{title}</h3>
      {description && <p className="text-body text-neutral-black/80 mb-2">{description}</p>}
      {children}
    </div>
    {actions && <div className="mt-2 flex gap-2">{actions}</div>}
  </div>
); 