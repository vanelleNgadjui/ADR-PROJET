import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/LOGO-ADR-bleu-jaune.png';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import UserDropdown from '../dashboard/header/UserDropdown';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Vérifier le rôle de l'utilisateur
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        // Ajouter un délai pour éviter les requêtes multiples
        const timeoutId = setTimeout(async () => {
          try {
            const { data, error } = await supabase
              .from('users')
              .select('role')
              .eq('id', user.id)
              .single();
            
            if (!error && data) {
              setUserRole(data.role);
            }
          } catch (err) {
            console.error('Erreur lors de la récupération du rôle:', err);
          }
        }, 200);

        return () => clearTimeout(timeoutId);
      } else {
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, [user]);

  // Fonction pour déterminer la destination du logo selon le rôle
  const getLogoDestination = () => {
    if (!user) return '/';
    if (userRole === 'participant') return '/home';
    if (userRole === 'organisateur') return '/homeOrg';
    if (userRole === 'admin') return '/admin-dashboard';
    return '/'; // Fallback
  };

  return (
    <header
      className="w-full bg-white/95 backdrop-blur-md shadow-sm px-4 md:px-8 h-16 flex items-center justify-between fixed top-0 z-[9999] border-b border-neutral-200 transition-all duration-300 mx-auto md:mx-0 -mx-3 md:mx-0"
    >
      {/* Logo à gauche (mobile : caché si menuOpen) */}
      <div className={`flex items-center h-full ${menuOpen ? 'hidden' : ''} md:flex`}>
        <Link to={getLogoDestination()}>
          <img src={logo} alt="Logo Agenda du Royaume" className="h-8 max-h-full w-auto rounded-md object-contain cursor-pointer hover:opacity-80 transition-opacity" />
        </Link>
      </div>
      {/* Desktop actions */}
      <nav className="hidden md:flex items-center gap-2">
        {user ? (
          <UserDropdown />
        ) : (
          <>
            <Link 
              to="/auth/connexion"
              className="px-4 py-1.5 rounded-md border border-primary-blue text-primary-blue font-medium bg-white hover:bg-primary-blue hover:text-white transition-colors duration-200 text-sm"
            >
          Se connecter
            </Link>
            <Link 
              to="/auth/choix-role"
              className="px-4 py-1.5 rounded-md border border-primary-blue bg-primary-blue text-white font-medium hover:bg-white hover:text-primary-blue transition-colors duration-200 text-sm"
            >
          S'inscrire
            </Link>
          </>
        )}
      </nav>
      {/* Mobile actions */}
      <div className="md:hidden flex items-center gap-2 ml-auto">
        {menuOpen ? (
          <>
            {user ? (
              <div className="flex items-center gap-2">
                <UserDropdown />
                <button
                  className="ml-2 flex items-center justify-center w-9 h-9 rounded-md border border-neutral-200 hover:bg-neutral-100 transition"
                  aria-label="Fermer le menu"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-blue"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/auth/connexion"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-1.5 rounded-md border border-primary-blue text-primary-blue font-medium bg-white hover:bg-primary-blue hover:text-white transition-colors duration-200 text-sm"
                >
              Se connecter
                </Link>
                <Link 
                  to="/auth/choix-role"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-1.5 rounded-md border border-primary-blue bg-primary-blue text-white font-medium hover:bg-white hover:text-primary-blue transition-colors duration-200 text-sm"
                >
              S'inscrire
                </Link>
                <button
                  className="ml-2 flex items-center justify-center w-9 h-9 rounded-md border border-neutral-200 hover:bg-neutral-100 transition"
                  aria-label="Fermer le menu"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-blue"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </>
            )}
          </>
        ) : (
          <button
            className="flex items-center justify-center w-10 h-10 rounded-md border border-neutral-200 hover:bg-neutral-100 transition"
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOpen(true)}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-blue"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header; 