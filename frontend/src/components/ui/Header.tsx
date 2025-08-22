import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/LOGO-ADR-bleu-jaune.png';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { user, signOut } = useAuth();

  // Récupérer le rôle de l'utilisateur depuis la base de données
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
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
      } else {
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, [user]);

  return (
    <header
      className="w-full bg-white/90 backdrop-blur-md shadow-sm px-4 md:px-8 h-16 flex items-center justify-between sticky top-0 z-40 border-b border-neutral-200 transition-all duration-300"
    >
      {/* Logo à gauche (mobile : caché si menuOpen) */}
      <div className={`flex items-center h-full ${menuOpen ? 'hidden' : ''} md:flex`}>
        <Link to="/">
          <img src={logo} alt="Logo Agenda du Royaume" className="h-8 max-h-full w-auto rounded-md object-contain cursor-pointer hover:opacity-80 transition-opacity" />
        </Link>
      </div>
      {/* Desktop actions */}
      <nav className="hidden md:flex items-center gap-2">
        {user ? (
          <>
            <span className="text-sm text-neutral-600">
              Bonjour, {user.user_metadata?.prenom || user.email}
              {userRole && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                  userRole === 'participant' 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-primary-blue/10 text-primary-blue'
                }`}>
                  {userRole === 'participant' ? 'Participant' : 'Organisateur'}
                </span>
              )}
            </span>
            <button 
              onClick={() => signOut()}
              className="px-4 py-1.5 rounded-md border border-primary-blue text-primary-blue font-medium bg-white hover:bg-primary-blue hover:text-white transition-colors duration-200 text-sm"
            >
              Se déconnecter
            </button>
          </>
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
          Créer un compte
            </Link>
          </>
        )}
      </nav>
      {/* Mobile actions */}
      <div className="md:hidden flex items-center gap-2 ml-auto">
        {menuOpen ? (
          <>
            {user ? (
              <>
                <span className="text-xs text-neutral-600 px-2">
                  {user.user_metadata?.prenom || user.email}
                  {userRole && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                      userRole === 'participant' 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'bg-primary-blue/10 text-primary-blue'
                    }`}>
                      {userRole === 'participant' ? 'P' : 'O'}
                    </span>
                  )}
                </span>
                <button 
                  onClick={() => { signOut(); setMenuOpen(false); }}
                  className="px-3 py-1.5 rounded-md border border-primary-blue text-primary-blue font-medium bg-white hover:bg-primary-blue hover:text-white transition-colors duration-200 text-sm"
                >
                  Se déconnecter
                </button>
              </>
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
              Créer un compte
                </Link>
              </>
            )}
            <button
              className="ml-2 flex items-center justify-center w-9 h-9 rounded-md border border-neutral-200 hover:bg-neutral-100 transition"
              aria-label="Fermer le menu"
              onClick={() => setMenuOpen(false)}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-blue"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
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