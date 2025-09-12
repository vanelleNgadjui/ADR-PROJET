import { useState } from "react";
import { DropdownItem } from "../../ui/DropdownItem";
import { Dropdown } from "../../ui/Dropdown";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useUserProfilePhoto } from "../../../hooks/useUserProfilePhoto";
import Avatar from "../../ui/Avatar";
import { 
  UserIcon, 
  SettingsIcon, 
  LogOutIcon, 
  ChevronDownIcon
} from "lucide-react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // Récupérer la photo de profil depuis la base de données
  const { photoUrl: userPhotoUrl, loading: photoLoading } = useUserProfilePhoto();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleSignOut = async () => {
    closeDropdown();
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Erreur lors de la déconnexion:', error);
      } else {
        // Rediriger vers la landing page après déconnexion réussie
        navigate('/');
        console.log('Déconnexion réussie');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Si l'auth est en cours de chargement
  if (loading || photoLoading) {
    return (
      <div className="flex items-center text-gray-700 dark:text-gray-400">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse mr-3"></div>
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté
  if (!user) {
    return (
      <div className="relative">
        <Link
          to="/auth/connexion"
          className="flex items-center text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <UserIcon className="w-5 h-5 text-gray-500" />
          </div>
          <span className="text-sm font-medium">Se connecter</span>
        </Link>
      </div>
    );
  }

  // Données utilisateur depuis Supabase
  const userName = user?.user_metadata?.full_name || 
                  user?.user_metadata?.nom || 
                  user?.email?.split('@')[0] || 
                  'Utilisateur';
  const userEmail = user?.email || '';
  const userRole = user?.user_metadata?.role || 'participant';
  const userAvatar = userPhotoUrl;

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <Avatar 
          src={userAvatar || ''}
          alt={userName}
          size="medium"
          status="online"
          role={userRole}
          className="mr-3 flex-shrink-0"
        />

        <div className="flex flex-col items-start mr-2 flex-1 min-w-0">
          <div className="flex items-center">
            <span className="font-medium text-sm truncate">{userName}</span>
            <ChevronDownIcon
              className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 w-4 h-4 flex-shrink-0 ml-1 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
            {userRole === 'participant' ? 'Participant' : 
             userRole === 'organisateur' ? 'Organisateur' : 
             userRole === 'admin' ? 'Administrateur' : userRole}
          </span>
        </div>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <div>
          <span className="block font-medium text-gray-700 text-sm dark:text-gray-400">
            {userName}
          </span>
          <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
            {userEmail}
          </span>
                          <span className="mt-0.5 block text-xs text-primary-blue dark:text-primary-blue">
            {userRole === 'participant' ? 'Participant' : 
             userRole === 'organisateur' ? 'Organisateur' : 
             userRole === 'admin' ? 'Administrateur' : userRole}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <UserIcon className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Mon profil
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/settings"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <SettingsIcon className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Paramètres
            </DropdownItem>
          </li>
        </ul>

        <ul className="flex flex-col gap-1 pt-3">
          <li>
            <DropdownItem
              onItemClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <LogOutIcon className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Déconnexion
            </DropdownItem>
          </li>
        </ul>
      </Dropdown>
    </div>
  );
}
