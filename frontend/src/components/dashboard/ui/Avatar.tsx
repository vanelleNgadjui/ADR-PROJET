import React from "react";

interface AvatarProps {
  src?: string; // URL of the avatar image (optional)
  alt?: string; // Alt text for the avatar
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge"; // Avatar size
  status?: "online" | "offline" | "busy" | "none"; // Status indicator
  role?: "participant" | "organisateur" | "admin"; // User role for color theming
  className?: string; // Additional classes
}

const sizeClasses = {
  xsmall: "h-6 w-6 max-w-6",
  small: "h-8 w-8 max-w-8",
  medium: "h-10 w-10 max-w-10",
  large: "h-12 w-12 max-w-12",
  xlarge: "h-14 w-14 max-w-14",
  xxlarge: "h-16 w-16 max-w-16",
};

const fallbackTextClasses = {
  xsmall: "text-xs",
  small: "text-xs",
  medium: "text-sm",
  large: "text-base",
  xlarge: "text-lg",
  xxlarge: "text-xl",
};

const statusSizeClasses = {
  xsmall: "h-1.5 w-1.5 max-w-1.5",
  small: "h-2 w-2 max-w-2",
  medium: "h-2.5 w-2.5 max-w-2.5",
  large: "h-3 w-3 max-w-3",
  xlarge: "h-3.5 w-3.5 max-w-3.5",
  xxlarge: "h-4 w-4 max-w-4",
};

const statusColorClasses = {
  online: "bg-secondary-mint",
  offline: "bg-secondary-coral",
  busy: "bg-yellow-500",
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "User Avatar",
  size = "medium",
  status = "none",
  role,
  className = "",
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Validation de l'URL de l'image
  const isValidImageUrl = (url: string) => {
    if (!url || url.trim() === '') return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const getFallbackText = () => {
    if (alt) {
      // Extraire les initiales du nom complet
      const nameParts = alt.trim().split(' ');
      if (nameParts.length >= 2) {
        return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
      }
      return alt.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getFallbackColor = () => {
    switch (role) {
      case "participant":
        return "bg-primary-orange text-white";
      case "organisateur":
        return "bg-primary-blue text-white";
      case "admin":
        return "bg-gray-700 text-white";
      default:
        return "bg-primary-orange text-white"; // Default fallback (jaune orange)
    }
  };

  return (
    <div className={`relative rounded-full ${sizeClasses[size]} ${className}`}>
      {/* Avatar Image or Fallback */}
      {src && isValidImageUrl(src) && !imageError ? (
        <img 
          src={src} 
          alt={alt} 
          className="object-cover rounded-full w-full h-full"
          onError={handleImageError}
        />
      ) : (
        <div className={`w-full h-full rounded-full ${getFallbackColor()} flex items-center justify-center font-semibold ${fallbackTextClasses[size]}`}>
          {getFallbackText()}
        </div>
      )}

      {/* Status Indicator */}
      {status !== "none" && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-900 ${
            statusSizeClasses[size]
          } ${statusColorClasses[status] || ""}`}
        ></span>
      )}
    </div>
  );
};

export default Avatar;
