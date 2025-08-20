import { useState, useEffect } from "react";
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import Badge from "./ui/Badge";

interface Event {
  id: number;
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string;
  lieu: string;
  statut: string;
  format: string;
  tarification: string;
  capacite_max: number;
  organisateur_id: string;
}

export default function EventsCard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date_debut', { ascending: true })
        .limit(5);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'publie': return 'success';
      case 'brouillon': return 'warning';
      case 'annule': return 'error';
      default: return 'light';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'publie': return 'Publié';
      case 'brouillon': return 'Brouillon';
      case 'annule': return 'Annulé';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="p-6 border border-gray-200 rounded-2xl dark:border-gray-800">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border border-gray-200 rounded-2xl dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Mes Événements
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {events.length} événement{events.length > 1 ? 's' : ''}
        </span>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8">
          <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Aucun événement trouvé
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="p-4 border border-gray-100 rounded-lg dark:border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-800 dark:text-white/90">
                  {event.titre}
                </h4>
                <Badge variant="light" color={getStatusColor(event.statut)}>
                  {getStatusLabel(event.statut)}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {event.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  <span>{formatDate(event.date_debut)}</span>
                </div>
                
                {event.lieu && (
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-3 h-3" />
                    <span>{event.lieu}</span>
                  </div>
                )}

                {event.capacite_max && (
                  <div className="flex items-center gap-1">
                    <UsersIcon className="w-3 h-3" />
                    <span>Max {event.capacite_max}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" />
                  <span>{event.format}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
