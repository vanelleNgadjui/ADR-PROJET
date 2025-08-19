import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session actuelle
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fonctions d'authentification
  const signInWithGoogle = async (role?: 'participant' | 'organisateur') => {
    // Stocker le rôle dans localStorage pour le récupérer après OAuth
    if (role) {
      localStorage.setItem('pendingRole', role);
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    
    return { data, error };
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  };

  const signUpWithEmail = async (
    email: string, 
    password: string, 
    role: 'participant' | 'organisateur'
  ) => {
    try {
      // 1. Créer l'utilisateur dans Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            nom: '', // À remplir dans l'onboarding
            prenom: '', // À remplir dans l'onboarding
          }
        }
      });

      if (error) {
        return { data, error };
      }

      // 2. Si l'inscription réussit, créer l'utilisateur dans notre table
      if (data.user) {
        const { error: dbError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            password_hash: 'managed_by_supabase_auth', // Placeholder
            nom: '',
            prenom: '',
            role: role,
            date_creation: new Date().toISOString(),
          });

        if (dbError) {
          // On ne retourne pas l'erreur car l'utilisateur est créé dans Auth
          // mais on la log pour debug
        }
        
        // 3. Se connecter automatiquement après l'inscription
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          // Si la connexion échoue, on attend un peu et on réessaie
          setTimeout(async () => {
            const { error: retryError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            if (retryError) {
              console.error('❌ Échec de la connexion automatique après retry:', retryError);
            } else {
              console.log('✅ Connexion automatique réussie après retry');
            }
          }, 2000);
        } else {
          console.log('✅ Connexion automatique réussie');
        }
      } else {
        console.warn('⚠️ Pas d\'utilisateur dans la réponse Auth');
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('💥 Erreur inattendue lors de l\'inscription:', err);
      return { 
        data: null, 
        error: { 
          message: err instanceof Error ? err.message : 'Erreur inattendue lors de l\'inscription' 
        } 
      };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    
    return { data, error };
  };

  return {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
  };
}; 