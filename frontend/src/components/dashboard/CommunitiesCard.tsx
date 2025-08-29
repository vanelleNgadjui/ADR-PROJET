import { useState, useEffect } from "react";
import { UsersIcon, GlobeIcon, LockIcon } from "lucide-react";
import locationIcon from "../../assets/location.svg";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import Badge from "../ui/Badge";

interface Community {
  id: number;
  nom: string;
  description: string;
  type: string;
  est_publique: boolean;
  image_couverture: string;
  created_at: string;
  owner_id: string;
}

export default function CommunitiesCard() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('communautes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setCommunities(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des communautés:', error);
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'professionnel': return 'Professionnel';
      case 'personnel': return 'Personnel';
      case 'educatif': return 'Éducatif';
      default: return type;
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
          Mes Communautés
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {communities.length} communauté{communities.length > 1 ? 's' : ''}
        </span>
      </div>

      {communities.length === 0 ? (
        <div className="text-center py-8">
          <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Aucune communauté trouvée
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {communities.map((community) => (
            <div key={community.id} className="p-4 border border-gray-100 rounded-lg dark:border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-800 dark:text-white/90">
                  {community.nom}
                </h4>
                <div className="flex items-center gap-2">
                  <Badge variant="light" color="primary">
                    {getTypeLabel(community.type)}
                  </Badge>
                  {community.est_publique ? (
                    <GlobeIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <LockIcon className="w-4 h-4 text-orange-500" />
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {community.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <UsersIcon className="w-3 h-3" />
                  <span>{community.est_publique ? 'Publique' : 'Privée'}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <img src={locationIcon} alt="Localisation" className="w-3 h-3 opacity-60" />
                  <span>Créée le {formatDate(community.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
