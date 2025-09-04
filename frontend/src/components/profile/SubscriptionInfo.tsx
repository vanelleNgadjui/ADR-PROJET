import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { UserPlus, UserCheck, Users } from 'lucide-react';

interface SubscriptionInfoProps {
  userId: string;
  role: string;
}

interface SubscriptionStats {
  followingCount: number;
  followersCount: number;
  eventsCount: number;
}

export default function SubscriptionInfo({ userId, role }: SubscriptionInfoProps) {
  const [stats, setStats] = useState<SubscriptionStats>({
    followingCount: 0,
    followersCount: 0,
    eventsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        if (role === 'participant') {
          // Pour les participants : compter les organisateurs suivis
          const { count: followingCount } = await supabase
            .from('user_follows')
            .select('*', { count: 'exact', head: true })
            .eq('follower_id', userId);

          setStats(prev => ({
            ...prev,
            followingCount: followingCount || 0
          }));
        } else if (role === 'organisateur') {
          // Pour les organisateurs : compter les followers et événements
          const { count: followersCount } = await supabase
            .from('user_follows')
            .select('*', { count: 'exact', head: true })
            .eq('followed_id', userId);

          const { count: eventsCount } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('organisateur_id', userId);

          setStats(prev => ({
            ...prev,
            followersCount: followersCount || 0,
            eventsCount: eventsCount || 0
          }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId, role]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Réseau</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary-blue border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Réseau</h3>
      
      {role === 'participant' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-primary-blue/20" style={{backgroundColor: 'rgba(0, 0, 139, 0.05)'}}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: 'rgba(0, 0, 139, 0.1)'}}>
                <UserPlus className="w-5 h-5 text-primary-blue" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Organisateurs suivis</h4>
                <p className="text-xs sm:text-sm text-gray-600">Organisateurs que vous suivez</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-blue">{stats.followingCount}</div>
              <div className="text-xs text-gray-500">suivis</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Abonnés</h4>
                <p className="text-sm text-gray-600">Participants qui vous suivent</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{stats.followersCount}</div>
              <div className="text-xs text-gray-500">abonnés</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Événements créés</h4>
                <p className="text-sm text-gray-600">Total de vos événements</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{stats.eventsCount}</div>
              <div className="text-xs text-gray-500">événements</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
