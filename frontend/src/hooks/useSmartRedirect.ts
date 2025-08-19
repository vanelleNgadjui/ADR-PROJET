import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

export const useSmartRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const redirectToAction = (action: 'discover' | 'organize') => {
    if (user) {
      // Utilisateur connecté
      if (action === 'discover') {
        navigate('/events');
      } else {
        navigate('/organisateur/creer-evenement');
      }
    } else {
      // Utilisateur non connecté
      if (action === 'discover') {
        navigate('/auth/inscription/participant');
      } else {
        navigate('/auth/inscription/organisateur');
      }
    }
  };

  const redirectToAuth = (type: 'login' | 'signup') => {
    if (type === 'login') {
      navigate('/auth/connexion');
    } else {
      navigate('/auth/choix-role');
    }
  };

  const redirectToDashboard = () => {
    if (user) {
      // Rediriger selon le rôle (à implémenter plus tard)
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return { 
    redirectToAction, 
    redirectToAuth, 
    redirectToDashboard,
    isAuthenticated: !!user 
  };
}; 