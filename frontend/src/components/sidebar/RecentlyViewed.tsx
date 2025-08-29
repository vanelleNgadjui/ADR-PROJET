import React from 'react';

const RecentlyViewed: React.FC = () => {
  // Données mockées pour les événements consultés récemment
  const recentEvents = [
    {
      id: '1',
      title: 'Conférence des jeunes église ICC',
      location: 'San Francisco, CA',
      date: 'Mars 10-19',
      price: 'Gratuit',
      image: '/api/placeholder/60/60'
    },
    {
      id: '2',
      title: 'Séminaire Business',
      location: 'Douala, CM',
      date: 'Mars 15-20',
      price: '15 000 fca',
      image: '/api/placeholder/60/60'
    }
  ];

  return (
    <div className="p-6 border-t border-gray-200">
      <h3 className="text-sm font-medium text-gray-900 mb-4">
        Consultés récemment
      </h3>
      
      <div className="space-y-3">
        {recentEvents.map((event) => (
          <div key={event.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
            <img
              src={event.image}
              alt={event.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {event.title}
              </p>
              <p className="text-xs text-gray-500">
                {event.location} • {event.date}
              </p>
              <p className="text-xs text-gray-500">
                À partir de {event.price}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-4 w-full flex items-center justify-center text-sm text-gray-500 hover:text-gray-700">
        <span className="mr-2">🗑️</span>
        Supprimer
      </button>
    </div>
  );
};

export default RecentlyViewed;
