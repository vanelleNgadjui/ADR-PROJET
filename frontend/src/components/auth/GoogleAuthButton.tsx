import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface GoogleAuthButtonProps {
  role?: 'participant' | 'organisateur';
  children?: React.ReactNode;
  className?: string;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ 
  role, 
  children = 'Continuer avec Google',
  className = ''
}) => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      console.log('🔑 GoogleAuthButton - Rôle reçu:', role);
      const { error } = await signInWithGoogle(role);
      
      if (error) {
        console.error('Erreur Google OAuth:', error);
        alert('Erreur de connexion Google: ' + error.message);
      }
    } catch (err) {
      console.error('Erreur inattendue:', err);
      alert('Erreur inattendue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  // Déterminer la couleur selon le rôle
  const getButtonStyle = () => {
    if (role === 'organisateur') {
      return 'bg-[#00008B] hover:bg-[#00008B]/90 text-white border-[#00008B]';
    } else if (role === 'participant') {
      return 'bg-[#FFA500] hover:bg-[#FFA500]/90 text-white border-[#FFA500]';
    }
    // Couleur par défaut si pas de rôle spécifié
    return 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600';
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold text-base transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${getButtonStyle()} ${className}`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}; 