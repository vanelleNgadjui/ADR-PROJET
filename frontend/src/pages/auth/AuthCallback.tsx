import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { supabase } from '../../lib/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Redirection immédiate si pas d'utilisateur et pas de chargement
  useEffect(() => {
    if (!loading && !user) {
      console.log('🔴 Pas d\'utilisateur, redirection immédiate vers connexion');
      navigate('/auth/connexion');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Attendre que l'authentification soit terminée
        if (loading) return;

        if (user) {
          // Récupérer le rôle depuis localStorage (pour OAuth) ou les métadonnées
          const pendingRole = localStorage.getItem('pendingRole');
          let role = pendingRole || user.user_metadata?.role || 'participant';
          
          // Ne pas nettoyer localStorage ici, laisser useUserSync le faire
          // pour éviter les problèmes de timing
          
          // Vérifier si l'utilisateur a déjà un profil complet ET récupérer son rôle actuel
          const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('nom, prenom, role')
            .eq('id', user.id)
            .single();
          
          // Si on a un profil en base, utiliser le rôle de la base (plus fiable)
          if (userProfile && userProfile.role) {
            role = userProfile.role;
          }
          
          // Nettoyer le localStorage une fois le rôle récupéré
          if (pendingRole) {
            localStorage.removeItem('pendingRole');
          }
          
          if (profileError) {
            navigate(`/auth/onboarding/${role}`);
          } else if (userProfile && userProfile.nom && userProfile.prenom) {
            // Rediriger vers la page d'accueil appropriée selon le rôle
            if (role === 'participant') {
              navigate('/home');
            } else if (role === 'organisateur') {
              navigate('/homeOrg');
            } else {
              navigate('/');
            }
          } else {
            navigate(`/auth/onboarding/${role}`);
          }
        } else {
          // Si pas d'utilisateur après le chargement, rediriger immédiatement
          console.log('🔴 Pas d\'utilisateur, redirection vers connexion');
          navigate('/auth/connexion');
        }
      } catch (err) {
        console.error('💥 Erreur callback:', err);
        setError('Une erreur est survenue');
        
        setTimeout(() => {
          navigate('/auth/connexion');
        }, 3000);
      }
    };

    handleCallback();
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <AuthLayout title="Connexion en cours...">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#00008B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Finalisation de votre connexion...</p>
        </div>
      </AuthLayout>
    );
  }

  if (error) {
    return (
      <AuthLayout title="Erreur de connexion">
        <div className="text-center">
          <div className="text-secondary-coral mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p>{error}</p>
          </div>
          <p className="text-sm text-gray-500">Redirection automatique...</p>
        </div>
      </AuthLayout>
    );
  }

  // Ce composant ne devrait jamais s'afficher car on redirige toujours
  // Mais au cas où, on affiche un spinner simple
  return (
    <AuthLayout title="Connexion en cours...">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-[#00008B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Finalisation de votre connexion...</p>
      </div>
    </AuthLayout>
  );
} 