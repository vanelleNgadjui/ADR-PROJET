import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Event, EventWithRelations, EventFilters, PaginationOptions, PaginatedResult } from '../types/database';

interface UseEventsReturn {
  events: EventWithRelations[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

interface UseEventsOptions extends PaginationOptions {
  filters?: EventFilters;
  enabled?: boolean;
}

export const useEvents = (options: UseEventsOptions = {}): UseEventsReturn => {
  const [events, setEvents] = useState<EventWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    page = 1,
    limit = 20,
    order_by = 'date_debut',
    order_direction = 'asc',
    filters = {},
    enabled = true
  } = options;

  const buildQuery = useCallback(() => {
    let query = supabase
      .from('events')
      .select(`
        *,
        sous_categorie:sous_categories(*),
        organisateur:users(id, nom, prenom, photo_profil_url, role),
        groupe_prive:communautes(id, nom, slug),
        audiences:event_audiences(*),
        canaux_diffusion:event_canaux_diffusion(*),
        mots_cles:event_mots_cles(*),
        tickets_categories(*),
        tickets(*),
        intervenants:event_intervenants(*),
        sessions:event_sessions(*)
      `);

    // Appliquer les filtres
    if (filters.statut && filters.statut.length > 0) {
      query = query.in('statut', filters.statut);
    }

    if (filters.format && filters.format.length > 0) {
      query = query.in('format', filters.format);
    }

    if (filters.sous_categorie_id) {
      query = query.eq('sous_categorie_id', filters.sous_categorie_id);
    }

    if (filters.organisateur_id) {
      query = query.eq('organisateur_id', filters.organisateur_id);
    }

    if (filters.niveau_privacy && filters.niveau_privacy.length > 0) {
      query = query.in('niveau_privacy', filters.niveau_privacy);
    }

    if (filters.tarification && filters.tarification.length > 0) {
      query = query.in('tarification', filters.tarification);
    }

    if (filters.date_debut_min) {
      query = query.gte('date_debut', filters.date_debut_min);
    }

    if (filters.date_debut_max) {
      query = query.lte('date_debut', filters.date_debut_max);
    }

    // Appliquer l'ordre et la pagination
    query = query
      .order(order_by, { ascending: order_direction === 'asc' })
      .range((page - 1) * limit, page * limit - 1);

    return query;
  }, [filters, page, limit, order_by, order_direction]);

  const fetchEvents = async (append = false) => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: eventsError } = await buildQuery();

      if (eventsError) {
        throw eventsError;
      }

      if (append) {
        setEvents(prev => [...prev, ...(data || [])]);
      } else {
        setEvents(data || []);
      }

      // Vérifier s'il y a plus de données
      setHasMore((data || []).length === limit);
    } catch (err) {
      console.error('Erreur lors de la récupération des événements:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;

    setCurrentPage(prev => prev + 1);
    await fetchEvents(true);
  };

  useEffect(() => {
    fetchEvents();
  }, [enabled, JSON.stringify(filters), page, limit, order_by, order_direction]);

  return {
    events,
    loading,
    error,
    refetch: () => fetchEvents(),
    loadMore,
    hasMore,
  };
};

// Hook pour récupérer un événement spécifique
export const useEvent = (eventId: number) => {
  const [event, setEvent] = useState<EventWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        setLoading(true);
        setError(null);

        const { data, error: eventError } = await supabase
          .from('events')
          .select(`
            *,
            sous_categorie:sous_categories(*),
            organisateur:users(id, nom, prenom, photo_profil_url, role),
            groupe_prive:communautes(id, nom, slug),
            audiences:event_audiences(*),
            canaux_diffusion:event_canaux_diffusion(*),
            mots_cles:event_mots_cles(*),
            tickets_categories(*),
            tickets(*),
            intervenants:event_intervenants(*),
            sessions:event_sessions(*)
          `)
          .eq('id', eventId)
          .single();

        if (eventError) {
          throw eventError;
        }

        setEvent(data);
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'événement:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return { event, loading, error };
};

// Hook pour récupérer les événements d'un organisateur
export const useOrganizerEvents = (organizerId: string, options: PaginationOptions = {}) => {
  return useEvents({
    ...options,
    filters: { organisateur_id: organizerId }
  });
};

// Hook pour récupérer les événements à venir
export const useUpcomingEvents = (options: PaginationOptions = {}) => {
  const now = new Date().toISOString();
  return useEvents({
    ...options,
    filters: {
      date_debut_min: now,
      statut: ['publie', 'valide']
    }
  });
};

// Hook pour récupérer les événements par catégorie
export const useEventsByCategory = (categoryId: number, options: PaginationOptions = {}) => {
  return useEvents({
    ...options,
    filters: { sous_categorie_id: categoryId }
  });
};
