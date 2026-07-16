import type { ReactNode } from "react";

type BadgeVariant = "light" | "solid";
type BadgeSize = "sm" | "md" | "lg";
type BadgeColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

interface BadgeProps {
  variant?: BadgeVariant; // Light or solid variant
  size?: BadgeSize; // Badge size
  color?: BadgeColor; // Badge color
  startIcon?: ReactNode; // Icon at the start
  endIcon?: ReactNode; // Icon at the end
  children: ReactNode; // Badge content
  className?: string; // Additional classes
}

const Badge: React.FC<BadgeProps> = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-1 rounded-full font-medium";

  // Define size styles
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-base",
  };

  // Define color styles for variants - Adaptées à notre palette
  const variants = {
    light: {
      primary:
        "bg-primary-blue/10 text-primary-blue dark:bg-primary-blue/20 dark:text-primary-blue/90",
      secondary:
        "bg-primary-orange/10 text-primary-orange dark:bg-primary-orange/20 dark:text-primary-orange/90",
      success:
        "bg-secondary-mint/10 text-secondary-mint dark:bg-secondary-mint/20 dark:text-secondary-mint/90",
      error:
        "bg-secondary-coral/10 text-secondary-coral dark:bg-secondary-coral/20 dark:text-secondary-coral/90",
      warning:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      info: 
        "bg-primary-blue/10 text-primary-blue dark:bg-primary-blue/20 dark:text-primary-blue",
      light: 
        "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/80",
      dark: 
        "bg-gray-500 text-white dark:bg-white/5 dark:text-white",
    },
    solid: {
      primary: 
        "bg-primary-blue text-white dark:text-white",
      secondary: 
        "bg-primary-orange text-white dark:text-white",
      success: 
        "bg-secondary-mint text-white dark:text-white",
      error: 
        "bg-secondary-coral text-white dark:text-white",
      warning: 
        "bg-yellow-500 text-white dark:text-white",
      info: 
        "bg-primary-blue text-white dark:text-white",
      light: 
        "bg-gray-400 text-white dark:bg-white/5 dark:text-white/80",
      dark: 
        "bg-gray-700 text-white dark:text-white",
    },
  };

  // Get styles based on size and color variant
  const sizeClass = sizeStyles[size];
  const colorStyles = variants[variant]?.[color] || variants.light.primary; // Fallback to primary if variant/color is invalid

  return (
    <span className={`${baseStyles} ${sizeClass} ${colorStyles} ${className}`}>
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </span>
  );
};

export default Badge;
