import React, { useState } from 'react';
import Avatar from './Avatar';
import Badge from './Badge';
import { UserPlusIcon, UserCheckIcon } from 'lucide-react';

interface FollowButtonProps {
  organizer: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  isFollowing?: boolean;
  onFollowToggle?: (organizerId: string, isFollowing: boolean) => void;
  className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  organizer,
  isFollowing = false,
  onFollowToggle,
  className = ''
}) => {
  const [following, setFollowing] = useState(isFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFollow = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const newFollowingState = !following;
      setFollowing(newFollowingState);
      
      if (onFollowToggle) {
        await onFollowToggle(organizer.id, newFollowingState);
      }
    } catch (error) {
      // Revert state if error
      setFollowing(following);
      console.error('Erreur lors du suivi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${className}`}>
      {/* Photo et nom de l'organisateur */}
      <div className="flex items-center flex-1 min-w-0">
        <Avatar
          src={organizer.avatar || ''}
          alt={organizer.name}
          size="medium"
          role={organizer.role as "organisateur" | "participant" | "admin" | undefined}
          className="mr-3 flex-shrink-0"
        />
        
        <div className="flex flex-col items-start flex-1 min-w-0">
          <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
            {organizer.name}
          </span>
          <button
            onClick={handleToggleFollow}
            disabled={isLoading}
            className={`cursor-pointer ${isLoading ? 'opacity-50' : ''}`}
          >
            <Badge
              variant="light"
              color={following ? "success" : "primary"}
              size="sm"
            >
              {following ? 'Suivi' : 'Suivre'}
            </Badge>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowButton;
